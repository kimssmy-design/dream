/* ===== 엔딩 판정과 카드 이미지 만들기 ===== */
var CS = window.CS || {};
window.CS = CS;

/* 졸업 후 진로를 한 줄로 */
CS.pathText = function (g) {
  var p = g.path;
  var fname = CS.FIELDS[p.field].name;
  if (p.type === 'univ') {
    var uni = CS.findById(CS.UNIS, p.uni);
    var major = CS.findById(CS.MAJORS, p.major);
    return uni.name + ', ' + (major ? major.name : fname);
  }
  if (p.type === 'work') { return '졸업 후 바로 취업 (' + fname + ')'; }
  if (p.type === 'pro') { return '졸업 후 바로 현장으로 (' + fname + ')'; }
  return '나만의 길 만들기 (' + fname + ')';
};

/* 엔딩 계산: 직업은 분야와 삶의 방식으로, 평가는 가치관과의 어울림으로 */
CS.computeEnding = function (g) {
  var field = CS.FIELDS[g.path.field];
  var job = field.jobs[g.style];
  var style = CS.findById(CS.STYLES, g.style);
  var ready = CS.readiness(g, g.path.field);

  var level;
  if (ready >= CS.READY_HIGH) { level = '실력을 인정받는'; }
  else if (ready >= CS.READY_MID) { level = '자기 자리를 잡아 가는'; }
  else { level = '배우며 성장하고 있는'; }

  /* 이 삶이 채워 주는 가치 */
  var gives = style.values.slice();
  if (ready >= CS.READY_HIGH && gives.indexOf('fame') < 0) { gives.push('fame'); }
  if (g.stress >= 7) { gives = gives.filter(function (v) { return v !== 'rest'; }); }

  var matched = [], missed = [];
  for (var i = 0; i < g.values.length; i++) {
    var v = CS.findById(CS.VALUES, g.values[i]);
    if (gives.indexOf(v.id) >= 0) { matched.push(v.name); } else { missed.push(v.name); }
  }

  var fitText;
  if (matched.length === 2) {
    fitText = '내가 중요하게 여긴 두 가지(' + matched.join(', ') + ')가 모두 지금의 삶에 담겨 있어요.';
  } else if (matched.length === 1) {
    fitText = '두 가지 중 하나(' + matched[0] + ')는 지금의 삶에 담겨 있고, 다른 하나(' + missed[0] + ')는 아직 채우는 중이에요.';
  } else {
    fitText = '처음에 중요하다고 했던 두 가지(' + missed.join(', ') + ')와는 조금 다른 방향으로 걷고 있어요. 길은 언제든 다시 고를 수 있어요.';
  }

  var stressText;
  if (g.stress >= 7) { stressText = '몸과 마음이 많이 지쳐 있어요. 쉬는 것도 실력이에요.'; }
  else if (g.stress <= 3) { stressText = '일과 쉼의 균형을 잘 지키고 있어요.'; }
  else { stressText = '바쁘지만 버틸 만해요.'; }

  var school = CS.schoolOf(g);
  var lines = [school.name + (g.specialty ? ' (' + g.specialty + ')' : '')];
  if (g.gapUsed) { lines.push('1년 동안 쉬며 진로 탐색'); }
  if (g.retried) { lines.push('불합격 뒤 1년 더 준비해 재도전'); }
  lines.push(CS.pathText(g));
  if (g.path.changed) { lines.push('20대에 분야를 바꿈'); }

  return {
    jobName: job[0], desc: job[1], level: level, title: level + ' ' + job[0],
    fieldName: field.name, fitCount: matched.length, fitText: fitText,
    stressText: stressText, pathLines: lines
  };
};

/* 글자를 너비에 맞춰 줄바꿈하며 그리기 (띄어쓰기에서 먼저 끊고, 한 단어가 너무 길면 글자 단위로 끊음).
   마지막 y 좌표를 돌려줌 */
