/* ===== 졸업 후 진로 데이터: 대학 유형, 학과, 분야, 엔딩 직업 =====
   엔딩 수 = 분야 21개 x 삶의 방식 4가지 = 84가지 */
var CS = window.CS || {};
window.CS = CS;

/* 대학 유형. req: 지원 조건 / fields: 고를 수 있는 분야(없으면 군사학 빼고 전부) */
CS.UNIS = [
  { id: 'top',     name: '경쟁이 치열한 연구 중심 대학', desc: '전국에서 지원자가 몰려요.', req: { study: 18 } },
  { id: 'kaist',   name: '과학기술원', desc: '과학과 공학에 집중하는 대학이에요.', req: { study: 17, create: 10 }, fields: ['sci', 'it', 'eng'] },
  { id: 'nat',     name: '지역 거점 국립대', desc: '등록금 부담이 적고 학과가 다양해요.', req: { study: 13 } },
  { id: 'univ',    name: '4년제 대학', desc: '집에서 다닐 수 있는 곳도, 멀리 떠나는 곳도 있어요.', req: { study: 8 } },
  { id: 'college', name: '전문대학 (2~3년)', desc: '실무 중심으로 배워 빨리 현장에 나가요.', req: {},
    fields: ['it', 'eng', 'med', 'care', 'edu', 'art', 'ani', 'perf', 'sport', 'cook', 'air', 'tech', 'biz'] },
  { id: 'artUniv', name: '예술 계열 대학 (실기)', desc: '실기 시험으로 뽑아요.', req: { create: 16 }, fields: ['art', 'ani', 'dance', 'perf'] },
  { id: 'peUniv',  name: '체육 계열 대학 (실기)', desc: '실기와 경기 실적으로 뽑아요.', req: { body: 16 }, fields: ['sport'] },
  { id: 'academy', name: '사관학교', desc: '육군·해군·공군 장교를 길러요. 학업과 체력을 모두 봐요.', req: { study: 14, body: 12 }, fields: ['mil'] },
  { id: 'abroad',  name: '해외 대학 유학', desc: '낯선 언어와 문화 속에서 공부해요.', req: { study: 12, social: 11, exp: 4 } }
];

/* 학과. group: 화면에 묶어 보여 줄 계열 / field: 연결되는 분야 */
CS.MAJORS = [
  { id: 'm01', name: '국어국문학', group: '인문', field: 'human' },
  { id: 'm02', name: '사학', group: '인문', field: 'human' },
  { id: 'm03', name: '철학', group: '인문', field: 'human' },
  { id: 'm04', name: '경영학', group: '사회', field: 'biz' },
  { id: 'm05', name: '경제학', group: '사회', field: 'biz' },
  { id: 'm06', name: '심리학', group: '사회', field: 'care' },
  { id: 'm07', name: '사회복지학', group: '사회', field: 'care' },
  { id: 'm08', name: '미디어커뮤니케이션학', group: '사회', field: 'media' },
  { id: 'm09', name: '법학', group: '사회', field: 'law' },
  { id: 'm10', name: '행정학·경찰행정학', group: '사회', field: 'law' },
  { id: 'm11', name: '사범대 (교과 교육)', group: '교육', field: 'edu' },
  { id: 'm12', name: '유아·초등·특수교육', group: '교육', field: 'edu' },
  { id: 'm13', name: '수학·통계학', group: '자연', field: 'sci' },
  { id: 'm14', name: '생명과학', group: '자연', field: 'sci' },
  { id: 'm15', name: '물리·화학', group: '자연', field: 'sci' },
  { id: 'm16', name: '농생명·환경학', group: '자연', field: 'eco' },
  { id: 'm17', name: '컴퓨터공학', group: '공학', field: 'it' },
  { id: 'm18', name: '인공지능학', group: '공학', field: 'it' },
  { id: 'm19', name: '기계·로봇공학', group: '공학', field: 'eng' },
  { id: 'm20', name: '전기전자공학', group: '공학', field: 'eng' },
  { id: 'm21', name: '건축학', group: '공학', field: 'eng' },
  { id: 'm22', name: '항공운항·항공정비', group: '공학', field: 'air' },
  { id: 'm23', name: '간호학', group: '의료·보건', field: 'med' },
  { id: 'm24', name: '의예·약학', group: '의료·보건', field: 'med', req: { study: 21 } },
  { id: 'm25', name: '물리치료·응급구조', group: '의료·보건', field: 'med' },
  { id: 'm26', name: '회화·조소', group: '예술·체육', field: 'art' },
  { id: 'm27', name: '시각·산업디자인', group: '예술·체육', field: 'art' },
  { id: 'm28', name: '애니메이션·만화', group: '예술·체육', field: 'ani' },
  { id: 'm29', name: '무용', group: '예술·체육', field: 'dance' },
  { id: 'm30', name: '실용음악', group: '예술·체육', field: 'perf' },
  { id: 'm31', name: '연극영화', group: '예술·체육', field: 'perf' },
  { id: 'm32', name: '체육·스포츠과학', group: '예술·체육', field: 'sport' },
  { id: 'm33', name: '영어영문학', group: '외국어·국제', field: 'global' },
  { id: 'm34', name: '중국어·일본어·스페인어 등', group: '외국어·국제', field: 'global' },
  { id: 'm35', name: '국제학', group: '외국어·국제', field: 'global' },
  { id: 'm36', name: '조리·호텔관광', group: '생활·서비스', field: 'cook' },
  { id: 'm37', name: '기계·전기 실무 (기술)', group: '생활·서비스', field: 'tech' },
  { id: 'm38', name: '군사학', group: '군', field: 'mil' }
];

