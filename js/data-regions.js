/* ===== 지역(시·도)과 고등학교 목록 =====
   학교 명단 출처 (2026년 기준)
   - 마이스터고: 교육부 2026.6. 보도자료 인용 정리(인포굿맨), 2028년 개교 신규 지정 6교는 제외
   - 과학고·외고·국제고·자사고: 학교알리미 기반 정리(school.mustarddata.com)
   - 영재학교 8곳: 머니투데이 2026.5.29. 기사
   - 예술고: 예고 입시 가이드 2027(obri.co.kr), 국악고: 문화체육관광부 소속기관 안내, 체육고: 베리타스알파·나무위키
   - 강원 직업계고 학과: 강원 직업계고 진학 안내(gvhs.kr) 2027학년도 모집 학과
   - 광주·전남은 2026년 7월 「전남광주통합특별시」로 통합되어 한 지역으로 묶었습니다.
   학교를 고치거나 더하려면 아래 REGION_DATA 의 해당 줄만 바꾸면 됩니다.
   dorm 값: all 전원 기숙사 / some 기숙사 있음 / 값이 없으면 화면에 표시하지 않음 */
var CS = window.CS || {};
window.CS = CS;

CS.REGIONS = [
  { id: 'seoul', name: '서울' }, { id: 'busan', name: '부산' }, { id: 'daegu', name: '대구' },
  { id: 'incheon', name: '인천' }, { id: 'gwangjeon', name: '전남광주', full: '전남광주통합특별시 (광주·전남)' },
  { id: 'daejeon', name: '대전' }, { id: 'ulsan', name: '울산' }, { id: 'sejong', name: '세종' },
  { id: 'gyeonggi', name: '경기' }, { id: 'gangwon', name: '강원' }, { id: 'chungbuk', name: '충북' },
  { id: 'chungnam', name: '충남' }, { id: 'jeonbuk', name: '전북' }, { id: 'gyeongbuk', name: '경북' },
  { id: 'gyeongnam', name: '경남' }, { id: 'jeju', name: '제주' }
];

/* 도 지역의 시·군 (고르면 그 시·군 학교가 위로 오고 「우리 시」 표시. 학교 목록이 줄지는 않음)
   2026년 기준. 군위군은 2023년 대구로 편입되어 경북에서 뺐습니다. */
CS.CITIES = {
  gyeonggi: ['수원', '성남', '고양', '용인', '부천', '안산', '안양', '남양주', '화성', '평택', '의정부', '시흥', '파주', '광명', '김포', '군포',
             '광주', '이천', '양주', '오산', '구리', '안성', '포천', '의왕', '하남', '여주', '동두천', '과천', '가평', '양평', '연천'],
  gangwon: ['춘천', '원주', '강릉', '동해', '태백', '속초', '삼척', '홍천', '횡성', '영월', '평창', '정선', '철원', '화천', '양구', '인제', '고성', '양양'],
  chungbuk: ['청주', '충주', '제천', '보은', '옥천', '영동', '증평', '진천', '괴산', '음성', '단양'],
  chungnam: ['천안', '공주', '보령', '아산', '서산', '논산', '계룡', '당진', '금산', '부여', '서천', '청양', '홍성', '예산', '태안'],
  jeonbuk: ['전주', '군산', '익산', '정읍', '남원', '김제', '완주', '진안', '무주', '장수', '임실', '순창', '고창', '부안'],
  gwangjeon: ['광주', '목포', '여수', '순천', '나주', '광양', '담양', '곡성', '구례', '고흥', '보성', '화순', '장흥', '강진', '해남', '영암',
              '무안', '함평', '영광', '장성', '완도', '진도', '신안'],
  gyeongbuk: ['포항', '경주', '김천', '안동', '구미', '영주', '영천', '상주', '문경', '경산', '의성', '청송', '영양', '영덕', '청도', '고령',
              '성주', '칠곡', '예천', '봉화', '울진', '울릉'],
  gyeongnam: ['창원', '진주', '통영', '사천', '김해', '밀양', '거제', '양산', '의령', '함안', '창녕', '고성', '남해', '하동', '산청', '함양', '거창', '합천']
};

/* 학교가 내가 고른 시·군에 있는지: 「지역 시·군 ...」 형태의 소재지로 판단 */
CS.inMyCity = function (g, school) {
  if (!g.city || !g.region) { return false; }
  var r = CS.findById(CS.REGIONS, g.region);
  if (!r || !school.place) { return false; }
  var pre = r.name + ' ' + g.city;
  return school.place === pre || school.place.indexOf(pre + ' ') === 0;
};

