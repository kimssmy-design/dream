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
  /* 입학한 뒤에만 학교 정보가 보이도록 (고르는 중에는 '입학 전') */
  function enrolled() { return g.school && g.step !== 'school' && g.step !== 'quiz'; }
  /* 기숙사가 확인된 학교만 표시 */
  function dormTag(sc) {
    if (!CS.DORM_TEXT[sc.dorm]) { return ''; }
    return ' <span class="tag light">🏠 ' + CS.DORM_TEXT[sc.dorm] + (sc.dormNote ? ' (' + sc.dormNote + ')' : '') + '</span>';
  }

  /* ---------- 왼쪽: 고등학생이 된 나 ---------- */
  function renderSide() {
    if (g.step === 'intro') { side.innerHTML = '<p class="muted">게임을 시작하면 여기에 고등학생이 된 내 모습이 나타나요.</p>'; return; }
    var tr = enrolled() ? CS.trackOf(g) : null;
    var creating = (g.step === 'c1' || g.step === 'c2' || g.step === 'c3');
    var h = '<div class="me bg-' + (tr ? tr.main : 'white') + '">' + face('l') +
      '<div><div class="nm">' + (esc(g.name) || '이름 없음') + '</div><div class="muted">' +
      (tr ? (tr.school.emo || tr.kind.emo) + ' ' + esc(tr.name) : (CS.regionOf(g.region) ? '📍 ' + CS.regionOf(g.region).name + (g.city ? ' ' + g.city : '') + ' · ' : '') + '입학 전') + (g.specialty ? ' · ' + esc(g.specialty) : '') + '</div></div></div>';
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
      '<p class="muted">30분쯤 걸려요. 전국 ' + CS.REGIONS.length + '개 시·도 고등학교 ' + CS.SCHOOLS.length + '곳, 대학 학과 ' + CS.majorCount() + '개, 직업 엔딩 ' + CS.jobCount() + '가지. 정답은 없어요.</p>' +
      '<div class="mt">' + primary('start', '게임 시작') + '</div>' +
      '<p class="muted small mt">만든이 취미쌤 · <a href="https://blog.naver.com/ssam_hobbybox" target="_blank" rel="noopener">blog.naver.com/ssam_hobbybox</a></p></div>';
  };

  VIEWS.c1 = function () {
    var h = scene({ place: '고등학생이 된 나 만들기 1 / 3', emo: '🪪', color: 'exp', text: '1년 뒤, 고등학생이 된 나를 떠올려 봐요. 이름과 얼굴부터 정해요.' });
    h += '<label class="field"><span class="lab">이름</span><input type="text" id="inName" maxlength="10" placeholder="내 이름 또는 별명" value="' + esc(g.name) + '"></label>';
    h += '<div class="field"><span class="lab">얼굴</span><div class="row">' +
      '<label class="photo-btn">📷 ' + (g.photo ? '사진 바꾸기' : '사진 올리기') + '<input type="file" id="inPhoto" accept="image/*"></label>';
    if (g.photo) { h += '<button class="btn" data-act="photoOff">사진 빼기</button>'; }
    h += '</div><p class="muted mt-s">얼굴 사진이 아니어도 돼요. 좋아하는 그림이나 풍경도 좋아요. 사진은 이 기기에만 저장돼요.</p><div class="row mt-s">';
    for (var i = 0; i < CS.AVATARS.length; i++) {
      h += '<button class="pick' + (!g.photo && g.avatar === CS.AVATARS[i] ? ' on' : '') + '" data-act="avatar" data-arg="' + CS.AVATARS[i] + '">' + CS.AVATARS[i] + '</button>';
    }
    h += '</div></div>';
    h += '<div class="field"><span class="lab">내가 사는 곳</span><p class="muted" style="margin-bottom:8px">이 지역의 고등학교가 나와요.</p><div class="row">';
    for (var r = 0; r < CS.REGIONS.length; r++) {
      var rg = CS.REGIONS[r];
      h += '<button class="tab' + (g.region === rg.id ? ' on' : '') + '" data-act="region" data-arg="' + rg.id + '"' +
        (rg.full ? ' title="' + rg.full + '"' : '') + '>' + rg.name + '</button>';
    }
    h += '</div></div>';
    var cities = CS.CITIES[g.region];
    if (cities) {
      h += '<div class="field"><span class="lab">우리 시·군 <span class="muted">(안 골라도 돼요)</span></span>' +
        '<p class="muted" style="margin-bottom:8px">고르면 우리 시·군 학교가 목록 맨 위에 보여요.</p><div class="row">';
      for (var c = 0; c < cities.length; c++) {
        h += '<button class="tab small-tab' + (g.city === cities[c] ? ' on' : '') + '" data-act="city" data-arg="' + cities[c] + '">' + cities[c] + '</button>';
      }
      h += '</div></div>';
    }
    if (err) { h += '<p class="err">' + err + '</p>'; }
    return h + '<div class="mt">' + primary('c1Next', '다음') + '</div>';
  };

  VIEWS.c2 = function () {
    var h = scene({ place: '고등학생이 된 나 만들기 2 / 3', emo: '💭', color: 'social', text: '살면서 내가 가장 중요하게 여기는 것 <b>2개</b>를 골라요. 마지막에 내 삶과 비교해 볼 거예요.' });
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
    var h = scene({ place: '고등학생이 된 나 만들기 3 / 3', emo: '🎚️', color: 'body',
      text: '지금의 나는 어떤 걸 잘할까? 자신 있는 쪽에 점수를 더 주세요. 정답은 없어요.<br><span class="muted">점수 ' + CS.START_POINTS + '점을 모두 나눠야 다음으로 갈 수 있어요. 이 점수는 고등학교 생활과 대학·직업 선택에 영향을 줘요.</span>',
      right: '남은 점수 ' + dots(allocLeft(), CS.START_POINTS) });
    h += '<div class="field">';
    for (var k = 0; k < CS.STATS.length; k++) {
      var s = CS.STATS[k];
      h += '<div class="alloc bg-' + s.id + '"><span class="nm">' + CS.STAT_EMO[s.id] + ' ' + s.name +
        '<small>' + s.desc + '<br>예: ' + s.ex + '</small></span>' +
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
    h += '</div><div class="mt"><button class="btn" data-act="quizSkip">🤔 아직 잘 모르겠어요 · 질문 건너뛰고 학교 보기</button></div>';
    return h;
  };

  /* 학교 카드 */
  function schoolCard(sc, rec) {
    var tags = '<span class="tag light">' + sc.type + ' · ' + sc.place + '</span>' + (sc.nation ? ' <span class="tag light">전국 모집</span>' : '') + dormTag(sc);
    if (CS.inMyCity(g, sc)) { tags = '<span class="tag">📍 우리 ' + (g.city || '') + '</span> ' + tags; }
    if (rec) { tags = '<span class="tag">추천: ' + sc.reason + '</span> ' + tags; }
    var color = sc.depts ? CS.KINDS[sc.depts[0].kind].main : CS.KINDS[sc.kind].main;
    var emo = sc.emo || (sc.depts ? CS.KINDS[sc.depts[0].kind].emo : CS.KINDS[sc.kind].emo);
    return '<button class="ch bg-' + color + (g.school === sc.id ? ' on' : '') + '" data-act="pickSchool" data-arg="' + sc.id + '">' +
      '<span class="emo">' + emo + '</span><span class="body"><b>' + sc.name + '</b><small>' + sc.desc +
      (sc.depts ? ' <u>' + (sc.deptWord || '학과') + ' ' + sc.depts.length + '개</u>' : '') + '</small><span class="tags">' + tags + '</span></span></button>';
  }

  VIEWS.school = function () {
    var h = scene({ place: '고등학교 고르기', emo: '🏫', color: 'study',
      text: (g.tab === 'rec' ? '내 답을 보니 이런 학교가 어울릴 것 같아요. 추천일 뿐, 위의 탭을 눌러 어느 학교든 고를 수 있어요.' : '탭을 넘기며 학교를 둘러보세요. 학교를 누르면 학과와 자세한 정보가 나와요.') +
        '<br><span class="muted">' + (CS.regionOf(g.region) ? (CS.regionOf(g.region).full || CS.regionOf(g.region).name) : '') + ' 학교와 전국에서 모집하는 학교가 나와요.' + (g.city ? ' 우리 ' + g.city + ' 학교가 먼저 보여요.' : '') + '</span>' });
    /* 탭 */
    h += '<div class="tabs" role="tablist">';
    h += '<button class="tab' + (g.tab === 'rec' ? ' on' : '') + '" data-act="tab" data-arg="rec">⭐ 추천</button>';
    for (var t = 0; t < CS.SCHOOL_TABS.length; t++) {
      var tb = CS.SCHOOL_TABS[t];
      h += '<button class="tab bg-' + CS.TAB_COLORS[tb.id] + (g.tab === tb.id ? ' on' : '') + '" data-act="tab" data-arg="' + tb.id + '">' + tb.name + '</button>';
    }
    h += '</div><div class="choices one">';
    var list = [], i;
    var vis = CS.visibleSchools(g);
    if (g.tab === 'rec') { for (i = 0; i < g.recs.length; i++) { var rs = CS.findById(CS.SCHOOLS, g.recs[i]); if (rs) { list.push(rs); } } }
    else {
      /* 공통 유형 → 우리 지역 학교 → 전국 모집 학교 순서 */
      var order = [function (x) { return x.common; },
                   function (x) { return x.area !== 'all' && CS.inMyCity(g, x); },
                   function (x) { return x.area !== 'all' && !CS.inMyCity(g, x); },
                   function (x) { return x.nation; }];
      for (var o = 0; o < order.length; o++) {
        for (i = 0; i < vis.length; i++) { if (vis[i].tab === g.tab && order[o](vis[i])) { list.push(vis[i]); } }
      }
    }
    /* 고른 학교 상자: 학과 고르기, 종목 적기, 입학하기
       목록이 길어도 바로 보이도록 고른 학교 카드 바로 아래에 붙임 */
    var cur = CS.schoolOf(g);
    var picked = '';
    if (cur) {
      picked = pickedBox(cur);
    }
    var shown = false;
    for (i = 0; i < list.length; i++) {
      h += schoolCard(list[i], g.recs.indexOf(list[i].id) >= 0);
      if (cur && list[i].id === cur.id) { h += picked; shown = true; }
    }
    if (!list.length) { h += '<p class="muted">이 탭에는 학교가 없어요. 다른 탭을 눌러 보세요.</p>'; }
    h += '</div>';
    if (cur && !shown) { h += picked; }   /* 다른 탭에서 고른 학교는 목록 아래에 */
    h += '<p class="muted small mt-s">학교 정보는 2026년 기준이에요. 기숙사, 모집 학과, 지원 자격은 학교 홈페이지에서 꼭 확인하세요.</p>';
    if (!cur) {
      if (err) { h += '<p class="err">' + err + '</p>'; }
      h += '<div class="mt">' + primary('enroll', '입학하기') + '</div>';
    }
    return h;
  };

  function pickedBox(cur) {
    var h = '';
    {
      h += '<div class="picked" id="pickedBox"><h3>✔ ' + cur.name + '</h3>';
      if (cur.depts) {
        var dw = cur.deptWord || '학과';
        h += '<p class="muted">' + dw + CS.josa(dw, '을', '를') + ' 골라요.' + (cur.deptWord ? ' 학교마다 개설된 전공이 다를 수 있어요.' : '') + '</p><div class="choices three">';
        for (var d = 0; d < cur.depts.length; d++) {
          var dp = cur.depts[d], kd = CS.KINDS[dp.kind];
          h += ch('pickDept', dp.id, dp.name, kd.t[0], kd.main, { on: g.dept === dp.id, emo: kd.emo });
        }
        h += '</div>';
      }
      if (cur.ask) {
        h += '<label class="field"><span class="lab">' + cur.ask + ' <span class="muted">(안 적어도 돼요)</span></span>' +
          '<input type="text" id="inSpec" maxlength="14" value="' + esc(g.specialty) + '"></label>';
      }
      var kindNow = CS.KINDS[CS.kindIdOf(cur, g.dept)];
      h += '<p class="mt-s">입학 보너스 ' + fx(CS.bonusOf(kindNow)) + '</p>';
      if (err) { h += '<p class="err">' + err + '</p>'; }
      h += '<div class="mt-s">' + primary('enroll', '이 학교에 입학하기') + '</div></div>';
    }
    return h;
  }

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
      var sit = CS.sceneOf(g);
      var tr = CS.trackOf(g);
      h += scene({ place: CS.semName(g.sem) + ' · ' + sit.place, emo: sit.emo, color: CS.SEM_COLORS[g.sem - 1],
        text: '<span class="now">지금 상황</span>' + sit.text, right: '이번 학기 ' + dots(g.points, CS.SEM_POINTS) });
      if (g.stress >= CS.BURNOUT) { h += '<div class="note bg-stress"><b>몸이 보내는 신호:</b> 스트레스가 너무 높아요. 이대로 학기를 마치면 번아웃이 와요.</div>'; }
      h += '<p class="ask">이 시기, 나는 어디에 시간을 쓸까?</p><div class="choices">';
      var acts = CS.actionsFor(g);
      for (var j = 0; j < acts.length; j++) {
        var a = acts[j];
        var color = a.special ? tr.main : CS.colorOfEff(g, a.eff);
        h += ch('action', a.id, a.label, fx(CS.resolveEff(g, a.eff)), color,
          { emo: a.emo, tag: a.special ? tr.school.name + ' 전용' : '', tagCls: 'light' });
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
    h += ch('path', 'univ', '대학에 진학한다', '단과대와 학과를 골라요. 사범대, 교대, 공대, 예체능대, 전문대…', 'study', { emo: '🏛️' });
    h += ch('path', 'work', '바로 취업한다', '일하면서 배워요. 나중에 대학에 갈 수도 있어요.', 'body', { emo: '💼' });
    h += ch('path', 'abroad', '유학을 떠난다', '어학, 미술, 음악, 요리, 스포츠… 다른 나라에서 배워요.', 'exp', { emo: '🛫' });
    h += ch('path', 'pro', '선수·예술가로 바로 뛰어든다', '실업팀, 무용단, 연재, 무대로 곧장 가요.', 'create',
      { emo: '🔥', disabled: !proOk, tag: '조건: 체력 또는 창의 ' + CS.PRO_MIN + ' 이상', tagCls: proOk ? 'light' : 'no' });
    h += ch('path', 'startup', '나만의 길을 만든다', '창업하거나 내 일을 직접 시작해요.', 'exp',
      { emo: '🚀', disabled: !startOk, tag: '조건: 진로 경험 ' + CS.STARTUP_EXP + ' 이상', tagCls: startOk ? 'light' : 'no' });
    if (!g.gapUsed) { h += ch('path', 'gap', '1년 쉬며 탐색한다', '여행하고 일해 보며 천천히 정해요. ' + fx({ exp: 3, stress: -3 }), 'rest', { emo: '🎒' }); }
    return h + '</div>';
  };

  /* 고를 수 있는지 표시: 조건을 채우면 조건만, 못 채우면 무엇이 얼마나 부족한지 */
  function reqOpt(req, emo, extraTag) {
    var ok = CS.checkReq(g, req).ok;
    var opt = { emo: emo, disabled: !ok };
    if (!ok) { opt.tag = CS.needText(g, req); opt.tagCls = 'no'; }
    else if (extraTag) { opt.tag = extraTag; }
    else if (CS.reqText(req) !== '조건 없음') { opt.tag = CS.reqText(req); opt.tagCls = 'light'; }
    return opt;
  }

  VIEWS.college = function () {
    var col = CS.findById(CS.COLLEGES, g.college) || CS.COLLEGES[0];
    var h = scene({ place: '학과 고르기', emo: '🏛️', color: 'study', title: '어떤 학과에서 공부할까요?',
      text: '단과대를 누르면 학과가 나와요. 능력치가 모자란 학과는 회색으로 막혀 있어요.' });
    h += '<div class="tabs">';
    for (var t = 0; t < CS.COLLEGES.length; t++) {
      var c = CS.COLLEGES[t];
      h += '<button class="tab bg-' + c.color + (c.id === col.id ? ' on' : '') + '" data-act="college" data-arg="' + c.id + '">' + c.emo + ' ' + c.name + '</button>';
    }
    h += '</div><p class="mt-s muted">' + col.desc + '</p><div class="choices">';
    var top = CS.topFields(g);
    for (var i = 0; i < col.majors.length; i++) {
      var m = col.majors[i];
      var good = g.exp >= 3 && top.indexOf(m[2]) >= 0 && CS.checkReq(g, m[3]).ok;
      h += ch('major', m[0], m[1], CS.FIELDS[m[2]].name + ' 분야로 이어져요', col.color,
        reqOpt(m[3], CS.FIELD_EMO[m[2]], good ? '내 강점과 맞음' : ''));
    }
    h += '</div>';
    if (g.exp < 3) { h += '<p class="muted mt-s">진로 탐색을 3번 이상 했다면 내 강점과 맞는 학과에 표시가 붙었을 거예요.</p>'; }
    return h;
  };

  VIEWS.work = function () {
    var tr = CS.trackOf(g);
    var h = scene({ place: '취업 준비', emo: '💼', color: 'body', title: '어디에서 일을 시작할까요?',
      text: '고등학교에서 배운 것과 이어지는 일에는 「내 학과와 맞음」 표시가 있어요.' });
    var mine = [], rest = [], i;
    for (i = 0; i < CS.WORK.length; i++) { (CS.WORK[i][4].indexOf(tr.kindId) >= 0 ? mine : rest).push(CS.WORK[i]); }
    var list = mine.concat(rest);
    h += '<div class="choices">';
    for (i = 0; i < list.length; i++) {
      var w = list[i];
      h += ch('work', w[0], w[1], CS.FIELDS[w[2]].name + ' 분야', CS.FIELDS[w[2]].keys[0],
        reqOpt(w[3], CS.FIELD_EMO[w[2]], mine.indexOf(w) >= 0 ? '내 학과와 맞음' : ''));
    }
    return h + '</div>';
  };

  VIEWS.abroad = function () {
    var h = scene({ place: '출국 준비', emo: '🛫', color: 'exp', title: '어떤 유학을 떠날까요?',
      text: '낯선 나라에서 말도 배우고 실력도 키워요. 나라는 예시예요.' });
    h += '<div class="choices">';
    for (var i = 0; i < CS.ABROAD.length; i++) {
      var ab = CS.ABROAD[i];
      h += ch('abroad', ab[0], ab[1], ab[2], CS.FIELDS[ab[3]].keys[0], reqOpt(ab[4], CS.FIELD_EMO[ab[3]], ''));
    }
    return h + '</div>';
  };

  /* 분야 고르기 (취업, 바로 활동, 창업, 분야 바꾸기 공용) */
  VIEWS.pickField = function () {
    var titles = { pro: '어떤 무대로 뛰어들까요?', startup: '어떤 분야에서 내 일을 시작할까요?', change: '어느 분야로 바꿀까요?' };
    var emos = { pro: '🔥', startup: '🚀', change: '🔄' };
    var h = scene({ place: '분야 고르기', emo: emos[g.pickMode], color: 'exp', title: titles[g.pickMode], text: '분야마다 특히 중요한 능력이 달라요.' });
    var ids = [], i;
    if (g.pickMode === 'startup') { ids = CS.STARTUP_FIELDS; }
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
      title: '나는 어떤 방식으로 일하고 싶나요?', text: CS.FIELDS[g.path.field].name + ' 분야에서 내 자리를 찾아야 할 때예요. 먼저 원하는 일하는 방식을 고르고, 다음에 구체적인 직업을 골라요.' });
    h += '<div class="choices one">';
    for (var i = 0; i < CS.STYLES.length; i++) {
      var s = CS.STYLES[i];
      h += ch('style', s.id, s.label, '', CS.STYLE_COLORS[s.id], { emo: CS.STYLE_EMO[s.id] });
    }
    return h + '</div>';
  };

  VIEWS.job = function () {
    var f = CS.FIELDS[g.path.field];
    var want = CS.findById(CS.STYLES, g.style);
    var h = scene({ place: '스물일곱 즈음', emo: CS.FIELD_EMO[g.path.field], color: CS.STYLE_COLORS[g.style],
      title: '어떤 일을 하게 될까요?', text: f.name + ' 분야의 직업들이에요. 「' + want.short + '」 방식과 맞는 직업에 표시가 있지만, 어느 직업이든 골라도 돼요. 마지막 선택이에요.' });
    /* 원하는 방식과 맞는 직업을 위로 */
    var order = [], i;
    for (i = 0; i < f.jobs.length; i++) { if (f.jobs[i][2] === g.style) { order.push(i); } }
    for (i = 0; i < f.jobs.length; i++) { if (f.jobs[i][2] !== g.style) { order.push(i); } }
    h += '<div class="choices">';
    for (var n = 0; n < order.length; n++) {
      var j = CS.jobOf(g.path.field, order[n]);
      var st = CS.findById(CS.STYLES, j.style);
      var match = j.style === g.style;
      h += ch('job', order[n], j.name, j.desc, CS.STYLE_COLORS[j.style],
        { emo: CS.STYLE_EMO[j.style], tag: match ? '내 방식과 맞음' : st.short + ' 쪽 일', tagCls: match ? '' : 'light' });
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
    var rc = CS.uniRecs(g);
    h += '</ul><div class="recs"><b>' + rc.title + '</b><div>';
    for (var r = 0; r < rc.items.length; r++) { h += '<span class="tag light">' + rc.items[r] + '</span> '; }
    h += '</div>' + (g.path.type === 'univ' ? '<small class="muted">학과 이름은 대학마다 조금씩 달라요. 정확한 정보는 대학 입학처에서 확인하세요.</small>' : '') + '</div>';
    h += '<hr><h3>내가 중요하게 여긴 것과 지금의 삶</h3><p>' + e.fitText + '</p><p class="mt-s">' + e.styleText + '</p><p class="muted mt-s">' + e.stressText + '</p></div></div>';

    h += '<h2 class="mt">돌아보기</h2>';
    h += '<label class="field"><span class="lab">게임 속 나와 지금의 나는 무엇이 닮았고, 무엇이 다른가요?</span><textarea id="inA">' + esc(g.reflect.a) + '</textarea></label>';
    h += '<label class="field"><span class="lab">이번 겨울에 실제로 해 볼 한 가지를 적어 보세요.</span><textarea id="inB">' + esc(g.reflect.b) + '</textarea></label>';
    h += '<div class="row mt">' + primary('saveCard', '카드 이미지 만들기') + plain('restart', '다시 해 보기') + '</div>';
    return h + '<div id="cardOut"></div>';
  };

  function render() {
    CS.save(g);
    renderSide();
    var back = '';
    if (g.step !== 'intro' && CS.canBack(g)) {
      var label = (g.step === 'semester') ? '← 방금 선택 되돌리기' : '← 이전으로';
      back = '<div class="back-row"><button class="btn ghost" data-act="back">' + label + '</button></div>';
    }
    try {
      stage.innerHTML = back + VIEWS[g.step]();
    } catch (e) {
      showError(e);
    }
    flash = '';
  }
  /* 오류 안내: 파일이 섞였거나(예전 파일 + 새 파일) 예상 못 한 문제가 생겼을 때 */
  function showError(e) {
    var msg = (e && e.message) ? e.message : String(e);
    if (window.console) { console.error(e); }
    stage.innerHTML = '<div class="note bg-stress"><b>화면을 불러오다 문제가 생겼어요.</b>' +
      '<p class="mt-s">새로고침해도 같으면 「처음부터」를 눌러 주세요. 선생님께 아래 내용을 보여 주면 고칠 수 있어요.</p>' +
      '<p class="muted small mt-s">오류: ' + esc(msg) + ' · 화면: ' + esc(g.step) + ' · 버전 ' + CS.VERSION + '</p></div>' +
      '<div class="row mt"><button class="btn" data-act="back">← 이전으로</button><button class="btn" data-act="restart">처음부터</button></div>';
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
  ON.back = function () {
    if (!CS.canBack(g)) { return; }
    g = CS.popHist(g);
    flash = ''; err = ''; render(); window.scrollTo(0, 0);
  };
  ON.start = function () { CS.pushHist(g); go('c1'); };
  ON.avatar = function (a) { g.avatar = a; g.photo = ''; render(); };
  ON.photoOff = function () { g.photo = ''; render(); };
  ON.c1Next = function () {
    if (!g.name.trim()) { err = '이름을 적어 주세요.'; render(); return; }
    if (!g.region) { err = '사는 곳을 골라 주세요.'; render(); return; }
    g.name = g.name.trim(); CS.pushHist(g); go('c2');
  };
  ON.region = function (id) {
    if (g.region !== id) { g.region = id; g.city = null; g.school = null; g.dept = null; g.recs = []; }
    err = ''; render();
  };
  ON.city = function (c) {
    g.city = (g.city === c) ? null : c;   /* 한 번 더 누르면 선택 취소 */
    render();
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
    CS.pushHist(g); go('c3');
  };
  ON.allocPlus = function (id) { if (allocLeft() > 0) { g.alloc[id] += 1; err = ''; render(); } };
  ON.allocMinus = function (id) { if (g.alloc[id] > 0) { g.alloc[id] -= 1; render(); } };
  ON.c3Next = function () {
    if (allocLeft() > 0) { err = '점수가 ' + allocLeft() + '점 남았어요. 모두 나눠 주세요.'; render(); return; }
    CS.pushHist(g);
    for (var k in g.alloc) { if (g.alloc.hasOwnProperty(k)) { g.stats[k] += g.alloc[k]; g.alloc[k] = 0; } }
    g.quizIdx = 0; g.quizScore = {};
    go('quiz');
  };
  ON.quiz = function (idx) {
    CS.pushHist(g);
    CS.answerQuiz(g, parseInt(idx, 10));
    if (g.quizIdx >= CS.QUIZ.length) { g.recs = CS.recommendSchools(g); g.tab = 'rec'; go('school'); }
    else { render(); }
  };
  ON.quizSkip = function () { CS.pushHist(g); g.recs = []; g.tab = 'general'; go('school'); };
  ON.tab = function (id) { g.tab = id; render(); };
  ON.pickSchool = function (id) {
    if (g.school !== id) { g.school = id; g.specialty = ''; g.dept = null; }
    var sc = CS.schoolOf(g);
    if (sc.depts && sc.depts.length === 1) { g.dept = sc.depts[0].id; }
    err = ''; render();
    var el = document.getElementById('pickedBox');
    if (el && el.scrollIntoView) { try { el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { el.scrollIntoView(false); } }
  };
  ON.pickDept = function (id) { g.dept = id; err = ''; render(); };
  ON.enroll = function () {
    var s = CS.schoolOf(g);
    if (!s) { err = '학교를 하나 골라 주세요.'; render(); return; }
    if (s.depts && !g.dept) { err = '학과를 하나 골라 주세요.'; render(); return; }
    g.specialty = g.specialty.trim();
    CS.pushHist(g);
    var tr = CS.trackOf(g);
    var bonus = CS.bonusOf(tr.kind);
    CS.applyEff(g, bonus);
    g.log.push(tr.name + ' 입학');
    g.sem = 1; g.points = CS.SEM_POINTS; g.phase = 'act';
    flash = '<b>' + tr.name + '에 입학했어요.</b> ' + fx(bonus);
    go('semester');
  };
  ON.action = function (id) {
    CS.clearHist(g); CS.pushHist(g);   /* 학기 선택은 방금 것 1번만 되돌리기 */
    var r = CS.doAction(g, id);
    if (r) {
      flash = (r.crit ? '<span class="crit">대성공!</span>' : '') + '<b>' + r.text + '</b> ' + fx(CS.resolveEff(g, r.eff));
      if (r.bonus) { flash += '<div class="bonus"><span class="crit">깜짝!</span> ' + r.bonus.text + ' ' + fx(r.bonus.eff) + '</div>'; }
    }
    render();
  };
  ON.event = function (idx) { CS.clearHist(g); CS.chooseEvent(g, parseInt(idx, 10)); render(); };
  ON.nextSem = function () { CS.clearHist(g); CS.nextSemester(g); render(); window.scrollTo(0, 0); };
  ON.path = function (type) {
    CS.pushHist(g);
    if (type === 'univ') { go('college'); return; }
    if (type === 'work') { go('work'); return; }
    if (type === 'abroad') { go('abroad'); return; }
    if (type === 'gap') {
      CS.gapYear(g);
      flash = '<b>1년 동안 낯선 곳을 여행하고 여러 일을 해 봤어요.</b> ' + fx({ exp: 3, stress: -3 }) + ' 이제 다시 골라 볼까요?';
      render(); return;
    }
    g.pickMode = type; go('pickField');
  };
  ON.backGrad = function () { g.path = null; go('grad'); };
  ON.college = function (id) { g.college = id; render(); };
  ON.major = function (id) {
    var m = CS.majorOf(id);
    if (!m || !CS.checkReq(g, m.req).ok) { return; }
    CS.pushHist(g);
    g.path = { type: 'univ', major: id, field: m.field };
    g.log.push(CS.pathText(g));
    go('tw1');
  };
  ON.work = function (id) {
    var w = CS.rowOf(CS.WORK, id);
    if (!w || !CS.checkReq(g, w[3]).ok) { return; }
    CS.pushHist(g);
    g.path = { type: 'work', work: id, field: w[2] };
    g.log.push(CS.pathText(g));
    go('tw1');
  };
  ON.abroad = function (id) {
    var ab = CS.rowOf(CS.ABROAD, id);
    if (!ab || !CS.checkReq(g, ab[4]).ok) { return; }
    CS.pushHist(g);
    g.path = { type: 'abroad', abroad: id, field: ab[3] };
    g.log.push(CS.pathText(g));
    go('tw1');
  };
  ON.field = function (id) {
    CS.pushHist(g);
    if (g.pickMode === 'change') {
      g.path.field = id; g.path.changed = true;   /* 처음 고른 학과·일자리는 그대로 기록 */
      CS.applyEff(g, { exp: 1 });
      g.log.push('20대: ' + CS.FIELDS[id].name + ' 분야로 방향을 바꿨다');
      go('tw2'); return;
    }
    g.path = { type: g.pickMode, uni: null, major: null, field: id };
    g.log.push(CS.pathText(g));
    go('tw1');
  };
  ON.tw1 = function (id) {
    CS.pushHist(g);
    if (id === 'change') { g.pickMode = 'change'; go('pickField'); return; }
    CS.applyTw1(g, id); go('tw2');
  };
  ON.style = function (id) { CS.pushHist(g); g.style = id; g.job = null; go('job'); };
  ON.backStyle = function () { go('tw2'); };
  ON.job = function (idx) {
    CS.pushHist(g);
    g.job = parseInt(idx, 10);
    g.log.push('직업: ' + CS.jobOf(g.path.field, g.job).name);
    go('ending');
  };
  /* 카드 저장
     1단계: 카드 그림을 만들어 화면에 보여 줌
     2단계: 공유 기능이 되는 기기(아이폰·안드로이드)는 「사진에 저장」 버튼 → 공유 창에서 「이미지 저장」
            공유가 안 되는 기기(PC 등)는 바로 내려받기
     아이폰 사파리는 내려받기를 하면 사진 앱이 아니라 「파일」 앱으로 가기 때문에 공유 창을 씁니다.
     공유 기능은 https 주소(GitHub Pages, Netlify 등)에서만 동작합니다. */
  var cardFile = null;
  function canShareFile(f) {
    try { return !!(f && navigator.canShare && navigator.share && navigator.canShare({ files: [f] })); } catch (e) { return false; }
  }
  function downloadUrl(url) {
    var a = document.createElement('a');
    a.href = url; a.download = 'my-future-card.png';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }
  ON.saveCard = function () {
    var out = document.getElementById('cardOut');
    if (out) { out.innerHTML = '<p class="muted mt">카드를 만드는 중이에요…</p>'; }
    CS.drawCard(g, CS.computeEnding(g), function (canvas) {
      var dataUrl = canvas.toDataURL('image/png');
      function show(file) {
        cardFile = file;
        var share = canShareFile(file);
        var h = '<div class="card-actions">';
        if (share) { h += primary('shareCard', '📲 사진에 저장하기'); }
        h += '<a class="btn" href="' + dataUrl + '" download="my-future-card.png">파일로 내려받기</a></div>';
        h += '<p class="muted mt-s">' + (share ? '공유 창이 뜨면 「이미지 저장」을 누르세요. ' : '') +
          '저장이 안 되면 아래 그림을 길게 눌러 「사진에 저장」을 고르세요.</p>';
        h += '<img id="cardImg" alt="내 엔딩 카드" src="' + dataUrl + '">';
        if (out) { out.innerHTML = h; }
        /* 검정 버튼은 하나만: 만든 뒤에는 「카드 다시 만들기」를 흰 버튼으로 */
        var mk = document.querySelector('[data-act=saveCard]');
        if (mk) { mk.className = 'btn'; mk.textContent = '카드 다시 만들기'; }
        if (!share) { downloadUrl(dataUrl); }
      }
      if (canvas.toBlob && window.File) {
        canvas.toBlob(function (blob) {
          var f = null;
          try { f = blob ? new File([blob], 'my-future-card.png', { type: 'image/png' }) : null; } catch (e) { f = null; }
          show(f);
        }, 'image/png');
      } else { show(null); }
    });
  };
  ON.shareCard = function () {
    if (!canShareFile(cardFile)) { return; }
    navigator.share({ files: [cardFile], title: '15년 뒤의 나' }).catch(function (e) {
      if (e && e.name === 'AbortError') { return; }   /* 학생이 공유 창을 닫은 경우 */
      var out = document.getElementById('cardOut');
      if (out) { out.insertAdjacentHTML('afterbegin', '<p class="err">공유 창을 열지 못했어요. 아래 그림을 길게 눌러 저장하세요.</p>'); }
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
      if (fn) {
        try { fn(t.getAttribute('data-arg')); } catch (e) { showError(e); }
      }
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
