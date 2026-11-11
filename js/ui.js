/* ===== 화면 표시와 버튼 처리 (장면 + 대사창 + 색 선택지) ===== */
(function () {
  var CS = window.CS;
  var g, stage, side, modal;
  var flash = '';  /* 방금 한 행동의 결과 (한 번만 보여 줌) */
  var err = '';    /* 입력 오류 안내 */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- 화면 조각 만들기 ---------- */
  /* 얼굴: 사진이 있으면 사진, 없으면 이모지. size = s / m / l */
  function face(size) {
    if (g.photo && g.photo.indexOf('data:image/') === 0) {
      return '<span class="face ' + size + '" style="background-image:url(' + g.photo + ')" role="img" aria-label="내 사진"></span>';
    }
    return '<span class="face ' + size + '">' + g.avatar + '</span>';
  }
  /* 장면 + 대사창 */
  function scene(o) {
    return '<div class="scene bg-' + o.color + '"><span class="place">' + o.place + '</span>' +
      (o.right ? '<span class="right">' + o.right + '</span>' : '') +
      face('m') + '<span class="who">' + (esc(g.name) || '나') + '</span><span class="prop">' + o.emo + '</span></div>' +
      '<div class="dialog">' + (o.title ? '<b class="t">' + o.title + '</b>' : '') + o.text + '</div>';
  }
  /* 색 선택지 */
  function ch(act, arg, title, sub, color, opt) {
    opt = opt || {};
    return '<button class="ch bg-' + color + (opt.on ? ' on' : '') + '" data-act="' + act + '" data-arg="' + arg + '"' +
      (opt.disabled ? ' disabled' : '') + '>' + (opt.emo ? '<span class="emo">' + opt.emo + '</span>' : '') +
      '<span class="body"><b>' + title + '</b>' + (sub ? '<small>' + sub + '</small>' : '') +
      (opt.tag ? '<span class="tag' + (opt.tagCls ? ' ' + opt.tagCls : '') + '">' + opt.tag + '</span>' : '') + '</span></button>';
  }
  /* 능력치 변화 알약: 학업 +1 */
  function fx(eff) {
    var h = '';
    for (var k in eff) {
      if (!eff.hasOwnProperty(k) || eff[k] === 0) { continue; }
      var color = (k === 'stress') ? (eff[k] > 0 ? 'stress' : 'rest') : k;
      h += '<span class="fx bg-' + color + '">' + CS.STAT_NAMES[k] + ' ' + (eff[k] > 0 ? '+' : '') + eff[k] + '</span>';
    }
    return h;
  }
  function primary(act, label) { return '<button class="btn primary" data-act="' + act + '">' + label + '</button>'; }
  function plain(act, label) { return '<button class="btn" data-act="' + act + '">' + label + '</button>'; }
  function dots(n, total) {
    var h = '<span class="dots">';
    for (var i = 0; i < total; i++) { h += '<i' + (i < n ? ' class="full"' : '') + '></i>'; }
    return h + '</span>';
  }
  function allocLeft() {
    return CS.START_POINTS - (g.alloc.study + g.alloc.body + g.alloc.social + g.alloc.create);
  }
  function schoolColor(s) { return s.main; }

  /* ---------- 왼쪽: 캐릭터 카드 ---------- */
  function renderSide() {
    if (g.step === 'intro') { side.innerHTML = '<p class="muted">게임을 시작하면 여기에 내 캐릭터가 나타나요.</p>'; return; }
    var school = CS.schoolOf(g);
    var creating = (g.step === 'c1' || g.step === 'c2' || g.step === 'c3');
    var h = '<div class="me bg-' + (school ? schoolColor(school) : 'white') + '">' + face('l') +
      '<div><div class="nm">' + (esc(g.name) || '이름 없음') + '</div><div class="muted">' +
      (school ? CS.SCHOOL_EMO[school.id] + ' ' + school.name : '입학 전') + (g.specialty ? ' · ' + esc(g.specialty) : '') + '</div></div></div>';
    if (g.values.length) {
      h += '<h3>중요하게 여기는 것</h3><div class="vals">';
      for (var i = 0; i < g.values.length; i++) {
        var v = CS.findById(CS.VALUES, g.values[i]);
        h += '<span class="bg-' + CS.VALUE_COLORS[v.id] + '">' + CS.VALUE_EMO[v.id] + ' ' + v.name + '</span>';
      }
      h += '</div>';
    }
    h += '<h3>능력치</h3><div class="stats">';
    for (var j = 0; j < CS.STATS.length; j++) {
      var st = CS.STATS[j];
      var val = g.stats[st.id] + (creating ? g.alloc[st.id] : 0);
      h += '<div class="stat"><div class="l"><span>' + st.name + '</span><span>' + val + '</span></div><div class="bar"><i class="bg-' + st.id +
        (val === 0 ? ' zero' : '') + '" style="width:' + Math.round(val / CS.STAT_MAX * 100) + '%"></i></div></div>';
    }
    h += '<div class="stat"><div class="l"><span>스트레스</span><span>' + g.stress + ' / 10</span></div><div class="bar' + (g.stress >= 7 ? ' hot' : '') +
      '"><i class="bg-stress' + (g.stress === 0 ? ' zero' : '') + '" style="width:' + (g.stress * 10) + '%"></i></div></div>';
    h += '<div class="stat"><div class="l"><span>진로 경험</span><span>' + g.exp + '</span></div></div></div>';
    if (g.log.length) {
      h += '<div class="hide-narrow"><h3>걸어온 길</h3><ul class="log">';
      for (var k = 0; k < g.log.length; k++) { h += '<li>' + esc(g.log[k]) + '</li>'; }
      h += '</ul></div>';
    }
    side.innerHTML = h;
  }

  /* ---------- 오른쪽: 화면별 내용 ---------- */
  var VIEWS = {};

  VIEWS.intro = function () {
    return '<div class="title-screen"><div class="steps"><span>🎒</span><span>🏫</span><span>🎓</span><span>✨</span></div>' +
      '<h1>나의 다음 페이지</h1>' +
      '<p>고등학생이 된 나를 키워서, 15년 뒤의 나를 만나요.</p>' +
      '<p class="muted">30분쯤 걸려요. 정답은 없고, 엔딩은 84가지예요.</p>' +
      '<div class="mt">' + primary('start', '게임 시작') + '</div></div>';
  };

  VIEWS.c1 = function () {
    var h = scene({ place: '캐릭터 만들기 1 / 3', emo: '🪪', color: 'exp', text: '고등학생이 된 나. 이름과 얼굴부터 정해요.' });
    h += '<label class="field"><span class="lab">이름</span><input type="text" id="inName" maxlength="10" placeholder="내 이름 또는 별명" value="' + esc(g.name) + '"></label>';
    h += '<div class="field"><span class="lab">얼굴</span><div class="row">' +
      '<label class="photo-btn">📷 ' + (g.photo ? '사진 바꾸기' : '사진 올리기') + '<input type="file" id="inPhoto" accept="image/*"></label>';
    if (g.photo) { h += '<button class="btn" data-act="photoOff">사진 빼기</button>'; }
    h += '</div><p class="muted mt-s">얼굴 사진이 아니어도 돼요. 좋아하는 캐릭터나 풍경도 좋아요. 사진은 이 기기에만 저장돼요.</p><div class="row mt-s">';
    for (var i = 0; i < CS.AVATARS.length; i++) {
      h += '<button class="pick' + (!g.photo && g.avatar === CS.AVATARS[i] ? ' on' : '') + '" data-act="avatar" data-arg="' + CS.AVATARS[i] + '">' + CS.AVATARS[i] + '</button>';
    }
    h += '</div></div>';
    if (err) { h += '<p class="err">' + err + '</p>'; }
    return h + '<div class="mt">' + primary('c1Next', '다음') + '</div>';
  };

  VIEWS.c2 = function () {
    var h = scene({ place: '캐릭터 만들기 2 / 3', emo: '💭', color: 'social', text: '살면서 내가 가장 중요하게 여기는 건 뭘까? <b>2개</b>를 골라요.' });
    h += '<div class="choices three">';
    for (var j = 0; j < CS.VALUES.length; j++) {
      var v = CS.VALUES[j];
      h += ch('value', v.id, v.name, v.desc, CS.VALUE_COLORS[v.id], { on: g.values.indexOf(v.id) >= 0, emo: CS.VALUE_EMO[v.id] });
    }
    h += '</div>';
    if (err) { h += '<p class="err">' + err + '</p>'; }
    return h + '<div class="mt">' + primary('c2Next', '다음') + '</div>';
  };

  VIEWS.c3 = function () {
    var h = scene({ place: '캐릭터 만들기 3 / 3', emo: '🎚️', color: 'body',
      text: '지금의 나는 어떤 사람일까? 점수 ' + CS.START_POINTS + '점을 나눠 줘요.', right: '남은 점수 ' + dots(allocLeft(), CS.START_POINTS) });
    h += '<div class="field">';
    for (var k = 0; k < CS.STATS.length; k++) {
      var s = CS.STATS[k];
      h += '<div class="alloc bg-' + s.id + '"><span class="nm">' + CS.STAT_EMO[s.id] + ' ' + s.name + '</span>' +
        '<button class="btn" data-act="allocMinus" data-arg="' + s.id + '" aria-label="' + s.name + ' 줄이기">−</button>' +
        '<span class="num">' + (CS.START_BASE + g.alloc[s.id]) + '</span>' +
        '<button class="btn" data-act="allocPlus" data-arg="' + s.id + '" aria-label="' + s.name + ' 늘리기">+</button></div>';
    }
    h += '</div>';
    if (err) { h += '<p class="err">' + err + '</p>'; }
    return h + '<div class="mt">' + primary('c3Next', '나 알아보기 질문으로') + '</div>';
  };

  VIEWS.quiz = function () {
    var q = CS.QUIZ[g.quizIdx];
    var h = '<div class="row" style="justify-content:space-between"><h3>나 알아보기</h3><span class="tag light">' + (g.quizIdx + 1) + ' / ' + CS.QUIZ.length + '</span></div>' +
      '<div class="progress"><i style="width:' + Math.round(g.quizIdx / CS.QUIZ.length * 100) + '%"></i></div>';
    h += scene({ place: '질문 ' + (g.quizIdx + 1), emo: '❓', color: 'exp', text: '<b class="t">' + q.q + '</b>가장 나다운 것 하나를 골라요.' });
    h += '<div class="choices">';
    for (var i = 0; i < q.options.length; i++) {
      h += ch('quiz', i, q.options[i].text, '', CS.QUIZ_COLORS[i], { emo: q.options[i].emo });
    }
    h += '</div><div class="mt"><button class="btn ghost" data-act="quizSkip">아직 잘 모르겠어요 (건너뛰기)</button></div>';
    return h;
  };

  VIEWS.school = function () {
    var h = scene({ place: '고등학교 고르기', emo: '🏫', color: 'study',
      text: g.showAll ? '모든 학교를 펼쳤어요. 어디든 고를 수 있어요.' : '내 답을 보니 이런 학교가 어울릴 것 같아요. 추천일 뿐, 선택은 내 마음이에요.' });
    h += '<div class="choices one">';
    /* 추천만 볼 때는 잘 맞는 순서대로, 전체 보기일 때는 원래 순서대로 */
    var order = [];
    for (var n = 0; n < CS.SCHOOLS.length; n++) { order.push(CS.SCHOOLS[n].id); }
    if (!g.showAll) { order = g.recs; }
    for (var i = 0; i < order.length; i++) {
      var s = CS.findById(CS.SCHOOLS, order[i]);
      var rec = g.recs.indexOf(s.id) >= 0;
      h += ch('pickSchool', s.id, s.name, s.desc + ' ' + fx(s.bonus), schoolColor(s),
        { on: g.school === s.id, emo: CS.SCHOOL_EMO[s.id], tag: rec ? '추천: ' + CS.SCHOOL_REASON[s.id] : '' });
    }
    h += '</div>';
    if (!g.showAll) { h += '<div class="mt"><button class="btn" data-act="showAll">전체 학교 10곳 보기</button></div>'; }
    var cur = CS.schoolOf(g);
    if (cur && cur.ask) {
      h += '<label class="field"><span class="lab">' + cur.ask + ' <span class="muted">(안 적어도 돼요)</span></span>' +
        '<input type="text" id="inSpec" maxlength="14" value="' + esc(g.specialty) + '"></label>';
    }
    if (err) { h += '<p class="err">' + err + '</p>'; }
    return h + '<div class="mt">' + primary('enroll', '입학하기') + '</div>';
  };

  function track() {
    var h = '<div class="track">';
    for (var i = 1; i <= 6; i++) {
      h += '<span class="' + (i < g.sem ? 'done' : (i === g.sem ? 'now' : '')) + '">' + Math.ceil(i / 2) + '-' + (i % 2 === 1 ? 1 : 2) + '</span>';
    }
    return h + '</div>';
  }

  VIEWS.semester = function () {
    var h = track();
    if (flash) { h += '<div class="flash">' + flash + '</div>'; }
    if (g.phase === 'act') {
      var sit = CS.situationOf(g);
      h += scene({ place: CS.semName(g.sem) + ' · ' + sit.place, emo: sit.emo, color: CS.SEM_COLORS[g.sem - 1], text: sit.text,
        right: '남은 시간 ' + dots(g.points, CS.SEM_POINTS) });
      if (g.stress >= CS.BURNOUT) { h += '<div class="note bg-stress"><b>몸이 보내는 신호:</b> 스트레스가 너무 높아요. 이대로 학기를 마치면 번아웃이 와요.</div>'; }
      h += '<div class="choices">';
      var acts = CS.actionsFor(g);
      var school = CS.schoolOf(g);
      for (var j = 0; j < acts.length; j++) {
        var a = acts[j];
        var color = (a.id === 'special') ? schoolColor(school) : CS.ACTION_COLORS[a.id];
        h += ch('action', a.id, CS.actionText(g, a.id), fx(CS.resolveEff(g, a.eff)), color,
          { emo: a.id === 'special' ? CS.SCHOOL_EMO[school.id] : CS.ACTION_EMO[a.id] });
      }
      h += '</div>';
    } else if (g.phase === 'event') {
      var ev = CS.findById(CS.EVENTS, g.eventId);
      h += scene({ place: CS.semName(g.sem) + ' · 돌발 사건', emo: '⚡', color: 'stress', title: ev.title, text: ev.text });
      h += '<div class="choices one">';
      for (var k = 0; k < ev.choices.length; k++) {
        h += ch('event', k, ev.choices[k].label, '', CS.colorOfEff(g, ev.choices[k].eff), { emo: ['🅰️', '🅱️', '🅲'][k] || '' });
      }
      h += '</div>';
    } else {
      h += scene({ place: CS.semName(g.sem) + ' · 그 뒤', emo: '💬', color: 'white', text: g.resultText + '<div class="mt-s">' + fx(g.resultEff || {}) + '</div>' });
      if (g.nextPenalty) {
        h += '<div class="note bg-stress"><b>번아웃이 왔어요.</b> 한동안 아무것도 손에 잡히지 않아요.' + (g.sem >= 6 ? '' : ' 다음 학기에는 쓸 수 있는 시간이 하나 줄어요.') + '</div>';
      }
      h += '<div class="mt">' + primary('nextSem', g.sem >= 6 ? '졸업식으로' : '다음 학기로') + '</div>';
    }
    return h;
  };

  VIEWS.grad = function () {
    var h = '';
    if (flash) { h += '<div class="flash">' + flash + '</div>'; }
    h += scene({ place: '졸업식', emo: '🎓', color: 'social', title: '졸업을 축하해요', text: '3년이 지나갔어요. 교문을 나서며 생각해요. 이제 어디로 갈까?' });
    var proOk = g.stats.body >= CS.PRO_MIN || g.stats.create >= CS.PRO_MIN;
    var startOk = g.exp >= CS.STARTUP_EXP;
    h += '<div class="choices one">';
    h += ch('path', 'univ', '대학에 진학한다', '대학 유형과 학과를 골라요.', 'study', { emo: '🏛️' });
    h += ch('path', 'work', '바로 취업한다', '일하면서 배워요. 나중에 대학에 갈 수도 있어요.', 'body', { emo: '💼' });
    h += ch('path', 'pro', '선수·예술가로 바로 뛰어든다', '실업팀, 무용단, 연재, 무대로 곧장 가요.', 'create',
      { emo: '🔥', disabled: !proOk, tag: '조건: 체력 또는 창의 ' + CS.PRO_MIN + ' 이상', tagCls: proOk ? 'light' : 'no' });
    h += ch('path', 'startup', '나만의 길을 만든다', '창업하거나 내 일을 직접 시작해요.', 'exp',
      { emo: '🚀', disabled: !startOk, tag: '조건: 진로 경험 ' + CS.STARTUP_EXP + ' 이상', tagCls: startOk ? 'light' : 'no' });
    if (!g.gapUsed) { h += ch('path', 'gap', '1년 쉬며 탐색한다', '여행하고 일해 보며 천천히 정해요. ' + fx({ exp: 3, stress: -3 }), 'rest', { emo: '🎒' }); }
    return h + '</div>';
  };

  VIEWS.uni = function () {
    var h = scene({ place: '원서 접수', emo: '✉️', color: 'study', title: '어떤 대학에 지원할까요?',
      text: '조건이 조금 부족해도 도전 지원을 할 수 있어요. 결과는 아무도 몰라요.' });
    h += '<div class="choices">';
    for (var i = 0; i < CS.UNIS.length; i++) {
      var u = CS.UNIS[i];
      var chk = CS.checkReq(g, u.req);
      var tag = chk.ok ? '지원 가능' : (chk.gap <= 3 ? '도전 지원 (' + chk.lacks.join(', ') + ' 조금 부족)' : chk.lacks.join(', ') + ' 많이 부족');
      h += ch('applyUni', u.id, u.name, u.desc + ' 조건: ' + CS.reqText(u.req), chk.ok ? 'study' : 'social',
        { emo: CS.UNI_EMO[u.id], disabled: !chk.ok && chk.gap > 3, tag: tag, tagCls: chk.ok ? '' : 'no' });
    }
    return h + '</div><div class="mt">' + plain('backGrad', '다른 길 보기') + '</div>';
  };

  VIEWS.fail = function () {
    var u = CS.findById(CS.UNIS, g.failUni);
    var h = scene({ place: u.name + ' 합격자 발표', emo: '🌧️', color: 'stress', title: '불합격',
      text: '합격자 명단에 내 이름이 없어요. 속상하고, 한동안 아무 말도 하고 싶지 않아요.<br>그래도 불합격은 끝이 아니에요. 여기서 고를 수 있는 길이 있어요.' });
    h += '<div class="choices one">';
    h += ch('retry', '', '1년 더 준비해서 다시 도전한다', '부족했던 부분을 채워요. ' + fx({ stress: 2 }), 'create', { emo: '🔥' });
    h += ch('backGrad', '', '다른 길을 찾아본다', '다른 대학, 취업, 나만의 길을 다시 살펴봐요.', 'exp', { emo: '🧭' });
    return h + '</div>';
  };

  VIEWS.major = function () {
    var u = CS.findById(CS.UNIS, g.path.uni);
    var list = CS.majorsFor(u.id);
    var h = scene({ place: u.name, emo: '🎉', color: 'social', title: '합격! 어떤 학과에서 공부할까요?',
      text: g.exp >= 3 ? '진로 탐색을 해 둔 덕분에 내 강점과 맞는 학과가 표시돼요.' : '진로 탐색을 3번 이상 했다면 내 강점과 맞는 학과가 표시됐을 거예요.' });
    var group = '';
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      if (m.group !== group) { h += (group ? '</div>' : '') + '<p class="group-title">' + m.group + '</p><div class="choices three" style="margin-top:8px">'; group = m.group; }
      var lack = m.req ? !CS.checkReq(g, m.req).ok : false;
      var good = g.exp >= 3 && CS.readiness(g, m.field) >= CS.READY_MID + 2;
      h += ch('major', m.id, m.name, '', CS.GROUP_COLORS[m.group] || 'white',
        { emo: CS.FIELD_EMO[m.field], disabled: lack, tag: lack ? '조건: ' + CS.reqText(m.req) : (good ? '내 강점과 맞음' : ''), tagCls: lack ? 'no' : '' });
    }
    return h + '</div>';
  };

  /* 분야 고르기 (취업, 바로 활동, 창업, 분야 바꾸기 공용) */
  VIEWS.pickField = function () {
    var titles = { work: '어떤 분야에서 일을 시작할까요?', pro: '어떤 무대로 뛰어들까요?', startup: '어떤 분야에서 내 일을 시작할까요?', change: '어느 분야로 바꿀까요?' };
    var emos = { work: '💼', pro: '🔥', startup: '🚀', change: '🔄' };
    var h = scene({ place: '분야 고르기', emo: emos[g.pickMode], color: 'exp', title: titles[g.pickMode], text: '분야마다 특히 중요한 능력이 달라요.' });
    var ids = [], i;
    if (g.pickMode === 'work') { ids = CS.WORK_FIELDS; }
    else if (g.pickMode === 'startup') { ids = CS.STARTUP_FIELDS; }
    else if (g.pickMode === 'pro') {
      for (i = 0; i < CS.PRO_FIELDS.length; i++) { if (CS.checkReq(g, CS.PRO_FIELDS[i].req).ok) { ids.push(CS.PRO_FIELDS[i].field); } }
    } else {
      for (var key in CS.FIELDS) { if (CS.FIELDS.hasOwnProperty(key) && key !== 'mil' && key !== g.path.field) { ids.push(key); } }
    }
    h += '<div class="choices three">';
    for (i = 0; i < ids.length; i++) {
      var f = CS.FIELDS[ids[i]];
      h += ch('field', ids[i], f.name, CS.STAT_NAMES[f.keys[0]] + ', ' + CS.STAT_NAMES[f.keys[1]], f.keys[0], { emo: CS.FIELD_EMO[ids[i]] });
    }
    h += '</div>';
    if (g.pickMode !== 'change') { h += '<div class="mt">' + plain('backGrad', '다른 길 보기') + '</div>'; }
    return h;
  };

  VIEWS.tw1 = function () {
    var h = scene({ place: '스무 살', emo: '🌆', color: 'exp', title: '스무 살 이후, 어디에 시간을 쓸까요?', text: esc(CS.pathText(g)) + '. 새로운 생활이 시작됐어요.' });
    var look = { deep: ['⛏️', 'study'], wide: ['🧳', 'social'], balance: ['🌿', 'rest'], change: ['🔄', 'create'] };
    h += '<div class="choices">';
    for (var i = 0; i < CS.TW1.length; i++) {
      var t = CS.TW1[i];
      h += ch('tw1', t.id, t.label, t.desc, look[t.id][1], { emo: look[t.id][0] });
    }
    return h + '</div>';
  };

  VIEWS.tw2 = function () {
    var h = scene({ place: '스물다섯 즈음', emo: CS.FIELD_EMO[g.path.field], color: 'social',
      title: '나는 어떤 방식으로 일하고 싶나요?', text: CS.FIELDS[g.path.field].name + ' 분야에서 내 자리를 찾아야 할 때예요. 마지막 선택이에요.' });
    h += '<div class="choices one">';
    for (var i = 0; i < CS.STYLES.length; i++) {
      var s = CS.STYLES[i];
      h += ch('style', s.id, s.label, '', CS.STYLE_COLORS[s.id], { emo: CS.STYLE_EMO[s.id] });
    }
    return h + '</div>';
  };

  VIEWS.ending = function () {
    var e = CS.computeEnding(g);
    var color = CS.FIELDS[g.path.field].keys[0];
    var h = '<div class="end-card"><div class="head bg-' + color + '">' + face('l') +
      '<div><p class="muted">15년 뒤의 나 ' + CS.FIELD_EMO[g.path.field] + '</p><h2>' + esc(g.name) + '</h2></div></div>' +
      '<div class="in"><h2>' + e.title + '</h2><p class="mt-s">' + e.desc + '</p><hr><h3>걸어온 길</h3><ul>';
    for (var i = 0; i < e.pathLines.length; i++) { h += '<li>' + esc(e.pathLines[i]) + '</li>'; }
    h += '</ul><hr><h3>내가 중요하게 여긴 것과 지금의 삶</h3><p>' + e.fitText + '</p><p class="muted mt-s">' + e.stressText + '</p></div></div>';

    h += '<h2 class="mt">돌아보기</h2>';
    h += '<label class="field"><span class="lab">게임 속 나와 지금의 나는 무엇이 닮았고, 무엇이 다른가요?</span><textarea id="inA">' + esc(g.reflect.a) + '</textarea></label>';
    h += '<label class="field"><span class="lab">이번 겨울에 실제로 해 볼 한 가지를 적어 보세요.</span><textarea id="inB">' + esc(g.reflect.b) + '</textarea></label>';
    h += '<div class="row mt">' + primary('saveCard', '카드 이미지 저장') + plain('restart', '다시 해 보기') + '</div>';
    return h + '<div id="cardOut"></div>';
  };

  function render() {
    CS.save(g);
    renderSide();
    stage.innerHTML = VIEWS[g.step]();
    flash = '';
  }
  function go(step) { g.step = step; err = ''; render(); window.scrollTo(0, 0); }

  /* ---------- 버튼 처리 ---------- */
  var ON = {};
  ON.help = function () { modal.hidden = false; };
  ON.closeHelp = function () { modal.hidden = true; };
  ON.restart = function () {
    if (g.step !== 'intro' && !window.confirm('지금까지의 진행과 사진이 지워져요. 처음부터 다시 할까요?')) { return; }
    CS.clear(); g = CS.newGame(); go('intro');
  };
  ON.start = function () { go('c1'); };
  ON.avatar = function (a) { g.avatar = a; g.photo = ''; render(); };
  ON.photoOff = function () { g.photo = ''; render(); };
  ON.c1Next = function () {
    if (!g.name.trim()) { err = '이름을 적어 주세요.'; render(); return; }
    g.name = g.name.trim(); go('c2');
  };
  ON.value = function (id) {
    var i = g.values.indexOf(id);
    if (i >= 0) { g.values.splice(i, 1); }
    else if (g.values.length < 2) { g.values.push(id); }
    else { g.values.shift(); g.values.push(id); }
    err = ''; render();
  };
  ON.c2Next = function () {
    if (g.values.length < 2) { err = '2개를 골라 주세요.'; render(); return; }
    go('c3');
  };
  ON.allocPlus = function (id) { if (allocLeft() > 0) { g.alloc[id] += 1; err = ''; render(); } };
  ON.allocMinus = function (id) { if (g.alloc[id] > 0) { g.alloc[id] -= 1; render(); } };
  ON.c3Next = function () {
    if (allocLeft() > 0) { err = '점수가 ' + allocLeft() + '점 남았어요. 모두 나눠 주세요.'; render(); return; }
    for (var k in g.alloc) { if (g.alloc.hasOwnProperty(k)) { g.stats[k] += g.alloc[k]; g.alloc[k] = 0; } }
    g.quizIdx = 0; g.quizScore = {};
    go('quiz');
  };
  ON.quiz = function (idx) {
    CS.answerQuiz(g, parseInt(idx, 10));
    if (g.quizIdx >= CS.QUIZ.length) { g.recs = CS.recommendSchools(g); g.showAll = false; go('school'); }
    else { render(); }
  };
  ON.quizSkip = function () { g.recs = ['general']; g.showAll = true; go('school'); };
  ON.showAll = function () { g.showAll = true; render(); };
  ON.pickSchool = function (id) { g.school = id; g.specialty = ''; err = ''; render(); };
  ON.enroll = function () {
    var s = CS.schoolOf(g);
    if (!s) { err = '학교를 하나 골라 주세요.'; render(); return; }
    g.specialty = g.specialty.trim();
    CS.applyEff(g, s.bonus);
    g.log.push(s.name + ' 입학');
    g.sem = 1; g.points = CS.SEM_POINTS; g.phase = 'act';
    flash = '<b>' + s.name + '에 입학했어요.</b> ' + fx(s.bonus);
    go('semester');
  };
  ON.action = function (id) {
    var r = CS.doAction(g, id);
    if (r) { flash = (r.crit ? '<span class="crit">대성공!</span>' : '') + '<b>' + r.text + '</b> ' + fx(CS.resolveEff(g, r.eff)); }
    render();
  };
  ON.event = function (idx) { CS.chooseEvent(g, parseInt(idx, 10)); render(); };
  ON.nextSem = function () { CS.nextSemester(g); render(); window.scrollTo(0, 0); };
  ON.path = function (type) {
    if (type === 'univ') { go('uni'); return; }
    if (type === 'gap') {
      CS.gapYear(g);
      flash = '<b>1년 동안 낯선 곳을 여행하고 여러 일을 해 봤어요.</b> ' + fx({ exp: 3, stress: -3 }) + ' 이제 다시 골라 볼까요?';
      render(); return;
    }
    g.pickMode = type; go('pickField');
  };
  ON.backGrad = function () { g.failUni = null; g.path = null; go('grad'); };
  ON.applyUni = function (id) { CS.applyUni(g, id); render(); window.scrollTo(0, 0); };
  ON.retry = function () { CS.retryUni(g); render(); window.scrollTo(0, 0); };
  ON.major = function (id) {
    var m = CS.findById(CS.MAJORS, id);
    g.path.major = id; g.path.field = m.field;
    g.log.push(CS.pathText(g));
    go('tw1');
  };
  ON.field = function (id) {
    if (g.pickMode === 'change') {
      g.path.field = id; g.path.major = null; g.path.changed = true;
      CS.applyEff(g, { exp: 1 });
      g.log.push('20대: ' + CS.FIELDS[id].name + ' 분야로 방향을 바꿨다');
      go('tw2'); return;
    }
    g.path = { type: g.pickMode, uni: null, major: null, field: id };
    g.log.push(CS.pathText(g));
    go('tw1');
  };
  ON.tw1 = function (id) {
    if (id === 'change') { g.pickMode = 'change'; go('pickField'); return; }
    CS.applyTw1(g, id); go('tw2');
  };
  ON.style = function (id) { g.style = id; go('ending'); };
  ON.saveCard = function () {
    CS.drawCard(g, CS.computeEnding(g), function (canvas) {
      var url = canvas.toDataURL('image/png');
      var a = document.createElement('a');
      a.href = url; a.download = 'my-future-card.png';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      document.getElementById('cardOut').innerHTML =
        '<p class="muted mt">저장이 안 되면 아래 그림을 길게 눌러 「사진에 저장」을 고르세요.</p><img id="cardImg" alt="내 엔딩 카드" src="' + url + '">';
    });
  };

  /* 사진 올리기: 기기 안에서 200x200 으로 줄여서 저장 (서버로 보내지 않음) */
  function readPhoto(file) {
    if (!/^image\//.test(file.type)) { err = '사진 파일만 올릴 수 있어요.'; render(); return; }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var S = 200, c = document.createElement('canvas');
        c.width = S; c.height = S;
        var m = Math.min(img.width, img.height);
        c.getContext('2d').drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
        g.photo = c.toDataURL('image/jpeg', 0.82);
        err = ''; render();
      };
      img.onerror = function () { err = '이 사진은 열 수 없어요. 다른 사진을 골라 주세요.'; render(); };
      img.src = reader.result;
    };
    reader.onerror = function () { err = '사진을 읽지 못했어요. 다시 골라 주세요.'; render(); };
    reader.readAsDataURL(file);
  }

  /* ---------- 시작 ---------- */
  function init() {
    stage = document.getElementById('stage');
    side = document.getElementById('side');
    modal = document.getElementById('modal');
    g = CS.load() || CS.newGame();

    document.addEventListener('click', function (ev) {
      var t = ev.target.closest ? ev.target.closest('[data-act]') : null;
      if (!t || t.disabled) { return; }
      var fn = ON[t.getAttribute('data-act')];
      if (fn) { fn(t.getAttribute('data-arg')); }
    });
    /* 글자 입력은 화면을 다시 그리지 않고 바로 저장 */
    document.addEventListener('input', function (ev) {
      var id = ev.target.id;
      if (id === 'inName') { g.name = ev.target.value; }
      else if (id === 'inSpec') { g.specialty = ev.target.value; }
      else if (id === 'inA') { g.reflect.a = ev.target.value; }
      else if (id === 'inB') { g.reflect.b = ev.target.value; }
      else { return; }
      CS.save(g);
    });
    document.addEventListener('change', function (ev) {
      if (ev.target.id === 'inPhoto' && ev.target.files && ev.target.files[0]) { readPhoto(ev.target.files[0]); }
    });
    render();
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