/* 대학에 가지 않는 길의 조건과 고를 수 있는 분야 */
CS.PRO_MIN = 16;      /* 바로 선수·예술가로 뛰어들려면 체력 또는 창의가 이만큼 */
CS.STARTUP_EXP = 5;   /* 나만의 길을 만들려면 진로 경험이 이만큼 */
CS.READY_HIGH = 30;   /* 핵심 능력치 합이 이 이상이면 '실력을 인정받는' */
CS.READY_MID = 20;    /* 이 이상이면 '자기 자리를 잡아 가는' */
CS.WORK_FIELDS = ['tech', 'it', 'cook', 'biz', 'mil', 'eco', 'media'];
CS.PRO_FIELDS = [
  { field: 'sport', req: { body: 16 } },
  { field: 'dance', req: { create: 16 } },
  { field: 'art',   req: { create: 16 } },
  { field: 'ani',   req: { create: 16 } },
  { field: 'perf',  req: { create: 16 } }
];
CS.STARTUP_FIELDS = ['it', 'cook', 'media', 'art', 'ani', 'tech', 'eco', 'biz', 'dance', 'sport'];

/* 20대의 마지막 선택: 삶의 방식. values = 이 방식과 어울리는 가치관 */
CS.STYLES = [
  { id: 'stable',    label: '안정적인 자리에서 꾸준히 일하고 싶다', values: ['stable', 'rest'] },
  { id: 'challenge', label: '어렵더라도 가장 큰 무대에 도전하고 싶다', values: ['challenge', 'fame'] },
  { id: 'worth',     label: '누군가에게 도움이 되는 일을 하고 싶다', values: ['worth'] },
  { id: 'free',      label: '내 방식대로, 내 이름을 걸고 일하고 싶다', values: ['free', 'rest'] }
];

