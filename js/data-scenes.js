/* ===== 장면 연출 데이터: 색, 이모지, 학기별 상황, 상황형 선택지 문구 =====
   문구를 바꾸고 싶으면 이 파일만 고치면 됩니다. */
var CS = window.CS || {};
window.CS = CS;

CS.CRIT_RATE = 0.15;   /* 활동이 '대성공'할 확률 (능력치 +1 추가) */

/* 카드 그림에 쓰는 파스텔 색 (화면 색은 css/style.css 의 :root 와 같게 유지) */
CS.COLOR_HEX = { study: '#DCEBFB', create: '#FBE1EC', social: '#FCEFC7', body: '#DFF1D0', rest: '#D3F1E7', exp: '#E7E3FB', stress: '#FBDCDC' };

CS.VALUE_COLORS = { challenge: 'create', stable: 'study', worth: 'body', rest: 'rest', fame: 'social', free: 'exp' };
CS.VALUE_EMO = { challenge: '🔥', stable: '🏠', worth: '🤝', rest: '🌿', fame: '🏆', free: '🧭' };
CS.STAT_EMO = { study: '📘', body: '💪', social: '👫', create: '🎨' };

CS.SCHOOL_EMO = { general: '🏫', sportsTalent: '🚣', peHigh: '🤼', artHigh: '🎨', danceHigh: '💃', aniHigh: '🎬', aiHigh: '🤖', langHigh: '🌍', sciHigh: '🔬', vocHigh: '🔧' };
CS.UNI_EMO = { top: '🏛️', kaist: '🧬', nat: '🌳', univ: '🎒', college: '🧰', artUniv: '🖌️', peUniv: '🏟️', academy: '⚓', abroad: '🛫' };
CS.FIELD_EMO = { human: '📖', biz: '💼', care: '🤝', media: '🎥', law: '⚖️', edu: '🍎', sci: '🔬', it: '💻', eng: '🛠️', med: '🩺',
  art: '🎨', ani: '🎬', dance: '💃', perf: '🎤', sport: '🏅', global: '🌍', mil: '⚓', cook: '🍳', tech: '🔧', eco: '🌱', air: '✈️' };
CS.GROUP_COLORS = { '인문': 'social', '사회': 'social', '교육': 'body', '자연': 'study', '공학': 'study', '의료·보건': 'rest',
  '예술·체육': 'create', '외국어·국제': 'exp', '생활·서비스': 'body', '군': 'stress' };
CS.STYLE_EMO = { stable: '🏠', challenge: '🔥', worth: '🤝', free: '🧭' };
CS.STYLE_COLORS = { stable: 'study', challenge: 'create', worth: 'body', free: 'exp' };
CS.ACTION_COLORS = { study: 'study', club: 'create', friend: 'social', sport: 'body', explore: 'exp', rest: 'rest' };
CS.ACTION_EMO = { special: '⭐', study: '📘', club: '🎪', friend: '🍜', sport: '⚽', explore: '🔭', rest: '😴' };
CS.SEM_COLORS = ['study', 'create', 'social', 'body', 'exp', 'rest'];

/* 학기별 상황 4장면 (학기당 시간 포인트 4개에 하나씩) */
CS.SITUATIONS = [
  [ { place: '1학년 교실', emo: '🏫', text: '입학 첫 주. 교복이 아직 어색하다. 종이 울렸다. 오늘 방과 후엔 뭘 하지?' },
    { place: '복도', emo: '🎪', text: '동아리 홍보 포스터가 복도에 가득하다. 선배들이 전단지를 나눠 준다.' },
    { place: '교실', emo: '📝', text: '첫 중간고사가 다가온다. 중학교 때와는 시험 범위부터 다르다.' },
    { place: '운동장', emo: '☀️', text: '여름방학이 코앞이다. 창밖으로 매미 소리가 들린다.' } ],
  [ { place: '등굣길', emo: '🍂', text: '2학기 시작. 이제 학교 가는 길이 익숙하다.' },
    { place: '강당', emo: '🎉', text: '축제 준비로 학교 전체가 들썩인다.' },
    { place: '방과 후 교실', emo: '🕔', text: '기말고사 2주 전. 종이 울리고 친구들이 하나둘 가방을 싼다. 오늘은 뭘 하지?' },
    { place: '교실', emo: '❄️', text: '겨울방학 전 마지막 주. 1학년이 벌써 끝나 간다.' } ],
  [ { place: '2학년 교실', emo: '🌸', text: '2학년이 됐다. 새 반, 새 시간표, 낯선 얼굴들.' },
    { place: '급식실', emo: '🍛', text: '후배가 생겼다. "선배"라고 불리는 게 아직 낯설다.' },
    { place: '교실', emo: '📚', text: '수행평가가 한꺼번에 몰려온다. 달력이 빨간 동그라미투성이다.' },
    { place: '교실', emo: '🌀', text: '더운 여름. 에어컨 바람 아래서 다들 축 늘어져 있다.' } ],
  [ { place: '진로실 앞', emo: '🧭', text: '2학년 2학기. 여기저기서 진로 이야기가 들리기 시작한다.' },
    { place: '교실', emo: '🚌', text: '수학여행에서 돌아온 뒤 나른한 오후.' },
    { place: '교실', emo: '📄', text: '모의고사 성적표가 나왔다. 교실이 조용해졌다.' },
    { place: '운동장', emo: '🌙', text: '올해의 마지막 달. 내년이면 고3이다.' } ],
  [ { place: '3학년 교실', emo: '🔥', text: '고3. 같은 교실인데 공기가 달라졌다.' },
    { place: '교무실', emo: '☕', text: '상담 주간. 담임 선생님이 "요즘 어떠니?" 하고 물으신다.' },
    { place: '교실', emo: '🥱', text: '6월. 체력이 바닥나기 시작한다. 책상에 엎드린 친구가 늘었다.' },
    { place: '빈 교실', emo: '🌻', text: '여름방학. 다들 각자의 자리로 흩어졌다.' } ],
  [ { place: '교실', emo: '🗓️', text: '마지막 학기. 달력에 표시가 하나씩 늘어난다.' },
    { place: '진로실', emo: '✉️', text: '원서 접수 기간. 친구들 표정이 저마다 다르다.' },
    { place: '교실', emo: '⏳', text: '결전의 날까지 한 달. 하루가 짧게 느껴진다.' },
    { place: '운동장', emo: '🎓', text: '큰 일정이 모두 끝났다. 졸업까지 며칠 남지 않았다.' } ]
];

