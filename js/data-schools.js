/* ===== 기본 데이터: 가치관, 능력치, 고등학교·학과, 학교 전용 활동 =====
   학교 정보 출처: 강원 직업계고 진학 안내(gvhs.kr) 2027학년도 모집 학과, 각 학교 관련 보도.
   기숙사 여부 중 'check'는 확인하지 못한 학교입니다. 확인되면 dorm 값을 바꿔 주세요. */
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

/* 능력치 4종: 이름, 뜻, 예시 */
CS.STATS = [
  { id: 'study',  name: '학업', desc: '수업을 이해하고 공부를 꾸준히 하는 힘', ex: '시험 준비를 미루지 않는 편' },
  { id: 'body',   name: '체력', desc: '몸을 쓰고 오래 버티는 힘', ex: '운동이 즐겁고 잘 안 지침' },
  { id: 'social', name: '관계', desc: '사람과 잘 지내고 함께하는 힘', ex: '처음 보는 친구와도 금방 친해짐' },
  { id: 'create', name: '창의', desc: '새로운 걸 생각하고 만드는 힘', ex: '그림, 글, 영상, 아이디어' }
];
CS.STAT_NAMES = { study: '학업', body: '체력', social: '관계', create: '창의', stress: '스트레스', exp: '진로 경험' };
CS.STAT_MAX = 24;      /* 막대 그래프 최대치 */
CS.START_BASE = 2;     /* 시작 능력치 */
CS.START_POINTS = 6;   /* 처음에 나눠 줄 점수 */
CS.SEM_POINTS = 4;     /* 학기당 장면 수 (장면마다 하나씩 선택) */
CS.BURNOUT = 8;        /* 스트레스가 이 값 이상이면 번아웃 */

CS.AVATARS = ['🙂', '😎', '🤓', '😺', '🐻', '🦊', '🐧', '🌱'];

/* ---------- 학교 전용 활동 (학과·학교 종류별) ----------
   main: 주특기 능력치 / eff: 효과 / g: 사건 묶음(sport, arts, academic, voc, general, alt)
   t: 1학년, 2학년, 3학년 때 나오는 활동 문구 */
