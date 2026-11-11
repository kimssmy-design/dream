/* ===== 게임 상태와 자동 저장 ===== */
var CS = window.CS || {};
window.CS = CS;

CS.SAVE_KEY = 'career-sim-v2';

/* 새 게임의 처음 상태 */
CS.newGame = function () {
  return {
    step: 'intro',            /* 지금 보고 있는 화면 */
    name: '', avatar: '🙂',
    photo: '',                /* 학생이 올린 사진 (작게 줄인 그림 데이터, 이 기기에만 저장) */
    quizIdx: 0, quizScore: {}, recs: [], showAll: false,
    values: [],               /* 고른 가치관 id 2개 */
    alloc: { study: 0, body: 0, social: 0, create: 0 },
    school: null, specialty: '',
    stats: { study: 2, body: 2, social: 2, create: 2 },
    stress: 2, exp: 0,
    sem: 1, points: 4, phase: 'act', eventId: null, resultText: '', nextPenalty: false,
    log: [],                  /* 걸어온 길 */
    path: null,               /* 졸업 후 진로 */
    gapUsed: false, retried: false,
    pickMode: '', failUni: null,
    style: null,
    reflect: { a: '', b: '' }
  };
};

/* 기기에 저장 (새로고침해도 이어서 할 수 있게) */
CS.save = function (g) {
  try { localStorage.setItem(CS.SAVE_KEY, JSON.stringify(g)); } catch (e) { /* 저장이 막힌 기기에서는 그냥 진행 */ }
};
CS.load = function () {
  try {
    var raw = localStorage.getItem(CS.SAVE_KEY);
    if (!raw) { return null; }
    var g = JSON.parse(raw);
    return (g && g.step && g.stats) ? g : null;
  } catch (e) { return null; }
};
CS.clear = function () {
  try { localStorage.removeItem(CS.SAVE_KEY); } catch (e) { /* 무시 */ }
};
