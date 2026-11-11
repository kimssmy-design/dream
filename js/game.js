/* ===== 게임 규칙: 능력치 계산, 학기 진행, 조건 판정 ===== */
var CS = window.CS || {};
window.CS = CS;

CS.findById = function (list, id) {
  for (var i = 0; i < list.length; i++) { if (list[i].id === id) { return list[i]; } }
  return null;
};
CS.schoolOf = function (g) { return CS.findById(CS.SCHOOLS, g.school); };

/* 지금 다니는 학교·학과 정보 한 묶음 */
CS.trackOf = function (g) {
  var school = CS.schoolOf(g);
  if (!school) { return null; }
  var kindId = CS.kindIdOf(school, g.dept);
  var kind = CS.KINDS[kindId];
  var dept = null;
  if (school.depts) {
    for (var i = 0; i < school.depts.length; i++) { if (school.depts[i].id === g.dept) { dept = school.depts[i]; } }
    if (!dept) { dept = school.depts[0]; }
  }
  return { school: school, dept: dept, kind: kind, kindId: kindId, main: kind.main, group: kind.g,
    name: school.name + (dept ? ' ' + dept.name : '') };
};

/* 능력치 하나 읽기 (스트레스, 진로 경험 포함) */
CS.statOf = function (g, key) {
  if (key === 'stress') { return g.stress; }
  if (key === 'exp') { return g.exp; }
  return g.stats[key];
};

/* eff 안의 main 을 그 학교의 주특기 능력치로 바꿔 줌 */
CS.resolveEff = function (g, eff) {
  var out = {};
  var tr = CS.trackOf(g);
  for (var k in eff) {
    if (!eff.hasOwnProperty(k)) { continue; }
    var key = (k === 'main') ? (tr ? tr.main : 'study') : k;
    out[key] = (out[key] || 0) + eff[k];
  }
  return out;
};

/* 효과 적용 */
CS.applyEff = function (g, eff) {
  var e = CS.resolveEff(g, eff);
  for (var k in e) {
    if (!e.hasOwnProperty(k)) { continue; }
    if (k === 'stress') { g.stress = Math.max(0, Math.min(10, g.stress + e[k])); }
    else if (k === 'exp') { g.exp = Math.max(0, g.exp + e[k]); }
    else { g.stats[k] = Math.max(0, Math.min(CS.STAT_MAX, g.stats[k] + e[k])); }
  }
};

/* 효과를 글로 보여 주기: "학업 +1, 스트레스 +1" */
CS.effText = function (g, eff) {
  var e = CS.resolveEff(g, eff);
  var parts = [];
  for (var k in e) {
    if (!e.hasOwnProperty(k) || e[k] === 0) { continue; }
    parts.push(CS.STAT_NAMES[k] + ' ' + (e[k] > 0 ? '+' : '') + e[k]);
  }
  return parts.join(', ');
};

CS.semName = function (sem) {
  return Math.ceil(sem / 2) + '학년 ' + (sem % 2 === 1 ? '1' : '2') + '학기';
};

/* 이번 장면의 선택지: 학교 전용 활동 1개 + 장면 선택지 6개 */
CS.actionsFor = function (g) {
  var tr = CS.trackOf(g);
  var grade = Math.ceil(g.sem / 2);
  var list = [{ id: 'special', label: tr.kind.t[grade - 1], eff: tr.kind.eff, emo: tr.kind.emo, special: true }];
  var sc = CS.sceneOf(g);
  for (var i = 0; i < sc.c.length; i++) {
    var c = sc.c[i];
    list.push({ id: 'c' + i, label: c[1], eff: CS.EFF[c[2]], emo: c[0],
      bonus: c[3] ? { text: c[3], eff: CS.EFF[c[4]] } : null });
  }
  return list;
};

/* 활동 하나 하기. 가끔 '대성공'(능력치 +1)이나 깜짝 이벤트가 생김.
   장면 4개를 모두 지나면 돌발 사건 단계로 넘어감 */
CS.doAction = function (g, actionId) {
  if (g.points <= 0) { return null; }
  var act = CS.findById(CS.actionsFor(g), actionId);
  if (!act) { return null; }
  var eff = {}, k, crit = false;
  for (k in act.eff) { if (act.eff.hasOwnProperty(k)) { eff[k] = act.eff[k]; } }
  if (Math.random() < CS.CRIT_RATE) {
    for (k in eff) { if (eff.hasOwnProperty(k) && k !== 'stress' && eff[k] > 0) { eff[k] += 1; crit = true; break; } }
  }
  CS.applyEff(g, eff);
  var bonus = null;
  if (act.bonus && Math.random() < CS.BONUS_RATE) {
    CS.applyEff(g, act.bonus.eff);
    bonus = act.bonus;
  }
  g.points -= 1;
  if (g.points === 0) {
    g.eventId = CS.pickEvent(g).id;
    g.phase = 'event';
  }
  return { act: act, eff: eff, crit: crit, text: act.label, bonus: bonus };
};

