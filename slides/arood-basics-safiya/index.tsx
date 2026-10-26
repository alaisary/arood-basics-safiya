import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';
import camel from './assets/camel.jpg';
import cheetah from './assets/cheetah.jpg';
import feather from './assets/feather.jpg';
import kAvatar from './assets/k-avatar.jpg';
import kClap from './assets/k-clap.jpg';
import kFinger from './assets/k-finger.jpg';
import kListen from './assets/k-listen.jpg';
import kPoint from './assets/k-point.jpg';
import kScale from './assets/k-scale.jpg';
import kScroll from './assets/k-scroll.jpg';
import kThink from './assets/k-think.jpg';
import kWelcome from './assets/k-welcome.jpg';
import kWrite from './assets/k-write.jpg';
import oman from './assets/oman.jpg';
import rope from './assets/rope.jpg';
import souk from './assets/souk.jpg';
import tent from './assets/tent.jpg';

export const design: DesignSystem = {
  palette: { bg: '#F6EDDA', text: '#2A2233', accent: '#D99A1E' },
  fonts: {
    display: '"Aref Ruqaa", "Amiri", serif',
    body: '"Tajawal", "Segoe UI", Tahoma, sans-serif',
  },
  typeScale: { hero: 150, body: 32 },
  radius: 22,
};

const C = {
  indigo: '#24305E',
  indigoDeep: '#1A2347',
  terra: '#B4532A',
  teal: '#1E7A70',
  red: '#C0392B',
  paper: '#FFFDF5',
  line: '#D3DFEB',
  margin: '#E08A86',
  sand: '#E9DCC0',
  soft: '#5A4E5F',
  gold: '#D99A1E',
  goldSoft: '#F8E2A6',
  cream: '#FBF5E6',
};
const VERSE = '"Amiri", serif';

// ── Webfonts + keyframes (injected once, keyed to this slide) ──────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Aref+Ruqaa:wght@700&family=Tajawal:wght@400;500;700;800&display=swap';
const FONT_LINK_ID = 'osd-webfont-arood-basics';
const STYLE_ID = 'osd-styles-arood-basics';
const css = `
@keyframes ar-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes ar-pop { 0% { transform: scale(.85); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
@keyframes ar-shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }
@keyframes ar-beat { 0% { transform: scale(1) } 40% { transform: scale(1.18) } 100% { transform: scale(1) } }
.ar-bob { animation: ar-bob 5s ease-in-out infinite; }
.ar-pop { animation: ar-pop .35s cubic-bezier(.22,1,.36,1) both; }
.ar-shake { animation: ar-shake .3s ease-in-out 2; }
.ar-beat { animation: ar-beat .22s ease-out; }
.ar-btn:hover { filter: brightness(1.06); }
.ar-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(0,0,0,.25) !important; }
[data-still] .ar-bob, [data-still] .ar-pop, [data-still] .ar-shake, [data-still] .ar-beat { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .ar-bob, .ar-pop, .ar-shake, .ar-beat { animation: none !important; } }
`;
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== css) style.textContent = css;
}

