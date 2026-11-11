/* ===== 기본 데이터: 가치관, 능력치, 아바타, 고교 유형, 학기 활동 =====
   문구나 숫자를 바꾸고 싶으면 이 파일만 고치면 됩니다. */
var CS = window.CS || {};
window.CS = CS;

/* 내가 중요하게 여기는 것 (2개 선택) */
CS.VALUES = [
  { id: 'challenge', name: '도전', desc: '어렵고 새로운 일에 부딪혀 보기' },
  { id: 'stable',    name: '안정', desc: '꾸준하고 예측할 수 있는 생활' },
  { id: 'worth',     name: '보람', desc: '누군가에게 도움이 되는 일' },
  { id: 'rest',      name: '여유', desc: '나를 위한 시간과 건강' },
  { id: 'fame',      name: '인정', desc: '실력을 인정받고 이름을 알리기' },
  { id: 'free',      name: '자율', desc: '내 방식대로 결정하며 살기' }
];

/* 능력치 4종 (스트레스, 진로 경험은 따로 관리) */
CS.STATS = [
  { id: 'study',  name: '학업' },
  { id: 'body',   name: '체력' },
  { id: 'social', name: '관계' },
  { id: 'create', name: '창의' }
];
CS.STAT_NAMES = { study: '학업', body: '체력', social: '관계', create: '창의', stress: '스트레스', exp: '진로 경험' };
CS.STAT_MAX = 24;      /* 막대 그래프 최대치 */
CS.START_BASE = 2;     /* 시작 능력치 */
CS.START_POINTS = 6;   /* 처음에 나눠 줄 점수 */
CS.SEM_POINTS = 4;     /* 학기당 시간 포인트 */
CS.BURNOUT = 8;        /* 스트레스가 이 값 이상이면 번아웃 */

CS.AVATARS = ['🙂', '😎', '🤓', '😺', '🐻', '🦊', '🐧', '🌱'];

/* 고교 유형
   main: 사건 카드에서 '주특기'로 쓰이는 능력치
   bonus: 입학 시 받는 능력치
   special: 그 학교에서만 할 수 있는 활동
   ask: 종목·전공을 직접 적게 할 때의 안내 문구 (없으면 묻지 않음) */
CS.SCHOOLS = [
  { id: 'general', name: '일반고', main: 'study',
    desc: '여러 과목을 직접 골라 들으며(고교학점제) 진로를 찾아가요.',
    bonus: { study: 1, social: 1, exp: 1 },
    special: { label: '선택과목 깊게 듣기', eff: { study: 1, exp: 1, stress: 1 } } },
  { id: 'sportsTalent', name: '일반고 체육특기생', main: 'body',
    desc: '일반고에 다니며 운동부 선수로 뛰어요. 수업과 훈련을 함께 해내야 해요.',
    bonus: { body: 2, social: 1 }, ask: '내 종목 (예: 조정)',
    special: { label: '운동부 훈련', eff: { body: 1, social: 1, stress: 1 } } },
  { id: 'peHigh', name: '체육고', main: 'body',
    desc: '하루의 많은 시간을 전문 훈련에 써요. 전국 대회가 목표예요.',
    bonus: { body: 3 }, ask: '내 종목 (예: 레슬링)',
    special: { label: '전문 훈련', eff: { body: 2, stress: 1 } } },
  { id: 'artHigh', name: '예술고 (미술)', main: 'create',
    desc: '소묘, 채색, 디자인 실기를 깊이 배워요.',
    bonus: { create: 3 }, ask: '내 전공 (예: 서양화, 디자인)',
    special: { label: '실기 작업', eff: { create: 2, stress: 1 } } },
  { id: 'danceHigh', name: '예술고 (무용)', main: 'create',
    desc: '몸으로 표현하는 법을 배워요. 연습실에서 보내는 시간이 길어요.',
    bonus: { create: 2, body: 1 }, ask: '내 장르 (예: 현대무용, 스트릿댄스)',
    special: { label: '무용 연습', eff: { create: 1, body: 1, stress: 1 } } },
  { id: 'aniHigh', name: '애니메이션고', main: 'create',
    desc: '만화, 애니메이션, 영상, 게임 그래픽을 만들며 배워요.',
    bonus: { create: 3 },
    special: { label: '작품 제작', eff: { create: 2, stress: 1 } } },
  { id: 'aiHigh', name: '인공지능·소프트웨어고', main: 'create',
    desc: '코딩과 인공지능을 배우고 팀 프로젝트로 결과물을 만들어요.',
    bonus: { create: 2, study: 1 },
    special: { label: '코딩 프로젝트', eff: { study: 1, create: 1, stress: 1 } } },
  { id: 'langHigh', name: '외국어고', main: 'study',
    desc: '전공 외국어를 깊이 배우고 다른 나라 문화를 가까이 접해요.',
    bonus: { study: 2, social: 1 }, ask: '내 전공어 (예: 영어, 스페인어)',
    special: { label: '외국어 심화', eff: { study: 1, social: 1, stress: 1 } } },
  { id: 'sciHigh', name: '과학고·자사고', main: 'study',
    desc: '심화 수업과 탐구 활동이 많아요. 공부량이 많고 경쟁도 치열해요.',
    bonus: { study: 3 },
    special: { label: '심화 탐구', eff: { study: 2, stress: 2 } } },
  { id: 'vocHigh', name: '특성화고·마이스터고', main: 'create',
    desc: '기술과 실무를 배워 졸업 후 바로 취업할 수 있어요. 대학 진학도 가능해요.',
    bonus: { create: 1, study: 1, exp: 1 }, ask: '내 전공 (예: 조리, 전기, 디자인)',
    special: { label: '실습·자격증', eff: { study: 1, exp: 1, stress: 1 } } }
];

/* 모든 학교에서 공통으로 할 수 있는 학기 활동 */
CS.ACTIONS = [
  { id: 'study',   label: '공부',        eff: { study: 1, stress: 1 } },
  { id: 'club',    label: '동아리·창작', eff: { create: 1 } },
  { id: 'friend',  label: '친구와 시간', eff: { social: 1, stress: -1 } },
  { id: 'sport',   label: '운동',        eff: { body: 1, stress: -1 } },
  { id: 'explore', label: '진로 탐색',   eff: { exp: 1 } },
  { id: 'rest',    label: '휴식',        eff: { stress: -3 } }
];
