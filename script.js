/* ============================================================
   💕 РОМАНТИЧЕСКИЙ САЙТ ДЛЯ НИКОЛЬ 💜
   Все настройки — в блоке SETTINGS ниже.
   ============================================================ */

'use strict';

/* ============================================================
   ⚙️  НАСТРОЙКИ — РЕДАКТИРУЙ ЗДЕСЬ
   ============================================================ */

const SETTINGS = {

    // ──────────────────────────────────────────────
    // ⏱️  ДАТА И ВРЕМЯ СОБЫТИЯ
    // ──────────────────────────────────────────────
    // Формат: new Date(ГОД, МЕСЯЦ, ДЕНЬ, ЧАС, МИНУТА, СЕКУНДА)
    // ⚠️ Месяц с НУЛЯ: 0=янв, 9=окт, 11=дек
    TARGET_DATE: new Date(2026, 9, 1, 15, 0, 0),


    // ──────────────────────────────────────────────
    // 💌  ТЕКСТ ПИСЬМА ДЛЯ НИКОЛЬ
    // ──────────────────────────────────────────────
    // ⚠️ НЕ используй символ ` (обратная кавычка) внутри текста.
    LETTER_TEXT:
`Милая Николь,

Я так тебя люблю, прям ваще, ты такая милая, люблю тебя, прям ваще, я даже не могу словами описать как сильно я тебя люблю.

Ты такая лапочка, у тебя прекрасные глазки, прекрасный характер, самый красивый в мире голос, ты самая красивая, и вообщее ты самая самая, я так тебя люблю, даже не знаю как словами описать.

Я очень тебя люблю! 💜

Понимаю, что мы не увижимся 4 дня, но хочу тебе лтличной поездки и классно провести время. Ты у меня самая лучшя девушка, которую я знаю. 💜

Спасибо, что ты есть. Пусть каждый твой день будет наполнен теплом, улыбками и чем-то волшебным.

С любовью,
Ярик (Бублик) 💜`,


    // ──────────────────────────────────────────────
    // ✉️  НАДПИСИ НА КОНВЕРТЕ
    // ──────────────────────────────────────────────
    ENVELOPE_TO:   'Для Николь',
    ENVELOPE_FROM: 'От Ярика (Бублика) 💜',


    // ──────────────────────────────────────────────
    // 📝  ТЕКСТЫ НА ЭКРАНАХ
    // ──────────────────────────────────────────────
    TIMER_SUBTITLE:    'До особенного момента с тобой',
    TIMER_TITLE:       'Осталось совсем чуть-чуть',
    BOUQUET_CAPTION:   'Это всё — для тебя 💐',
    FINGERPRINT_TITLE: 'Только для тебя',
    FINGERPRINT_TEXT:  'Приложи палец и удерживай, чтобы открыть 💜',


    // ──────────────────────────────────────────────
    // ⚙️  ПАРАМЕТРЫ
    // ──────────────────────────────────────────────
    TYPE_SPEED: 45,   // мс на символ (30 = быстрее, 80 = медленнее)
    HOLD_TIME:  1500, // удержание отпечатка (мс)
};


/* ============================================================
   🚀  ЛОГИКА — НИЖЕ ТРОГАТЬ НЕ НУЖНО
   ============================================================ */


// ============ ПРИМЕНЕНИЕ ТЕКСТОВ ИЗ SETTINGS ============
function applySettings() {
    const envTo = document.getElementById('envelopeTo');
    const envFrom = document.getElementById('envelopeFrom');
    if (envTo) envTo.textContent = SETTINGS.ENVELOPE_TO;
    if (envFrom) envFrom.textContent = SETTINGS.ENVELOPE_FROM;

    const subtitle = document.querySelector('.subtitle');
    const title = document.querySelector('.title');
    if (subtitle) subtitle.textContent = SETTINGS.TIMER_SUBTITLE;
    if (title) title.innerHTML = SETTINGS.TIMER_TITLE + '<span class="dots">...</span>';

    const caption = document.querySelector('.bouquet-caption');
    if (caption) caption.textContent = SETTINGS.BOUQUET_CAPTION;

    const fpTitle = document.querySelector('.fingerprint-title');
    const fpText = document.querySelector('.fingerprint-text');
    if (fpTitle) fpTitle.textContent = SETTINGS.FINGERPRINT_TITLE;
    if (fpText) fpText.textContent = SETTINGS.FINGERPRINT_TEXT;
}


