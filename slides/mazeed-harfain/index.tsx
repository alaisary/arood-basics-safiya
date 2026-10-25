import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
} from '@open-slide/core';
import { type CSSProperties, type ReactNode, useState } from 'react';
import kClap from './assets/k-clap.png';
import kListen from './assets/k-listen.png';
import kPoint from './assets/k-point.png';
import kScale from './assets/k-scale.png';
import kScroll from './assets/k-scroll.png';
import kThink from './assets/k-think.png';
import kWelcome from './assets/k-welcome.png';
import kWrite from './assets/k-write.png';

export const design: DesignSystem = {
  palette: { bg: '#FDFCF6', text: '#1F2433', accent: '#C0392B' },
  fonts: {
    display: '"Aref Ruqaa", "Amiri", serif',
    body: '"Tajawal", "Segoe UI", Tahoma, sans-serif',
  },
  typeScale: { hero: 140, body: 36 },
  radius: 18,
};

const C = {
  navy: '#1E3A6E',
  red: '#C0392B',
  blue: '#2F6FB5',
  green: '#2E8B57',
  line: '#D4E2EF',
  margin: '#E58C8A',
  sticky: '#FCE68B',
  stickyEdge: '#E9CC5A',
  taskBg: 'rgba(226,236,248,.92)',
  card: '#FFFFFF',
  soft: '#55607A',
  tape: 'rgba(214,196,150,.75)',
  gold: '#C9971E',
};
const VERB = '"Amiri", serif';

// ── Webfonts + keyframes (injected once, keyed to this slide) ──────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Aref+Ruqaa:wght@700&family=Tajawal:wght@500;700;800&display=swap';
const FONT_LINK_ID = 'osd-webfont-mazeed-harfain';
const STYLE_ID = 'osd-styles-mazeed-harfain';
const css = `
@keyframes mz-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes mz-pop { 0% { transform: scale(.9); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
@keyframes mz-shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }
.mz-bob { animation: mz-bob 5s ease-in-out infinite; }
.mz-pop { animation: mz-pop .3s cubic-bezier(.22,1,.36,1) both; }
.mz-shake { animation: mz-shake .3s ease-in-out 2; }
.mz-btn:hover { filter: brightness(1.06); }
.mz-btn:active { transform: translateY(2px); }
[data-still] .mz-bob, [data-still] .mz-pop, [data-still] .mz-shake { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .mz-bob, .mz-pop, .mz-shake { animation: none !important; } }
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

// ── Shared building blocks ────────────────────────────────────────────────

// Lined notebook paper with the red margin on the right (RTL notebook).
function Paper({ children }: { children: ReactNode }) {
  return (
    <div
      dir="rtl"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--osd-font-body)',
        color: 'var(--osd-text)',
        background: 'var(--osd-bg)',
        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 53px, ${C.line} 53px 55px)`,
        backgroundPosition: '0 30px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 150,
          width: 3,
          background: C.margin,
          opacity: 0.8,
        }}
      />
      {children}
    </div>
  );
}

const R = ({ children }: { children: ReactNode }) => (
  <span style={{ color: C.red }}>{children}</span>
);
const N = ({ children }: { children: ReactNode }) => (
  <span style={{ color: C.navy }}>{children}</span>
);