/* 분야와 엔딩 직업. keys: 그 분야에서 특히 중요한 능력치 2개 */
CS.FIELDS = {
  human: { name: '인문·문화', keys: ['study', 'create'], jobs: {
    stable:    ['공공도서관 사서', '동네 도서관에서 책과 사람을 이어 줘요.'],
    challenge: ['소설가', '내 이름으로 된 책을 내고 독자를 만나요.'],
    worth:     ['박물관 학예사', '오래된 이야기를 지키고 사람들에게 들려줘요.'],
    free:      ['프리랜서 콘텐츠 작가', '글과 영상으로 인문학 이야기를 풀어내요.'] } },
  biz: { name: '경영·경제', keys: ['study', 'social'], jobs: {
    stable:    ['공기업 직원', '많은 사람이 쓰는 공공 서비스를 운영해요.'],
    challenge: ['스타트업 기획자', '아직 세상에 없는 서비스를 만들어 내놓아요.'],
    worth:     ['사회적기업 운영자', '돈을 벌면서 사회 문제도 함께 풀어요.'],
    free:      ['작은 브랜드 대표', '내가 만든 물건을 내 가게에서 팔아요.'] } },
  care: { name: '상담·복지', keys: ['social', 'study'], jobs: {
    stable:    ['사회복지 공무원', '도움이 필요한 이웃을 찾아 제도와 연결해요.'],
    challenge: ['임상심리 전문가', '병원에서 마음의 병을 진단하고 연구해요.'],
    worth:     ['청소년 상담사', '흔들리는 십 대의 이야기를 들어 줘요.'],
    free:      ['상담센터 원장', '내 이름을 건 상담실을 열었어요.'] } },
  media: { name: '미디어', keys: ['create', 'social'], jobs: {
    stable:    ['기업 홍보 담당자', '회사의 이야기를 세상에 알기 쉽게 전해요.'],
    challenge: ['방송 PD', '수많은 사람이 보는 프로그램을 만들어요.'],
    worth:     ['기자', '알려져야 할 일을 취재해 세상에 알려요.'],
    free:      ['영상 크리에이터', '내 채널에서 내가 만들고 싶은 영상을 만들어요.'] } },
  law: { name: '법·행정', keys: ['study', 'social'], jobs: {
    stable:    ['행정 공무원', '시청에서 시민의 생활과 닿아 있는 일을 해요.'],
    challenge: ['변호사', '법정에서 의뢰인의 권리를 지켜요.'],
    worth:     ['경찰관', '동네의 안전을 지키고 피해자를 도와요.'],
    free:      ['노무사', '사무소를 열고 일하는 사람들의 권리를 상담해요.'] } },
  edu: { name: '교육', keys: ['social', 'study'], jobs: {
    stable:    ['중학교 교사', '교실에서 매일 학생들을 만나요.'],
    challenge: ['교육 서비스 기획자', '공부를 돕는 새로운 앱과 도구를 만들어요.'],
    worth:     ['특수교사', '저마다 다른 속도로 배우는 학생들 곁에 있어요.'],
    free:      ['독립 강사', '내 수업을 내 방식으로 열어요.'] } },
  sci: { name: '자연과학', keys: ['study', 'create'], jobs: {
    stable:    ['국책 연구소 연구원', '긴 호흡으로 기초 과학을 연구해요.'],
    challenge: ['과학자 (대학 교수)', '아무도 풀지 못한 질문에 매달려요.'],
    worth:     ['환경 연구원', '기후와 생태계를 지킬 방법을 찾아요.'],
    free:      ['과학 커뮤니케이터', '어려운 과학을 쉽고 재미있게 전해요.'] } },
  it: { name: '컴퓨터·인공지능', keys: ['study', 'create'], jobs: {
    stable:    ['IT 기업 개발자', '많은 사람이 매일 쓰는 서비스를 만들고 고쳐요.'],
    challenge: ['인공지능 연구원', '더 똑똑하고 안전한 인공지능을 연구해요.'],
    worth:     ['의료·공공 분야 개발자', '병원과 공공기관에서 사람을 돕는 프로그램을 만들어요.'],
    free:      ['인디 게임 개발자', '작은 팀으로 내가 하고 싶은 게임을 만들어요.'] } },
  eng: { name: '공학', keys: ['study', 'create'], jobs: {
    stable:    ['제조 기업 엔지니어', '자동차와 전자 제품이 만들어지는 과정을 책임져요.'],
    challenge: ['로봇·우주 개발자', '로봇과 위성을 설계해요.'],
    worth:     ['에너지·안전 엔지니어', '더 깨끗하고 안전한 시설을 설계해요.'],
    free:      ['건축사', '사무소를 열고 사람들이 살 집을 설계해요.'] } },
  med: { name: '의료·보건', keys: ['study', 'social'], jobs: {
    stable:    ['종합병원 의료인', '병원에서 환자의 회복을 가장 가까이에서 도와요.'],
    challenge: ['권역외상센터 의료진', '가장 급한 순간에 생명을 살리는 팀에서 일해요.'],
    worth:     ['재활 치료사', '다친 사람이 다시 일상으로 돌아가게 도와요.'],
    free:      ['방문 건강관리 센터 운영자', '병원에 오기 힘든 어르신들을 찾아가요.'] } },
  art: { name: '미술·디자인', keys: ['create', 'social'], jobs: {
    stable:    ['기업 디자이너', '사람들이 매일 쓰는 제품과 화면을 디자인해요.'],
    challenge: ['전시를 여는 미술 작가', '내 작품으로 개인전을 열어요.'],
    worth:     ['미술치료사', '그림으로 마음을 들여다보게 도와요.'],
    free:      ['프리랜서 일러스트레이터', '책 표지와 포스터에 내 그림이 실려요.'] } },
  ani: { name: '애니메이션·만화', keys: ['create', 'study'], jobs: {
    stable:    ['스튜디오 애니메이터', '팀과 함께 극장판 애니메이션을 만들어요.'],
    challenge: ['웹툰 작가', '매주 수많은 독자가 내 연재를 기다려요.'],
    worth:     ['어린이 콘텐츠 감독', '아이들이 처음 만나는 이야기를 만들어요.'],
    free:      ['1인 애니메이션 창작자', '기획부터 완성까지 혼자 해내요.'] } },
  dance: { name: '무용·춤', keys: ['create', 'body'], jobs: {
    stable:    ['시립무용단 단원', '정기 공연 무대에 꾸준히 올라요.'],
    challenge: ['안무가', '세계 무대에 오르는 가수의 안무를 짜요.'],
    worth:     ['무용 교육가', '춤이 처음인 사람들에게 몸 쓰는 즐거움을 알려 줘요.'],
    free:      ['댄스 스튜디오 대표', '내 스타일의 춤을 가르치는 공간을 열었어요.'] } },
  perf: { name: '음악·연기', keys: ['create', 'social'], jobs: {
    stable:    ['공연 기획사 직원', '무대 뒤에서 공연이 올라가게 만들어요.'],
    challenge: ['배우·뮤지션', '무대와 화면에서 관객을 만나요.'],
    worth:     ['예술 강사', '학교와 마을에서 음악과 연극을 가르쳐요.'],
    free:      ['독립 아티스트', '작은 공연장에서 내 작품을 직접 올려요.'] } },
  sport: { name: '체육·스포츠', keys: ['body', 'social'], jobs: {
    stable:    ['체육 교사', '운동장에서 학생들에게 몸 쓰는 법을 가르쳐요.'],
    challenge: ['실업팀·국가대표 선수', '태극마크를 달고 국제 대회에 나가요.'],
    worth:     ['선수 트레이너', '다친 선수가 다시 경기장에 서도록 도와요.'],
    free:      ['체육관 관장', '내 체육관에서 다음 세대 선수를 길러요.'] } },
  global: { name: '외국어·국제', keys: ['study', 'social'], jobs: {
    stable:    ['무역회사 해외영업 담당', '다른 나라 회사와 물건을 사고팔아요.'],
    challenge: ['국제회의 통역사', '두 언어 사이에서 실시간으로 말을 옮겨요.'],
    worth:     ['국제구호 활동가', '재난과 분쟁 지역에서 사람들을 도와요.'],
    free:      ['프리랜서 번역가', '외국의 책과 영화를 우리말로 옮겨요.'] } },
  mil: { name: '군·안보', keys: ['body', 'study'], jobs: {
    stable:    ['직업군인', '부대원들을 이끌며 나라를 지켜요.'],
    challenge: ['함정 지휘관', '바다 위에서 함정과 승조원을 책임져요.'],
    worth:     ['해양경찰·소방관', '위험한 현장에서 사람을 구해요.'],
    free:      ['안전·보안 전문가', '군 경험을 살려 안전 교육과 컨설팅을 해요.'] } },
  cook: { name: '조리·관광', keys: ['create', 'social'], jobs: {
    stable:    ['호텔 조리사', '큰 주방에서 팀으로 요리해요.'],
    challenge: ['오너 셰프', '내 이름을 건 식당으로 평가받아요.'],
    worth:     ['학교 영양사', '학생들의 한 끼를 책임져요.'],
    free:      ['작은 식당 사장', '단골이 찾아오는 동네 가게를 꾸려요.'] } },
  tech: { name: '기술·기능', keys: ['create', 'body'], jobs: {
    stable:    ['기업 기술직 사원', '현장에서 설비를 다루고 고쳐요.'],
    challenge: ['기능 명장', '한 분야의 기술로 최고 자리에 올라요.'],
    worth:     ['산업안전 관리자', '일터에서 아무도 다치지 않게 살펴요.'],
    free:      ['공방 대표', '내 기술로 직접 만들어 팔아요.'] } },
  eco: { name: '농생명·환경', keys: ['study', 'body'], jobs: {
    stable:    ['농업 연구직 공무원', '더 잘 자라는 품종과 농사법을 연구해요.'],
    challenge: ['스마트팜 창업가', '기술로 농사를 짓는 농장을 세웠어요.'],
    worth:     ['환경 활동가', '숲과 바다를 지키는 일을 해요.'],
    free:      ['로컬 크리에이터', '작은 마을에 내려가 그곳의 이야기를 만들어요.'] } },
  air: { name: '항공', keys: ['study', 'body'], jobs: {
    stable:    ['항공 정비사', '비행기가 안전하게 뜨도록 꼼꼼히 점검해요.'],
    challenge: ['여객기 조종사', '수백 명을 태우고 하늘길을 날아요.'],
    worth:     ['구조 헬기 조종사', '산과 바다에서 사람을 구하러 날아가요.'],
    free:      ['드론 사업가', '드론 촬영과 방제 사업을 운영해요.'] } }
};