CS.SCHOOL_TABS = [
  { id: 'general', name: '일반고·자율학교' },
  { id: 'special', name: '특목고·예체능' },
  { id: 'voc',     name: '특성화고·마이스터고' },
  { id: 'alt',     name: '대안학교' }
];
CS.DORM_TEXT = { all: '전원 기숙사', some: '기숙사 있음' };

/* 학교 종류별 추천 성향(나 알아보기 질문과 연결)과 추천 이유 */
CS.KIND_TAGS = {
  general: ['general'], sportsTalent: ['sport', 'general'], boarding: ['study', 'boarding'], jasago: ['study'],
  science: ['science', 'study'], lang: ['lang', 'study'], pe: ['sport'],
  art: ['art'], dance: ['perform', 'sport'], music: ['perform'], gugak: ['perform'], perfArts: ['perform', 'media'],
  comic: ['ani', 'art'], ani: ['ani', 'art', 'media'], broadcast: ['media', 'art'],
  ai: ['it', 'tech'], software: ['it', 'tech'], hacking: ['it'], game: ['it', 'ani'],
  ebiz: ['media', 'general'], dcontent: ['art', 'media'], beauty: ['beauty'], fashion: ['beauty', 'art'],
  cook: ['food'], cafe: ['food'], food: ['food', 'science'], biocos: ['beauty', 'science'],
  robot: ['tech'], semicon: ['tech', 'science'], auto: ['tech'], electric: ['tech'], electronics: ['tech', 'it'],
  construct: ['tech'], mech: ['tech'], ship: ['tech'], chem: ['science', 'tech'],
  farm: ['farm'], pet: ['farm'], flower: ['farm', 'art'], horse: ['farm', 'sport'],
  medmech: ['health', 'tech'], biopharma: ['health', 'science'], medelec: ['health', 'tech'], care: ['health'],
  defense: ['military', 'it'], fire: ['military', 'health'], aviation: ['military', 'tech'], sergeant: ['military', 'sport'],
  marine: ['tech', 'military'], logistics: ['tech', 'general'], tour: ['lang', 'general'], alt: ['alt']
};
CS.KIND_REASON = {
  general: '여러 가지를 해 보며 천천히 찾고 싶은 나에게', sportsTalent: '운동도 평범한 학교생활도 놓치고 싶지 않은 나에게',
  boarding: '친구들과 함께 지내며 공부에 집중하고 싶은 나에게', jasago: '높은 목표를 세우고 깊이 공부하고 싶은 나에게',
  science: '원리를 끝까지 파고드는 나에게', lang: '다른 나라 말과 사람에 관심 많은 나에게', pe: '몸을 쓰는 게 좋고 승부를 즐기는 나에게',
  art: '그리고 만드는 데 몰입하는 나에게', dance: '몸으로 표현하고 무대를 좋아하는 나에게', music: '노래하고 연주하는 게 좋은 나에게',
  gugak: '우리 소리와 가락에 끌리는 나에게', perfArts: '무대 위에서 빛나고 싶은 나에게',
  comic: '이야기를 그림으로 풀어내고 싶은 나에게', ani: '이야기와 그림, 영상으로 뭔가 만들고 싶은 나에게', broadcast: '카메라 뒤에서 이야기를 만들고 싶은 나에게',
  ai: '코딩과 기계, 새로운 기술이 궁금한 나에게', software: '코딩으로 뭔가 만들어 보고 싶은 나에게', hacking: '보안과 해킹 방어가 궁금한 나에게',
  game: '게임을 즐기는 것을 넘어 직접 만들고 싶은 나에게', ebiz: 'SNS와 마케팅에 관심 많은 나에게', dcontent: '디자인으로 눈길을 사로잡고 싶은 나에게',
  beauty: '꾸미고 가꾸는 일이 즐거운 나에게', fashion: '옷과 스타일에 관심 많은 나에게', cook: '요리하는 게 즐거운 나에게',
  cafe: '커피와 디저트에 끌리는 나에게', food: '먹거리를 연구하고 만들고 싶은 나에게', biocos: '화장품을 직접 만들어 보고 싶은 나에게',
  robot: '직접 만들고 고치는 게 좋은 나에게', semicon: '첨단 기술 현장에서 일하고 싶은 나에게', auto: '자동차와 기계가 좋은 나에게',
  electric: '전기와 에너지 기술에 관심 있는 나에게', electronics: '전자 기기의 속이 궁금한 나에게', construct: '건물과 도시를 짓는 일에 끌리는 나에게',
  mech: '기계를 다루고 만드는 게 좋은 나에게', ship: '큰 배를 만드는 일에 끌리는 나에게', chem: '실험과 화학이 재미있는 나에게',
  farm: '동물과 식물, 자연이 좋은 나에게', pet: '동물을 돌보는 게 좋은 나에게', flower: '꽃과 정원을 가꾸고 싶은 나에게', horse: '말과 함께 일하고 싶은 나에게',
  medmech: '사람을 돕는 기술에 관심 있는 나에게', biopharma: '약과 바이오 기술이 궁금한 나에게', medelec: '의료 장비를 다루고 싶은 나에게',
  care: '아픈 사람을 곁에서 돌보고 싶은 나에게', defense: '나라를 지키는 기술에 관심 있는 나에게', fire: '위험한 순간에 사람을 지키고 싶은 나에게',
  aviation: '비행기와 하늘에 끌리는 나에게', sergeant: '군인의 길이 궁금한 나에게', marine: '넓은 바다에서 일하고 싶은 나에게',
  logistics: '세계로 오가는 물건의 흐름이 궁금한 나에게', tour: '여행과 사람 만나는 일이 좋은 나에게', alt: '교실 밖에서 배우고 싶은 나에게'
};