// ============ ЧАСТИЦЫ-СЕРДЕЧКИ ============
(function initParticles() {
    const container = document.getElementById('particles');
    const symbols = ['💗', '💕', '💜', '💖', '💘', '🌸', '✨', '❤️', '🤍', '💝'];
    for (let i = 0; i < 30; i++) {
        const el = document.createElement('div');
        el.className = 'particle';
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (12 + Math.random() * 20) + 'px';
        el.style.animationDuration = (12 + Math.random() * 18) + 's';
        el.style.animationDelay = (-Math.random() * 25) + 's';
        container.appendChild(el);
    }
})();


// ============ УПРАВЛЕНИЕ ЭТАПАМИ ============
let currentStageId = 'stage-timer';
let isTransitioning = false;

function gotoStage(nextId) {
    if (isTransitioning) return;
    const next = document.getElementById(nextId);
    if (!next) {
        console.error('Не найдена секция:', nextId);
        return;
    }
    if (nextId === currentStageId && next.classList.contains('active')) return;

    isTransitioning = true;
    const current = document.querySelector('.stage.active');

    if (current) {
        current.classList.add('leaving');
        setTimeout(() => {
            current.classList.remove('active', 'leaving');
            current.style.display = 'none';
        }, 700);
    }

    setTimeout(() => {
        next.style.display = 'flex';
        void next.offsetWidth;
        next.classList.add('active');
        currentStageId = nextId;
        isTransitioning = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onStageEnter(nextId);
    }, current ? 700 : 50);
}

function onStageEnter(stageId) {
    switch (stageId) {
        case 'stage-bouquet':     startBouquetSequence(); break;
        case 'stage-fingerprint': initFingerprint();      break;
        case 'stage-envelope':    initEnvelope();         break;
        case 'stage-letter':      initLetter();           break;
    }
}


// ============ ЭТАП 1: ТАЙМЕР ============
(function initTimer() {
    const els = {
        days:    document.getElementById('days'),
        hours:   document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
    };

    const pad = (n) => String(n).padStart(2, '0');

    function pulse(el) {
        if (!el) return;
        el.classList.add('pulse');
        setTimeout(() => el.classList.remove('pulse'), 250);
    }

    let intervalId = null;
    let triggered = false;

    function update() {
        const now = new Date();
        const diff = SETTINGS.TARGET_DATE - now;

        if (diff <= 0 || triggered) {
            if (triggered) return;
            triggered = true;
            if (intervalId) clearInterval(intervalId);
            setTimeout(() => gotoStage('stage-bouquet'), 400);
            return;
        }

        const days    = Math.floor(diff / 86400000);
        const hours   = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        const newVals = {
            days: pad(days), hours: pad(hours),
            minutes: pad(minutes), seconds: pad(seconds)
        };

        for (const k in newVals) {
            if (els[k] && els[k].textContent !== newVals[k]) {
                els[k].textContent = newVals[k];
                pulse(els[k]);
            }
        }
    }

    if (Date.now() >= SETTINGS.TARGET_DATE.getTime()) {
        setTimeout(() => gotoStage('stage-bouquet'), 500);
        return;
    }

    update();
    intervalId = setInterval(update, 1000);
})();


// ============ ЭТАП 2: БУКЕТ ============
function startBouquetSequence() {
    const bouquetSvg = document.querySelector('.bouquet-svg');
    const peonies = document.querySelectorAll('.peony-group');

    // Сброс (на случай перезапуска)
    peonies.forEach(g => g.classList.remove('bloom'));
    if (bouquetSvg) bouquetSvg.classList.remove('swaying');

    // Запускаем распускание пионов по очереди
    peonies.forEach((group, index) => {
        const baseDelay = 1400;
        const delay = baseDelay + index * 400;
        setTimeout(() => group.classList.add('bloom'), delay);
    });

    // Покачивание после полного раскрытия
    const totalBloomTime = 1400 + peonies.length * 400 + 800;
    setTimeout(() => {
        if (bouquetSvg) bouquetSvg.classList.add('swaying');
    }, totalBloomTime);

    // Переход дальше
    setTimeout(() => {
        gotoStage('stage-fingerprint');
    }, totalBloomTime + 1600);
}