function wrapText(ctx, text, x, y, maxW, lineH, maxLines) {
  var words = String(text).split(' '), lines = [], line = '';
  for (var i = 0; i < words.length; i++) {
    var w = words[i];
    var test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width <= maxW) { line = test; continue; }
    if (line) { lines.push(line); line = ''; }
    while (ctx.measureText(w).width > maxW) {
      var cut = w.length - 1;
      while (cut > 1 && ctx.measureText(w.slice(0, cut)).width > maxW) { cut -= 1; }
      lines.push(w.slice(0, cut)); w = w.slice(cut);
    }
    line = w;
  }
  if (line) { lines.push(line); }
  if (maxLines && lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1) + '…';
  }
  for (var j = 0; j < lines.length; j++) { ctx.fillText(lines[j], x, y); y += lineH; }
  return y;
}

/* 엔딩 카드를 그림(캔버스)으로 그리기. 사진을 불러와야 해서 다 그린 뒤 done(canvas) 을 부름 */
CS.drawCard = function (g, e, done) {
  var W = 1080, H = 1350, L = 90, MW = W - 180;
  var FONT = '"Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif';
  var c = document.createElement('canvas');
  c.width = W; c.height = H;
  var x = c.getContext('2d');
  var band = CS.COLOR_HEX[CS.FIELDS[g.path.field].keys[0]] || '#eee';

  x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  x.fillStyle = band; x.fillRect(36, 36, W - 72, 270);
  x.strokeStyle = '#000'; x.lineWidth = 6;
  x.strokeRect(36, 36, W - 72, H - 72);
  x.beginPath(); x.moveTo(36, 306); x.lineTo(W - 36, 306); x.stroke();
  x.textBaseline = 'top';

  function drawRest() {
    x.fillStyle = '#000';
    x.font = '34px ' + FONT; x.fillText('15년 뒤의 나', L + 200, 110);
    x.font = 'bold 60px ' + FONT; x.fillText(g.name, L + 200, 165);

    x.font = 'bold 62px ' + FONT;
    var y = wrapText(x, e.title, L, 350, MW, 78, 2);
    x.font = '36px ' + FONT; x.fillStyle = '#333';
    y = wrapText(x, e.desc, L, y + 10, MW, 50, 2);

    y += 24; x.fillStyle = '#000'; x.fillRect(L, y, MW, 3); y += 30;
    x.font = 'bold 32px ' + FONT; x.fillText('걸어온 길', L, y); y += 48;
    x.font = '32px ' + FONT; x.fillStyle = '#333';
    for (var i = 0; i < e.pathLines.length; i++) { y = wrapText(x, '· ' + e.pathLines[i], L, y, MW, 44, 1); }

    y += 20; x.fillStyle = '#000';
    x.font = 'bold 32px ' + FONT; x.fillText('내가 중요하게 여긴 것', L, y); y += 48;
    x.font = '32px ' + FONT; x.fillStyle = '#333';
    y = wrapText(x, e.fitText, L, y, MW, 44, 3);

    y += 20; x.fillStyle = '#000';
    x.font = 'bold 32px ' + FONT; x.fillText('이번 겨울에 해 볼 한 가지', L, y); y += 48;
    x.font = '32px ' + FONT; x.fillStyle = '#333';
    wrapText(x, g.reflect.b || '(아직 적지 않았어요)', L, y, MW, 44, 3);

    x.font = '26px ' + FONT; x.fillStyle = '#888';
    x.fillText('나의 다음 페이지 - 진로 설계 게임', L, H - 110);
    done(c);
  }

  /* 얼굴: 동그란 테두리 안에 사진 또는 이모지 */
  var cx = L + 85, cy = 171, r = 85;
  function ring() { x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.lineWidth = 6; x.strokeStyle = '#000'; x.stroke(); }
  function emojiFace() {
    x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fillStyle = '#fff'; x.fill(); ring();
    x.fillStyle = '#000'; x.font = '100px ' + FONT; x.textAlign = 'center';
    x.fillText(g.avatar, cx, cy - 55); x.textAlign = 'left';
    drawRest();
  }
  if (g.photo) {
    var img = new Image();
    img.onload = function () {
      x.save(); x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip();
      x.drawImage(img, cx - r, cy - r, r * 2, r * 2); x.restore(); ring();
      drawRest();
    };
    img.onerror = emojiFace;
    img.src = g.photo;
  } else { emojiFace(); }
};
