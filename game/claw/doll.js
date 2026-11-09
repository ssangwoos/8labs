// 인형 그리기 (TV 화면·관리자 미리보기 공용)
window.DOLL_TYPES = [
  { kind: 'bear', body: '#C9946A', dark: '#A8744C', inner: '#F0D2B4' },
  { kind: 'bunny', body: '#F6F1EC', dark: '#DCD3CA', inner: '#FFB3C6' },
  { kind: 'cat', body: '#FFB15C', dark: '#E8913A', inner: '#FFE0BC' },
  { kind: 'chick', body: '#FFDF5E', dark: '#F2C230', inner: '#FF9F43' },
  { kind: 'bear', body: '#FF9EB7', dark: '#EF7C9B', inner: '#FFE0E8' },
  { kind: 'bear', body: '#8EDFC9', dark: '#5FC7AB', inner: '#E2FAF3' },
  { kind: 'cat', body: '#9AA7C7', dark: '#7887AB', inner: '#E3E8F5' },
];

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
window.rr = rr;

// d: {x, y, rot, type(index), img(Image|null), label}
window.drawDoll = function (ctx, d, scale) {
  const T = DOLL_TYPES[d.type % DOLL_TYPES.length];
  const s = scale || 1;
  ctx.save();
  ctx.translate(d.x, d.y);
  ctx.rotate(d.rot || 0);
  ctx.scale(s, s);

  // 그림자
  ctx.fillStyle = 'rgba(0,0,0,0.10)';
  ctx.beginPath(); ctx.ellipse(0, 62, 60, 10, 0, 0, Math.PI * 2); ctx.fill();

  // 발
  ctx.fillStyle = T.dark;
  ctx.beginPath(); ctx.ellipse(-30, 50, 24, 15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(30, 50, 24, 15, 0, 0, Math.PI * 2); ctx.fill();

  // 몸통
  ctx.fillStyle = T.body;
  ctx.beginPath(); ctx.ellipse(0, 4, 58, 54, 0, 0, Math.PI * 2); ctx.fill();

  // 귀
  ctx.fillStyle = T.body;
  if (T.kind === 'bear') {
    for (const sx of [-1, 1]) {
      ctx.fillStyle = T.body; ctx.beginPath(); ctx.arc(sx * 36, -116, 17, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = T.inner; ctx.beginPath(); ctx.arc(sx * 36, -116, 9, 0, Math.PI * 2); ctx.fill();
    }
  } else if (T.kind === 'bunny') {
    for (const sx of [-1, 1]) {
      ctx.save(); ctx.translate(sx * 20, -128); ctx.rotate(sx * 0.18);
      ctx.fillStyle = T.body; ctx.beginPath(); ctx.ellipse(0, -14, 14, 38, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = T.inner; ctx.beginPath(); ctx.ellipse(0, -12, 7, 28, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  } else if (T.kind === 'cat') {
    for (const sx of [-1, 1]) {
      ctx.fillStyle = T.body; ctx.beginPath(); ctx.moveTo(sx * 46, -100); ctx.lineTo(sx * 40, -140); ctx.lineTo(sx * 14, -122); ctx.closePath(); ctx.fill();
      ctx.fillStyle = T.inner; ctx.beginPath(); ctx.moveTo(sx * 40, -106); ctx.lineTo(sx * 37, -128); ctx.lineTo(sx * 22, -118); ctx.closePath(); ctx.fill();
    }
  } else if (T.kind === 'chick') {
    ctx.fillStyle = T.dark;
    ctx.beginPath(); ctx.ellipse(-6, -130, 6, 14, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(6, -132, 6, 14, 0.4, 0, Math.PI * 2); ctx.fill();
  }

  // 머리
  ctx.fillStyle = T.body;
  ctx.beginPath(); ctx.arc(0, -78, 50, 0, Math.PI * 2); ctx.fill();

  // 얼굴
  if (T.kind === 'bear' || T.kind === 'cat') {
    ctx.fillStyle = T.inner;
    ctx.beginPath(); ctx.ellipse(0, -64, 20, 15, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#2B2B3A';
  ctx.beginPath(); ctx.arc(-18, -84, 5.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(18, -84, 5.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-16, -86, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(20, -86, 1.8, 0, Math.PI * 2); ctx.fill();
  if (T.kind === 'chick') {
    ctx.fillStyle = T.inner;
    ctx.beginPath(); ctx.moveTo(-9, -72); ctx.lineTo(9, -72); ctx.lineTo(0, -62); ctx.closePath(); ctx.fill();
  } else {
    ctx.fillStyle = '#2B2B3A';
    ctx.beginPath(); ctx.ellipse(0, -70, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2B2B3A'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(-5, -65, 5, 0.2, Math.PI - 0.6); ctx.stroke();
    ctx.beginPath(); ctx.arc(5, -65, 5, 0.6, Math.PI - 0.2); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,120,150,0.45)';
  ctx.beginPath(); ctx.ellipse(-31, -68, 9, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(31, -68, 9, 6, 0, 0, Math.PI * 2); ctx.fill();

  // 안고 있는 제품
  const cw = 94, ch = 100;
  ctx.fillStyle = '#FFFFFF';
  rr(ctx, -cw / 2, -40, cw, ch, 14); ctx.fill();
  if (d.img && d.img.complete && d.img.naturalWidth) {
    const iw = d.img.naturalWidth, ih = d.img.naturalHeight;
    const k = Math.min((cw - 8) / iw, (ch - 8) / ih);
    const w = iw * k, h = ih * k;
    ctx.save(); rr(ctx, -cw / 2, -40, cw, ch, 14); ctx.clip();
    ctx.drawImage(d.img, -w / 2, -40 + ch / 2 - h / 2, w, h);
    ctx.restore();
  } else {
    ctx.fillStyle = '#FF5C8A';
    ctx.font = '800 20px Pretendard, "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('EIGHT', 0, 4);
  }

  // 팔 (제품을 감싸 안은 모양)
  ctx.fillStyle = T.body;
  ctx.save(); ctx.translate(-50, 14); ctx.rotate(-0.45);
  ctx.beginPath(); ctx.ellipse(0, 0, 17, 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(50, 14); ctx.rotate(0.45);
  ctx.beginPath(); ctx.ellipse(0, 0, 17, 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.fillStyle = T.dark;
  ctx.beginPath(); ctx.ellipse(-36, 34, 11, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(36, 34, 11, 9, 0, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
};
