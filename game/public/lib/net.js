// 폰 ↔ TV ↔ 관리자 통신 (MQTT 중계). 나중에 Firebase 등으로 바꿀 때는 이 파일만 교체하면 됩니다.
(function () {
  const qs = new URLSearchParams(location.search);
  const cfg = window.EIGHT || {};
  const room = qs.get('room') || cfg.room;
  const broker = qs.get('broker') || cfg.broker;
  const base = 'eight/claw/' + room;
  window.Net = {
    room, broker, base,
    T: { up: base + '/up', down: base + '/down', tv: base + '/tv', settings: base + '/settings', prod: base + '/p/', log: base + '/log' },
    connect(opts) {
      const id = (opts.prefix || 'c') + '-' + Math.random().toString(36).slice(2, 10);
      const o = { clientId: id, keepalive: 20, reconnectPeriod: 1500, connectTimeout: 8000, clean: true };
      if (opts.will) o.will = { topic: opts.will.topic, payload: JSON.stringify(opts.will.payload), retain: true, qos: 1 };
      const c = mqtt.connect(broker, o);
      this.client = c;
      c.on('connect', () => { c.subscribe(opts.subscribe || [], { qos: 0 }); opts.onStatus && opts.onStatus(true); });
      c.on('close', () => opts.onStatus && opts.onStatus(false));
      c.on('offline', () => opts.onStatus && opts.onStatus(false));
      c.on('message', (topic, buf) => {
        const s = buf.toString();
        let m = null; if (s) { try { m = JSON.parse(s); } catch { return; } }
        opts.onMessage && opts.onMessage(topic, m);
      });
      return c;
    },
    pub(topic, obj, retain) {
      if (!this.client) return;
      this.client.publish(topic, obj === null ? '' : JSON.stringify(obj), { qos: retain ? 1 : 0, retain: !!retain });
    },
  };
  // PIN 해시 (공개 채널에 원문 PIN을 올리지 않기 위함 · 모든 기기에서 같은 값이 나오도록 순수 JS)
  window.pinHash = async function (pin) {
    const str = 'eight-salt:' + room + ':' + pin;
    let h1 = 0x811c9dc5, h2 = 0x01000193;
    for (let r = 0; r < 500; r++) for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i) + r;
      h1 = Math.imul(h1 ^ c, 16777619) >>> 0; h2 = Math.imul(h2 + c, 2246822519) >>> 0; h2 = (h2 ^ (h2 >>> 13)) >>> 0;
    }
    return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
  };
})();