export const transition: SlideTransition = {
  duration: 240,
  enter: {
    duration: 240,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// ── Rhythm audio (WebAudio, no files) ─────────────────────────────────────
// A pattern is a string of S (متحرك لا يليه ساكن: ٮ) and L (متحرك يليه ساكن: -).
let audioCtx: AudioContext | null = null;
function getAudio() {
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}
function hit(at: number, long: boolean) {
  const a = getAudio();
  const end = at + (long ? 0.38 : 0.2);
  // Mid-range drum-like tone so it carries on laptop and projector speakers.
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(long ? 520 : 880, at);
  o.frequency.exponentialRampToValueAtTime(long ? 330 : 600, end);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(0.6, at + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, end);
  o.connect(g).connect(a.destination);
  o.start(at);
  o.stop(end + 0.02);
  // Short noise click for a crisp attack.
  const len = Math.floor(a.sampleRate * 0.03);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const n = a.createBufferSource();
  const ng = a.createGain();
  ng.gain.value = 0.35;
  n.buffer = buf;
  n.connect(ng).connect(a.destination);
  n.start(at);
}
function useRhythm() {
  const [pos, setPos] = useState(-1);
  const [playing, setPlaying] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const play = async (pattern: string, key: string) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const a = getAudio();
    if (a.state !== 'running') await a.resume().catch(() => {});
    const start = a.currentTime + 0.05;
    let t = 0;
    setPlaying(key);
    [...pattern].forEach((ch, i) => {
      const long = ch === 'L';
      hit(start + t, long);
      timers.current.push(window.setTimeout(() => setPos(i), (t + 0.05) * 1000));
      t += long ? 0.46 : 0.24;
    });
    timers.current.push(
      window.setTimeout(() => {
        setPos(-1);
        setPlaying(null);
      }, (t + 0.25) * 1000),
    );
  };
  return { pos, playing, play };
}

const toAr = (n: number) => n.toLocaleString('ar-EG');

// ── Shared building blocks ────────────────────────────────────────────────
function Tap({
  onClick,
  children,
  state = 'idle',
  style,
}: {
  onClick?: () => void;
  children: ReactNode;
  state?: 'idle' | 'on' | 'right' | 'wrong' | 'ghost';
  style?: CSSProperties;
}) {
  const bg = {
    idle: C.cream,
    on: C.gold,
    right: C.teal,
    wrong: C.red,
    ghost: 'rgba(251,245,230,.12)',
  }[state];
  const fg = state === 'idle' || state === 'on' ? C.indigo : C.cream;
  return (
    <button
      type="button"
      className={`ar-btn${state === 'wrong' ? ' ar-shake' : ''}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      style={{
        font: 'inherit',
        border: state === 'ghost' ? '2px dashed rgba(251,245,230,.5)' : 'none',
        cursor: 'pointer',
        borderRadius: 16,
        padding: '12px 24px',
        fontSize: 28,
        fontWeight: 700,
        background: bg,
        color: fg,
        boxShadow: state === 'ghost' ? 'none' : '0 5px 0 rgba(0,0,0,.28)',
        transition: 'background .2s, transform .1s',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Header({ kicker, title, avatar }: { kicker: string; title: string; avatar?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, height: 116 }}>
      {avatar && (
        <img
          src={kAvatar}
          alt="الخليل"
          style={{
            width: 104,
            height: 104,
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: '50% 30%',
            border: `5px solid ${C.gold}`,
            boxShadow: '0 6px 16px rgba(36,48,94,.18)',
          }}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 26,
            fontWeight: 700,
            color: C.terra,
          }}
        >
          <span
            style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--osd-accent)' }}
          />
          {kicker}
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--osd-font-display)',
            fontSize: 68,
            lineHeight: 1.1,
            color: C.indigo,
            fontWeight: 700,
          }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}

function Notebook({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'relative',
        background: `repeating-linear-gradient(to bottom, transparent 0 47px, ${C.line} 47px 48px) 0 20px / 100% 100% no-repeat, ${C.paper}`,
        borderRadius: 'var(--osd-radius)',
        boxShadow: '0 14px 30px rgba(42,34,51,.12), 0 2px 0 rgba(42,34,51,.06)',
        padding: '20px 104px 20px 44px',
        fontSize: 30,
        lineHeight: '48px',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{ position: 'absolute', top: 0, bottom: 0, right: 76, width: 3, background: C.margin }}
      />
      <Hole top="16%" />
      <Hole top="48%" />
      <Hole top="80%" />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

function Hole({ top }: { top: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 26,
        top,
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: 'var(--osd-bg)',
        boxShadow: 'inset 0 3px 5px rgba(42,34,51,.25)',
      }}
    />
  );
}

function Note({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        background: C.goldSoft,
        borderRight: `10px solid ${C.gold}`,
        borderRadius: 14,
        padding: '12px 22px',
        fontSize: 28,
        lineHeight: 1.5,
        color: C.indigoDeep,
        boxShadow: '0 6px 14px rgba(217,154,30,.18)',
        ...style,
      }}
    >
      <svg width="30" height="38" viewBox="0 0 30 38" style={{ flex: 'none', marginTop: 4 }}>
        <circle cx="15" cy="11" r="10" fill={C.terra} />
        <circle cx="12" cy="8" r="3" fill="#fff" opacity=".55" />
        <path d="M15 20 L15 37" stroke={C.soft} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div>
        <b style={{ color: C.terra }}>ملاحظة: </b>
        {children}
      </div>
    </div>
  );
}

function Activity({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        height: 300,
        flex: 'none',
        background: `linear-gradient(135deg, ${C.indigo}, ${C.indigoDeep})`,
        borderRadius: 28,
        padding: '22px 40px 26px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        color: C.cream,
        boxShadow: '0 16px 30px rgba(26,35,71,.25)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span
          style={{
            background: 'var(--osd-accent)',
            color: C.indigoDeep,
            fontWeight: 800,
            fontSize: 24,
            padding: '6px 18px',
            borderRadius: 999,
          }}
        >
          نشاط تفاعلي
        </span>
        <span style={{ fontSize: 30, fontWeight: 700 }}>{title}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 24, minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}

function Footer() {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 22,
        left: 110,
        right: 110,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 22,
        color: C.soft,
        fontWeight: 500,
      }}
    >
      <span>أساسيات في علم العروض · أ. صفية الحارثية</span>
      <span style={{ fontWeight: 700, color: C.indigo }}>
        {toAr(current)} / {toAr(total)}
      </span>
    </div>
  );
}

function Shell({
  kicker,
  title,
  figure,
  avatar,
  children,
  activity,
}: {
  kicker: string;
  title: string;
  figure?: string;
  avatar?: boolean;
  children: ReactNode;
  activity?: ReactNode;
}) {
  const active = useIsActivePage();
  return (
    <div
      data-still={active ? undefined : ''}
      style={{
        width: '100%',
        height: '100%',
        background:
          'radial-gradient(1200px 600px at 85% -10%, rgba(217,154,30,.16), transparent 60%), var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: 'var(--osd-font-body)',
        direction: 'rtl',
        position: 'relative',
        padding: '52px 110px 72px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div style={{ display: 'flex', gap: 36, ...(activity ? { height: 632, flex: 'none' } : { flex: 1, minHeight: 0 }) }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Header kicker={kicker} title={title} avatar={avatar} />
          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 28 }}>{children}</div>
        </div>
        {figure && <Figure src={figure} />}
      </div>
      {activity}
      <Footer />
    </div>
  );
}

function Figure({ src }: { src: string }) {
  return (
    <div style={{ width: 400, flex: 'none', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          left: 60,
          right: 60,
          height: 40,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(42,34,51,.22), transparent)',
        }}
      />
      <img
        className="ar-bob"
        src={src}
        alt="الخليل بن أحمد الفراهيدي"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          marginLeft: -211,
          height: 632,
          width: 422,
          objectFit: 'cover',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 88%, transparent), linear-gradient(to left, transparent, black 6%, black 94%, transparent)',
          WebkitMaskComposite: 'source-in',
          maskImage:
            'linear-gradient(to bottom, black 88%, transparent), linear-gradient(to left, transparent, black 6%, black 94%, transparent)',
          maskComposite: 'intersect',
        }}
      />
    </div>
  );
}

function Polaroid({ src, caption, tilt = -2 }: { src: string; caption: string; tilt?: number }) {
  return (
    <div
      style={{
        width: 720,
        flex: 'none',
        alignSelf: 'flex-start',
        marginTop: 22,
        background: '#fff',
        padding: '16px 16px 10px',
        boxSizing: 'border-box',
        borderRadius: 10,
        transform: `rotate(${tilt}deg)`,
        boxShadow: '0 18px 36px rgba(42,34,51,.22)',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -16,
          left: '50%',
          marginLeft: -70,
          width: 140,
          height: 34,
          background: 'rgba(217,154,30,.55)',
          transform: 'rotate(3deg)',
        }}
      />
      <img
        src={src}
        alt={caption}
        style={{ width: 688, height: 387, objectFit: 'cover', display: 'block', borderRadius: 4 }}
      />
      <div
        style={{
          textAlign: 'center',
          fontFamily: VERSE,
          fontSize: 28,
          lineHeight: '44px',
          color: C.soft,
          marginTop: 4,
        }}
      >
        {caption}
      </div>
    </div>
  );
}

// Beat dots — S = small (ٮ), L = wide (-); `pos` lights the current beat.
function Beats({ pattern, pos, size = 1 }: { pattern: string; pos: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 10 * size, alignItems: 'center', direction: 'rtl' }}>
      {[...pattern].map((ch, i) => {
        const on = i === pos;
        const long = ch === 'L';
        return (
          <span
            key={`${i}-${on}`}
            className={on ? 'ar-beat' : undefined}
            style={{
              height: 50 * size,
              minWidth: (long ? 92 : 50) * size,
              padding: `0 ${8 * size}px`,
              boxSizing: 'border-box',
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: VERSE,
              fontSize: 28 * size,
              fontWeight: 700,
              background: on ? C.gold : long ? 'rgba(251,245,230,.18)' : 'rgba(251,245,230,.08)',
              color: on ? C.indigoDeep : C.cream,
              border: `2px solid ${on ? C.gold : 'rgba(251,245,230,.35)'}`,
              transition: 'background .1s',
            }}
          >
            {long ? '-' : 'ٮ'}
          </span>
        );
      })}
    </div>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          background: 'var(--osd-accent)',
          transform: 'rotate(45deg) translateY(-4px)',
          flex: 'none',
        }}
      />
      <span>{children}</span>
    </div>
  );
}

function Mark({ children, color = C.terra }: { children: ReactNode; color?: string }) {
  return <b style={{ color }}>{children}</b>;
}

// Multiple-choice question; options are rendered from props inside the component.
function Mcq({
  question,
  options,
  answer,
  width,
}: {
  question: ReactNode;
  options: string[];
  answer: number;
  width?: number;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div
      style={{
        flex: width ? 'none' : 1,
        width,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        background: 'rgba(251,245,230,.07)',
        border: '2px solid rgba(251,245,230,.16)',
        borderRadius: 20,
        padding: '14px 20px',
        alignSelf: 'stretch',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.35 }}>{question}</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {options.map((o, i) => (
          <Tap
            key={o}
            onClick={() => setPicked(i)}
            state={picked === i ? (i === answer ? 'right' : 'wrong') : 'idle'}
          >
            {picked === i && i === answer ? `✓ ${o}` : o}
          </Tap>
        ))}
      </div>
    </div>
  );
}

// ── Page 1 · Cover ────────────────────────────────────────────────────────
function CoverRhythm() {
  const { pos, playing, play } = useRhythm();
  return (
    <>
      <Tap state="on" onClick={() => play('SLLSLLSLLSL', 'm')} style={{ fontSize: 30, padding: '16px 30px' }}>
        {playing ? '♪ يُعزَف…' : '▶ اسمعي'}
      </Tap>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontFamily: VERSE, fontSize: 34 }}>فَعُولُنْ فَعُولُنْ فَعُولُنْ فَعُولُ</div>
        <Beats pattern="SLLSLLSLLSL" pos={pos} size={0.9} />
      </div>
      <div style={{ marginRight: 'auto', fontSize: 28, maxWidth: 420, lineHeight: 1.4, opacity: 0.9 }}>
        انقري على الطاولة مع كل نبضة: القصيرة «ٮ» والطويلة «-».
      </div>
    </>
  );
}

const Cover: Page = () => {
  const active = useIsActivePage();
  return (
    <div
      data-still={active ? undefined : ''}
      style={{
        width: '100%',
        height: '100%',
        background:
          'radial-gradient(1100px 700px at 80% 0%, rgba(217,154,30,.22), transparent 60%), var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: 'var(--osd-font-body)',
        direction: 'rtl',
        position: 'relative',
        padding: '52px 110px 72px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div style={{ display: 'flex', gap: 36, height: 632, flex: 'none' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.terra, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ width: 48, height: 4, background: 'var(--osd-accent)', borderRadius: 2 }} />
            درس في موسيقى الشعر العربي
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--osd-font-display)',
              fontSize: 'var(--osd-size-hero)',
              lineHeight: 1.2,
              color: C.indigo,
            }}
          >
            أساسيات في
            <br />
            علم العَروض
          </h1>
          <div style={{ fontSize: 38, color: C.soft, fontWeight: 500 }}>
            رحلة مع الخليل بن أحمد الفراهيدي إلى ميزان الشعر
          </div>
          <Notebook style={{ alignSelf: 'flex-start', marginTop: 8, padding: '14px 104px 14px 40px' }}>
            <div>
              إعداد المعلمة: <Mark>أ. صفية الحارثية</Mark>
            </div>
            <div>مدرسة قيرون حيرتي</div>
          </Notebook>
        </div>
        <div style={{ position: 'relative', width: 460, flex: 'none', display: 'flex', justifyContent: 'center' }}>
          <Figure src={kWelcome} />
          <div
            className="ar-pop"
            style={{
              position: 'absolute',
              top: 30,
              right: -150,
              background: '#fff',
              borderRadius: 24,
              padding: '14px 24px',
              fontSize: 30,
              fontWeight: 700,
              color: C.indigo,
              boxShadow: '0 10px 24px rgba(42,34,51,.16)',
            }}
          >
            أهلًا بكِ يا صديقتي!
          </div>
        </div>
      </div>
      <Activity title="اسمعي نبض الشعر — هذا إيقاع بحر المتقارب">
        <CoverRhythm />
      </Activity>
      <Footer />
    </div>
  );
};

// ── Page 2 · Goals ────────────────────────────────────────────────────────
const Goals: Page = () => (
  <Shell
    kicker="قبل أن نبدأ"
    title="أهداف الدرس"
    figure={kPoint}
  >
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Notebook style={{ flex: 1, fontSize: 44, lineHeight: '96px', paddingTop: 44 }}>
        <div style={{ fontWeight: 700, color: C.indigo }}>في نهاية الدرس ستكونين قادرة على أن:</div>
        <Bullet>تتعرّفي الخليلَ بن أحمد، واضعَ علم العروض.</Bullet>
        <Bullet>تعرّفي علم العروض وتبيّني فائدته.</Bullet>
        <Bullet>تحدّدي أجزاء البيت الشعري والروي.</Bullet>
        <Bullet>تتعرّفي البحور والتفعيلات، وتكتبي الكلمات كتابة عروضية.</Bullet>
      </Notebook>
      <Note>العروض ليس حفظًا فقط؛ إنه أذنٌ تسمع، وإصبعٌ ينقر الإيقاع.</Note>
    </div>
  </Shell>
);

// ── Page 3 · Who is al-Khalil ─────────────────────────────────────────────
const WhoIsKhalil: Page = () => (
  <Shell
    kicker="الشخصية"
    title="من هو الخليل؟"
    avatar
  >
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Notebook style={{ flex: 1, fontSize: 40, lineHeight: '96px', paddingTop: 44 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        <Bullet>
          اسمه: <Mark>الخليل بن أحمد الفراهيدي</Mark> الأزدي.
        </Bullet>
        <Bullet>وُلد في عُمان نحو سنة ١٠٠هـ، وعاش في البصرة.</Bullet>
        <Bullet>عالمٌ باللغة والنحو والموسيقى.</Bullet>
        <Bullet>
          وضع <Mark>علم العروض</Mark>، وألّف معجم <Mark>«العين»</Mark>.
        </Bullet>
        </div>
      </Notebook>
      <Note>الخليل عُمانيّ الأصل، ونحن نفخر به!</Note>
    </div>
    <Polaroid src={oman} caption="من قرى عُمان إلى حلقات العلم في البصرة" tilt={2} />
  </Shell>
);

// ── Page 4 · The coppersmiths' souk ───────────────────────────────────────
function HammerActivity() {
  const { pos, playing, play } = useRhythm();
  const [taps, setTaps] = useState(0);
  const tap = () => {
    const a = getAudio();
    hit(a.currentTime + 0.01, taps % 3 !== 1);
    setTaps((t) => (t >= 6 ? 1 : t + 1));
  };
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
        <Tap state="on" onClick={() => play('LSLLSL', 'h')}>
          {playing ? '♪ طَرْق…' : '▶ اسمعي المطرقة'}
        </Tap>
        <Beats pattern="LSLLSL" pos={pos} size={0.9} />
      </div>
      <div style={{ width: 2, alignSelf: 'stretch', background: 'rgba(251,245,230,.2)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 28 }}>دورك! اضغطي الطبلة ست مرات بالإيقاع نفسه:</div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <Tap state="idle" onClick={tap} style={{ fontSize: 30, padding: '14px 34px' }}>
            🥁 طُم
          </Tap>
          <TapDots count={taps} />
          {taps === 6 && (
            <span className="ar-pop" style={{ fontSize: 30, fontWeight: 800, color: C.goldSoft }}>
              أحسنتِ! هكذا سمعها الخليل.
            </span>
          )}
        </div>
      </div>
    </>
  );
}

function TapDots({ count }: { count: number }) {
  const dot = (i: number) => (
    <span
      style={{
        width: i === 2 || i === 5 ? 24 : 40,
        height: 24,
        borderRadius: 999,
        background: count >= i ? C.gold : 'rgba(251,245,230,.18)',
        transition: 'background .15s',
      }}
    />
  );
  return (
    <div style={{ display: 'flex', gap: 8, direction: 'rtl' }}>
      {dot(1)}
      {dot(2)}
      {dot(3)}
      {dot(4)}
      {dot(5)}
      {dot(6)}
    </div>
  );
}

const SoukStory: Page = () => (
  <Shell
    kicker="الحكاية"
    title="في سوق الصفّارين"
    avatar
    activity={
      <Activity title="اسمعي طرق المطرقة: - ٮ - … ثم قلّديه">
        <HammerActivity />
      </Activity>
    }
  >
    <Polaroid src={souk} caption="الخليل يُصغي إلى المطارق في سوق البصرة" tilt={-2} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Notebook style={{ flex: 1 }}>
        <div>مرّ الخليل بسوق الصفّارين في البصرة، فسمع طَرْق المطارق على النحاس:</div>
        <div style={{ fontFamily: VERSE, fontSize: 36, color: C.terra, fontWeight: 700 }}>
          - ٮ - … - ٮ -
        </div>
        <div>فلاحظ أنّ الإيقاع منتظم كأوزان الشعر، فتتبّع أشعار العرب حتى جمع أوزانها في علمٍ واحد.</div>
      </Notebook>
      <Note>الشعر العربي إيقاعٌ قبل أن يكون كلمات.</Note>
    </div>
  </Shell>
);

// ── Page 5 · Definition ───────────────────────────────────────────────────
const Definition: Page = () => (
  <Shell
    kicker="المفهوم"
    title="ما علم العَروض؟"
    figure={kScale}
  >
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Notebook style={{ flex: 1, fontSize: 44, lineHeight: '96px', paddingTop: 44 }}>
        <div
          style={{
            fontSize: 50,
            fontWeight: 700,
            color: C.indigo,
            paddingBottom: 96,
          }}
        >
          علمٌ يُعرَف به صحيحُ أوزان الشعر العربي من مكسورها.
        </div>
        <Bullet>
          سُمّي بذلك لأن الشعر <Mark>يُعرَض</Mark> عليه ليوزَن.
        </Bullet>
        <Bullet>فائدته: يحفظ الشعر من الخطأ، ويعين على فهم موسيقاه.</Bullet>
      </Notebook>
      <Note>العروض ميزانُ الشعر، كما أن الميزان يزن البضاعة.</Note>
    </div>
  </Shell>
);

// ── Page 6 · Tent and verse ───────────────────────────────────────────────
const TentVerse: Page = () => (
  <Shell
    kicker="لماذا «بيت»؟"
    title="الخيمة والبيت الشعري"
    avatar
  >
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Notebook style={{ flex: 1, fontSize: 44, lineHeight: '96px', paddingTop: 44 }}>
        <div>شبّه العرب البيت الشعري ببيت الشَّعَر (الخيمة):</div>
        <Bullet>تقوم الخيمة على الحبال والأوتاد، والبيت على الأسباب والأوتاد.</Bullet>
        <div
          style={{
            fontFamily: VERSE,
            fontSize: 40,
            color: C.indigo,
            fontWeight: 700,
            textAlign: 'center',
            marginTop: 96,
          }}
        >
          وإنّي لنجمٌ تهتدي صُحبتي به ❋ إذا حال من دون النجوم سحابُ
        </div>
      </Notebook>
      <Note>البيت الشعري خيمةٌ من كلمات، لها شطران كمصراعَي الباب.</Note>
    </div>
    <Polaroid src={tent} caption="بيت الشَّعَر: حبالٌ وأوتادٌ وبابان" tilt={-2} />
  </Shell>
);

// ── Page 9 · Parts of the verse ───────────────────────────────────────────
type Part = 'sadr' | 'ajz' | 'arud' | 'darb' | 'hashw' | null;

function Seg({ text, on }: { text: string; on: boolean }) {
  return (
    <span
      style={{
        flex: 1,
        textAlign: 'center',
        fontFamily: VERSE,
        fontSize: 30,
        fontWeight: 700,
        lineHeight: '52px',
        borderRadius: 12,
        background: on ? C.gold : '#fff',
        color: on ? C.indigoDeep : C.indigo,
        border: `2px solid ${on ? C.gold : C.sand}`,
        transition: 'background .2s',
      }}
    >
      {text}
    </span>
  );
}

function useVerseParts() {
  const [part, setPart] = useState<Part>(null);
  const inSadr = part === 'sadr';
  const inAjz = part === 'ajz';
  const h = part === 'hashw';
  const row = (label: string, a: string, b: string, c: string, d: string, side: 'sadr' | 'ajz') => {
    const whole = side === 'sadr' ? inSadr : inAjz;
    const last = side === 'sadr' ? part === 'arud' : part === 'darb';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 70, fontWeight: 800, color: C.soft, fontSize: 26 }}>{label}</span>
        <Seg text={a} on={whole || h} />
        <Seg text={b} on={whole || h} />
        <Seg text={c} on={whole || h} />
        <Seg text={d} on={whole || last} />
      </div>
    );
  };
  return { part, setPart, row };
}

const Parts: Page = () => {
  const { part, setPart, row } = useVerseParts();
  const btn = (p: Part, label: string) => (
    <Tap state={part === p ? 'on' : 'idle'} onClick={() => setPart(part === p ? null : p)}>
      {label}
    </Tap>
  );
  const caption: Record<string, string> = {
    sadr: 'الصدر: الشطر الأول من البيت.',
    ajz: 'العجز: الشطر الثاني من البيت.',
    arud: 'العَروض: آخر تفعيلة في الصدر.',
    darb: 'الضرب: آخر تفعيلة في العجز.',
    hashw: 'الحشو: كل ما سوى العروض والضرب.',
  };
  return (
    <Shell
      kicker="بناء البيت"
      title="أجزاء البيت الشعري"
      figure={kPoint}
      activity={
        <Activity title="اضغطي على المصطلح ليتلوّن موضعه في البيت">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
            <div style={{ display: 'flex', gap: 14 }}>
              {btn('sadr', 'الصدر')}
              {btn('ajz', 'العجز')}
              {btn('arud', 'العَروض')}
              {btn('darb', 'الضرب')}
              {btn('hashw', 'الحشو')}
            </div>
            <div key={part ?? 'none'} className="ar-pop" style={{ fontSize: 30, color: C.goldSoft, fontWeight: 700 }}>
              {part ? caption[part] : 'اختاري مصطلحًا لترَي أين يقع في البيت ↑'}
            </div>
          </div>
        </Activity>
      }
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Notebook style={{ flex: 1 }}>
          <div style={{ fontFamily: VERSE, fontSize: 34, fontWeight: 700, color: C.indigo, textAlign: 'center' }}>
            عليكَ بالنفسِ فاستكملْ فضائلَها ❋ فأنتَ بالنفسِ لا بالجسمِ إنسانُ
          </div>
          <div style={{ fontSize: 26, color: C.soft, lineHeight: '48px' }}>البيت مقسّم إلى شطرين: صدر وعجز</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {row('الصدر', 'عَلَيْكَ', 'بِالنَّفْسِ', 'فَاسْتَكْمِلْ', 'فَضَائِلَهَا', 'sadr')}
            {row('العجز', 'فَأَنْتَ', 'بِالنَّفْسِ', 'لَا بِالْجِسْمِ', 'إِنْسَانُ', 'ajz')}
          </div>
        </Notebook>
        <Note>كلمة «العَروض» اسمٌ للعلم كلّه، واسمٌ لآخر تفعيلة في الصدر أيضًا.</Note>
      </div>
    </Shell>
  );
};

// ── Page 8 · Practice: parts of the verse (أبو مسلم البهلاني) ──────────────
type Term = Exclude<Part, null>;

const TERMS: { id: Term; label: string; color: string }[] = [
  { id: 'sadr', label: 'الصدر', color: C.gold },
  { id: 'ajz', label: 'العجز', color: C.teal },
  { id: 'arud', label: 'العَروض', color: C.terra },
  { id: 'darb', label: 'الضرب', color: C.indigo },
  { id: 'hashw', label: 'الحشو', color: '#7A5A9E' },
];

const BAHLANI = [
  [
    ['قَدْ يُخْطِئُ', 'النَّقْلُ', 'وَالتَّحْقِيقُ', 'يَعْكِسُهُ'],
    ['وَالْعَيْنُ', 'أَصْدَقُ', 'أَنْبَاءً', 'مِنَ الْأُذُنِ'],
  ],
  [
    ['تَأْتِي', 'السَّلَامَةُ', 'وَالْأَسْوَاءُ', 'مُحْدِقَةٌ'],
    ['وَيَهْلِكُ', 'الْمَرْءُ', 'وَالْأَسْوَاءُ', 'لَمْ تَكُنِ'],
  ],
];

// Which term(s) a chunk belongs to: shatr 0 = صدر, 1 = عجز; chunk 3 = عروض/ضرب.
const termsOf = (shatr: number, i: number): Term[] => [
  shatr === 0 ? 'sadr' : 'ajz',
  i === 3 ? (shatr === 0 ? 'arud' : 'darb') : 'hashw',
];

const covers = (t: Term, shatr: number, i: number) => termsOf(shatr, i).includes(t);

function HuntVerse({
  verse,
  n,
  term,
  found,
  shown,
  onPick,
  wrong,
}: {
  verse: string[][];
  n: number;
  term: Term | null;
  found: Term[];
  shown: Term | null;
  onPick: (shatr: number, i: number) => void;
  wrong: string | null;
}) {
  const color = TERMS.find((t) => t.id === shown)?.color;
  return (
    <div
      style={{
        background: C.paper,
        borderRadius: 'var(--osd-radius)',
        boxShadow: '0 14px 30px rgba(42,34,51,.12)',
        padding: '18px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: C.terra }}>البيت {n === 0 ? 'الأول' : 'الثاني'}</span>
        <div style={{ flex: 1 }} />
        {TERMS.map((t) => {
          const ok = found.includes(t.id);
          return (
            <span
              key={t.id}
              style={{
                fontSize: 21,
                fontWeight: 700,
                padding: '3px 14px',
                borderRadius: 999,
                background: ok ? t.color : 'transparent',
                color: ok ? C.cream : C.soft,
                border: `2px ${ok ? 'solid' : 'dashed'} ${ok ? t.color : C.sand}`,
              }}
            >
              {ok ? '✓ ' : ''}
              {t.label}
            </span>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {verse.map((shatr, s) => (
          <div key={s} style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center' }}>
            {s === 1 && <span style={{ color: C.gold, fontSize: 28, marginLeft: 6 }}>❋</span>}
            {shatr.map((w, i) => {
              const id = `${n}-${s}-${i}`;
              const on = shown !== null && covers(shown, s, i);
              return (
                <button
                  key={id}
                  type="button"
                  className={wrong === id ? 'ar-shake' : undefined}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPick(s, i);
                  }}
                  style={{
                    flex: 1,
                    font: 'inherit',
                    fontFamily: VERSE,
                    fontSize: 30,
                    fontWeight: 700,
                    lineHeight: '58px',
                    borderRadius: 12,
                    cursor: term ? 'pointer' : 'default',
                    background: wrong === id ? C.red : on ? color : '#fff',
                    color: wrong === id || on ? C.cream : C.indigo,
                    border: `2px solid ${wrong === id ? C.red : on ? color : C.sand}`,
                    transition: 'background .2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {w}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

const VerseHunt: Page = () => {
  const [term, setTerm] = useState<Term | null>(null);
  const [found, setFound] = useState<Term[][]>([[], []]);
  const [shown, setShown] = useState<(Term | null)[]>([null, null]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [msg, setMsg] = useState('اختاري مصطلحًا، ثم اضغطي على موضعه في أحد البيتين.');
  const total = found[0].length + found[1].length;

  const pick = (n: number) => (s: number, i: number) => {
    if (!term) {
      setMsg('اختاري مصطلحًا أولًا ↑');
      return;
    }
    const label = TERMS.find((t) => t.id === term)?.label;
    if (covers(term, s, i)) {
      setFound((f) => f.map((x, k) => (k === n && !x.includes(term) ? [...x, term] : x)));
      setShown((v) => v.map((x, k) => (k === n ? term : x)));
      setWrong(null);
      setMsg(term === 'hashw' ? 'أحسنتِ! هذه الكلمة من الحشو.' : `أحسنتِ! هذا موضع ${label}.`);
    } else {
      const id = `${n}-${s}-${i}`;
      setWrong(id);
      setTimeout(() => setWrong((w) => (w === id ? null : w)), 700);
      setMsg(`ليس هذا موضع ${label}، حاولي مرة أخرى.`);
    }
  };

  const reset = () => {
    setTerm(null);
    setFound([[], []]);
    setShown([null, null]);
    setMsg('اختاري مصطلحًا، ثم اضغطي على موضعه في أحد البيتين.');
  };

  return (
    <Shell kicker="نشاط تطبيقي · أبو مسلم البهلاني" title="حدّدي أجزاء البيت" figure={kThink}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${C.indigo}, ${C.indigoDeep})`,
            borderRadius: 28,
            padding: '20px 32px',
            color: C.cream,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxShadow: '0 16px 30px rgba(26,35,71,.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {TERMS.map((t) => (
              <Tap key={t.id} state={term === t.id ? 'on' : 'idle'} onClick={() => setTerm(t.id)}>
                {t.label}
              </Tap>
            ))}
            <div style={{ flex: 1 }} />
            <Tap state="ghost" onClick={reset}>
              ↺ من جديد
            </Tap>
          </div>
          <div key={msg} className="ar-pop" style={{ fontSize: 28, fontWeight: 700, color: C.goldSoft }}>
            {total === 10 ? '🎉 ممتاز! حدّدتِ أجزاء البيتين كلها.' : msg}
          </div>
        </div>
        {BAHLANI.map((v, n) => (
          <HuntVerse
            key={n}
            verse={v}
            n={n}
            term={term}
            found={found[n]}
            shown={shown[n]}
            onPick={pick(n)}
            wrong={wrong}
          />
        ))}
        <Note>
          للشاعر العُماني <b>أبي مسلم البهلاني</b> (شاعر القطرين)، من بحر البسيط.
        </Note>
      </div>
    </Shell>
  );
};