/* 공통 활동의 상황형 문구 (장면마다 돌아가며 나옴) */
CS.ACTION_TEXT = {
  study:   ['야자 남아서 수학 문제집 풀기', '도서관에서 수행평가 준비하기', '인강 들으며 오답 노트 정리하기', '스터디카페에서 시험 범위 끝내기'],
  club:    ['동아리방에서 축제 부스 준비하기', '친구들과 짧은 영상 찍어 올리기', '공모전에 낼 아이디어 짜기', '동아리 발표회 무대 꾸미기'],
  friend:  ['친구랑 떡볶이 먹으러 가기', '친구 고민을 밤늦게까지 들어 주기', '반 친구들과 노래방 가기', '친구 생일 깜짝 파티 준비하기'],
  sport:   ['운동장에서 축구 한 판 뛰기', '저녁에 동네 한 바퀴 달리기', '체육관에서 배드민턴 치기', '점심시간에 농구 내기하기'],
  explore: ['진로 박람회 구경 가기', '관심 있는 일을 하는 선배 인터뷰하기', '대학 전공 체험 캠프 신청하기', '직업 다큐를 찾아보고 메모하기'],
  rest:    ['집에 가서 그냥 낮잠 자기', '이불 속에서 좋아하는 영상 몰아 보기', '아무 계획 없이 산책하기', '일찍 자고 푹 쉬기']
};

/* 학교별 특별 활동의 상황형 문구 */
CS.SPECIAL_TEXT = {
  general:      ['궁금했던 선택과목 깊게 파기', '선택과목 탐구 보고서 쓰기', '진로 연계 과목 수업 찾아 듣기'],
  sportsTalent: ['수업 끝나고 운동부 훈련하기', '주말 전지훈련 참가하기', '대회 앞두고 팀 호흡 맞추기'],
  peHigh:       ['새벽 훈련 한 번 더 하기', '체력 측정 기록 깨기', '전국체전 대비 실전 연습하기'],
  artHigh:      ['실기실에서 밤까지 소묘하기', '전시회에 낼 작품 완성하기', '입시 주제로 채색 연습하기'],
  danceHigh:    ['연습실 거울 앞에서 동작 반복하기', '정기 공연 안무 맞추기', '새로운 장르 워크숍 듣기'],
  aniHigh:      ['공모전에 낼 원고 콘티 짜기', '졸업 작품 애니메이션 작업하기', '캐릭터 디자인 100장 그리기'],
  aiHigh:       ['팀 프로젝트 코드 밤새 고치기', '인공지능 모델 직접 학습시켜 보기', '해커톤 대회 나가기'],
  langHigh:     ['전공어 원서 읽기 모임 하기', '외국 학생들과 화상 교류하기', '전공어 말하기 대회 준비하기'],
  sciHigh:      ['실험실에서 탐구 주제 실험하기', '심화 수학 문제 붙잡고 씨름하기', '과학 탐구 대회 보고서 쓰기'],
  vocHigh:      ['실습실에서 자격증 실기 연습하기', '현장 실습 나가 보기', '기능 대회 과제 만들기']
};

/* 지금 장면 번호 (0~3) */
CS.slotOf = function (g) { return Math.max(0, Math.min(3, CS.SEM_POINTS - g.points)); };
CS.situationOf = function (g) { return CS.SITUATIONS[g.sem - 1][CS.slotOf(g)]; };

/* 이번 장면에서 보여 줄 활동 문구 */
CS.actionText = function (g, actId) {
  var n = (g.sem - 1) * 4 + CS.slotOf(g);
  var list = (actId === 'special') ? CS.SPECIAL_TEXT[g.school] : CS.ACTION_TEXT[actId];
  return list[n % list.length];
};

/* 효과를 보고 선택지 색 정하기: 가장 먼저 오르는 능력치의 색 */
CS.colorOfEff = function (g, eff) {
  var e = CS.resolveEff(g, eff);
  var order = ['study', 'create', 'social', 'body', 'exp'];
  for (var i = 0; i < order.length; i++) { if (e[order[i]] > 0) { return order[i]; } }
  return (e.stress < 0) ? 'rest' : 'stress';
};
