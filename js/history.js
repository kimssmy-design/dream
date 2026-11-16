/* ===== 이전으로: 선택 직전 상태를 기록했다가 되돌리기 =====
   - 만들기·질문·학교·졸업 후 진로 화면: 여러 번 되돌릴 수 있음
   - 학기 선택: 방금 한 선택 1번만 되돌릴 수 있음 (결과 다시 뽑기 방지)
   - 돌발 사건을 고른 뒤, 다음 학기로 넘어간 뒤에는 기록을 지움 */
var CS = window.CS || {};
window.CS = CS;

CS.HIST_MAX = 40;

/* 지금 상태 복사 (사진과 기록 자체는 빼고) */
function histSnap(g) {
  var c = JSON.parse(JSON.stringify(g));
  delete c._hist;
  delete c.photo;
  return c;
}
CS.pushHist = function (g) {
  if (!g._hist) { g._hist = []; }
  g._hist.push(histSnap(g));
  if (g._hist.length > CS.HIST_MAX) { g._hist.shift(); }
};
CS.clearHist = function (g) { g._hist = []; };
CS.canBack = function (g) { return !!(g._hist && g._hist.length); };

/* 되돌린 상태를 돌려줌. 사진과 돌아보기 글은 지금 것을 그대로 유지 */
CS.popHist = function (g) {
  if (!CS.canBack(g)) { return g; }
  var prev = g._hist.pop();
  prev._hist = g._hist;
  prev.photo = g.photo;
  prev.reflect = g.reflect;
  return prev;
};
