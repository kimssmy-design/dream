/* ===== 나 알아보기 질문 (고등학교 추천용) =====
   각 보기의 score 는 "학교 id: 점수" 입니다. 점수가 높은 학교 3곳이 추천으로 표시됩니다.
   추천일 뿐이고, 학생은 어느 학교든 고를 수 있습니다. */
var CS = window.CS || {};
window.CS = CS;

CS.QUIZ = [
  { q: '쉬는 날, 나는 주로?', options: [
    { emo: '🎨', text: '그림 그리거나 뭔가 만든다', score: { artHigh: 2, aniHigh: 2, vocHigh: 1 } },
    { emo: '🎮', text: '게임이나 코딩, 기계 만지기에 빠져 있다', score: { aiHigh: 2, vocHigh: 1, sciHigh: 1 } },
    { emo: '⚽', text: '밖에 나가 몸을 움직인다', score: { peHigh: 2, sportsTalent: 2, danceHigh: 1 } },
    { emo: '💬', text: '친구들 만나 수다 떤다', score: { general: 2, langHigh: 1 } } ] },
  { q: '수업 중 제일 신나는 시간은?', options: [
    { emo: '🧪', text: '실험하고 문제 푸는 시간', score: { sciHigh: 2, aiHigh: 1 } },
    { emo: '🌍', text: '다른 나라 말과 문화를 배우는 시간', score: { langHigh: 2, general: 1 } },
    { emo: '🏃', text: '체육 시간', score: { peHigh: 2, sportsTalent: 2 } },
    { emo: '✏️', text: '그리고 만들고 표현하는 시간', score: { artHigh: 1, aniHigh: 1, danceHigh: 2 } } ] },
  { q: '조별 과제에서 나는?', options: [
    { emo: '📋', text: '계획 세우고 정리하는 사람', score: { general: 2, sciHigh: 1 } },
    { emo: '💡', text: '아이디어 내는 사람', score: { aniHigh: 1, aiHigh: 1, artHigh: 1 } },
    { emo: '🔧', text: '직접 만들고 해결하는 사람', score: { vocHigh: 2, aiHigh: 1 } },
    { emo: '🎤', text: '앞에 나가 발표하는 사람', score: { langHigh: 1, danceHigh: 1, general: 1 } } ] },
  { q: '3년 뒤, 나는 어떤 모습이면 좋을까?', options: [
    { emo: '🏆', text: '대회나 무대에서 실력을 겨루는 나', score: { peHigh: 2, danceHigh: 1, artHigh: 1 } },
    { emo: '💼', text: '기술을 익혀 빨리 일을 시작한 나', score: { vocHigh: 3 } },
    { emo: '📚', text: '대학에서 더 깊이 공부할 준비가 된 나', score: { sciHigh: 2, general: 1, langHigh: 1 } },
    { emo: '🤔', text: '아직은 여러 가지를 해 보며 찾는 나', score: { general: 3 } } ] },
  { q: '하나를 잘하려면 나는?', options: [
    { emo: '🔁', text: '될 때까지 매일 반복 연습', score: { peHigh: 1, danceHigh: 1, artHigh: 1, sportsTalent: 1 } },
    { emo: '📖', text: '원리를 이해할 때까지 파고들기', score: { sciHigh: 2, aiHigh: 1 } },
    { emo: '👀', text: '잘하는 사람을 따라 해 보기', score: { vocHigh: 1, aniHigh: 1, danceHigh: 1 } },
    { emo: '🧭', text: '이것저것 해 보며 나한테 맞는 것 찾기', score: { general: 2 } } ] },
  { q: '학교생활에서 놓치고 싶지 않은 것은?', options: [
    { emo: '👫', text: '친구들과 보내는 평범한 일상', score: { general: 2, sportsTalent: 1 } },
    { emo: '🎯', text: '좋아하는 한 가지에 몰입하는 시간', score: { artHigh: 1, aniHigh: 1, peHigh: 1, danceHigh: 1, aiHigh: 1 } },
    { emo: '📈', text: '성적과 실력이 오르는 경험', score: { sciHigh: 2, langHigh: 1 } },
    { emo: '🛠️', text: '손으로 결과물을 만드는 경험', score: { vocHigh: 2, aniHigh: 1, aiHigh: 1 } } ] }
];

/* 추천 이유 한 줄 */
CS.SCHOOL_REASON = {
  general: '여러 가지를 해 보며 천천히 찾고 싶은 나에게',
  sportsTalent: '운동도 평범한 학교생활도 놓치고 싶지 않은 나에게',
  peHigh: '몸을 쓰는 게 좋고 승부를 즐기는 나에게',
  artHigh: '그리고 만드는 데 몰입하는 나에게',
  danceHigh: '몸으로 표현하고 무대를 좋아하는 나에게',
  aniHigh: '이야기와 그림으로 뭔가 만들고 싶은 나에게',
  aiHigh: '코딩과 기계, 새로운 기술이 궁금한 나에게',
  langHigh: '다른 나라 말과 사람에 관심 많은 나에게',
  sciHigh: '원리를 끝까지 파고드는 나에게',
  vocHigh: '손으로 만들고 빨리 실력을 쓰고 싶은 나에게'
};

/* 보기 색 (순서대로) */
CS.QUIZ_COLORS = ['create', 'study', 'body', 'social'];

/* 질문 답 반영 */
CS.answerQuiz = function (g, optIdx) {
  var sc = CS.QUIZ[g.quizIdx].options[optIdx].score;
  for (var k in sc) { if (sc.hasOwnProperty(k)) { g.quizScore[k] = (g.quizScore[k] || 0) + sc[k]; } }
  g.quizIdx += 1;
};

/* 점수 높은 학교 3곳 고르기 (동점이면 학교 목록 순서대로) */
CS.recommendSchools = function (g) {
  var list = [];
  for (var i = 0; i < CS.SCHOOLS.length; i++) { list.push({ id: CS.SCHOOLS[i].id, s: g.quizScore[CS.SCHOOLS[i].id] || 0, i: i }); }
  list.sort(function (a, b) { return (b.s - a.s) || (a.i - b.i); });
  return [list[0].id, list[1].id, list[2].id];
};