CS.KINDS = {
  general:      { emo: '🏫', main: 'study',  eff: { study: 1, exp: 1, stress: 1 }, g: 'general',
                  t: ['진로 연계 과목 설명회 듣기', '고교학점제로 고른 선택과목에서 탐구 보고서 쓰기', '진로 선택과목 심화 수업 듣기'] },
  boarding:     { emo: '🌙', main: 'study',  eff: { study: 1, social: 1, stress: 1 }, g: 'academic',
                  t: ['기숙사 자습실에서 밤 10시까지 공부하기', '룸메이트와 서로 문제 내 주기', '점호 끝나고 수능 기출 한 회 더 풀기'] },
  sportsTalent: { emo: '🚣', main: 'body',   eff: { body: 1, social: 1, stress: 1 }, g: 'sport',
                  t: ['수업 끝나고 운동부 훈련하기', '주말 전지훈련 참가하기', '대학 진학용 대회 기록 만들기'] },
  pe:           { emo: '🤼', main: 'body',   eff: { body: 2, stress: 1 }, g: 'sport',
                  t: ['새벽 훈련 한 번 더 하기', '체력 측정 기록 깨기', '전국체전 대비 실전 연습하기'] },
  science:      { emo: '🔬', main: 'study',  eff: { study: 2, stress: 2 }, g: 'academic',
                  t: ['실험실에서 탐구 주제 실험하기', '심화 수학 문제와 씨름하기', '과학 탐구 대회 보고서 쓰기'] },
  lang:         { emo: '🌍', main: 'study',  eff: { study: 1, social: 1, stress: 1 }, g: 'academic',
                  t: ['전공어 원서 읽기 모임 하기', '외국 학생들과 화상 교류하기', '전공어 말하기 대회 준비하기'] },
  art:          { emo: '🎨', main: 'create', eff: { create: 2, stress: 1 }, g: 'arts',
                  t: ['실기실에서 밤까지 소묘하기', '전시회에 낼 작품 완성하기', '입시 주제로 채색 연습하기'] },
  dance:        { emo: '💃', main: 'create', eff: { create: 1, body: 1, stress: 1 }, g: 'arts',
                  t: ['연습실 거울 앞에서 동작 반복하기', '정기 공연 안무 맞추기', '입시 작품 마무리 연습하기'] },
  music:        { emo: '🎻', main: 'create', eff: { create: 1, social: 1, stress: 1 }, g: 'arts',
                  t: ['연습실에서 하루 3시간 연습하기', '정기 공연 무대에 오르기', '입시 실기곡·독백 완성하기'] },
  comic:        { emo: '✒️', main: 'create', eff: { create: 2, stress: 1 }, g: 'arts',
                  t: ['웹툰 콘티 매일 한 컷 그리기', '교내 웹툰 공모전에 연재하기', '졸업 작품 단편 만화 완성하기'] },
  ani:          { emo: '🎬', main: 'create', eff: { create: 2, stress: 1 }, g: 'arts',
                  t: ['캐릭터 디자인 100장 그리기', '팀 단편 애니메이션 원화 작업하기', '졸업 작품 애니메이션 완성하기'] },
  broadcast:    { emo: '📹', main: 'create', eff: { create: 1, social: 1, stress: 1 }, g: 'arts',
                  t: ['카메라 장비 다루는 법 익히기', '교내 방송 뉴스 직접 제작하기', '졸업 작품 단편 영상 촬영하기'] },
  ai:           { emo: '🤖', main: 'create', eff: { study: 1, create: 1, stress: 1 }, g: 'voc',
                  t: ['센서로 스마트홈 모형 만들기', 'AI로 사물 인식 실습하기', 'IoT 프로젝트 대회 출전하기'] },
  software:     { emo: '💻', main: 'create', eff: { study: 1, create: 1, stress: 1 }, g: 'voc',
                  t: ['프로그래밍 기초 문법 익히기', '팀으로 웹사이트 직접 만들기', '앱 개발 대회 출전하기'] },
  hacking:      { emo: '🛡️', main: 'study',  eff: { study: 1, create: 1, stress: 1 }, g: 'voc',
                  t: ['정보보안 기초 실습하기', '교내 해킹 방어 대회 참가하기', '보안 경진대회 본선 준비하기'] },
  ebiz:         { emo: '📈', main: 'social', eff: { social: 1, create: 1, stress: 1 }, g: 'voc',
                  t: ['SNS 계정 운영 실습하기', '온라인 쇼핑몰 직접 열어 보기', '광고 캠페인 기획 대회 출전하기'] },
  dcontent:     { emo: '🖌️', main: 'create', eff: { create: 2, stress: 1 }, g: 'voc',
                  t: ['디자인 프로그램 기초 실습하기', '학교 홍보물 디자인 맡기', '디자인 공모전에 출품하기'] },
  beauty:       { emo: '💄', main: 'create', eff: { create: 1, social: 1, stress: 1 }, g: 'voc',
                  t: ['헤어·메이크업 기초 실습하기', '친구 졸업 사진 메이크업 해 주기', '미용사 자격증 실기 연습하기'] },
  fashion:      { emo: '🧵', main: 'create', eff: { create: 2, stress: 1 }, g: 'voc',
                  t: ['패턴 그리고 재봉틀 다루기', '교내 패션쇼 의상 만들기', '패션 디자인 공모전에 출품하기'] },
  cook:         { emo: '🍳', main: 'create', eff: { create: 1, body: 1, stress: 1 }, g: 'voc',
                  t: ['칼질부터 기초 조리 실습하기', '한식조리기능사 실기 연습하기', '요리 경연 대회 출전하기'] },
  cafe:         { emo: '☕', main: 'create', eff: { create: 1, social: 1, stress: 1 }, g: 'voc',
                  t: ['바리스타 기초 실습하기', '디저트 신메뉴 개발하기', '교내 카페 운영 실습하기'] },
  biocos:       { emo: '🧴', main: 'study',  eff: { study: 1, create: 1, stress: 1 }, g: 'voc',
                  t: ['화장품 원료 실험 실습하기', '천연 화장품 직접 만들기', '화장품 품질 검사 실습하기'] },
  robot:        { emo: '🦾', main: 'create', eff: { create: 1, study: 1, stress: 1 }, g: 'voc',
                  t: ['기계 도면 그리기 실습하기', '로봇 팔 조립 실습하기', '로봇 경진대회 출전하기'] },
  semicon:      { emo: '🔌', main: 'study',  eff: { study: 1, create: 1, stress: 1 }, g: 'voc',
                  t: ['클린룸 실습복 입고 장비 익히기', '반도체 공정 실습하기', '반도체 기업 현장 실습 가기'] },
  auto:         { emo: '🚗', main: 'body',   eff: { body: 1, create: 1, stress: 1 }, g: 'voc',
                  t: ['엔진 분해·조립 실습하기', '자동차정비기능사 실기 연습하기', '자동차 회사 현장 실습 가기'] },
  electric:     { emo: '⚡', main: 'study',  eff: { study: 1, body: 1, stress: 1 }, g: 'voc',
                  t: ['전기 회로 기초 실습하기', '전기기능사 실기 연습하기', '전기 회사 현장 실습 가기'] },
  construct:    { emo: '🏗️', main: 'create', eff: { create: 1, body: 1, stress: 1 }, g: 'voc',
                  t: ['건축 도면 읽기 실습하기', '측량 장비로 운동장 측량하기', '건축 모형 설계 대회 출전하기'] },
  farm:         { emo: '🌿', main: 'body',   eff: { body: 1, study: 1, stress: 1 }, g: 'voc',
                  t: ['스마트팜 센서 설치 실습하기', '도시 텃밭 직접 가꾸기', '스마트팜 창업 아이디어 대회 나가기'] },
  pet:          { emo: '🐶', main: 'social', eff: { social: 1, body: 1, stress: 1 }, g: 'voc',
                  t: ['반려동물 기초 돌봄 실습하기', '동물병원 현장 실습 가기', '반려동물 미용 자격증 연습하기'] },
  flower:       { emo: '💐', main: 'create', eff: { create: 1, social: 1, stress: 1 }, g: 'voc',
                  t: ['꽃꽂이 기초 실습하기', '학교 정원 가꾸기', '플로리스트 자격증 실기 연습하기'] },
  medmech:      { emo: '🩻', main: 'study',  eff: { study: 1, create: 1, stress: 1 }, g: 'voc',
                  t: ['의료기기 구조 배우기', '혈압계 분해·조립 실습하기', '의료기기 회사 현장 실습 가기'] },
  biopharma:    { emo: '💊', main: 'study',  eff: { study: 1, exp: 1, stress: 1 }, g: 'voc',
                  t: ['실험 가운 입고 기초 분석 실습하기', '의약품 품질 검사 실습하기', '제약 회사 현장 실습 가기'] },
  medelec:      { emo: '🔋', main: 'study',  eff: { study: 1, create: 1, stress: 1 }, g: 'voc',
                  t: ['전자 회로 납땜 실습하기', '의료 장비 회로 수리 실습하기', '의료기기 회사 현장 실습 가기'] },
  defense:      { emo: '🎖️', main: 'body',   eff: { body: 1, study: 1, stress: 1 }, g: 'voc',
                  t: ['드론 비행 기초 실습하기', '사이버보안·로봇 코스 실습하기', '부사관·사관학교 진학 준비하기'] },
  fire:         { emo: '🚒', main: 'body',   eff: { body: 1, study: 1, stress: 1 }, g: 'voc',
                  t: ['소방 설비 구조 익히기', '소화 설비 설계 실습하기', '소방설비산업기사 준비하기'] },
  aviation:     { emo: '✈️', main: 'study',  eff: { study: 1, body: 1, stress: 1 }, g: 'voc',
                  t: ['항공기 구조 기초 실습하기', '항공기 정비 실습하기', '항공 정비 자격증 준비하기'] },
  sergeant:     { emo: '🪖', main: 'body',   eff: { body: 1, social: 1, stress: 1 }, g: 'voc',
                  t: ['아침 체력 단련하기', '부사관 진로 특강 듣기', '부사관 선발 시험 준비하기'] },
  alt:          { emo: '🌱', main: 'social', eff: { social: 1, exp: 1 }, g: 'alt',
                  t: ['마을 어르신 찾아가 이야기 듣기', '팀 프로젝트로 마을 문제 해결하기', '졸업 프로젝트 발표 준비하기'] }
};