/* 학교 한 곳 만들기 */
function S(o) {
  var kind = o.kind || (o.depts ? o.depts[0].kind : 'general');
  if (!o.tags) {
    var t = [];
    var kinds = o.depts ? o.depts.map(function (d) { return d.kind; }) : [kind];
    for (var i = 0; i < kinds.length; i++) {
      var kt = CS.KIND_TAGS[kinds[i]] || [];
      for (var j = 0; j < kt.length; j++) { if (t.indexOf(kt[j]) < 0) { t.push(kt[j]); } }
    }
    if (o.dorm === 'all' && t.indexOf('boarding') < 0) { t.push('boarding'); }
    o.tags = t;
  }
  if (!o.reason) { o.reason = CS.KIND_REASON[kind] || ''; }
  return o;
}

/* 예술고: 미술·음악·무용 전공 */
function artDepts(id) {
  return [ { id: id + 'Art', name: '미술 전공', kind: 'art' }, { id: id + 'Music', name: '음악 전공', kind: 'music' },
           { id: id + 'Dance', name: '무용 전공', kind: 'dance' } ];
}

/* 지역별 학교: [이름, 시·군·구] 형태의 짧은 표 */
var REGION_DATA = {
  seoul: {
    gifted: [['서울과학고', '종로구']], sci: [['한성과학고', '서대문구'], ['세종과학고', '구로구']],
    lang: [['대원외고', '광진구'], ['대일외고', '성북구'], ['명덕외고', '강서구'], ['서울외고', '도봉구'], ['이화여자외고', '중구'], ['한영외고', '강동구']],
    intl: [['서울국제고', '종로구']], art: [['서울예고', '종로구'], ['선화예고', '광진구'], ['덕원예고', '강서구']],
    gugak: [['국립국악고', ''], ['국립전통예술고', '']], pe: [['서울체고', '']],
    meister: [['수도전기공업고', '에너지', 'electric'], ['미림마이스터고', '뉴미디어콘텐츠', 'dcontent'], ['서울로봇고', '로봇', 'robot'],
              ['서울도시과학기술고', '해외건설·플랜트', 'construct'], ['서울반도체고', '반도체 (2027년 3월 개교)', 'semicon']],
    extra: [ { id: 'seoulPerf', tab: 'special', name: '서울공연예술고', type: '예술 특성화고', place: '서울', kind: 'perfArts',
               desc: '노래, 연기, 춤, 연주 같은 공연 예술을 실기 중심으로 배워요.' } ]
  },
  busan: {
    gifted: [['한국과학영재학교', '']], sci: [['부산과학고', '금정구'], ['부산일과학고', '사하구']], lang: [['부산외고', '연제구']],
    intl: [['부산국제고', '부산진구']], art: [['부산예고', '금정구'], ['브니엘예고', '금정구']], pe: [['부산체고', '']],
    meister: [['부산자동차마이스터고', '자동차산업', 'auto'], ['부산기계공업고', '기계', 'mech'], ['부산해사고', '해양', 'marine'],
              ['부산소프트웨어마이스터고', '소프트웨어', 'software']]
  },
  daegu: {
    gifted: [['대구과학고', '수성구']], sci: [['대구일과학고', '동구']], lang: [['대구외고', '달서구']], intl: [['대구국제고', '북구']],
    art: [['경북예고', '남구']], pe: [['대구체고', '']],
    meister: [['경북기계공업고', '기계·메카트로닉스', 'mech'], ['대구일마이스터고', '자동차', 'auto'], ['대구소프트웨어마이스터고', '소프트웨어', 'software'],
              ['대구농업마이스터고', '도시형 첨단농업', 'farm'], ['대구반도체마이스터고', '반도체', 'semicon']]
  },
  incheon: {
    gifted: [['인천과학예술영재학교', '연수구']], sci: [['인천과학고', '영종'], ['인천진산과학고', '부평구']],
    lang: [['인천외고', '부평구'], ['미추홀외고', '남동구']], intl: [['인천국제고', '영종']], art: [['인천예고', '남동구']], pe: [['인천체고', '']],
    meister: [['인천전자마이스터고', '전자·통신·AI', 'electronics'], ['인천해사고', '해양', 'marine']]
  },
  gwangjeon: {
    gifted: [['광주과학고', '광주']], sci: [['전남과학고', '나주']], lang: [['전남외고', '나주']],
    art: [['광주예고', '광주 북구'], ['전남예고', '무안'], ['한국창의예고', '광양']],
    pe: [['광주체고', '광주'], ['전남체고', '전남']],
    meister: [['광주자동화설비마이스터고', '자동화설비', 'mech'], ['광주소프트웨어마이스터고', '소프트웨어', 'software'],
              ['한국항만물류고', '항만물류', 'logistics'], ['전남생명과학고', '친환경농축산', 'farm'],
              ['여수석유화학고', '석유화학', 'chem'], ['완도수산고', '수산·해양', 'marine']],
    extra: [ { id: 'hampyeongGolf', tab: 'special', name: '함평골프고', type: '골프 특목고', place: '함평', kind: 'pe',
               desc: '골프 선수를 기르는 학교예요. 하루의 많은 시간을 연습장에서 보내요.' } ]
  },
  daejeon: {
    gifted: [['대전과학고', '유성구']], sci: [['대전동신과학고', '동구']], lang: [['대전외고', '서구']], art: [['대전예고', '유성구']], pe: [['대전체고', '']],
    meister: [['동아마이스터고', '전자·기계', 'electronics'], ['대덕소프트웨어마이스터고', '소프트웨어', 'software']]
  },
  ulsan: {
    sci: [['울산과학고', '울주군']], lang: [['울산외고', '북구']], art: [['울산예고', '울주군']], pe: [['울산스포츠과학고', '']],
    meister: [['울산마이스터고', '기계·자동화', 'mech'], ['울산에너지고', '에너지', 'electric'], ['현대공업고', '조선해양플랜트', 'ship']]
  },
  sejong: {
    gifted: [['세종과학예술영재학교', '']], intl: [['세종국제고', '']], art: [['세종예고', '']]
  },
  gyeonggi: {
    gifted: [['경기과학고', '수원']], sci: [['경기북과학고', '의정부']],
    lang: [['과천외고', '과천'], ['안양외고', '안양'], ['고양외고', '고양'], ['동두천외고', '동두천'], ['김포외고', '김포'],
           ['수원외고', '수원'], ['성남외고', '성남'], ['경기외고', '의왕']],
    intl: [['청심국제고', '가평'], ['동탄국제고', '화성'], ['고양국제고', '고양']],
    art: [['경기예고', '부천'], ['계원예고', '성남'], ['고양예고', '고양'], ['안양예고', '안양']], pe: [['경기체고', '']],
    meister: [['수원하이텍고', '메카트로닉스', 'mech'], ['평택마이스터고', '자동차·기계', 'auto'], ['경기게임마이스터고', '게임 콘텐츠', 'game']],
    extra: [ { id: 'koreaAni', tab: 'voc', name: '한국애니메이션고', type: '특성화고', place: '하남', kind: 'ani',
               desc: '애니메이션, 만화, 게임 그래픽, 영상을 만들며 배워요.' } ]
  },
  gangwon: {
    sci: [['강원과학고', '원주']], art: [['강원예고', '강릉']], pe: [['강원체고', '']],
    meister: [['한국에너지마이스터고', '발전산업', 'electric']],
    extra: [
      { id: 'kwLang', tab: 'special', name: '강원외국어고', type: '외국어 특화 고교', place: '양구', kind: 'lang',
        desc: '외국어를 깊이 배우는 학교예요. 농촌형 자율고 전환이 추진되어 학교 유형은 확인이 필요해요.', ask: '내 관심 언어 (예: 영어, 중국어)' },
      { id: 'hansaem', tab: 'voc', emo: '🛍️', name: '춘천한샘고', type: '특성화고', place: '춘천',
        desc: '학과가 다양해서 「백화점 학교」라고도 불려요. 부전공도 고를 수 있어요.',
        depts: [ { id: 'sns', name: 'SNS마케팅과', kind: 'ebiz' }, { id: 'design', name: '디자인콘텐츠과', kind: 'dcontent' },
                 { id: 'beautyArt', name: '뷰티아트과', kind: 'beauty' }, { id: 'fashionStyle', name: '패션스타일과', kind: 'fashion' },
                 { id: 'cookDept', name: '조리과', kind: 'cook' }, { id: 'bioCos', name: '바이오코스메틱과', kind: 'biocos' },
                 { id: 'fusionSw', name: '융합소프트웨어과', kind: 'software' } ] },
      { id: 'ccMech', tab: 'voc', emo: '⚙️', name: '춘천기계공고', type: '특성화고', place: '춘천',
        desc: '기계, 로봇, 반도체, 자동차, 전기, 건축을 실습 중심으로 배워요.',
        depts: [ { id: 'robotSys', name: '로봇기계시스템과', kind: 'robot' }, { id: 'robotMat', name: '로봇소재융합과', kind: 'robot' },
                 { id: 'semi', name: '반도체과', kind: 'semicon' }, { id: 'car', name: '자동차과', kind: 'auto' },
                 { id: 'elec', name: '전기과', kind: 'electric' }, { id: 'build', name: '건축토목과', kind: 'construct' } ] },
      { id: 'kwBio', tab: 'voc', emo: '🌿', name: '강원생명과학고', type: '특성화고 (협약형)', place: '춘천',
        desc: '농업, 동물, 꽃, 디저트를 배우고 지역 기업과 연계해 취업해요.',
        depts: [ { id: 'smartFarm', name: '스마트팜도시농업과', kind: 'farm' }, { id: 'petCare', name: '반려동물케어과', kind: 'pet' },
                 { id: 'flowerGarden', name: '플라워가드닝과', kind: 'flower' }, { id: 'cafeDessert', name: '카페N디저트과', kind: 'cafe' } ] },
      { id: 'kAI', tab: 'voc', emo: '🤖', name: '한국인공지능고', type: '특성화고', place: '화천',
        desc: '인공지능과 사물인터넷을 함께 배워 스마트홈, 자율주행 기술을 직접 만들어요.',
        depts: [ { id: 'aiIot', name: 'AI사물인터넷과', kind: 'ai' } ] },
      { id: 'kwAni', tab: 'voc', emo: '🎬', name: '강원애니고', type: '특성화고', place: '춘천',
        desc: '만화, 애니메이션, 방송 영상을 만들며 배워요.',
        depts: [ { id: 'comicDept', name: '만화창작과', kind: 'comic' }, { id: 'aniDept', name: '애니메이션과', kind: 'ani' },
                 { id: 'bcast', name: '방송영상과', kind: 'broadcast' } ] },
      { id: 'kMedi', tab: 'voc', emo: '🩺', name: '한국의료마이스터고 (구 원주의료고)', type: '마이스터고', place: '원주', dorm: 'some',
        desc: '의료기기와 바이오의약을 배워요. 졸업 후 의료기기·제약 회사로 많이 취업해요.',
        depts: [ { id: 'medMech', name: '의료기계과', kind: 'medmech' }, { id: 'bioPharm', name: '바이오의약과', kind: 'biopharma' },
                 { id: 'medElec', name: '의료전기전자과', kind: 'medelec' } ] },
      { id: 'kDef', tab: 'voc', emo: '🎖️', name: '한국국방과학고', type: '강원형 마이스터고', place: '철원', dorm: 'all',
        desc: '2학년부터 사이버보안, 로봇, 드론, 진학 코스로 나뉘어요. 학년당 48명만 뽑아요.',
        depts: [ { id: 'defSys', name: '국방시스템과', kind: 'defense' } ] },
      { id: 'kAir', tab: 'voc', emo: '✈️', name: '한국항공고', type: '강원형 마이스터고', place: '태백',
        desc: '항공기 정비를 배워 항공 분야 기술자로 일할 준비를 해요.',
        depts: [ { id: 'airMaint', name: '항공정비시스템과', kind: 'aviation' } ] },
      { id: 'kFire', tab: 'voc', emo: '🚒', name: '한국소방마이스터고', type: '마이스터고', place: '영월', dorm: 'all',
        desc: '우리나라 유일의 소방 분야 마이스터고예요. 소방 설비를 설계하고 점검하는 법을 배워요.',
        depts: [ { id: 'fireSafe', name: '소방안전관리과', kind: 'fire' } ] },
      { id: 'hyeoncheon', tab: 'alt', name: '현천고', type: '기숙형 공립 대안학교', place: '횡성', dorm: 'all', kind: 'alt',
        desc: '함께 먹고 자며 지역 어르신 돕기, 체험, 프로젝트로 배워요. 대학 입시보다 삶을 배우는 데 집중해요.' },
      { id: 'jeonin', tab: 'alt', name: '전인고', type: '대안교육 특성화고', place: '춘천', kind: 'alt',
        desc: '프로젝트와 체험 중심으로 배우는 작은 학교예요.' }
    ]
  },
  chungbuk: {
    sci: [['충북과학고', '청주']], lang: [['충북외고', '청주']], art: [['충북예고', '청주']], pe: [['충북체고', '']],
    meister: [['충북반도체고', '반도체장비', 'semicon'], ['한국바이오마이스터고', '바이오', 'biopharma'], ['충북에너지고', '차세대전지', 'electric']]
  },
  chungnam: {
    sci: [['충남과학고', '공주']], lang: [['충남외고', '아산']], art: [['충남예고', '천안']], pe: [['충남체고', '']],
    meister: [['합덕제철고', '철강', 'mech'], ['공주마이스터고', '전기·전자', 'electronics'], ['연무마이스터고', '자동차부품제조', 'auto'],
              ['한국식품마이스터고', '식품', 'food'], ['아산스마트팩토리마이스터고', '스마트공장', 'mech'], ['충남반도체마이스터고', '반도체', 'semicon']]
  },
  jeonbuk: {
    sci: [['전북과학고', '익산']], lang: [['전북외고', '군산']], art: [['전주예고', '완주']], pe: [['전북체고', '']],
    meister: [['군산기계공업고', 'AI·로봇', 'robot'], ['전북기계공업고', '기계', 'mech'], ['한국경마축산고', '말 산업', 'horse'],
              ['김제농생명마이스터고', '농생명자원', 'farm']]
  },
  gyeongbuk: {
    sci: [['경북과학고', '포항'], ['경산과학고', '경산']], lang: [['경북외고', '구미']], art: [['김천예고', '김천'], ['포항예고', '포항']], pe: [['경북체고', '']],
    meister: [['구미전자공업고', '전자', 'electronics'], ['금오공업고', '기계·전자모바일', 'mech'], ['포항제철공업고', '철강', 'mech'],
              ['한국원자력마이스터고', '원자력발전설비', 'electric'], ['경북바이오마이스터고', '바이오', 'biopharma'],
              ['한국국제통상마이스터고', '글로벌 비즈니스', 'ebiz'], ['한국해양마이스터고', '스마트해양수산', 'marine'],
              ['경북소프트웨어마이스터고', '디지털', 'software'], ['한국반도체마이스터고', '반도체', 'semicon']]
  },
  gyeongnam: {
    sci: [['경남과학고', '진주'], ['창원과학고', '창원']], lang: [['경남외고', '양산'], ['김해외고', '김해']], art: [['경남예고', '진주']], pe: [['경남체고', '']],
    meister: [['거제공업고', '조선', 'ship'], ['삼천포공업고', '항공·조선', 'aviation'], ['한국나노마이스터고', '나노융합', 'semicon']]
  },
  jeju: {
    sci: [['제주과학고', '제주']], lang: [['제주외고', '제주']],
    extra: [ { id: 'namnyeong', tab: 'special', name: '남녕고 체육과', type: '일반고 체육과', place: '제주', kind: 'pe',
               desc: '일반고 안의 체육과예요. 공부와 운동부 훈련을 함께 해요.', ask: '내 종목 (예: 수영)' } ]
  }
};