// ============ ЭТАП 3: ОТПЕЧАТОК ============
let fingerprintInitialized = false;

function initFingerprint() {
    const container = document.getElementById('fingerprintContainer');
    const ring = document.getElementById('ringFg');
    const SVG_CIRC = 2 * Math.PI * 100;

    ring.style.strokeDasharray = SVG_CIRC;
    ring.style.strokeDashoffset = SVG_CIRC;

    const HOLD_DURATION = SETTINGS.HOLD_TIME;
    let progress = 0;
    let startTime = 0;
    let rafId = null;
    let active = false;
    let completed = false;

    function start(e) {
        if (completed) return;
        if (e && e.cancelable) e.preventDefault();
        active = true;
        container.classList.add('pressed');
        startTime = performance.now() - progress * HOLD_DURATION;
        tick();
    }

    function tick() {
        if (!active) return;
        const elapsed = performance.now() - startTime;
        progress = Math.min(elapsed / HOLD_DURATION, 1);
        ring.style.strokeDashoffset = SVG_CIRC * (1 - progress);
        if (progress >= 1) { complete(); return; }
        rafId = requestAnimationFrame(tick);
    }

    function reset() {
        active = false;
        container.classList.remove('pressed');
        if (rafId) cancelAnimationFrame(rafId);
        if (completed) return;
        progress = 0;
        ring.style.strokeDashoffset = SVG_CIRC;
    }

    function complete() {
        completed = true;
        active = false;
        container.classList.remove('pressed');

        if (navigator.vibrate) navigator.vibrate([30, 40, 60, 40, 80]);

        const flash = document.createElement('div');
        Object.assign(flash.style, {
            position: 'fixed', inset: '0',
            background: 'radial-gradient(circle, rgba(255, 214, 232, 0.95), rgba(212, 86, 143, 0.7) 40%, transparent 70%)',
            zIndex: '999', pointerEvents: 'none', opacity: '0',
            transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        });
        document.body.appendChild(flash);

        for (let i = 0; i < 12; i++) {
            const h = document.createElement('div');
            const hearts = ['💗', '💕', '💜', '💖'];
            h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            Object.assign(h.style, {
                position: 'fixed', left: '50%', top: '50%',
                fontSize: (16 + Math.random() * 16) + 'px',
                pointerEvents: 'none', zIndex: '1000', opacity: '0',
                transition: 'all 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
            });
            document.body.appendChild(h);
            requestAnimationFrame(() => {
                h.style.opacity = '1';
                h.style.transform = `translate(${(Math.random() - 0.5) * 300}px, ${-100 - Math.random() * 200}px) rotate(${(Math.random() - 0.5) * 180}deg)`;
            });
            setTimeout(() => {
                h.style.opacity = '0';
                setTimeout(() => h.remove(), 600);
            }, 900 + Math.random() * 400);
        }

        requestAnimationFrame(() => { flash.style.opacity = '1'; });
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 600);
        }, 250);

        setTimeout(() => gotoStage('stage-envelope'), 1000);
    }

    if (!fingerprintInitialized) {
        fingerprintInitialized = true;
        container.addEventListener('mousedown', start);
        container.addEventListener('touchstart', start, { passive: false });
        document.addEventListener('mouseup', reset);
        document.addEventListener('touchend', reset);
        document.addEventListener('touchcancel', reset);
        container.addEventListener('mouseleave', () => { if (active) reset(); });
    }
}


// ============ ЭТАП 4: КОНВЕРТ ============
let envelopeInitialized = false;

function initEnvelope() {
    const envelope = document.getElementById('envelope');
    const btn = document.getElementById('btnOpen');

    if (!envelopeInitialized) {
        envelopeInitialized = true;
        btn.addEventListener('click', () => {
            if (envelope.classList.contains('open')) return;
            envelope.classList.add('open');
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0';
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => gotoStage('stage-letter'), 1900);
        });
    }
}


// ============ ЭТАП 5: ПИСЬМО ============
let letterTimer = null;