/* 이번 학기 사건 고르기: 내 학교 전용 사건이 있으면 우선, 없으면 공통 사건 중 무작위 */
CS.pickEvent = function (g) {
  var own = [], common = [];
  for (var i = 0; i < CS.EVENTS.length; i++) {
    var ev = CS.EVENTS[i];
    if (ev.sem !== g.sem) { continue; }
    if (ev.tracks) { if (ev.tracks.indexOf(CS.trackOf(g).group) >= 0) { own.push(ev); } }
    else { common.push(ev); }
  }
  var pool = own.length ? own : common;
  return pool[Math.floor(Math.random() * pool.length)];
};

/* 사건 선택지 고르기 */
CS.chooseEvent = function (g, idx) {
  var ev = CS.findById(CS.EVENTS, g.eventId);
  var ch = ev.choices[idx];
  CS.applyEff(g, ch.eff);
  g.resultText = ch.result;
  g.resultEff = CS.resolveEff(g, ch.eff);
  g.nextPenalty = g.stress >= CS.BURNOUT;
  g.phase = 'result';
};

/* 다음 학기로. 6학기가 끝나면 졸업 */
CS.nextSemester = function (g) {
  var burned = g.nextPenalty;
  if (burned) { g.stress = 5; }
  g.nextPenalty = false;
  g.eventId = null;
  g.resultText = '';
  g.resultEff = null;
  if (g.sem >= 6) {
    g.step = 'grad';
    g.log.push(CS.trackOf(g).school.name + ' 졸업');
    return;
  }
  g.sem += 1;
  g.points = CS.SEM_POINTS - (burned ? 1 : 0);
  g.phase = 'act';
};

/* 조건 확인. gap = 부족한 점수의 합 */
CS.checkReq = function (g, req) {
  var gap = 0, lacks = [];
  for (var k in req) {
    if (!req.hasOwnProperty(k)) { continue; }
    var d = req[k] - CS.statOf(g, k);
    if (d > 0) { gap += d; lacks.push(CS.STAT_NAMES[k]); }
  }
  return { ok: gap === 0, gap: gap, lacks: lacks };
};

CS.reqText = function (req) {
  var parts = [];
  for (var k in req) { if (req.hasOwnProperty(k)) { parts.push(CS.STAT_NAMES[k] + ' ' + req[k] + ' 이상'); } }
  return parts.length ? parts.join(', ') : '조건 없음';
};

/* 필요한 능력치를 못 채웠을 때 보여 줄 문구: "체력 12 필요 (지금 2)" */
CS.needText = function (g, req) {
  var parts = [];
  for (var k in req) {
    if (req.hasOwnProperty(k) && CS.statOf(g, k) < req[k]) { parts.push(CS.STAT_NAMES[k] + ' ' + req[k] + ' 필요 (지금 ' + CS.statOf(g, k) + ')'); }
  }
  return parts.join(', ');
};

/* 분야 준비도 = 그 분야 핵심 능력치 2개의 합 */
CS.readiness = function (g, fieldId) {
  var f = CS.FIELDS[fieldId];
  return g.stats[f.keys[0]] + g.stats[f.keys[1]];
};

/* 내 능력치와 가장 잘 맞는 분야 3개 (학과에 「내 강점과 맞음」 표시용) */
CS.topFields = function (g) {
  var list = [];
  for (var k in CS.FIELDS) { if (CS.FIELDS.hasOwnProperty(k)) { list.push({ id: k, r: CS.readiness(g, k) }); } }
  list.sort(function (a, b) { return b.r - a.r; });
  return [list[0].id, list[1].id, list[2].id];
};

/* 1년 쉬며 탐색 (갭이어) */
CS.gapYear = function (g) {
  CS.applyEff(g, { exp: 3, stress: -3 });
  g.gapUsed = true;
  g.log.push('1년 동안 여행하고 일하며 진로 탐색');
};

/* 20대 초반의 선택 */
CS.TW1 = [
  { id: 'deep',    label: '한 우물을 깊게 판다', desc: '전공과 실력에 시간을 쏟아요.' },
  { id: 'wide',    label: '다양한 경험을 쌓는다', desc: '동아리, 아르바이트, 여행, 교환학생.' },
  { id: 'balance', label: '건강과 균형을 챙긴다', desc: '운동하고 쉬면서 오래 갈 힘을 길러요.' },
  { id: 'change',  label: '분야를 바꾼다', desc: '해 보니 아니었어요. 전과하거나 다른 일을 시작해요.' }
];
CS.applyTw1 = function (g, id) {
  var f = CS.FIELDS[g.path.field];
  var eff = {};
  if (id === 'deep') { eff[f.keys[0]] = 3; eff[f.keys[1]] = (eff[f.keys[1]] || 0) + 2; eff.stress = 2; g.log.push('20대: 한 우물을 깊게 팠다'); }
  if (id === 'wide') { eff = { exp: 2, social: 2, create: 1 }; g.log.push('20대: 다양한 경험을 쌓았다'); }
  if (id === 'balance') { eff = { body: 2, stress: -4 }; g.log.push('20대: 건강과 균형을 챙겼다'); }
  CS.applyEff(g, eff);
};