/* 어느 지역에서나 보이는 학교 (공통 유형 + 전국 단위 모집 학교) */
var COMMON = [
  { id: 'general', tab: 'general', name: '일반고', type: '일반고', place: '우리 지역', kind: 'general', common: true,
    desc: '여러 과목을 직접 골라 들으며(고교학점제) 진로를 찾아가요.' },
  { id: 'sportsTalent', tab: 'general', name: '일반고 체육특기생', type: '일반고', place: '우리 지역', kind: 'sportsTalent', common: true,
    desc: '일반고에 다니며 운동부 선수로 뛰어요. 수업과 훈련을 함께 해내야 해요.', ask: '내 종목 (예: 조정)' },
  { id: 'vocLocal', tab: 'voc', emo: '🏫', name: '특성화고 (우리 지역)', type: '특성화고', place: '우리 지역', common: true,
    desc: '지역마다 여러 특성화고가 있어요. 배우고 싶은 학과를 골라요.',
    depts: [ { id: 'lSw', name: '소프트웨어과', kind: 'software' }, { id: 'lDesign', name: '디자인과', kind: 'dcontent' },
             { id: 'lVideo', name: '영상·방송과', kind: 'broadcast' }, { id: 'lCook', name: '조리과', kind: 'cook' },
             { id: 'lCafe', name: '제과·카페과', kind: 'cafe' }, { id: 'lBeauty', name: '뷰티과', kind: 'beauty' },
             { id: 'lFashion', name: '패션과', kind: 'fashion' }, { id: 'lBiz', name: '경영·마케팅과', kind: 'ebiz' },
             { id: 'lCare', name: '보건간호과', kind: 'care' }, { id: 'lTour', name: '관광과', kind: 'tour' },
             { id: 'lMech', name: '기계과', kind: 'mech' }, { id: 'lElec', name: '전기·전자과', kind: 'electric' },
             { id: 'lAuto', name: '자동차과', kind: 'auto' }, { id: 'lBuild', name: '건축과', kind: 'construct' },
             { id: 'lFarm', name: '농생명과', kind: 'farm' }, { id: 'lPet', name: '반려동물과', kind: 'pet' } ] },
  { id: 'altLocal', tab: 'alt', name: '대안학교 (우리 지역)', type: '대안학교', place: '우리 지역', kind: 'alt', common: true,
    desc: '지역마다 공립·사립 대안학교가 있어요. 프로젝트와 체험으로 배워요.' },
  /* 전국 단위 모집 */
  { id: 'minjok', tab: 'general', name: '민족사관고', type: '전국 단위 자사고', place: '강원 횡성', kind: 'boarding', dorm: 'all', nation: true,
    desc: '전국 단위로 뽑는 자율형 사립고예요. 기숙사 생활을 하며 공부량이 많아요.' },
  { id: 'hana', tab: 'general', name: '하나고', type: '자율형 사립고', place: '서울 은평구', kind: 'jasago', nation: true,
    desc: '서울과 전국에서 학생을 뽑는 자율형 사립고예요.' },
  { id: 'hafs', tab: 'general', name: '용인한국외대부고', type: '전국 단위 자사고', place: '경기 용인', kind: 'jasago', nation: true,
    desc: '전국에서 학생을 뽑는 자율형 사립고예요. 외국어와 다양한 심화 과목을 배워요.' },
  { id: 'sangsan', tab: 'general', name: '상산고', type: '전국 단위 자사고', place: '전북 전주', kind: 'jasago', nation: true,
    desc: '전국에서 학생을 뽑는 자율형 사립고예요.' },
  { id: 'bukil', tab: 'general', name: '북일고', type: '전국 단위 자사고', place: '충남 천안', kind: 'jasago', nation: true,
    desc: '전국에서 학생을 뽑는 자율형 사립고예요.' },
  { id: 'gimcheon', tab: 'general', name: '김천고', type: '전국 단위 자사고', place: '경북 김천', kind: 'jasago', nation: true,
    desc: '전국에서 학생을 뽑는 자율형 사립고예요.' },
  { id: 'cheongun', tab: 'general', name: '현대청운고', type: '전국 단위 자사고', place: '울산 동구', kind: 'jasago', nation: true,
    desc: '전국에서 학생을 뽑는 자율형 사립고예요.' },
  { id: 'hanil', tab: 'general', name: '한일고', type: '전국 단위 자율학교', place: '충남 공주', kind: 'boarding', dorm: 'all', nation: true,
    desc: '전국에서 학생을 뽑고, 3년 동안 기숙사에서 함께 생활하며 공부해요.' },
  { id: 'hanmin', tab: 'general', name: '한민고', type: '기숙형 자율학교', place: '경기 파주', kind: 'boarding', dorm: 'all', nation: true,
    desc: '군인 자녀를 중심으로 뽑는 기숙형 학교예요. 규칙적인 단체 생활을 해요.', tags: ['boarding', 'military', 'study'] },
  { id: 'dimigo', tab: 'voc', emo: '💻', name: '한국디지털미디어고', type: '특성화고 (전국 단위)', place: '경기 안산', dorm: 'all', nation: true,
    desc: '우리나라 첫 IT 특성화고예요. 전국에서 학생을 뽑고 전교생이 기숙사에서 생활해요.',
    depts: [ { id: 'ebizDept', name: 'e-비즈니스과', kind: 'ebiz' }, { id: 'dContent', name: '디지털콘텐츠과', kind: 'dcontent' },
             { id: 'webProg', name: '웹프로그래밍과', kind: 'software' }, { id: 'hackDef', name: '해킹방어과', kind: 'hacking' } ] },
  { id: 'afAir', tab: 'voc', name: '공군항공과학고', type: '마이스터고 (전국 단위)', place: '경남 진주', kind: 'aviation', dorm: 'all', nation: true,
    desc: '입학과 동시에 공군 부사관 후보생이 되고, 3년 동안 생활관에서 지내요.', tags: ['military', 'tech', 'boarding'] },
  { id: 'cheongdam', tab: 'voc', name: '청담고', type: '특성화고', place: '경기 평택', kind: 'sergeant', dorm: 'some', dormNote: '운동부·부사관 진로 학생 위주', nation: true,
    desc: '부사관 진로와 운동부 학생을 위한 기숙사가 있어요.' }
];