function initLetter() {
    const textEl = document.getElementById('letterText');
    const signature = document.getElementById('letterSignature');
    const waxSeal = document.querySelector('.wax-seal');

    if (letterTimer) { clearTimeout(letterTimer); letterTimer = null; }
    textEl.textContent = '';
    textEl.classList.remove('done');
    signature.classList.remove('show');
    waxSeal.classList.remove('show');

    const message = SETTINGS.LETTER_TEXT;
    const SPEED = SETTINGS.TYPE_SPEED;
    let i = 0;

    function typeNext() {
        if (i < message.length) {
            textEl.textContent += message[i];
            i++;
            let delay = SPEED;
            const ch = message[i - 1];
            if (ch === '\n') delay = SPEED * 6;
            else if ('.!?'.includes(ch)) delay = SPEED * 5;
            else if (','.includes(ch)) delay = SPEED * 3;
            letterTimer = setTimeout(typeNext, delay);
        } else {
            textEl.classList.add('done');
            setTimeout(() => signature.classList.add('show'), 400);
            setTimeout(() => waxSeal.classList.add('show'), 1800);
        }
    }

    letterTimer = setTimeout(typeNext, 900);
}


// ============ КНОПКА ПЕРЕЗАПУСКА ============
document.getElementById('btnRestart').addEventListener('click', () => {
    if (letterTimer) { clearTimeout(letterTimer); letterTimer = null; }
    const textEl = document.getElementById('letterText');
    textEl.textContent = '';
    textEl.classList.remove('done');
    document.getElementById('letterSignature').classList.remove('show');
    document.querySelector('.wax-seal').classList.remove('show');

    document.getElementById('envelope').classList.remove('open');
    const btnOpen = document.getElementById('btnOpen');
    btnOpen.style.pointerEvents = '';
    btnOpen.style.opacity = '';
    btnOpen.style.transform = '';
    envelopeInitialized = false;

    const ring = document.getElementById('ringFg');
    if (ring) ring.style.strokeDashoffset = 2 * Math.PI * 100;
    fingerprintInitialized = false;

    // Сброс букета
    document.querySelectorAll('.peony-group').forEach(g => g.classList.remove('bloom'));
    const bouquetSvg = document.querySelector('.bouquet-svg');
    if (bouquetSvg) bouquetSvg.classList.remove('swaying');
    document.querySelectorAll('.stem, .leaf').forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
    });

    gotoStage('stage-timer');
});


// ============ ФОНОВАЯ МУЗЫКА ============
(function initMusic() {
    const btn = document.getElementById('musicBtn');
    const icon = document.getElementById('musicIcon');

    let audioCtx = null;
    let playing = false;

    const melody = [
        [523.25, 0.0, 1.6], [659.25, 0.4, 1.6], [783.99, 0.8, 1.6], [1046.5, 1.2, 1.8],
        [493.88, 2.5, 1.6], [587.33, 2.9, 1.6], [739.99, 3.3, 1.6], [987.77, 3.7, 1.8],
        [440.00, 5.0, 1.6], [523.25, 5.4, 1.6], [659.25, 5.8, 1.6], [880.00, 6.2, 1.8],
        [392.00, 7.5, 1.6], [493.88, 7.9, 1.6], [587.33, 8.3, 1.6], [783.99, 8.7, 2.0],
    ];
    const bassLine = [
        [130.81, 0.0, 2.5], [123.47, 2.5, 2.5], [110.00, 5.0, 2.5], [98.00, 7.5, 2.5],
    ];

    function scheduleLoop() {
        if (!playing) return;
        const now = audioCtx.currentTime;
        melody.forEach(([f, s, d]) => playNote(now + s, f, d, 0.06, 'triangle'));
        bassLine.forEach(([f, s, d]) => playNote(now + s, f, d, 0.04, 'sine'));
        setTimeout(() => { if (playing) scheduleLoop(); }, 10500);
    }

    function playNote(when, freq, dur, vol, type) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, when);
        gain.gain.linearRampToValueAtTime(vol, when + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(when);
        osc.stop(when + dur + 0.1);
    }

    btn.addEventListener('click', () => {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        playing = !playing;
        btn.classList.toggle('playing', playing);
        icon.textContent = playing ? '♫' : '♪';
        if (playing) scheduleLoop();
    });
})();


// ============ ЗАПУСК ============
window.addEventListener('DOMContentLoaded', () => {
    applySettings();

    document.querySelectorAll('.stage').forEach(s => {
        if (!s.classList.contains('active')) s.style.display = 'none';
    });

    if (Date.now() >= SETTINGS.TARGET_DATE.getTime()) {
        setTimeout(() => gotoStage('stage-bouquet'), 300);
    }
});