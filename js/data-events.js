/* ===== 학기별 돌발 사건 =====
   sem: 몇 번째 학기에 나오는지 (1~6)
   tracks: 특정 고교 유형에서만 나오는 사건 (없으면 모든 학교 공통)
   eff의 main 은 그 학교의 주특기 능력치로 바뀌어 적용됩니다. */
var CS = window.CS || {};
window.CS = CS;

var SPORT = ['sportsTalent', 'peHigh'];
var ARTS = ['artHigh', 'danceHigh', 'aniHigh'];
var ACADEMIC = ['aiHigh', 'langHigh', 'sciHigh'];

CS.EVENTS = [
  { id: 'e1a', sem: 1, title: '새 학교, 새 교실',
    text: '교실에 아는 얼굴이 한 명도 없어요. 쉬는 시간이 유난히 길게 느껴져요.',
    choices: [
      { label: '옆자리 친구에게 먼저 말을 건다', eff: { social: 2, stress: 1 }, result: '떨렸지만 말을 걸길 잘했어요. 급식을 같이 먹을 친구가 생겼어요.' },
      { label: '일단 조용히 수업에 집중한다', eff: { study: 1 }, result: '수업 흐름을 빨리 잡았어요. 친구는 천천히 사귀기로 해요.' },
      { label: '동아리 홍보 부스를 돌아본다', eff: { exp: 1, create: 1 }, result: '생각도 못 한 동아리가 많았어요. 한 곳에 지원서를 냈어요.' }
    ] },
  { id: 'e1b', sem: 1, tracks: SPORT.concat(ARTS, ACADEMIC), title: '잘하는 애들이 너무 많다',
    text: '중학교 때는 내가 제일 잘했는데, 여기서는 다들 나만큼, 아니 나보다 잘해요.',
    choices: [
      { label: '연습량을 확 늘린다', eff: { main: 2, stress: 2 }, result: '실력은 늘었지만 몸과 마음이 꽤 지쳤어요.' },
      { label: '잘하는 친구에게 방법을 물어본다', eff: { main: 1, social: 1 }, result: '경쟁자라고만 생각했던 친구가 좋은 동료가 됐어요.' },
      { label: '남과 비교하지 않고 내 속도로 간다', eff: { stress: -1, exp: 1 }, result: '조급함을 내려놓으니 내가 뭘 좋아하는지 더 잘 보여요.' }
    ] },
  { id: 'e2', sem: 2, title: '첫 성적표',
    text: '고등학교 첫 성적표를 받았어요. 생각보다 낮은 숫자에 마음이 무거워요.',
    choices: [
      { label: '공부 방법을 바꿔 본다', eff: { study: 2, stress: 1 }, result: '나에게 맞는 방법을 찾는 데 시간이 걸렸지만 조금씩 감이 와요.' },
      { label: '"다음에 잘하면 돼" 하고 털어 낸다', eff: { stress: -2 }, result: '마음이 한결 가벼워졌어요. 성적이 나의 전부는 아니니까요.' },
      { label: '선생님께 상담을 신청한다', eff: { study: 1, exp: 1 }, result: '선생님이 성적보다 내가 관심 있는 분야를 먼저 물어보셨어요.' }
    ] },
  { id: 'e3a', sem: 3, title: '2학년 과목 선택',
    text: '고등학교에서는 진로에 맞춰 들을 과목을 직접 골라요. 친한 친구들은 다 같은 과목을 듣는대요.',
    choices: [
      { label: '친구들과 같은 과목을 고른다', eff: { social: 2 }, result: '수업은 즐거운데, 가끔 "이게 내가 원한 과목인가" 싶어요.' },
      { label: '혼자라도 궁금한 과목을 고른다', eff: { exp: 2, create: 1 }, result: '아는 친구는 없지만 수업이 기다려져요. 새 친구도 생겼어요.' },
      { label: '성적이 잘 나올 과목을 고른다', eff: { study: 2, stress: 1 }, result: '성적은 올랐어요. 다만 흥미는 잘 모르겠어요.' }
    ] },
  { id: 'e3b', sem: 3, tracks: ['vocHigh'], title: '자격증과 현장',
    text: '2학년이 되니 자격증 시험, 기능 대회, 기업 탐방 안내가 한꺼번에 쏟아져요.',
    choices: [
      { label: '자격증 시험에 도전한다', eff: { study: 2, stress: 1 }, result: '필기와 실기를 모두 통과했어요. 이력서에 쓸 한 줄이 생겼어요.' },
      { label: '기업 탐방을 신청한다', eff: { exp: 2 }, result: '실제로 일하는 선배들을 보니 막연했던 취업이 구체적으로 보여요.' },
      { label: '기능 대회를 준비한다', eff: { create: 2, stress: 1 }, result: '밤늦게까지 실습실 불을 켰어요. 손이 기억하는 기술이 늘었어요.' }
    ] },
  { id: 'e4a', sem: 4, title: '친구와의 다툼',
    text: '사소한 오해로 가장 친한 친구와 말을 안 한 지 일주일째예요.',
    choices: [
      { label: '먼저 사과하고 이야기를 꺼낸다', eff: { social: 2 }, result: '알고 보니 서로 같은 마음이었어요. 전보다 더 가까워졌어요.' },
      { label: '시간이 해결해 주길 기다린다', eff: { study: 1, stress: 1 }, result: '할 일에 집중했지만 마음 한쪽이 계속 불편해요.' },
      { label: '다른 친구에게 고민을 털어놓는다', eff: { social: 1, stress: -1 }, result: '들어 주는 사람이 있다는 것만으로 마음이 놓였어요.' }
    ] },
  { id: 'e4b', sem: 4, title: '뜻밖의 관심사',
    text: '우연히 본 영상 하나가 머릿속을 떠나지 않아요. 지금까지 생각해 본 적 없는 분야예요.',
    choices: [
      { label: '관련 책과 강연을 찾아 깊이 파 본다', eff: { exp: 2, create: 1 }, result: '알수록 재미있어요. 진로 후보가 하나 더 늘었어요.' },
      { label: '지금 하던 것에 집중한다', eff: { main: 1 }, result: '흔들리지 않고 내 길을 다졌어요. 그 관심은 마음 한쪽에 넣어 뒀어요.' },
      { label: '친구를 꼬셔서 같이 체험해 본다', eff: { exp: 1, social: 1 }, result: '막상 해 보니 생각과 달랐어요. 그래도 해 봐서 알게 됐어요.' }
    ] },
  { id: 'e5a', sem: 5, title: '진로가 흔들린다',
    text: '고3이 됐어요. 하고 싶다고 말해 온 일이 정말 나에게 맞는지 갑자기 자신이 없어요.',
    choices: [
      { label: '그 일을 하는 사람을 찾아가 물어본다', eff: { exp: 2 }, result: '좋은 점과 힘든 점을 모두 들었어요. 막연함이 줄었어요.' },
      { label: '고민은 미루고 성적부터 올린다', eff: { study: 2, stress: 2 }, result: '선택지는 넓어졌지만 고민은 그대로 남아 있어요.' },
      { label: '부모님, 선생님과 이야기한다', eff: { social: 1, exp: 1, stress: -1 }, result: '어른들도 그 나이에 똑같이 흔들렸다고 해요. 조금 안심이 돼요.' }
    ] },
  { id: 'e5b', sem: 5, tracks: SPORT, title: '부상',
    text: '중요한 대회를 앞두고 훈련 중에 다쳤어요. 병원에서는 쉬어야 한다고 해요.',
    choices: [
      { label: '참고 훈련을 계속한다', eff: { body: -2, stress: 2 }, result: '무리하다가 결국 더 오래 쉬게 됐어요. 몸의 신호를 무시하면 안 됐어요.' },
      { label: '충분히 재활하며 공부를 챙긴다', eff: { study: 1, stress: -1 }, result: '대회는 놓쳤지만 몸은 완전히 회복됐어요. 다음 기회가 있어요.' },
      { label: '재활하면서 스포츠 과학에 관심을 갖는다', eff: { exp: 2 }, result: '선수 말고도 운동과 관련된 길이 많다는 걸 알게 됐어요.' }
    ] },
  { id: 'e5c', sem: 5, tracks: ARTS, title: '탈락',
    text: '오래 준비한 대회(오디션)에서 떨어졌어요. 합격자 명단에 내 이름이 없어요.',
    choices: [
      { label: '바로 다음 대회를 준비한다', eff: { create: 2, stress: 2 }, result: '분한 마음이 연료가 됐어요. 작업량이 늘고 실력도 늘었어요.' },
      { label: '심사위원에게 피드백을 요청한다', eff: { create: 1, exp: 1 }, result: '아팠지만 정확한 조언이었어요. 고칠 방향이 보여요.' },
      { label: '잠시 쉬어 간다', eff: { stress: -3 }, result: '쉬고 나니 다시 하고 싶어졌어요. 좋아하는 마음은 그대로였어요.' }
    ] },
  { id: 'e5d', sem: 5, tracks: ACADEMIC, title: '나만 뒤처지는 기분',
    text: '친구들은 벌써 대회 수상에 자격증까지 있는데 나만 제자리인 것 같아요.',
    choices: [
      { label: '할 수 있는 만큼으로 계획을 다시 세운다', eff: { study: 1, stress: -1 }, result: '남의 속도가 아니라 내 속도를 기준으로 삼으니 꾸준히 하게 돼요.' },
      { label: '밤을 새워 따라잡는다', eff: { study: 2, stress: 3 }, result: '진도는 따라잡았지만 수업 시간에 자꾸 졸아요.' },
      { label: '친구들과 스터디를 만든다', eff: { study: 1, social: 1 }, result: '다들 속으로는 같은 불안을 갖고 있었어요.' }
    ] },
  { id: 'e6', sem: 6, title: '원서의 계절',
    text: '졸업이 코앞이에요. 어디에 지원할지 결정해야 할 시간이 다가와요.',
    choices: [
      { label: '끝까지 최선을 다해 준비한다', eff: { main: 2, stress: 2 }, result: '할 수 있는 건 다 했어요. 결과가 어떻든 후회는 없어요.' },
      { label: '몸 상태와 마음을 먼저 챙긴다', eff: { body: 1, stress: -2 }, result: '잘 자고 잘 먹었어요. 가장 좋은 상태로 그날을 맞아요.' },
      { label: '대학 말고 다른 길도 알아본다', eff: { exp: 2 }, result: '취업, 창업, 해외까지. 길이 하나가 아니라는 걸 알았어요.' }
    ] }
];