/* 학교 고르기 탭 */
CS.SCHOOL_TABS = [
  { id: 'general', name: '일반고·자율학교' },
  { id: 'special', name: '특목고·예체능' },
  { id: 'voc',     name: '특성화고·마이스터고' },
  { id: 'alt',     name: '대안학교' }
];

/* 기숙사 표시: all 전원 기숙사 / some 기숙사 있음 / varies 학교마다 다름 / check 확인 필요 */
CS.DORM_TEXT = { all: '전원 기숙사', some: '기숙사 있음', varies: '학교마다 다름', check: '기숙사 여부 확인 필요' };

/* 고등학교 목록
   tags: 나 알아보기 질문 추천에 쓰는 성향 / kind: 학과가 없을 때의 활동 종류
   depts: 학과 목록 (학과마다 kind) / ask: 종목·전공을 적게 할 때의 안내 */
CS.SCHOOLS = [
  /* 일반고·자율학교 */
  { id: 'general', tab: 'general', name: '일반고', type: '일반고', region: '우리 지역', dorm: 'varies', kind: 'general',
    desc: '여러 과목을 직접 골라 들으며(고교학점제) 진로를 찾아가요.', tags: ['general'],
    reason: '여러 가지를 해 보며 천천히 찾고 싶은 나에게' },
  { id: 'sportsTalent', tab: 'general', name: '일반고 체육특기생', type: '일반고', region: '우리 지역', dorm: 'varies', kind: 'sportsTalent',
    desc: '일반고에 다니며 운동부 선수로 뛰어요. 수업과 훈련을 함께 해내야 해요.', tags: ['sport', 'general'], ask: '내 종목 (예: 조정)',
    reason: '운동도 평범한 학교생활도 놓치고 싶지 않은 나에게' },
  { id: 'hanil', tab: 'general', name: '공주 한일고', type: '전국 단위 자율학교', region: '충남 공주', dorm: 'all', kind: 'boarding',
    desc: '전국에서 학생을 뽑고, 3년 동안 기숙사에서 함께 생활하며 공부해요.', tags: ['study', 'boarding'],
    reason: '친구들과 함께 지내며 공부에 집중하고 싶은 나에게' },
  { id: 'hanmin', tab: 'general', name: '파주 한민고', type: '기숙형 자율학교', region: '경기 파주', dorm: 'all', kind: 'boarding',
    desc: '군인 자녀를 중심으로 뽑는 기숙형 학교예요. 규칙적인 단체 생활을 해요.', tags: ['boarding', 'military', 'study'],
    reason: '규칙적인 기숙사 생활이 잘 맞는 나에게' },
  { id: 'minjok', tab: 'general', name: '횡성 민족사관고', type: '전국 단위 자사고', region: '강원 횡성', dorm: 'all', kind: 'boarding',
    desc: '전국 단위로 뽑는 자율형 사립고예요. 기숙사 생활을 하며 공부량이 많아요.', tags: ['study', 'boarding', 'lang'],
    reason: '높은 목표를 세우고 깊이 공부하고 싶은 나에게' },
  /* 특목고·예체능 */
  { id: 'kwSci', tab: 'special', name: '강원과학고', type: '과학고', region: '강원 원주', dorm: 'some', kind: 'science',
    desc: '수학과 과학을 깊이 배우고 탐구 활동이 많아요.', tags: ['science', 'study'],
    reason: '원리를 끝까지 파고드는 나에게' },
  { id: 'langHigh', tab: 'special', name: '외국어고 (예: 강원외고)', type: '외국어고', region: '강원', dorm: 'check', kind: 'lang',
    desc: '전공 외국어를 깊이 배우고 다른 나라 문화를 가까이 접해요.', tags: ['lang', 'study'], ask: '내 전공어 (예: 영어, 중국어)',
    reason: '다른 나라 말과 사람에 관심 많은 나에게' },
  { id: 'peHigh', tab: 'special', name: '체육고 (예: 강원체고)', type: '체육고', region: '강원', dorm: 'check', kind: 'pe',
    desc: '하루의 많은 시간을 전문 훈련에 써요. 전국 대회가 목표예요.', tags: ['sport'], ask: '내 종목 (예: 레슬링)',
    reason: '몸을 쓰는 게 좋고 승부를 즐기는 나에게' },
  { id: 'artHigh', tab: 'special', name: '예술고 미술과 (예: 강원예고)', type: '예술고', region: '강원', dorm: 'check', kind: 'art',
    desc: '소묘, 채색, 디자인 실기를 깊이 배워요.', tags: ['art'], ask: '내 전공 (예: 서양화, 디자인)',
    reason: '그리고 만드는 데 몰입하는 나에게' },
  { id: 'danceHigh', tab: 'special', name: '예술고 무용과 (예: 강원예고)', type: '예술고', region: '강원', dorm: 'check', kind: 'dance',
    desc: '몸으로 표현하는 법을 배워요. 연습실에서 보내는 시간이 길어요.', tags: ['perform', 'sport'], ask: '내 장르 (예: 현대무용, 한국무용)',
    reason: '몸으로 표현하고 무대를 좋아하는 나에게' },
  { id: 'musicHigh', tab: 'special', name: '예술고 음악·연극과 (예: 강원예고)', type: '예술고', region: '강원', dorm: 'check', kind: 'music',
    desc: '악기, 성악, 연기를 전공해요. 무대에 서는 경험이 많아요.', tags: ['perform'], ask: '내 전공 (예: 피아노, 연기)',
    reason: '노래하고 연주하고 연기하는 게 좋은 나에게' },
  /* 특성화고·마이스터고 */
  { id: 'hansaem', tab: 'voc', emo: '🛍️', name: '춘천한샘고', type: '특성화고', region: '강원 춘천', dorm: 'check',
    desc: '학과가 다양해서 「백화점 학교」라고도 불려요. 부전공도 고를 수 있어요.', tags: ['beauty', 'food', 'media', 'it'],
    reason: '좋아하는 분야를 실습으로 배우고 싶은 나에게',
    depts: [ { id: 'sns', name: 'SNS마케팅과', kind: 'ebiz' }, { id: 'design', name: '디자인콘텐츠과', kind: 'dcontent' },
             { id: 'beautyArt', name: '뷰티아트과', kind: 'beauty' }, { id: 'fashionStyle', name: '패션스타일과', kind: 'fashion' },
             { id: 'cookDept', name: '조리과', kind: 'cook' }, { id: 'bioCos', name: '바이오코스메틱과', kind: 'biocos' },
             { id: 'fusionSw', name: '융합소프트웨어과', kind: 'software' } ] },
  { id: 'ccMech', tab: 'voc', emo: '⚙️', name: '춘천기계공고', type: '특성화고', region: '강원 춘천', dorm: 'check',
    desc: '기계, 로봇, 반도체, 자동차, 전기, 건축을 실습 중심으로 배워요.', tags: ['tech'],
    reason: '직접 만들고 고치는 게 좋은 나에게',
    depts: [ { id: 'robotSys', name: '로봇기계시스템과', kind: 'robot' }, { id: 'robotMat', name: '로봇소재융합과', kind: 'robot' },
             { id: 'semi', name: '반도체과', kind: 'semicon' }, { id: 'car', name: '자동차과', kind: 'auto' },
             { id: 'elec', name: '전기과', kind: 'electric' }, { id: 'build', name: '건축토목과', kind: 'construct' } ] },
  { id: 'kwBio', tab: 'voc', emo: '🌿', name: '강원생명과학고', type: '특성화고 (협약형)', region: '강원 춘천', dorm: 'check',
    desc: '농업, 동물, 꽃, 디저트를 배우고 지역 기업과 연계해 취업해요.', tags: ['farm', 'food'],
    reason: '동물과 식물, 자연이 좋은 나에게',
    depts: [ { id: 'smartFarm', name: '스마트팜도시농업과', kind: 'farm' }, { id: 'petCare', name: '반려동물케어과', kind: 'pet' },
             { id: 'flowerGarden', name: '플라워가드닝과', kind: 'flower' }, { id: 'cafeDessert', name: '카페N디저트과', kind: 'cafe' } ] },
  { id: 'kAI', tab: 'voc', emo: '🤖', name: '한국인공지능고', type: '특성화고', region: '강원 화천', dorm: 'check',
    desc: '인공지능과 사물인터넷을 함께 배워 스마트홈, 자율주행 기술을 직접 만들어요.', tags: ['it', 'tech'],
    reason: '코딩과 기계, 새로운 기술이 궁금한 나에게',
    depts: [ { id: 'aiIot', name: 'AI사물인터넷과', kind: 'ai' } ] },
  { id: 'kwAni', tab: 'voc', emo: '🎬', name: '강원애니고', type: '특성화고', region: '강원 춘천', dorm: 'check',
    desc: '만화, 애니메이션, 방송 영상을 만들며 배워요.', tags: ['ani', 'art', 'media'],
    reason: '이야기와 그림, 영상으로 뭔가 만들고 싶은 나에게',
    depts: [ { id: 'comicDept', name: '만화창작과', kind: 'comic' }, { id: 'aniDept', name: '애니메이션과', kind: 'ani' },
             { id: 'bcast', name: '방송영상과', kind: 'broadcast' } ] },
  { id: 'kMedi', tab: 'voc', emo: '🩺', name: '한국의료마이스터고 (구 원주의료고)', type: '마이스터고', region: '강원 원주', dorm: 'check',
    desc: '의료기기와 바이오의약을 배워요. 졸업 후 의료기기·제약 회사로 많이 취업해요.', tags: ['health', 'tech', 'science'],
    reason: '사람을 돕는 기술에 관심 있는 나에게',
    depts: [ { id: 'medMech', name: '의료기계과', kind: 'medmech' }, { id: 'bioPharm', name: '바이오의약과', kind: 'biopharma' },
             { id: 'medElec', name: '의료전기전자과', kind: 'medelec' } ] },
  { id: 'kDef', tab: 'voc', emo: '🎖️', name: '한국국방과학고', type: '강원형 마이스터고', region: '강원 철원', dorm: 'all',
    desc: '2학년부터 사이버보안, 로봇, 드론, 진학 코스로 나뉘어요. 학년당 48명만 뽑아요.', tags: ['military', 'it'],
    reason: '나라를 지키는 기술에 관심 있는 나에게',
    depts: [ { id: 'defSys', name: '국방시스템과', kind: 'defense' } ] },
  { id: 'kAir', tab: 'voc', emo: '✈️', name: '한국항공고', type: '강원형 마이스터고', region: '강원 태백', dorm: 'check',
    desc: '항공기 정비를 배워 항공 분야 기술자로 일할 준비를 해요.', tags: ['military', 'tech'],
    reason: '비행기와 하늘에 끌리는 나에게',
    depts: [ { id: 'airMaint', name: '항공정비시스템과', kind: 'aviation' } ] },
  { id: 'kFire', tab: 'voc', emo: '🚒', name: '한국소방마이스터고', type: '마이스터고', region: '강원 영월', dorm: 'all',
    desc: '우리나라 유일의 소방 분야 마이스터고예요. 소방 설비를 설계하고 점검하는 법을 배워요.', tags: ['military', 'health'],
    reason: '위험한 순간에 사람을 지키고 싶은 나에게',
    depts: [ { id: 'fireSafe', name: '소방안전관리과', kind: 'fire' } ] },
  { id: 'dimigo', tab: 'voc', emo: '💻', name: '한국디지털미디어고', type: '특성화고 (전국 단위)', region: '경기 안산', dorm: 'all',
    desc: '우리나라 첫 IT 특성화고예요. 전국에서 학생을 뽑고 전교생이 기숙사에서 생활해요.', tags: ['it', 'media', 'boarding'],
    reason: '컴퓨터와 미디어로 세상을 바꾸고 싶은 나에게',
    depts: [ { id: 'ebizDept', name: 'e-비즈니스과', kind: 'ebiz' }, { id: 'dContent', name: '디지털콘텐츠과', kind: 'dcontent' },
             { id: 'webProg', name: '웹프로그래밍과', kind: 'software' }, { id: 'hackDef', name: '해킹방어과', kind: 'hacking' } ] },
  { id: 'cheongdam', tab: 'voc', name: '평택 청담고', type: '특성화고', region: '경기 평택', dorm: 'some', dormNote: '운동부·부사관 진로 학생 위주',
    kind: 'sergeant', desc: '부사관 진로와 운동부 학생을 위한 기숙사가 있어요.', tags: ['military', 'sport'],
    reason: '군인이나 운동선수의 길이 궁금한 나에게' },
  { id: 'afAir', tab: 'voc', name: '공군항공과학고', type: '마이스터고 (전국 단위)', region: '경남 진주', dorm: 'all', kind: 'aviation',
    desc: '입학과 동시에 공군 부사관 후보생이 되고, 3년 동안 생활관에서 지내요.', tags: ['military', 'tech', 'boarding'],
    reason: '하늘을 지키는 기술자가 되고 싶은 나에게' },
  /* 대안학교 */
  { id: 'hyeoncheon', tab: 'alt', name: '현천고', type: '기숙형 공립 대안학교', region: '강원 횡성', dorm: 'all', kind: 'alt',
    desc: '함께 먹고 자며 지역 어르신 돕기, 체험, 프로젝트로 배워요. 대학 입시보다 삶을 배우는 데 집중해요.', tags: ['alt', 'boarding'],
    reason: '교실 밖에서 배우고 싶은 나에게' },
  { id: 'jeonin', tab: 'alt', name: '전인고', type: '대안교육 특성화고', region: '강원 춘천', dorm: 'check', kind: 'alt',
    desc: '프로젝트와 체험 중심으로 배우는 작은 학교예요.', tags: ['alt'],
    reason: '나만의 속도로 배우고 싶은 나에게' }
];

/* 학교와 학과로 활동 종류 찾기 */
CS.kindIdOf = function (school, deptId) {
  if (school.depts) {
    for (var i = 0; i < school.depts.length; i++) { if (school.depts[i].id === deptId) { return school.depts[i].kind; } }
    return school.depts[0].kind;
  }
  return school.kind;
};

/* 입학 보너스: 주특기 +2, 다른 능력치 +1, 직업계고·대안학교는 진로 경험 +1 */
CS.bonusOf = function (kind) {
  var b = {};
  b[kind.main] = 2;
  for (var k in kind.eff) {
    if (kind.eff.hasOwnProperty(k) && k !== 'stress' && k !== kind.main && kind.eff[k] > 0) { b[k] = (b[k] || 0) + 1; }
  }
  if (kind.g === 'voc' || kind.g === 'alt') { b.exp = (b.exp || 0) + 1; }
  return b;
};
