/* ===== 기본 데이터: 가치관, 능력치, 고등학교·학과, 학교 전용 활동 =====
   학교 목록은 data-regions.js 를 보세요. */
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
                  t: ['마을 어르신 찾아가 이야기 듣기', '팀 프로젝트로 마을 문제 해결하기', '졸업 프로젝트 발표 준비하기'] },
  /* ---- 전국 버전에서 추가한 종류 ---- */
  jasago:       { emo: '🏛️', main: 'study',  eff: { study: 1, social: 1, stress: 1 }, g: 'academic',
                  t: ['심화 수업 과제 끝까지 해결하기', '교내 연구 프로젝트 참여하기', '대입 대비 심화 과정 듣기'] },
  gugak:        { emo: '🪘', main: 'create', eff: { create: 1, social: 1, stress: 1 }, g: 'arts',
                  t: ['가야금·판소리 기초 실기 익히기', '국악 관현악 정기 연주회 무대 서기', '입시 실기곡 완성하기'] },
  perfArts:     { emo: '🎤', main: 'create', eff: { create: 1, social: 1, stress: 1 }, g: 'arts',
                  t: ['보컬·연기 기초 레슨 듣기', '교내 쇼케이스 무대 준비하기', '오디션·입시 영상 찍기'] },
  mech:         { emo: '⚙️', main: 'create', eff: { create: 1, body: 1, stress: 1 }, g: 'voc',
                  t: ['선반·밀링 기계 다루기 실습하기', '자동화 설비 조립 실습하기', '기계 회사 현장 실습 가기'] },
  electronics:  { emo: '📡', main: 'study',  eff: { study: 1, create: 1, stress: 1 }, g: 'voc',
                  t: ['전자 회로 납땜 실습하기', '통신 장비 다루기 실습하기', '전자 회사 현장 실습 가기'] },
  game:         { emo: '🎮', main: 'create', eff: { create: 1, study: 1, stress: 1 }, g: 'voc',
                  t: ['게임 엔진 기초 익히기', '팀으로 미니 게임 만들기', '게임 공모전 출품작 완성하기'] },
  marine:       { emo: '🚢', main: 'body',   eff: { body: 1, study: 1, stress: 1 }, g: 'voc',
                  t: ['실습선에서 항해 기초 배우기', '바다 위 승선 실습 나가기', '해기사 면허 시험 준비하기'] },
  ship:         { emo: '🛳️', main: 'create', eff: { create: 1, body: 1, stress: 1 }, g: 'voc',
                  t: ['용접 기초 실습하기', '선박 설계 도면 읽기', '조선소 현장 실습 가기'] },
  food:         { emo: '🥫', main: 'study',  eff: { study: 1, create: 1, stress: 1 }, g: 'voc',
                  t: ['식품 위생 기초 실습하기', '새로운 가공식품 개발하기', '식품 회사 현장 실습 가기'] },
  chem:         { emo: '⚗️', main: 'study',  eff: { study: 2, stress: 1 }, g: 'voc',
                  t: ['화학 분석 기초 실험하기', '공정 운전 시뮬레이션 실습하기', '석유화학 공장 현장 실습 가기'] },
  logistics:    { emo: '📦', main: 'social', eff: { social: 1, study: 1, stress: 1 }, g: 'voc',
                  t: ['물류 관리 프로그램 익히기', '항만 컨테이너 터미널 견학하기', '물류 회사 현장 실습 가기'] },
  horse:        { emo: '🐎', main: 'body',   eff: { body: 1, social: 1, stress: 1 }, g: 'voc',
                  t: ['말 돌보기와 승마 기초 배우기', '말 조련 실습하기', '경마·승마 현장 실습 가기'] },
  care:         { emo: '🩹', main: 'social', eff: { social: 1, study: 1, stress: 1 }, g: 'voc',
                  t: ['기초 간호 실습하기', '요양원 봉사 실습 가기', '간호조무사 자격 시험 준비하기'] },
  tour:         { emo: '🧳', main: 'social', eff: { social: 1, create: 1, stress: 1 }, g: 'voc',
                  t: ['외국어 안내 멘트 연습하기', '호텔 프런트 실습하기', '관광 상품 기획 대회 나가기'] }
};

/* 학교 고르기 탭 */
CS.SCHOOL_TABS = [
  { id: 'general', name: '일반고·자율학교' },
  { id: 'special', name: '특목고·예체능' },
  { id: 'voc',     name: '특성화고·마이스터고' },
  { id: 'alt',     name: '대안학교' }
];

/* 고등학교 목록과 지역은 data-regions.js 에 있습니다. */

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
