/* ===== 나 알아보기 질문 (고등학교 추천용) =====
   각 보기의 score 는 "성향: 점수" 입니다. 학교의 tags 와 맞춰 점수가 높은 학교 3곳을 추천합니다.
   추천일 뿐이고, 학생은 어느 학교든 고를 수 있습니다. */
var CS = window.CS || {};
window.CS = CS;

CS.QUIZ = [
  { q: '쉬는 날, 나는 주로?', options: [
    { emo: '🎨', text: '그림 그리거나 뭔가 만든다', score: { art: 2, ani: 2, beauty: 1, media: 1 } },
    { emo: '🎮', text: '게임, 코딩, 기계 만지기에 빠져 있다', score: { it: 2, tech: 2, science: 1 } },
    { emo: '⚽', text: '밖에 나가 몸을 움직인다', score: { sport: 2, perform: 1, military: 1 } },
    { emo: '💬', text: '친구들 만나 수다 떤다', score: { general: 2, lang: 1, media: 1 } } ] },
  { q: '수업 중 제일 신나는 시간은?', options: [
    { emo: '🧪', text: '실험하고 문제 푸는 시간', score: { science: 2, study: 1, health: 1 } },
    { emo: '🌍', text: '다른 나라 말과 문화를 배우는 시간', score: { lang: 2, general: 1 } },
    { emo: '🏃', text: '체육 시간', score: { sport: 2, military: 1 } },
    { emo: '🎭', text: '미술, 음악, 연극 시간', score: { perform: 2, art: 1, ani: 1 } } ] },
  { q: '조별 과제에서 나는?', options: [
    { emo: '📋', text: '계획 세우고 정리하는 사람', score: { study: 2, general: 1 } },
    { emo: '💡', text: '아이디어 내는 사람', score: { media: 1, ani: 1, art: 1, it: 1 } },
    { emo: '🔧', text: '직접 만들고 해결하는 사람', score: { tech: 2, it: 1, food: 1 } },
    { emo: '🎤', text: '앞에 나가 발표하는 사람', score: { lang: 1, perform: 1, media: 1, general: 1 } } ] },
  { q: '3년 뒤, 나는 어떤 모습이면 좋을까?', options: [
    { emo: '🏆', text: '대회나 무대에서 실력을 겨루는 나', score: { sport: 2, perform: 1, art: 1 } },
    { emo: '💼', text: '기술을 익혀 빨리 일을 시작한 나', score: { tech: 2, food: 1, beauty: 1, health: 1, farm: 1 } },
    { emo: '📚', text: '대학에서 더 깊이 공부할 준비가 된 나', score: { study: 2, science: 1, boarding: 1 } },
    { emo: '🧭', text: '아직은 여러 가지를 해 보며 찾는 나', score: { general: 2, alt: 2 } } ] },
  { q: '집을 떠나 기숙사에서 산다면?', options: [
    { emo: '🤩', text: '친구들이랑 24시간 같이라니 설렌다', score: { boarding: 3, alt: 1, military: 1 } },
    { emo: '🙂', text: '주말에 집에 올 수 있으면 괜찮다', score: { boarding: 1, tech: 1, it: 1 } },
    { emo: '🏠', text: '집에서 다니는 게 제일 좋다', score: { general: 2, food: 1, beauty: 1 } },
    { emo: '🎖️', text: '규칙적인 단체 생활, 오히려 좋다', score: { military: 3 } } ] },
  { q: '이런 활동에 마음이 끌린다', options: [
    { emo: '🐶', text: '동물이나 식물 돌보기', score: { farm: 3 } },
    { emo: '🩺', text: '아프거나 위험한 사람 돕기', score: { health: 3, military: 1 } },
    { emo: '🍳', text: '요리, 뷰티, 패션', score: { food: 2, beauty: 2 } },
    { emo: '🌱', text: '교실 밖 프로젝트, 여행, 봉사', score: { alt: 3, general: 1 } } ] }
];

/* 보기 색 (순서대로) */
CS.QUIZ_COLORS = ['create', 'study', 'body', 'social'];

/* 질문 답 반영 */
CS.answerQuiz = function (g, optIdx) {
  var sc = CS.QUIZ[g.quizIdx].options[optIdx].score;
  for (var k in sc) { if (sc.hasOwnProperty(k)) { g.quizScore[k] = (g.quizScore[k] || 0) + sc[k]; } }
  g.quizIdx += 1;
};

/* 성향 목록 점수 = 가장 잘 맞는 성향 점수 + 두 번째 성향 점수의 절반
   성향이 하나뿐인 학교(체고 등)는 그 성향에 집중된 학교라서 1.5배로 계산 */
function tagScore(g, tags) {
  var vals = [];
  for (var i = 0; i < tags.length; i++) { vals.push(g.quizScore[tags[i]] || 0); }
  vals.sort(function (a, b) { return b - a; });
  if (vals.length === 1) { return vals[0] * 1.5; }
  return (vals[0] || 0) + (vals.length > 1 ? vals[1] / 2 : 0);
}

/* 학교 점수
   - 학과가 여러 개인 학교는 학과마다 따로 계산해서 가장 잘 맞는 학과 점수를 씀
     (학과 성향을 모두 합치면 학과가 많은 학교만 늘 추천되기 때문)
   - 우리 지역 학교는 같은 점수일 때 먼저 나오도록 조금 더함 */
CS.schoolScore = function (g, school) {
  var best = 0;
  if (school.depts) {
    for (var d = 0; d < school.depts.length; d++) {
      var t = (CS.KIND_TAGS[school.depts[d].kind] || []).slice();
      if (school.dorm === 'all') { t.push('boarding'); }
      best = Math.max(best, tagScore(g, t));
    }
  } else {
    best = tagScore(g, school.tags);
  }
  if (school.area !== 'all') { best += 0.3; }            /* 우리 지역 학교 */
  if (CS.inMyCity(g, school)) { best += 0.2; }           /* 우리 시·군 학교 */
  if (school.common && school.depts) { best -= 1; }      /* '특성화고 (우리 지역)'은 학과가 많아 늘 맞으므로 낮춤 */
  return best;
};

/* 점수 높은 학교 3곳 (동점이면 목록 순서대로) */
CS.recommendSchools = function (g) {
  var list = [];
  var vis = CS.visibleSchools(g);   /* 내 지역 학교 + 전국 모집 학교 중에서만 추천 */
  /* 점수가 같은 학교가 여럿이면(예: 같은 지역 외고 여러 곳) 그중에서 무작위로 */
  for (var i = 0; i < vis.length; i++) { list.push({ id: vis[i].id, s: CS.schoolScore(g, vis[i]) + Math.random() * 0.01 }); }
  list.sort(function (a, b) { return b.s - a.s; });
  return [list[0].id, list[1].id, list[2].id];
};