// ── Page 10 · القافية والروي ──────────────────────────────────────────────
function LetterBadge({ letter, name }: { letter: string; name: string }) {
  return (
    <div
      style={{
        flex: 1,
        background: '#fff',
        borderRadius: 20,
        border: `3px solid ${C.sand}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        padding: '6px 0',
        boxShadow: '0 6px 14px rgba(42,34,51,.08)',
      }}
    >
      <span
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: C.indigo,
          color: C.goldSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: VERSE,
          fontSize: 46,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {letter}
      </span>
      <span style={{ fontSize: 34, fontWeight: 800, color: C.indigo }}>{name}</span>
    </div>
  );
}

const Rawiy: Page = () => (
  <Shell
    kicker="خاتمة البيت"
    title="القافية والرَّوِيّ"
    figure={kListen}
    activity={
      <Activity title="استمعي لآخر البيت، ثم سمّي القصيدة">
        <Mcq
          question={
            <>
              «… فأنتَ بالنفسِ لا بالجسمِ إنسانُ» القصيدة:
            </>
          }
          options={['لامية', 'نونية', 'سينية']}
          answer={1}
        />
        <Mcq
          question={
            <>
              «… إذا حال من دون النجوم سحابُ» القصيدة:
            </>
          }
          options={['بائية', 'حائية', 'ميمية']}
          answer={0}
        />
      </Activity>
    }
  >
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Notebook style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div>
          <Mark>الرَّويّ</Mark>: الحرف الذي تُبنى عليه القصيدة، ويتكرر في آخر كل أبياتها.
        </div>
        <div style={{ paddingBottom: 10 }}>وإليه تُنسب القصيدة:</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <LetterBadge letter="ل" name="لاميّة" />
          <LetterBadge letter="د" name="داليّة" />
          <LetterBadge letter="م" name="ميميّة" />
        </div>
      </Notebook>
      <Note>لا يكون الروي في الغالب حرفَ مدٍّ ولا هاءً زائدة.</Note>
    </div>
  </Shell>
);

// ── Page 11 · The meters ──────────────────────────────────────────────────
function MeterCard({
  src,
  name,
  hint,
  shown,
  onToggle,
}: {
  src: string;
  name: string;
  hint: string;
  shown: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        width: 200,
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignItems: 'center',
      }}
    >
      <button
        type="button"
        className="ar-btn"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={{
          font: 'inherit',
          cursor: 'pointer',
          padding: 0,
          width: 200,
          height: 200,
          borderRadius: 24,
          position: 'relative',
          boxShadow: '0 12px 24px rgba(42,34,51,.16)',
          background: '#fff',
          border: `4px solid ${shown ? C.teal : '#fff'}`,
          boxSizing: 'border-box',
        }}
      >
        <img src={src} alt={hint} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }} />
        {shown && (
          <div
            className="ar-pop"
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              right: 10,
              background: C.teal,
              color: '#fff',
              borderRadius: 12,
              textAlign: 'center',
              fontSize: 32,
              fontWeight: 800,
              padding: '4px 0',
            }}
          >
            {name}
          </div>
        )}
      </button>
      <div style={{ fontSize: 24, color: C.soft, fontWeight: 600 }}>{hint}</div>
    </div>
  );
}

const METERS = [
  'الطويل',
  'المديد',
  'البسيط',
  'الوافر',
  'الكامل',
  'الهزج',
  'الرجز',
  'الرمل',
  'السريع',
  'المنسرح',
  'الخفيف',
  'المضارع',
  'المقتضب',
  'المجتث',
  'المتقارب',
  'المتدارك',
];
const Meters: Page = () => {
  const [revealed, setRevealed] = useState<string[]>([]);
  const card = (src: string, name: string, hint: string) => (
    <MeterCard
      src={src}
      name={name}
      hint={hint}
      shown={revealed.includes(name)}
      onToggle={() => setRevealed((r) => (r.includes(name) ? r.filter((x) => x !== name) : [...r, name]))}
    />
  );
  return (
    <Shell kicker="أوزان الشعر" title="البحور الستة عشر" avatar>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'stretch' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Notebook style={{ flex: 1, padding: '16px 84px 16px 28px' }}>
              <div>
                <Mark>البحر</Mark>: الوزن الذي تسير عليه القصيدة.
              </div>
              <div>وضع الخليل ١٥ بحرًا، وزاد الأخفش «المتدارك» فصارت ١٦.</div>
            </Notebook>
            <Note>اسم البحر يلمّح إلى إيقاعه! انقري الصورة لتكشفي اسمه.</Note>
          </div>
          {card(rope, 'الطويل', 'حبلٌ ممتد')}
          {card(feather, 'الخفيف', 'ريشةٌ طائرة')}
          {card(cheetah, 'السريع', 'فهدٌ منطلق')}
          {card(camel, 'المتقارب', 'خطواتٌ متقاربة')}
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 18, alignContent: 'center' }}>
          {METERS.map((m, i) => {
            const pictured = revealed.includes(m);
            const added = m === 'المتدارك';
            return (
              <div
                key={m}
                style={{
                  background: pictured ? C.teal : '#fff',
                  color: pictured ? '#fff' : added ? C.terra : C.indigo,
                  border: `3px ${added ? 'dashed' : 'solid'} ${pictured ? C.teal : added ? C.terra : C.indigo}`,
                  borderRadius: 16,
                  padding: '34px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 5px 0 rgba(42,34,51,.12)',
                  transition: 'background .3s, color .3s',
                }}
              >
                  <span style={{ fontSize: 28, fontWeight: 800, opacity: 0.6 }}>{(i + 1).toLocaleString('ar-EG')}</span>
                <span style={{ fontFamily: VERSE, fontSize: 48, fontWeight: 700 }}>{m}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
};

// ── Page 12 · Tafeelat ────────────────────────────────────────────────────
function Taf({
  name,
  dan,
  pattern,
  five,
  onPlay,
  active,
}: {
  name: string;
  dan: string;
  pattern: string;
  five?: boolean;
  onPlay: (p: string, k: string) => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      className="ar-btn"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        onPlay(pattern, name);
      }}
      style={{
        font: 'inherit',
        cursor: 'pointer',
        background: active ? C.goldSoft : '#fff',
        border: `3px solid ${five ? C.terra : C.indigo}`,
        borderRadius: 16,
        padding: '22px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: 1.5,
        boxShadow: '0 5px 0 rgba(42,34,51,.12)',
        transition: 'background .2s',
      }}
    >
      <span style={{ fontFamily: VERSE, fontSize: 52, fontWeight: 700, color: five ? C.terra : C.indigo }}>
        {name}
      </span>
      <span style={{ fontFamily: VERSE, fontSize: 34, color: C.soft }}>{dan}</span>
    </button>
  );
}

const Tafeelat: Page = () => {
  const { playing, play } = useRhythm();
  return (
    <Shell
      kicker="وحدات الوزن"
      title="التفعيلات الثماني"
      figure={kClap}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Notebook style={{ flex: 1, padding: '24px 100px 24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 28, lineHeight: '44px', color: C.soft }}>
            <Mark>خماسية</Mark> (٥ أحرف) و<Mark color={C.indigo}>سباعية</Mark> (٧ أحرف) — اضغطي أي تفعيلة لتسمعيها:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 24 }}>
            <Taf name="فاعِلُنْ" dan="- ٮ -" pattern="LSL" five onPlay={play} active={playing === 'فاعِلُنْ'} />
            <Taf name="فَعُولُنْ" dan="ٮ - -" pattern="SLL" five onPlay={play} active={playing === 'فَعُولُنْ'} />
            <Taf name="مَفاعِيلُنْ" dan="ٮ - - -" pattern="SLLL" onPlay={play} active={playing === 'مَفاعِيلُنْ'} />
            <Taf name="مُسْتَفْعِلُنْ" dan="- - ٮ -" pattern="LLSL" onPlay={play} active={playing === 'مُسْتَفْعِلُنْ'} />
            <Taf name="مُفاعَلَتُنْ" dan="ٮ - ٮ ٮ -" pattern="SLSSL" onPlay={play} active={playing === 'مُفاعَلَتُنْ'} />
            <Taf name="مُتَفاعِلُنْ" dan="ٮ ٮ - ٮ -" pattern="SSLSL" onPlay={play} active={playing === 'مُتَفاعِلُنْ'} />
            <Taf name="فاعِلاتُنْ" dan="- ٮ - -" pattern="LSLL" onPlay={play} active={playing === 'فاعِلاتُنْ'} />
            <Taf name="مَفْعُولاتُ" dan="- - - ٮ" pattern="LLLS" onPlay={play} active={playing === 'مَفْعُولاتُ'} />
          </div>
        </Notebook>
        <Note>من هذه التفعيلات تُبنى البحور كلّها، كما تُبنى الألحان من النغمات.</Note>
      </div>
    </Shell>
  );
};

// ── Page 13 · Prosodic writing rules ──────────────────────────────────────
function RuleCol({ ok, title, children }: { ok: boolean; title: string; children: ReactNode }) {
  const tone = ok ? C.teal : C.red;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 800, color: tone, fontSize: 32 }}>
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: tone,
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
          }}
        >
          {ok ? '✓' : '✕'}
        </span>
        {title}
      </div>
      <div style={{ fontSize: 28, lineHeight: '48px' }}>{children}</div>
    </div>
  );
}

function RevealCard({ from, to }: { from: string; to: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      className="ar-btn"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((o) => !o);
      }}
      style={{
        flex: 1,
        alignSelf: 'stretch',
        font: 'inherit',
        cursor: 'pointer',
        border: 'none',
        borderRadius: 20,
        background: open ? C.cream : 'rgba(251,245,230,.1)',
        boxShadow: open ? '0 5px 0 rgba(0,0,0,.28)' : 'inset 0 0 0 2px rgba(251,245,230,.3)',
        color: open ? C.indigo : C.cream,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <span style={{ fontFamily: VERSE, fontSize: 44, fontWeight: 700 }}>{from}</span>
      <span
        key={String(open)}
        className={open ? 'ar-pop' : undefined}
        style={{ fontFamily: open ? VERSE : 'inherit', fontSize: open ? 40 : 26, fontWeight: 700, color: open ? C.teal : 'rgba(251,245,230,.55)' }}
      >
        {open ? `← ${to}` : 'كيف تُكتب عروضيًا؟'}
      </span>
    </button>
  );
}

const WritingRules: Page = () => (
  <Shell
    kicker="الكتابة العروضية"
    title="نكتب ما نسمع"
    figure={kScroll}
    activity={
      <Activity title="اكتبيها عروضيًا في دفترك، ثم اضغطي للتحقق">
        <RevealCard from="هَذَا" to="هَاذَا" />
        <RevealCard from="غَفُورٌ" to="غَفُورُنْ" />
        <RevealCard from="كَتَبُوا" to="كَتَبُو" />
        <RevealCard from="وَالشَّمْسُ" to="وَشْشَمْسُ" />
      </Activity>
    }
  >
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Notebook style={{ flex: 1, padding: '14px 100px 14px 32px', display: 'flex' }}>
        <div style={{ display: 'flex', gap: 28 }}>
          <RuleCol ok title="ما يُنطق يُكتب">
            <div>التنوين نونٌ: غَفورٌ ← غَفُورُنْ</div>
            <div>ألف الإشارة: هذا ← هاذا</div>
            <div>ألف (الله، الرحمن، لكن، طه)</div>
            <div>المشدّد حرفان: ساكن + متحرك</div>
            <div>آ = أَ + ا ساكنة</div>
            <div>إشباع حركة الروي</div>
          </RuleCol>
          <div style={{ width: 2, background: C.sand }} />
          <RuleCol ok={false} title="ما لا يُنطق لا يُكتب">
            <div>همزة الوصل وسط الكلام: فاستمع</div>
            <div>ألف واو الجماعة: كتبوا ← كتبو</div>
            <div>اللام الشمسية: الثياب ← اَثْثِيَاب</div>
            <div>واو (عمرو)</div>
            <div>المدّ قبل الساكن: أتى القاضي</div>
          </RuleCol>
        </div>
      </Notebook>
      <Note>القاعدة الذهبية: نكتب ما تسمعه الأذن، لا ما تراه العين.</Note>
    </div>
  </Shell>
);

// ── Page 14 · Worked examples ─────────────────────────────────────────────
function StepLine({ n, step, label, children }: { n: number; step: number; label: string; children: ReactNode }) {
  const shown = step >= n;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 48 }}>
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: shown ? C.indigo : C.sand,
          color: '#fff',
          fontSize: 20,
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}
      >
        {toAr(n)}
      </span>
      <span style={{ width: 220, flex: 'none', fontSize: 26, color: C.soft, fontWeight: 600 }}>{label}</span>
      <span
        key={String(shown)}
        className={shown ? 'ar-pop' : undefined}
        style={{
          fontFamily: VERSE,
          fontSize: 34,
          fontWeight: 700,
          color: n === 4 ? C.terra : C.indigo,
          opacity: shown ? 1 : 0.18,
        }}
      >
        {shown ? children : '؟ ؟ ؟'}
      </span>
    </div>
  );
}

function Example({ step, a, b, c, d }: { step: number; a: string; b: string; c: string; d: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <StepLine n={1} step={step} label="الكتابة العادية">
        {a}
      </StepLine>
      <StepLine n={2} step={step} label="الكتابة العروضية">
        {b}
      </StepLine>
      <StepLine n={3} step={step} label="الرموز">
        {c}
      </StepLine>
      <StepLine n={4} step={step} label="التفعيلة">
        {d}
      </StepLine>
    </div>
  );
}

function GroupTimer({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => {
    if (left === 0) setRunning(false);
  }, [left]);
  const done = left === 0;
  const urgent = left <= 30;
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 'none' }}>
      <div
        className={done ? 'ar-pop' : undefined}
        style={{
          minWidth: 220,
          textAlign: 'center',
          fontSize: done ? 44 : 76,
          lineHeight: '92px',
          fontWeight: 800,
          borderRadius: 20,
          background: done ? C.red : urgent && running ? C.gold : 'rgba(251,245,230,.1)',
          color: done ? '#fff' : urgent && running ? C.indigoDeep : C.cream,
          fontVariantNumeric: 'tabular-nums',
          direction: 'ltr',
          transition: 'background .3s',
        }}
      >
        {done ? 'انتهى الوقت!' : `${toAr(mm)}:${ss.split('').map((d) => toAr(Number(d))).join('')}`}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Tap state="on" onClick={() => (done ? null : setRunning((r) => !r))} style={{ fontSize: 24, padding: '8px 18px' }}>
          {running ? '⏸ إيقاف' : '▶ ابدئي'}
        </Tap>
        <Tap
          state="ghost"
          onClick={() => {
            setRunning(false);
            setLeft(seconds);
          }}
          style={{ fontSize: 24, padding: '8px 18px' }}
        >
          ↺
        </Tap>
      </div>
    </div>
  );
}

const Examples: Page = () => {
  const [step, setStep] = useState(1);
  return (
    <Shell
      kicker="تطبيق"
      title="نَزِنُ معًا خطوة خطوة"
      figure={kWrite}
      activity={
        <Activity title="نشاط جماعي: اقصصي واكتبي">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Tap state="on" onClick={() => setStep((s) => Math.min(4, s + 1))}>
              الخطوة التالية ←
            </Tap>
            <Tap state="ghost" onClick={() => setStep(1)}>
              ↺ من البداية
            </Tap>
          </div>
          <div style={{ width: 2, alignSelf: 'stretch', background: 'rgba(251,245,230,.2)' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 25, lineHeight: 1.45 }}>
            <div>١. تخرج طالبة من كل مجموعة، تقصّ بطاقة وتكتب إجابتها.</div>
            <div>٢. تعود بها إلى مجموعتها، ثم تخرج الطالبة نفسها لبطاقة أخرى.</div>
            <div>
              ٣. <span style={{ color: 'var(--osd-accent)', fontWeight: 800 }}>الفائزة</span>: المجموعة التي تجمع أكبر عدد من البطاقات الصحيحة.
            </div>
          </div>
          <div style={{ width: 2, alignSelf: 'stretch', background: 'rgba(251,245,230,.2)' }} />
          <GroupTimer seconds={240} />
        </Activity>
      }
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Notebook style={{ flex: 1, padding: '20px 100px 20px 32px' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <Example step={step} a="هَذَا أَبِي" b="هَاذَا أَبِي" c="- - ٮ -" d="مُسْتَفْعِلُنْ" />
            <div style={{ width: 2, background: C.sand }} />
            <Example step={step} a="أَتَى القَاضِي" b="أَتَلْقَاضِي" c="ٮ - - -" d="مَفَاعِيلُنْ" />
          </div>
        </Notebook>
        <Note>نكتب عروضيًا أولًا، ثم نرمز للمتحرك يليه ساكن «-» وللمتحرك لا يليه ساكن «ٮ»، ثم نطابق التفعيلة.</Note>
      </div>
    </Shell>
  );
};

// ── Page 15 · Review / exit ticket ────────────────────────────────────────
function ExitQ({
  q,
  a,
  b,
  answer,
  onAnswer,
}: {
  q: string;
  a: string;
  b: string;
  answer: 0 | 1;
  onAnswer: (ok: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer(i === answer);
  };
  const st = (i: number) =>
    picked === null ? 'idle' : i === answer ? 'right' : picked === i ? 'wrong' : 'idle';
  return (
    <div
      style={{
        flex: 1,
        alignSelf: 'stretch',
        background: 'rgba(251,245,230,.07)',
        border: '2px solid rgba(251,245,230,.16)',
        borderRadius: 20,
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 10,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.35 }}>{q}</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Tap state={st(0)} onClick={() => pick(0)} style={{ flex: 1, padding: '10px 12px' }}>
          {a}
        </Tap>
        <Tap state={st(1)} onClick={() => pick(1)} style={{ flex: 1, padding: '10px 12px' }}>
          {b}
        </Tap>
      </div>
    </div>
  );
}

const Review: Page = () => {
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const answer = (ok: boolean) => {
    setCount((c) => c + 1);
    if (ok) setScore((s) => s + 1);
  };
  return (
    <Shell
      kicker="تذكرة الخروج"
      title="ماذا تعلّمنا اليوم؟"
      figure={kWelcome}
      activity={
        <Activity
          title={
            count === 4
              ? `نتيجتك: ${toAr(score)} من ٤ — ${score === 4 ? 'ممتازة! أنتِ عَروضيّة صغيرة 🌟' : 'أحسنتِ، راجعي ما فاتك.'}`
              : 'أجيبي عن الأسئلة الأربعة'
          }
        >
          <ExitQ q="واضع علم العروض هو:" a="الأخفش" b="الخليل" answer={1} onAnswer={answer} />
          <ExitQ q="الحرف الذي تُبنى عليه القصيدة:" a="الروي" b="العَروض" answer={0} onAnswer={answer} />
          <ExitQ q="آخر تفعيلة في العجز:" a="العَروض" b="الضرب" answer={1} onAnswer={answer} />
          <ExitQ q="عدد بحور الشعر:" a="١٦ بحرًا" b="١٢ بحرًا" answer={0} onAnswer={answer} />
        </Activity>
      }
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Notebook style={{ flex: 1 }}>
          <Bullet>العروض ميزان الشعر، وضعه الخليل الفراهيدي العُماني.</Bullet>
          <Bullet>التفعيلات وحدات الوزن، والبحور ستة عشر.</Bullet>
          <Bullet>للبيت صدرٌ وعجز، وآخرهما العَروض والضرب.</Bullet>
          <Bullet>نكتب ما نسمع، ثم نرمز، ثم نطابق التفعيلة.</Bullet>
        </Notebook>
        <Note>أحسنتِ! صرتِ تسمعين الشعر بأذن الخليل.</Note>
      </div>
    </Shell>
  );
};

export const notes: (string | undefined)[] = [
  'رحّبي بالطالبات وقدّمي الخليل بوصفه رفيق الرحلة. شغّلي إيقاع المتقارب واطلبي منهن النقر على الطاولة مع كل نبضة: القصيرة «ٮ» والطويلة «-».',
  'اقرئي الأهداف الأربعة، واسألي الطالبات عمّا يعرفنه مسبقًا لمعرفة نقطة البداية.',
  'عرّفي بالخليل وأكّدي أصله العُماني ومعجم العين. وأكّدي أنه وُلد في عُمان وعاش في البصرة.',
  'احكي قصة سوق الصفارين بأسلوب قصصي. شغّلي صوت المطرقة، ثم اطلبي من طالبة أن تقلّد الإيقاع على الطبلة أمام زميلاتها.',
  'اكتبي التعريف على السبورة. اربطي بين الميزان والبضاعة وبين العروض والشعر، واسألي الطالبات: لماذا نحتاج ميزانًا للشعر؟',
  'اشرحي سبب تسمية البيت بيتًا. اقرئي البيت بصوت واضح، ووضّحي أن للبيت شطرين كمصراعَي باب الخيمة.',
  'اقرئي البيت ثم وضّحي تقسيمه. استخدمي الأزرار لتلوين الصدر والعجز والعروض والضرب والحشو، واسألي الطالبات قبل الضغط.',
  'وزّعي بطاقات الأدوار على أفراد المجموعة: القارئ، المتحدث، الكاتب، المدقق، مسؤول الوقت، مسؤول السبورة. تقرأ القارئة البيتين للبهلاني، وتحدد المجموعة الصدر والعجز والعروض والضرب والحشو، ثم تأتي ممثلة كل مجموعة لتحدد جزءًا على الشاشة.',
  'عرّفي الروي ونسبة القصيدة إليه. اقرئي آخر كل بيت ببطء ليسمعن الحرف الأخير، ثم نفّذي السؤالين.',
  'اذكري أن البحور ستة عشر. اطلبي من الطالبات تخمين اسم البحر من الصورة، ثم انقري البطاقة لكشف الاسم.',
  'اضغطي على كل تفعيلة لتسمعها الطالبات ويصفّقن معها.',
  'راجعي قاعدة: ما يُنطق يُكتب، وما لا يُنطق لا يُكتب. اطلبي كتابة الكلمات الأربع في الدفتر قبل كشف الإجابة.',
  'اكشفي الخطوات تدريجيًا للمثالين: الكتابة العادية، ثم العروضية، ثم الرموز، ثم التفعيلة. بعد ذلك ابدئي نشاط «اقصصي واكتبي»: تخرج طالبة من كل مجموعة فتقصّ بطاقة وتكتب إجابتها، ثم تعود بها وتخرج الطالبة نفسها لبطاقة أخرى. شغّلي المؤقت (٤ دقائق)، والفائزة المجموعة التي تجمع أكبر عدد من البطاقات الصحيحة.',
  'لخّصي الدرس في أربع نقاط، ثم نفّذي تذكرة الخروج. تظهر النتيجة بعد الإجابة عن الأسئلة الأربعة.',
];

export const meta: SlideMeta = {
  title: 'أساسيات في علم العروض (أ. صفية الحارثية)',
  createdAt: '2026-10-26T12:45:55.992Z',
};

export default [
  Cover,
  Goals,
  WhoIsKhalil,
  SoukStory,
  Definition,
  TentVerse,
  Parts,
  VerseHunt,
  Rawiy,
  Meters,
  Tafeelat,
  WritingRules,
  Examples,
  Review,
] satisfies Page[];