// A verb in Amiri; letters wrapped in [ ] are the added letters, shown in red.
function W({ t, size }: { t: string; size?: number }) {
  const parts = t.split(/(\[[^\]]*\])/).filter(Boolean);
  return (
    <span style={{ fontFamily: VERB, fontWeight: 700, fontSize: size ?? '1.12em' }}>
      {parts.map((p, i) =>
        p.startsWith('[') ? (
          <span key={i} style={{ color: C.red }}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </span>
  );
}

function Heading({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <h2
      style={{
        position: 'absolute',
        top: 62,
        right: 200,
        left: 110,
        margin: 0,
        fontSize: 60,
        fontWeight: 800,
        lineHeight: 1.25,
        color: C.navy,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

function Khalil({ src, h, style }: { src: string; h: number; style?: CSSProperties }) {
  return (
    <div style={{ position: 'absolute', ...style }}>
      <div
        style={{
          position: 'absolute',
          bottom: -14,
          left: '10%',
          right: '10%',
          height: 40,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(31,36,51,.22), transparent)',
        }}
      />
      <img
        className="mz-bob"
        src={src}
        alt="الخليل"
        style={{ height: h, display: 'block', position: 'relative' }}
      />
    </div>
  );
}

function Sticky({
  children,
  title = 'ملاحظة صفية:',
  rotate = -2,
  style,
}: {
  children: ReactNode;
  title?: string;
  rotate?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        background: C.sticky,
        borderBottom: `6px solid ${C.stickyEdge}`,
        padding: '40px 30px 26px',
        fontSize: 29,
        lineHeight: 1.5,
        fontWeight: 700,
        color: C.navy,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 14px 26px rgba(31,36,51,.18)',
        zIndex: 3,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -14,
          left: '50%',
          marginLeft: -16,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #F08A7E, #B8352A 70%)',
          boxShadow: '0 4px 6px rgba(0,0,0,.3)',
        }}
      />
      <div style={{ marginBottom: 8, fontWeight: 800, textDecoration: 'underline' }}>{title}</div>
      <div style={{ fontWeight: 500, color: '#2A2F45' }}>{children}</div>
    </div>
  );
}

function RevealButton({ open, onClick, label }: { open: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      className="mz-btn"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      style={{
        flex: 'none',
        border: 0,
        borderRadius: 999,
        padding: '10px 26px',
        fontFamily: 'inherit',
        fontSize: 26,
        fontWeight: 800,
        cursor: 'pointer',
        background: open ? C.green : C.navy,
        color: '#fff',
        boxShadow: '0 4px 0 rgba(0,0,0,.2)',
      }}
    >
      {open ? 'إخفاء' : (label ?? 'الإجابة')}
    </button>
  );
}

// Dashed task box at the foot of a page, with an optional answer reveal.
function Task({
  label,
  children,
  answer,
  style,
}: {
  label: string;
  children: ReactNode;
  answer?: ReactNode;
  style?: CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 50,
        right: 200,
        left: 110,
        border: `3px dashed ${C.navy}`,
        borderRadius: 16,
        background: C.taskBg,
        padding: '20px 30px',
        fontSize: 34,
        lineHeight: 1.45,
        fontWeight: 700,
        zIndex: 2,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <R>{label}: </R>
          {children}
        </div>
        {answer && <RevealButton open={open} onClick={() => setOpen(!open)} />}
      </div>
      {answer && open && (
        <div className="mz-pop" style={{ marginTop: 10, color: C.green, fontSize: 32 }}>
          ✔ {answer}
        </div>
      )}
    </div>
  );
}

// A taped polaroid-style card holding a big emoji illustration.
function Sticker({
  emoji,
  size = 150,
  rotate = 3,
  style,
}: {
  emoji: string;
  size?: number;
  rotate?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        background: C.card,
        padding: 22,
        width: size + 64,
        height: size + 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size,
        lineHeight: 1,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 10px 22px rgba(31,36,51,.16)',
        borderRadius: 6,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -16,
          left: '50%',
          width: 120,
          height: 34,
          marginLeft: -60,
          background: C.tape,
          transform: 'rotate(-4deg)',
        }}
      />
      {emoji}
    </div>
  );
}

// A white card with a numbered meaning heading.
function MeaningCard({
  num,
  title,
  emoji,
  children,
  style,
}: {
  num: string;
  title: string;
  emoji: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        background: 'rgba(255,255,255,.94)',
        border: `3px solid ${C.navy}`,
        borderRadius: 20,
        padding: '36px 40px 32px',
        boxShadow: '0 10px 0 rgba(30,58,110,.12)',
        fontSize: 34,
        lineHeight: 1.55,
        fontWeight: 500,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 14 }}>
        <div
          style={{
            width: 110,
            height: 110,
            flex: 'none',
            borderRadius: '50%',
            background: '#EEF4FB',
            border: `3px solid ${C.blue}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 62,
          }}
        >
          {emoji}
        </div>
        <div style={{ fontSize: 46, fontWeight: 800, color: C.navy }}>
          <R>{num}.</R> {title}
        </div>
      </div>
      {children}
    </div>
  );
}

const Ex = ({ children }: { children: ReactNode }) => (
  <div style={{ marginTop: 12, fontWeight: 700, color: C.navy }}>{children}</div>
);

// ── Pages ─────────────────────────────────────────────────────────────────

const Cover: Page = () => (
  <Paper>
    <Khalil src={kWrite} h={480} style={{ left: 70, bottom: 260 }} />
    <div style={{ position: 'absolute', top: 120, right: 210, width: 1000 }}>
      <div style={{ fontSize: 48, fontWeight: 800, color: C.red }}>الصرف</div>
      <h1
        style={{
          margin: '6px 0 0',
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 700,
          lineHeight: 1.25,
          color: C.navy,
        }}
      >
        درس المزيد بحرفين
      </h1>
      <svg width="760" height="30" viewBox="0 0 760 30" style={{ display: 'block', marginTop: 4 }}>
        <path
          d="M5 18 C 150 4, 320 28, 480 14 S 700 8, 755 16"
          stroke={C.red}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div style={{ marginTop: 34, fontSize: 40, fontWeight: 700, lineHeight: 1.6 }}>
        إعداد: الأستاذة أسماء الحارثية
      </div>
      <div style={{ fontSize: 36, fontWeight: 500, color: C.soft, lineHeight: 1.6 }}>
        الصف الثاني عشر — الفصل الدراسي الأول
      </div>
    </div>
    <Sticky rotate={-3} style={{ top: 610, right: 260, width: 560 }}>
      أهلاً بكم يا أبطال الثاني عشر في رحلتنا اليوم لاستكشاف أسرار الأفعال المزيدة! جهّزوا دفاتركم
      وانتباهكم.
    </Sticky>
    <Task
      label="استعد للمشاركة"
      answer={
        <>
          من أطول الأفعال في القرآن الكريم: <W t="فَأَسْقَيْنَاكُمُوهُ" /> (الحجر: ٢٢)
        </>
      }
    >
      ما هو أطول فعل في اللغة العربية تعرفه؟ احتفظ بالإجابة في ذهنك!
    </Task>
  </Paper>
);

const Definitions: Page = () => (
  <Paper>
    <Heading>الفعل المجرد والفعل المزيد</Heading>
    <div
      style={{
        position: 'absolute',
        top: 190,
        right: 200,
        width: 960,
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
        fontSize: 36,
        lineHeight: 1.6,
        fontWeight: 500,
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,.94)',
          border: `3px solid ${C.navy}`,
          borderRadius: 20,
          padding: '26px 36px',
        }}
      >
        <b style={{ color: C.navy }}>الفعل المجرد: </b>
        كلّ فعل حروفه أصلية لا يمكن الاستغناء عنها، مثل: <W t="سَمِعَ" />
      </div>
      <div
        style={{
          background: 'rgba(255,255,255,.94)',
          border: `3px solid ${C.red}`,
          borderRadius: 20,
          padding: '26px 36px',
        }}
      >
        <b style={{ color: C.red }}>الفعل المزيد: </b>
        ما زيد على حروفه الأصلية حرف أو أكثر، ويمكن الاستغناء عنها دون فقدان المعنى الأصلي، مثل:{' '}
        <W t="[ا]سْ[تَ]مَعَ" />
      </div>
    </div>
    <Khalil src={kScale} h={560} style={{ left: 300, top: 220 }} />
    <div
      style={{
        position: 'absolute',
        top: 210,
        left: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        alignItems: 'center',
        fontSize: 54,
      }}
    >
      <div style={{ background: '#fff', border: `3px solid ${C.navy}`, borderRadius: 14, padding: '2px 26px' }}>
        <W t="سَمِعَ" />
      </div>
      <div style={{ fontSize: 40, color: C.soft }}>⚖</div>
      <div style={{ background: '#fff', border: `3px solid ${C.red}`, borderRadius: 14, padding: '2px 26px' }}>
        <W t="[ا]سْ[تَ]مَعَ" />
      </div>
    </div>
    <Sticky title="تذكّر جيداً!" rotate={2} style={{ top: 640, right: 220, width: 560 }}>
      حروف المضارعة (أنيت) والضمائر المتصلة لا تُعدّ من حروف الزيادة أبداً.
    </Sticky>
    <Task
      label="صنّف سريعاً"
      style={{ right: 820 }}
      answer={
        <>
          مجرد؛ نحذف الياء والواو فيبقى <W t="كَتَبَ" />
        </>
      }
    >
      الفعل <W t="يَكْتُبُونَ" />.. مجرد أم مزيد؟ (احذف الضمائر وحرف المضارعة أولاً!)
    </Task>
  </Paper>
);

function WeightCard({
  verb,
  added,
  count,
  color,
  style,
}: {
  verb: string;
  added: string;
  count: string;
  color: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        width: 360,
        background: 'rgba(255,255,255,.95)',
        border: `4px solid ${color}`,
        borderRadius: 22,
        padding: '22px 24px 26px',
        textAlign: 'center',
        boxShadow: '0 10px 0 rgba(30,58,110,.1)',
        ...style,
      }}
    >
      <W t={verb} size={80} />
      <div style={{ fontSize: 30, fontWeight: 700, color: C.soft, marginTop: 4 }}>بزيادة {added}</div>
      <div
        style={{
          display: 'inline-block',
          marginTop: 16,
          background: color,
          color: '#fff',
          borderRadius: 999,
          padding: '6px 26px',
          fontSize: 30,
          fontWeight: 800,
        }}
      >
        {count}
      </div>
    </div>
  );
}

const WeightsMap: Page = () => (
  <Paper>
    <Heading>أوزان المزيد بحرفين</Heading>
    <Khalil src={kPoint} h={640} style={{ left: 90, top: 190 }} />
    <div
      style={{
        position: 'absolute',
        top: 175,
        left: 990,
        width: 250,
        height: 250,
        borderRadius: '50%',
        border: `5px double ${C.navy}`,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 44,
        fontWeight: 800,
        lineHeight: 1.3,
        color: C.navy,
      }}
    >
      المزيد
      <br />
      بحرفين
    </div>
    <svg
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <defs>
        <marker id="mz-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={C.blue} />
        </marker>
      </defs>
      <path d="M1180 405 C 1260 450, 1350 450, 1390 500" stroke={C.blue} strokeWidth="5" fill="none" markerEnd="url(#mz-arrow)" />
      <path d="M1115 428 C 1115 450, 1010 470, 1010 500" stroke={C.blue} strokeWidth="5" fill="none" markerEnd="url(#mz-arrow)" />
      <path d="M1045 405 C 900 450, 700 440, 640 500" stroke={C.blue} strokeWidth="5" fill="none" markerEnd="url(#mz-arrow)" />
    </svg>
    <WeightCard verb="[ا]فْ[تَ]عَلَ" added="(الألف والتاء)" count="له ٥ معانٍ" color={C.blue} style={{ top: 515, right: 360 }} />
    <WeightCard verb="[تَ]فَ[ا]عَلَ" added="(التاء والألف)" count="له ٣ معانٍ" color={C.red} style={{ top: 515, right: 760 }} />
    <WeightCard verb="[ا]فْعَلَّ" added="(الألف والتضعيف)" count="له معنى واحد" color={C.green} style={{ top: 515, right: 1160 }} />
    <Sticky rotate={3} style={{ top: 170, left: 490, width: 430 }}>
      ترتيب الحروف مهم جداً! في (افتعل) الزيادة هي الألف ثم التاء، أما في (تفاعل) فالزيادة هي التاء ثم
      الألف.
    </Sticky>
    <Task
      label="اربط الفعل بوزنه"
      answer={
        <>
          <W t="اخْتَارَ" /> ← افْتَعَلَ ، <W t="احْمَرَّ" /> ← افْعَلَّ ، <W t="تَعَاوَنَ" /> ← تَفَاعَلَ
        </>
      }
    >
      <W t="اخْتَارَ" /> ، <W t="احْمَرَّ" /> ، <W t="تَعَاوَنَ" /> — اربط كل فعل بالوزن المناسب له في
      الخريطة.
    </Task>
  </Paper>
);

const Iftaal1: Page = () => (
  <Paper>
    <Heading>
      أولاً: وزن (<W t="[ا]فْ[تَ]عَلَ" />) — حروف الزيادة (<R>ا ، تَ</R>)
    </Heading>
    <MeaningCard num="1" title="المشاركة" emoji="🤝" style={{ top: 190, right: 200, width: 690 }}>
      تشارك اثنين أو أكثر في الفعل.
      <Ex>
        أمثلة: <W t="[ا]خْ[تَ]صَمَ" /> ، <W t="[ا]شْ[تَ]رَكَ" /> ، <W t="[ا]خْ[تَ]لَفَ" /> ،{' '}
        <W t="[ا]لْ[تَ]حَمَ" />
      </Ex>
    </MeaningCard>
    <MeaningCard num="2" title="المطاوعة" emoji="🥛" style={{ top: 190, right: 930, width: 560 }}>
      تحوّل الفعل من متعدٍّ إلى لازم (استجابة المفعول للفعل).
      <Ex>
        <W t="مَزَجَ" /> <span style={{ fontSize: 26, color: C.soft }}>(متعدٍّ)</span> ←{' '}
        <W t="[ا]مْ[تَ]زَجَ" /> <span style={{ fontSize: 26, color: C.soft }}>(لازم)</span>
      </Ex>
    </MeaningCard>
    <Sticky rotate={-3} style={{ top: 560, left: 130, width: 520 }}>
      المطاوعة تعني أن المفعول به طاوعك وأصبح فاعلاً: مَزَجْتُ الحليبَ فامْتَزَجَ الحليبُ. إنها عكس التعدية!
    </Sticky>
    <Task
      label="طبّق المطاوعة"
      answer={
        <>
          رَسَمَ الفنانُ اللوحةَ فـ<W t="[ا]رْ[تَ]سَمَتْ" /> اللوحةُ.
        </>
      }
      style={{ left: 700 }}
    >
      حوّل الفعل في الجملة: (<W t="رَسَمَ" /> الفنانُ اللوحةَ فـ.....) على وزن افتعل لتدل على المطاوعة.
    </Task>
  </Paper>
);

const Iftaal2: Page = () => (
  <Paper>
    <Heading>
      تابع وزن (<W t="[ا]فْ[تَ]عَلَ" />)
    </Heading>
    <MeaningCard num="3" title="الاتّخاذ" emoji="🏜️" style={{ top: 180, right: 200, width: 700 }}>
      جعل الشيء لنفسك، أو اتخاذه صفة أو أداة.
      <Ex>
        أمثلة: <W t="[ا]فْ[تَ]رَشَ" /> الأرضَ = اتّخذها فراشاً ، <W t="[ا][تَّ]خَذَ" />
      </Ex>
    </MeaningCard>
    <MeaningCard num="4" title="الاجتهاد والطلب" emoji="📚" style={{ top: 180, right: 940, width: 660 }}>
      بذل جهد وتعب شديد للحصول على الشيء.
      <Ex>
        أمثلة: <W t="[ا]كْ[تَ]سَبَ" /> المالَ بجهده ، <W t="[ا]جْ[تَ]هَدَ" />
      </Ex>
    </MeaningCard>
    <Sticky title="لتمييز الاتخاذ:" rotate={2} style={{ top: 590, right: 230, width: 620 }}>
      ضع كلمة (اتّخذ) مكان الفعل: الْتَحَفَ السماءَ = اتّخذ السماءَ لحافاً.
    </Sticky>
    <Task
      label="استنتج المعنى"
      style={{ right: 900 }}
      answer="الاجتهاد والطلب: طلب الكتابة وبذل الجهد فيها، لا مجرد الكتابة."
    >
      ما معنى الزيادة في <W t="[ا]كْ[تَ]تَبَ" /> مقارنة بالمجرد <W t="كَتَبَ" />؟
    </Task>
  </Paper>
);

const Izhar: Page = () => (
  <Paper>
    <Heading>
      تابع وزن (<W t="[ا]فْ[تَ]عَلَ" />)
    </Heading>
    <Khalil src={kWelcome} h={640} style={{ left: 80, top: 190 }} />
    <Sticker emoji="❤️" size={170} rotate={-4} style={{ top: 190, left: 560 }} />
    <div
      style={{
        position: 'absolute',
        top: 200,
        right: 200,
        width: 900,
        fontSize: 40,
        lineHeight: 1.65,
        fontWeight: 700,
      }}
    >
      <div style={{ fontSize: 52, fontWeight: 800, color: C.navy, marginBottom: 10 }}>
        <R>5.</R> الإظهار
      </div>
      إظهار شعور أو صفة داخلية حقيقية للعلن، وغالباً تكون صفات محمودة وصادقة.
      <div style={{ marginTop: 22, fontSize: 36, color: C.navy }}>
        <W t="[ا]عْ[تَ]ذَرَ" /> = أظهر العذر
        <br />
        <W t="[ا]فْ[تَ]خَرَ" /> = أظهر الفخر
        <br />
        <W t="[ا]بْ[تَ]هَجَ" /> = أظهر الفرح
      </div>
    </div>
    <Sticky rotate={3} style={{ top: 520, left: 560, width: 400 }}>
      الإظهار في (افتعل) حقيقي وصادق ونابع من الداخل، وليس خداعاً للمتلقي!
    </Sticky>
    <Task label="أكمل الفراغ" answer="يفيد إظهارَ الشكوى الموجودة في القلب." style={{ left: 560 }}>
      الفعل <W t="[ا]شْ[تَ]كَى" /> على وزن افتعل، ويفيد ........ الشكوى الموجودة في القلب.
    </Task>
  </Paper>
);

const Tafaal1: Page = () => (
  <Paper>
    <Heading>
      ثانياً: وزن (<W t="[تَ]فَ[ا]عَلَ" />) — حروف الزيادة (<R>تَ ، ا</R>)
    </Heading>
    <MeaningCard num="1" title="التدرّج" emoji="🪜" style={{ top: 190, right: 200, width: 690 }}>
      حصول الشيء خطوة بخطوة، أو شيئاً فشيئاً (وليس دفعة واحدة).
      <Ex>
        أمثلة: <W t="[تَ]زَ[ا]يَدَ" /> ماءُ البحر ، <W t="[تَ]قَ[ا]طَرَ" /> المطرُ ،{' '}
        <W t="[تَ]مَ[ا]ثَلَ" /> للشفاء
      </Ex>
    </MeaningCard>
    <MeaningCard num="2" title="التظاهر" emoji="🎭" style={{ top: 190, right: 930, width: 620 }}>
      ادّعاء صفة غير حقيقية، أو إظهار خلاف الواقع (التمثيل).
      <Ex>
        أمثلة: <W t="[تَ]مَ[ا]رَضَ" /> = ادّعى المرض وهو سليم ، <W t="[تَ]جَ[ا]هَلَ" /> ،{' '}
        <W t="[تَ]غَ[ا]فَلَ" /> ، <W t="[تَ]بَ[ا]كَى" />
      </Ex>
    </MeaningCard>
    <Sticky rotate={-2} style={{ top: 640, right: 1000, width: 560 }}>
      التظاهر غالباً يرتبط بصفات غير محمودة أو تهرّب من موقف، كأنك ترتدي قناعاً يخفي حقيقتك.
    </Sticky>
    <Task
      label="ميّز المعنى"
      style={{ left: 940 }}
      answer="تدرّج: وصلت الإبل إلى النبع تباعاً، واحدةً بعد أخرى."
    >
      <W t="[تَ]وَ[ا]رَدَتِ" /> الإبلُ إلى النبع.. هل هذا تدرّج أم تظاهر؟ ولماذا؟
    </Task>
  </Paper>
);

const Tafaal2: Page = () => (
  <Paper>
    <Heading>
      تابع وزن (<W t="[تَ]فَ[ا]عَلَ" />)
    </Heading>
    <Khalil src={kListen} h={640} style={{ left: 90, top: 190 }} />
    <div
      style={{
        position: 'absolute',
        top: 180,
        left: 560,
        right: 200,
        height: 230,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        fontSize: 130,
      }}
    >
      <span>🧍</span>
      <span style={{ fontSize: 120, color: C.gold, fontWeight: 800 }}>⇄</span>
      <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>🧍</span>
    </div>
    <div
      style={{
        position: 'absolute',
        top: 440,
        right: 200,
        width: 1150,
        fontSize: 40,
        lineHeight: 1.65,
        fontWeight: 700,
      }}
    >
      <span style={{ fontSize: 50, fontWeight: 800, color: C.navy }}>
        <R>3.</R> المشاركة:{' '}
      </span>
      تشارك اثنين أو أكثر بحيث يكون كلٌّ منهما فاعلاً ومفعولاً به في المعنى؛ فالأداء متبادل بقوة
      متساوية.
      <div style={{ marginTop: 16, color: C.navy, fontSize: 38 }}>
        أمثلة: <W t="[تَ]عَ[ا]وَنَ" /> الولدان ، <W t="[تَ]خَ[ا]صَمَ" /> الرجلان ،{' '}
        <W t="[تَ]قَ[ا]تَلَ" /> الجيشان
      </div>
    </div>
    <Sticky rotate={-3} style={{ top: 135, left: 520, width: 380 }}>
      في (تفاعل) لا نستطيع أن نحدد من بدأ الفعل؛ فكلاهما فاعل في وقت واحد!
    </Sticky>
    <Task label="حرّك ذهنك" style={{ left: 560 }} answer={<W t="[تَ]سَ[ا]مَحَ" />}>
      هات فعلاً على وزن تفاعل يفيد المشاركة من الجذر (س م ح).
    </Task>
  </Paper>
);

function ClipCard({
  title,
  color,
  children,
  style,
}: {
  title: string;
  color: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        background: '#fff',
        border: `4px solid ${color}`,
        borderRadius: 8,
        padding: '30px 38px',
        fontSize: 34,
        lineHeight: 1.55,
        fontWeight: 500,
        boxShadow: '0 12px 24px rgba(31,36,51,.12)',
        ...style,
      }}
    >
      <div style={{ position: 'absolute', top: -46, left: 50, fontSize: 70, transform: 'rotate(20deg)' }}>📎</div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          color: C.navy,
          textAlign: 'center',
          paddingBottom: 14,
          borderBottom: `3px solid ${color}`,
          marginBottom: 18,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

const Compare: Page = () => (
  <Paper>
    <Heading>لا تخلط بين المعاني! إليك الدليل الذكي للتفرقة</Heading>
    <div
      style={{
        position: 'absolute',
        top: 40,
        left: 110,
        border: `5px solid ${C.red}`,
        color: C.red,
        borderRadius: 12,
        padding: '4px 26px',
        fontSize: 48,
        fontWeight: 800,
        transform: 'rotate(-10deg)',
        opacity: 0.88,
      }}
    >
      هامّ جداً
    </div>
    <ClipCard title="الإظهار ≠ التظاهر" color={C.red} style={{ top: 200, right: 200, width: 640 }}>
      <b style={{ color: C.red }}>الإظهار (افْتَعَلَ):</b> شعور حقيقي صادق من الداخل (اعتذر، افتخر).
      <div style={{ height: 3, background: C.line, margin: '18px 60px' }} />
      <b style={{ color: C.red }}>التظاهر (تَفَاعَلَ):</b> ادّعاء كاذب وإظهار خلاف الواقع (تمارض، تغافل).
    </ClipCard>
    <ClipCard title="المشاركة هنا وهناك" color={C.navy} style={{ top: 200, right: 880, width: 640 }}>
      <b style={{ color: C.navy }}>المشاركة (افْتَعَلَ):</b> مجرد الاشتراك في الفعل (اختلف، اشترك).
      <div style={{ height: 3, background: C.line, margin: '18px 60px' }} />
      <b style={{ color: C.navy }}>المشاركة (تَفَاعَلَ):</b> اشتراك بقوة وتبادل الأدوار كفاعل ومفعول
      (تعاون، تقاتل).
    </ClipCard>
    <Sticky rotate={-3} style={{ top: 640, right: 700, width: 520 }}>
      هذه الشريحة مفتاحك السري في الامتحانات لحل أسئلة التفرقة الدقيقة بين المعاني.
    </Sticky>
    <Khalil src={kPoint} h={420} style={{ left: 60, top: 520 }} />
    <Task
      label="تحدٍّ"
      style={{ left: 420 }}
      answer={
        <>
          <W t="تَبَاكَى" /> يدل على الكذب (تَفَاعَلَ: تظاهر)، و<W t="اشْتَكَى" /> على وزن افْتَعَلَ (إظهار
          صادق).
        </>
      }
    >
      أيّ الفعلين يدل على الكذب: (تَبَاكَى) أم (اشْتَكَى)؟ وما وزن كلٍّ منهما؟
    </Task>
  </Paper>
);

const Ifalla: Page = () => (
  <Paper>
    <Heading>
      ثالثاً: وزن (<W t="[ا]فْعَ[لَّ]" />) — حروف الزيادة (<R>ا</R> ، التضعيف «الشدّة»)
    </Heading>
    <Khalil src={kThink} h={600} style={{ left: 100, top: 230 }} />
    <Sticker emoji="🌹" size={150} rotate={4} style={{ top: 200, left: 470 }} />
    <Sticker emoji="👁️" size={150} rotate={-5} style={{ top: 200, left: 760 }} />
    <div
      style={{
        position: 'absolute',
        top: 200,
        right: 200,
        width: 760,
        fontSize: 38,
        lineHeight: 1.65,
        fontWeight: 700,
      }}
    >
      <div style={{ fontSize: 46, fontWeight: 800, color: C.navy }}>المعنى الوحيد:</div>
      المبالغة والزيادة الشديدة في <R>اللون</R> أو <R>العيب</R> (وخاصة العيوب الخَلْقية).
    </div>
    <div
      style={{
        position: 'absolute',
        top: 520,
        right: 200,
        width: 1300,
        fontSize: 38,
        lineHeight: 1.75,
        fontWeight: 700,
      }}
    >
      <div>
        <R>1.</R> في اللون: <W t="[ا]حْمَ[رَّ]" /> ، <W t="[ا]صْفَ[رَّ]" /> ، <W t="[ا]خْضَ[رَّ]" />{' '}
        <span style={{ fontSize: 30, color: C.soft }}>(قوة اللون مقارنة بـ حَمُرَ)</span>
      </div>
      <div>
        <R>2.</R> في العيب: <W t="[ا]عْوَ[جَّ]" /> ، <W t="[ا]حْوَ[لَّ]" /> ، <W t="[ا]عْوَ[رَّ]" />{' '}
        <span style={{ fontSize: 30, color: C.soft }}>(زيادة العيب ووضوحه)</span>
      </div>
    </div>
    <Task label="صُغِ الفعل" answer={<W t="[ا]سْوَ[دَّ] اللَّيْلُ" />} style={{ left: 560 }}>
      كيف تعبّر عن المبالغة في سواد الليل المظلم باستخدام وزن افعلّ؟
    </Task>
  </Paper>
);

function Leaf({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div
      className="mz-pop"
      style={{ position: 'absolute', left: x, top: y, fontSize: 36, fontWeight: 800, whiteSpace: 'nowrap' }}
    >
      {children}
    </div>
  );
}

const Summary: Page = () => {
  const [hide, setHide] = useState(false);
  return (
    <Paper>
      <Heading>خلاصة المزيد بحرفين (٩ معانٍ في لوحة واحدة)</Heading>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <path d="M1010 440 C 1080 360, 1150 330, 1290 330" stroke={C.blue} strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M1010 600 C 1080 690, 1150 720, 1290 720" stroke={C.red} strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M790 520 L 560 520" stroke={C.green} strokeWidth="16" strokeLinecap="round" />
        {!hide && (
          <g stroke={C.blue} strokeWidth="4" fill="none">
            <path d="M1290 330 C 1340 330, 1360 200, 1420 200" />
            <path d="M1290 330 C 1340 330, 1370 265, 1420 265" />
            <path d="M1290 330 L 1420 330" />
            <path d="M1290 330 C 1340 330, 1370 395, 1420 395" />
            <path d="M1290 330 C 1340 330, 1360 460, 1420 460" />
          </g>
        )}
        {!hide && (
          <g stroke={C.red} strokeWidth="4" fill="none">
            <path d="M1290 720 C 1340 720, 1360 650, 1420 650" />
            <path d="M1290 720 L 1420 720" />
            <path d="M1290 720 C 1340 720, 1360 790, 1420 790" />
          </g>
        )}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 780,
          top: 400,
          width: 240,
          height: 240,
          borderRadius: '50%',
          border: `6px double ${C.navy}`,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: 42,
          fontWeight: 800,
          lineHeight: 1.3,
          color: C.navy,
          boxShadow: '0 0 0 18px rgba(30,58,110,.06)',
        }}
      >
        أوزان
        <br />
        بحرفين
      </div>
      <div style={{ position: 'absolute', left: 1060, top: 385, color: C.blue, fontSize: 40, fontWeight: 800 }}>
        <W t="افْتَعَلَ" /> (٥)
      </div>
      <div style={{ position: 'absolute', left: 1060, top: 590, color: C.red, fontSize: 40, fontWeight: 800 }}>
        <W t="تَفَاعَلَ" /> (٣)
      </div>
      <div style={{ position: 'absolute', left: 600, top: 450, color: C.green, fontSize: 40, fontWeight: 800 }}>
        <W t="افْعَلَّ" /> (١)
      </div>
      {!hide && (
        <>
          <Leaf x={1440} y={175}>مشاركة</Leaf>
          <Leaf x={1440} y={240}>مطاوعة</Leaf>
          <Leaf x={1440} y={305}>اتّخاذ</Leaf>
          <Leaf x={1440} y={370}>اجتهاد وطلب</Leaf>
          <Leaf x={1440} y={435}>إظهار</Leaf>
          <Leaf x={1440} y={625}>مشاركة</Leaf>
          <Leaf x={1440} y={695}>تظاهر</Leaf>
          <Leaf x={1440} y={765}>تدرّج</Leaf>
          <Leaf x={270} y={490}>
            <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
              المبالغة في
              <br />
              اللون أو العيب
            </div>
          </Leaf>
        </>
      )}
      <Khalil src={kScroll} h={420} style={{ left: 90, top: 560 }} />
      <Sticky rotate={-3} style={{ top: 140, left: 250, width: 430 }}>
        التقط صورة لهذه الشاشة واحتفظ بها في هاتفك للمراجعة السريعة ليلة الاختبار!
      </Sticky>
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: 420,
          right: 200,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          border: `3px dashed ${C.navy}`,
          borderRadius: 16,
          background: C.taskBg,
          padding: '20px 30px',
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        <div style={{ flex: 1 }}>
          <R>هل تذكر؟ </R>راجع الخريطة ١٠ ثوانٍ، ثم أخفِ المعاني وحاول سرد معاني وزن (افتعل) الخمسة.
        </div>
        <button
          type="button"
          className="mz-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setHide(!hide)}
          style={{
            flex: 'none',
            border: 0,
            borderRadius: 999,
            padding: '10px 26px',
            fontFamily: 'inherit',
            fontSize: 26,
            fontWeight: 800,
            cursor: 'pointer',
            background: hide ? C.green : C.navy,
            color: '#fff',
            boxShadow: '0 4px 0 rgba(0,0,0,.2)',
          }}
        >
          {hide ? 'أظهر المعاني' : 'أخفِ المعاني'}
        </button>
      </div>
    </Paper>
  );
};

// One multiple-choice row: tap an option, it turns green (right) or red (wrong).
function Choice({ sentence, options, right }: { sentence: ReactNode; options: string[]; right: number }) {
  const [pick, setPick] = useState(-1);
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.5 }}>{sentence}</div>
      <div style={{ display: 'flex', gap: 22, marginTop: 10 }}>
        {options.map((o, i) => {
          const state = pick === i ? (i === right ? 'right' : 'wrong') : 'idle';
          return (
            <button
              key={o}
              type="button"
              className={`mz-btn${state === 'wrong' ? ' mz-shake' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setPick(i)}
              style={{
                border: `3px solid ${state === 'right' ? C.green : state === 'wrong' ? C.red : C.navy}`,
                background: state === 'right' ? C.green : state === 'wrong' ? C.red : '#fff',
                color: state === 'idle' ? C.navy : '#fff',
                borderRadius: 12,
                padding: '6px 26px',
                fontFamily: 'inherit',
                fontSize: 32,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {state === 'right' ? '✔ ' : state === 'wrong' ? '✘ ' : '☐ '}
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const Activity1: Page = () => (
  <Paper>
    <Khalil src={kThink} h={500} style={{ left: 120, top: 500 }} />
    <div
      style={{
        position: 'absolute',
        top: 80,
        right: 200,
        width: 1180,
        height: 850,
        background: '#F7F3E8',
        border: '2px solid #D9CFB8',
        borderRadius: 6,
        padding: '50px 60px',
        boxShadow: '0 16px 30px rgba(31,36,51,.16)',
      }}
    >
      <div style={{ position: 'absolute', top: 18, right: 24, width: 22, height: 22, borderRadius: '50%', background: '#9AA3AE' }} />
      <div style={{ position: 'absolute', top: 18, left: 24, width: 22, height: 22, borderRadius: '50%', background: '#9AA3AE' }} />
      <div style={{ fontSize: 46, fontWeight: 800, color: C.navy, marginBottom: 34 }}>
        <R>النشاط التطبيقي (١):</R> حدّد المعنى الذي تفيده الزيادة في الأفعال الملوّنة
      </div>
      <Choice
        sentence={
          <>
            ١. (<W t="[تَ]قَ[ا]طَرَتْ" />) الدموعُ من عينَي الطفل.
          </>
        }
        options={['التدرّج', 'التظاهر', 'الإظهار']}
        right={0}
      />
      <Choice
        sentence={
          <>
            ٢. (<W t="[ا]فْ[تَ]رَشَ" />) المسافرُ رمالَ الصحراء الساخنة.
          </>
        }
        options={['المطاوعة', 'الاتّخاذ', 'المشاركة']}
        right={1}
      />
      <Choice
        sentence={
          <>
            ٣. (<W t="[تَ]مَ[ا]رَضَ" />) الموظفُ ليهرب من ضغط العمل.
          </>
        }
        options={['الإظهار', 'التظاهر', 'التدرّج']}
        right={1}
      />
    </div>
    <Sticky rotate={-3} style={{ top: 110, left: 110, width: 400 }}>
      اقرأ الجملة كاملة دائماً وتخيّل الموقف؛ فالسياق هو الذي يحدد معنى الزيادة بدقة.
    </Sticky>
  </Paper>
);

function Cell({ children, head, show }: { children?: ReactNode; head?: boolean; show?: boolean }) {
  return (
    <td
      style={{
        border: `3px solid ${C.navy}`,
        height: head ? 64 : 66,
        textAlign: 'center',
        fontSize: head ? 32 : 32,
        fontWeight: 800,
        color: head ? C.navy : C.green,
        background: head ? '#EEF4FB' : '#fff',
      }}
    >
      {head || show ? children : null}
    </td>
  );
}

const Activity2: Page = () => {
  const [show, setShow] = useState(false);
  return (
    <Paper>
      <Khalil src={kPoint} h={480} style={{ left: 90, top: 470 }} />
      <Sticky title="احذر الأفخاخ!" rotate={-3} style={{ top: 110, left: 120, width: 380 }}>
        أرجع الفعل إلى أصله باستبعاد الضمائر وتاء التأنيث، كألف الاثنين في (تَعَاوَنَا) وتاء التأنيث في
        (احْمَرَّتْ).
      </Sticky>
      <div
        style={{
          position: 'absolute',
          top: 70,
          right: 200,
          width: 1160,
          fontSize: 38,
          lineHeight: 1.7,
          fontWeight: 700,
        }}
      >
        <div style={{ fontSize: 46, fontWeight: 800, color: C.navy, marginBottom: 12 }}>
          <R>النشاط التطبيقي (٢):</R> استخرج وصنّف
        </div>
        <div
          style={{
            background: '#fff',
            border: `2px solid ${C.line}`,
            borderRadius: 14,
            padding: '16px 28px',
          }}
        >
          اشْتَرَكَ الطالبانِ في المسابقةِ، وتَعَاوَنَا على إنجازِ البحثِ، حتى احْمَرَّتْ أعينُهما من السهرِ
          والإرهاقِ، فاكْتَسَبَا خبرةً عظيمةً.
        </div>
        <div style={{ marginTop: 16, fontSize: 34 }}>
          <R>المطلوب:</R> استخرج كل فعل مزيد بحرفين، واذكر وزنه وحروف الزيادة ومعنى الزيادة.
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <Cell head>الفعل</Cell>
              <Cell head>الوزن</Cell>
              <Cell head>حروف الزيادة</Cell>
              <Cell head>المعنى</Cell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Cell show={show}>اشْتَرَكَ</Cell>
              <Cell show={show}>افْتَعَلَ</Cell>
              <Cell show={show}>ا ، ت</Cell>
              <Cell show={show}>المشاركة</Cell>
            </tr>
            <tr>
              <Cell show={show}>تَعَاوَنَ</Cell>
              <Cell show={show}>تَفَاعَلَ</Cell>
              <Cell show={show}>ت ، ا</Cell>
              <Cell show={show}>المشاركة</Cell>
            </tr>
            <tr>
              <Cell show={show}>احْمَرَّ</Cell>
              <Cell show={show}>افْعَلَّ</Cell>
              <Cell show={show}>ا ، التضعيف</Cell>
              <Cell show={show}>المبالغة في اللون</Cell>
            </tr>
            <tr>
              <Cell show={show}>اكْتَسَبَ</Cell>
              <Cell show={show}>افْتَعَلَ</Cell>
              <Cell show={show}>ا ، ت</Cell>
              <Cell show={show}>الاجتهاد والطلب</Cell>
            </tr>
          </tbody>
        </table>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 22, fontSize: 32 }}>
          <div style={{ flex: 1 }}>
            <R>ارسم جدولك:</R> ارسم هذا الجدول في دفترك وقم بالحل.
          </div>
          <RevealButton open={show} onClick={() => setShow(!show)} label="اعرض الحل" />
        </div>
      </div>
    </Paper>
  );
};

const Closing: Page = () => (
  <Paper>
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 110,
        width: 230,
        height: 230,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, #F6D77A, ${C.gold} 70%)`,
        boxShadow: '0 0 0 10px #E8C25A, 0 12px 24px rgba(0,0,0,.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        color: '#6B4A08',
        transform: 'rotate(-8deg)',
      }}
    >
      التفوّق
    </div>
    <Khalil src={kClap} h={600} style={{ left: 380, top: 190 }} />
    <div
      style={{
        position: 'absolute',
        top: 150,
        right: 200,
        width: 880,
        fontSize: 42,
        lineHeight: 1.7,
        fontWeight: 700,
      }}
    >
      إلى هنا نكون قد أتممنا رحلتنا بنجاح في <N>درس المزيد بحرفين</N>.
      <div style={{ marginTop: 20 }}>أنتم الآن تمتلكون المفاتيح لاستخراج معاني الزيادة ببراعة!</div>
      <div style={{ marginTop: 36, fontSize: 50, fontWeight: 800, color: C.navy }}>
        مع تحيات: الأستاذة أسماء الحارثية
      </div>
      <div style={{ marginTop: 14, color: C.soft }}>دعواتي لكم بالتوفيق والتفوّق الدائم.</div>
    </div>
    <Sticky rotate={3} style={{ top: 730, right: 230, width: 520 }}>
      علم الصرف ليس مجرد حفظ أوزان، بل هو فهم وتذوّق عميق لدقة لغتنا العربية الجميلة.
    </Sticky>
    <Task label="مهمة اليوم الإثرائية" style={{ right: 800 }}>
      ابحث في القرآن الكريم أو في الصحف عن ٣ أفعال مزيدة بحرفين، واستخرج معانيها، وشاركها في الحصة
      القادمة!
    </Task>
  </Paper>
);

export const notes: (string | undefined)[] = [
  `رحّبي بالطالبات: درسنا اليوم المزيد بحرفين، ومعنا الخليل رفيق رحلتنا.
اسألي: ما أطول فعل تعرفينه؟ اتركي الإجابة معلّقة، ثم اعرضيها في نهاية التمهيد: فأسقيناكموه.`,
  `ابدئي بالميزان: سَمِعَ في كفّة واستمع في كفّة. ما الذي زاد؟ الألف والتاء.
عرّفي المجرد ثم المزيد، وشدّدي على أن حروف المضارعة والضمائر ليست زيادة.
نشاط سريع: يكتبون ← نحذف الياء والواو ← كتب، إذن مجرد.`,
  `هذه خريطة الدرس: ثلاثة أوزان. افتعل بخمسة معانٍ، وتفاعل بثلاثة، وافعلّ بمعنى واحد.
نبّهي إلى ترتيب حروف الزيادة: الألف ثم التاء في افتعل، والتاء ثم الألف في تفاعل.
اطلبي الربط: اختار، احمرّ، تعاون.`,
  `أول معنيين لافتعل: المشاركة (اختصم، اشترك) والمطاوعة.
اشرحي المطاوعة بالمثال: مزجتُ الحليب فامتزج الحليب؛ المفعول صار فاعلاً.
طبّقن: رسم الفنان اللوحة فارتسمت اللوحة.`,
  `المعنى الثالث: الاتخاذ (افترش الأرض = اتخذها فراشاً). حيلة التمييز: ضعي كلمة اتخذ مكان الفعل.
المعنى الرابع: الاجتهاد والطلب (اكتسب، اجتهد).
اسألي: ما الفرق بين كتب واكتتب؟`,
  `المعنى الخامس: الإظهار، صفة صادقة تخرج من القلب: اعتذر، افتخر، ابتهج.
لاحظي يد الخليل على صدره: الشعور حقيقي.
أكملن: اشتكى يفيد إظهار الشكوى.`,
  `ننتقل إلى تفاعل: التدرّج (تزايد، تقاطر، تماثل للشفاء) شيئاً فشيئاً.
والتظاهر: ادّعاء ما ليس حقيقياً (تمارض، تجاهل، تغافل، تباكى).
سؤال التمييز: تواردت الإبل، تدرّج لأنها جاءت تباعاً.`,
  `المعنى الثالث لتفاعل: المشاركة المتبادلة، كل طرف فاعل ومفعول في الوقت نفسه.
مثّلي بشد الحبل: لا نعرف من بدأ.
حرّكن أذهانكن: من الجذر س م ح ← تسامح.`,
  `أهم شريحة للاختبار: الإظهار صادق (افتعل) والتظاهر كاذب (تفاعل).
والمشاركة في افتعل مجرد اشتراك، وفي تفاعل تبادل أدوار.
التحدي: تباكى كذب على وزن تفاعل، واشتكى إظهار على وزن افتعل.`,
  `الوزن الثالث: افعلّ، الألف والتضعيف، ومعناه الوحيد المبالغة في اللون أو العيب.
احمرّ أقوى من حمُر. اعوجّ، احولّ، اعورّ للعيوب.
صُغن: اسودّ الليل.`,
  `لوحة المراجعة: تسعة معانٍ في خريطة واحدة.
اطلبي من الطالبات النظر عشر ثوانٍ، ثم اضغطي «أخفِ المعاني» واطلبي سرد معاني افتعل الخمسة.`,
  `النشاط التطبيقي الأول: اضغطي على الخيار الذي تختاره الطالبة؛ الأخضر صحيح والأحمر خطأ.
الإجابات: تقاطرت تدرّج، افترش اتخاذ، تمارض تظاهر.`,
  `النشاط الثاني: تقرأ طالبة الفقرة، ثم يستخرج الجميع الأفعال في دفاترهم.
نبّهي إلى ألف الاثنين في تعاونا وتاء التأنيث في احمرّت.
اضغطي «اعرض الحل» بعد انتهائهن.`,
  `اختمي بالشكر والتشجيع، واعرضي المهمة الإثرائية: ثلاثة أفعال مزيدة بحرفين من القرآن أو الصحف مع معانيها.`,
];

export const meta: SlideMeta = {
  title: 'الصرف: درس المزيد بحرفين',
  createdAt: '2026-10-25T03:41:55.786Z',
};

export default [
  Cover,
  Definitions,
  WeightsMap,
  Iftaal1,
  Iftaal2,
  Izhar,
  Tafaal1,
  Tafaal2,
  Compare,
  Ifalla,
  Summary,
  Activity1,
  Activity2,
  Closing,
] satisfies Page[];