/* 표를 학교 목록으로 펼치기 */
CS.SCHOOLS = [];
(function () {
  var i, r, key;
  for (i = 0; i < COMMON.length; i++) { COMMON[i].area = 'all'; CS.SCHOOLS.push(S(COMMON[i])); }
  function add(o) { CS.SCHOOLS.push(S(o)); }
  for (r = 0; r < CS.REGIONS.length; r++) {
    var rid = CS.REGIONS[r].id, rname = CS.REGIONS[r].name, d = REGION_DATA[rid] || {};
    var place = function (p) { return p ? rname + ' ' + p : rname; };
    var n = 0;
    function uid() { n += 1; return rid + '_' + n; }
    (d.gifted || []).forEach(function (x) {
      add({ id: uid(), area: rid, tab: 'special', name: x[0], type: '과학영재학교', place: place(x[1]), kind: 'science',
            desc: '과학 영재를 뽑는 학교예요. 연구와 탐구 중심으로 배우고, 전국에서 지원할 수 있어요.' });
    });
    (d.sci || []).forEach(function (x) {
      add({ id: uid(), area: rid, tab: 'special', name: x[0], type: '과학고', place: place(x[1]), kind: 'science',
            desc: '수학과 과학을 깊이 배우고 탐구 활동이 많아요.' });
    });
    (d.lang || []).forEach(function (x) {
      add({ id: uid(), area: rid, tab: 'special', name: x[0], type: '외국어고', place: place(x[1]), kind: 'lang',
            desc: '전공 외국어를 깊이 배우고 다른 나라 문화를 가까이 접해요.', ask: '내 전공어 (예: 영어, 중국어)' });
    });
    (d.intl || []).forEach(function (x) {
      add({ id: uid(), area: rid, tab: 'special', name: x[0], type: '국제고', place: place(x[1]), kind: 'lang',
            desc: '국제 관계와 외국어를 깊이 배워요. 세계 문제를 토론하는 수업이 많아요.' });
    });
    (d.art || []).forEach(function (x) {
      var id = uid();
      add({ id: id, area: rid, tab: 'special', emo: '🎨', name: x[0], type: '예술고', place: place(x[1]), depts: artDepts(id), deptWord: '전공',
            desc: '미술·음악·무용 같은 실기를 전공해요. 학교마다 개설된 전공이 조금씩 달라요.' });
    });
    (d.gugak || []).forEach(function (x) {
      add({ id: uid(), area: rid, tab: 'special', name: x[0], type: '국악 예술고', place: place(x[1]), kind: 'gugak',
            desc: '판소리, 가야금, 해금, 무용 같은 우리 전통 예술을 전공해요.', ask: '내 전공 (예: 가야금, 판소리)' });
    });
    (d.pe || []).forEach(function (x) {
      add({ id: uid(), area: rid, tab: 'special', name: x[0], type: '체육고', place: place(x[1]), kind: 'pe',
            desc: '하루의 많은 시간을 전문 훈련에 써요. 전국 대회가 목표예요.', ask: '내 종목 (예: 레슬링)' });
    });
    (d.meister || []).forEach(function (x) {
      add({ id: uid(), area: rid, tab: 'voc', name: x[0], type: '마이스터고', place: rname, kind: x[2], dorm: 'some',
            desc: x[1] + ' 분야 마이스터고예요. 취업을 목표로 실무를 배우고, 다른 지역 학생도 지원할 수 있어요.' });
    });
    (d.extra || []).forEach(function (o) { o.area = rid; if (o.place) { o.place = rname + ' ' + o.place; } add(o); });
  }
})();

/* 지금 지역에서 보이는 학교 */
CS.visibleSchools = function (g) {
  var out = [];
  for (var i = 0; i < CS.SCHOOLS.length; i++) {
    var s = CS.SCHOOLS[i];
    if (s.area === 'all' || s.area === g.region) { out.push(s); }
  }
  return out;
};
CS.regionOf = function (id) { return CS.findById(CS.REGIONS, id); };
