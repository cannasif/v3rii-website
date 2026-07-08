import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, ChevronLeft, ChevronRight, CircuitBoard, Hand, Network, SlidersHorizontal } from "lucide-react";
import { products } from "../../utils/products";
import ProductModal from "../ui/ProductModal";
import type { Language, Theme } from "../../App";

type Product = (typeof products)[number];

const getProductKey = (product: Product) => {
  const title = product.title.en.toLowerCase();
  if (title.includes("crm")) return "crm";
  if (title.includes("aqua")) return "aqua";
  if (title.includes("b2b")) return "b2b";
  if (title.includes("wms")) return "wms";
  if (title.includes("uts")) return "uts";
  return undefined;
};

type Props = {
  language: Language;
  theme: Theme;
};

const translations = {
  tr: {
    sectionTitlePre: "Yazılım",
    sectionTitleHighlight: "Ürünlerimiz",
    terminalLine: ">_ PRODUCT.MATRIX // 05 SİSTEM YÜKLENDİ",
    dragHint: "TUT & ÇEVİR",
    aiBadge: "AI DESTEKLİ",
    buttonText: "İncele",
    moduleLabel: "Modül",
    parameterLabel: "Parametre",
    integrationLabel: "Entegrasyon",
    unitLabel: "BİRİM"
  },
  en: {
    sectionTitlePre: "Our Software",
    sectionTitleHighlight: "Products",
    terminalLine: ">_ PRODUCT.MATRIX // 05 SYSTEMS LOADED",
    dragHint: "GRAB & SPIN",
    aiBadge: "AI POWERED",
    buttonText: "Explore",
    moduleLabel: "Modules",
    parameterLabel: "Parameters",
    integrationLabel: "Integrations",
    unitLabel: "UNIT"
  }
};

const COUNT = products.length;
const STEP = 360 / COUNT;
const AUTO_SPEED = -5.5; // derece/saniye — yavaş sürekli dönüş
const DRAG_SENSITIVITY = 0.35;

export default function Products({ language, theme }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [radius, setRadius] = useState(320);
  const [wheelGlitch, setWheelGlitch] = useState(false);
  const [arriveGlitchIndex, setArriveGlitchIndex] = useState(-1);

  const lang = language;
  const t = translations[lang];
  const isLight = theme === "light";

  const viewportRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const hoveringRef = useRef(false);
  const activeIndexRef = useRef(0);
  const radiusRef = useRef(radius);
  radiusRef.current = radius;

  // Sürükleme takibi
  const dragState = useRef({ lastX: 0, lastT: 0, dist: 0, downIndex: -1 });

  const cardW = Math.round(Math.min(290, Math.max(190, radius * 0.88)));
  const cardH = Math.round(cardW * 1.28);

  // Kart tam karşıya gelince hafif glitch
  useEffect(() => {
    setArriveGlitchIndex(activeIndex);
    const t = setTimeout(() => setArriveGlitchIndex(-1), 550);
    return () => clearTimeout(t);
  }, [activeIndex]);

  // 15-20 saniyede bir tüm kartlarda hafif glitch
  useEffect(() => {
    let off: ReturnType<typeof setTimeout>;
    const iv = setInterval(() => {
      setWheelGlitch(true);
      off = setTimeout(() => setWheelGlitch(false), 600);
    }, 17000);
    return () => {
      clearInterval(iv);
      clearTimeout(off);
    };
  }, []);

  // Responsive yarıçap
  useEffect(() => {
    const update = () => {
      const w = viewportRef.current?.clientWidth ?? 900;
      setRadius(Math.round(Math.min(400, Math.max(165, w * 0.3))));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Animasyon döngüsü: otomatik dönüş + atalet + hedefe yumuşak gidiş
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;

      if (!draggingRef.current) {
        if (targetRef.current !== null) {
          const diff = targetRef.current - rotationRef.current;
          rotationRef.current += diff * Math.min(1, dt * 6);
          if (Math.abs(diff) < 0.05) {
            rotationRef.current = targetRef.current;
            targetRef.current = null;
          }
        } else if (Math.abs(velocityRef.current) > 0.5) {
          rotationRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.12, dt); // sürtünme
          if (Math.abs(velocityRef.current) <= 0.5) {
            velocityRef.current = 0;
            // Atalet bitince en yakın karta hizala
            targetRef.current = Math.round(rotationRef.current / STEP) * STEP;
          }
        } else if (!hoveringRef.current) {
          rotationRef.current += AUTO_SPEED * dt;
        }
      }

      const rot = rotationRef.current;
      const r = radiusRef.current;

      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-r}px) rotateY(${rot}deg)`;
      }

      for (let i = 0; i < COUNT; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const a = (((i * STEP + rot) % 360) + 360) % 360;
        const facing = Math.cos((a * Math.PI) / 180); // 1 = tam önde
        const vis = Math.max(0, (facing + 0.4) / 1.4);
        el.style.opacity = (0.15 + 0.85 * vis).toFixed(3);
        el.style.filter = `brightness(${(0.55 + 0.55 * vis).toFixed(3)}) saturate(${(0.6 + 0.5 * vis).toFixed(3)})`;
      }

      const idx = ((Math.round(-rot / STEP) % COUNT) + COUNT) % COUNT;
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const spinToIndex = useCallback((index: number) => {
    const base = -index * STEP;
    const current = rotationRef.current;
    // Mevcut açıya en yakın eşdeğer hedefi bul
    const k = Math.round((current - base) / 360);
    velocityRef.current = 0;
    targetRef.current = base + k * 360;
  }, []);

  const spinBy = useCallback((dir: 1 | -1) => {
    const snapped = Math.round(rotationRef.current / STEP) * STEP;
    velocityRef.current = 0;
    targetRef.current = snapped + dir * STEP;
  }, []);

  const handleCardActivate = useCallback(
    (index: number) => {
      if (index === activeIndexRef.current) {
        setSelectedProduct(products[index]);
      } else {
        spinToIndex(index);
      }
    },
    [spinToIndex]
  );

  // Pointer (tut & çevir) kontrolü
  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    targetRef.current = null;
    velocityRef.current = 0;
    dragState.current.lastX = e.clientX;
    dragState.current.lastT = performance.now();
    dragState.current.dist = 0;
    const cardEl = (e.target as HTMLElement).closest("[data-card-index]");
    dragState.current.downIndex = cardEl ? Number(cardEl.getAttribute("data-card-index")) : -1;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dx = e.clientX - dragState.current.lastX;
    const dtMs = Math.max(1, now - dragState.current.lastT);
    dragState.current.lastX = e.clientX;
    dragState.current.lastT = now;
    dragState.current.dist += Math.abs(dx);
    rotationRef.current += dx * DRAG_SENSITIVITY;
    velocityRef.current = ((dx * DRAG_SENSITIVITY) / dtMs) * 1000;
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (dragState.current.dist < 8) {
      velocityRef.current = 0;
      if (dragState.current.downIndex >= 0) {
        handleCardActivate(dragState.current.downIndex);
      } else {
        targetRef.current = Math.round(rotationRef.current / STEP) * STEP;
      }
    }
    // dist >= 8 ise atalet devam eder, döngü kendisi hizalar
  };

  const activeProduct = products[activeIndex];

  return (
    <section
      id="products"
      className="scroll-mt-48 pt-36 pb-16 sm:pt-44 sm:pb-24 lg:pt-52 lg:pb-28 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden bg-transparent font-modern"
    >
      <div className="cyber-noise" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className={`mb-3 font-cyber text-[10px] sm:text-xs tracking-[0.3em] uppercase ${isLight ? "text-teal-700" : "text-teal-300"}`}>
            {t.terminalLine}
            <span className="cyber-caret">▊</span>
          </div>
          <div className="inline-flex w-full items-center justify-center gap-3 sm:w-auto sm:gap-4">
            <div className="hidden h-0.5 w-6 shrink-0 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] sm:block sm:w-8" />
            <h2 className={`min-w-0 text-2xl sm:text-4xl md:text-5xl font-bold font-cyber tracking-wide sm:tracking-wider uppercase ${isLight ? "text-slate-900" : "text-white"}`}>
              {t.sectionTitlePre}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-400 to-amber-400">
                {t.sectionTitleHighlight}
              </span>
            </h2>
            <div className="hidden h-0.5 w-6 shrink-0 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] sm:block sm:w-8" />
          </div>
        </motion.div>

        {/* ÇARK */}
        <div className="relative">
          {/* Tut & çevir ipucu */}
          <div className={`pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 font-cyber text-[9px] sm:text-[10px] tracking-[0.3em] uppercase ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            <Hand className="w-3.5 h-3.5 animate-pulse" />
            {t.dragHint}
          </div>

          <div
            ref={viewportRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerEnter={() => { hoveringRef.current = true; }}
            onPointerLeave={() => { hoveringRef.current = false; }}
            className="relative mx-auto select-none cursor-grab active:cursor-grabbing"
            style={{
              perspective: "1400px",
              height: cardH + 90,
              touchAction: "pan-y"
            }}
          >
            {/* Zemin halkası */}
            <div
              className="cyber-wheel-floor"
              style={{ width: radius * 2.15, height: Math.max(70, radius * 0.42) }}
            />

            <div
              ref={wheelRef}
              className="absolute left-1/2 top-1/2"
              style={{
                width: 0,
                height: 0,
                transformStyle: "preserve-3d",
                transform: `translateZ(${-radius}px) rotateY(0deg)`
              }}
            >
              {products.map((product, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={index}
                    ref={(el) => { cardRefs.current[index] = el; }}
                    data-card-index={index}
                    className="absolute"
                    style={{
                      width: cardW,
                      height: cardH,
                      left: -cardW / 2,
                      top: -cardH / 2,
                      transform: `rotateY(${index * STEP}deg) translateZ(${radius}px)`,
                      backfaceVisibility: "hidden",
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <div
                      className={`cyber-wheel-card relative flex h-full w-full flex-col items-center justify-between overflow-hidden border p-4 sm:p-5 transition-colors duration-300 ${
                        wheelGlitch || arriveGlitchIndex === index ? "cyber-card-glitch-soft" : ""
                      } ${
                        isActive
                          ? "border-pink-500/70 shadow-[0_0_35px_rgba(236,72,153,0.25)]"
                          : isLight
                            ? "border-teal-600/40"
                            : "border-teal-400/25"
                      }`}
                      style={{
                        clipPath: "polygon(9% 0, 100% 0, 100% 91%, 91% 100%, 0 100%, 0 9%)",
                        background: "linear-gradient(160deg, rgba(10,15,26,0.96) 0%, rgba(18,10,26,0.96) 100%)"
                      }}
                    >
                      <div className="cyber-panel-scanline" />
                      <div className="cyber-wheel-card-sweep" />

                      {/* Üst terminal satırı */}
                      <div className="relative z-10 flex w-full items-center justify-between font-cyber text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-teal-300/80">
                        <span>{`SYS.0${index + 1}`}</span>
                        <span className={`flex items-center gap-1 ${isActive ? "text-pink-400" : "text-slate-500"}`}>
                          <span className={`inline-block h-1.5 w-1.5 ${isActive ? "bg-pink-500 animate-pulse" : "bg-slate-600"}`} />
                          {isActive ? "ONLINE" : "IDLE"}
                        </span>
                      </div>

                      {/* Logo */}
                      <div className="relative z-10 flex flex-1 items-center justify-center px-2">
                        {product.logo ? (
                          <img
                            src={product.logo}
                            alt={`${product.title[lang]} logo`}
                            draggable={false}
                            className="max-h-[62%] w-auto max-w-full object-contain drop-shadow-[0_0_18px_rgba(236,72,153,0.35)]"
                          />
                        ) : null}
                      </div>

                      {/* Alt bilgi */}
                      <div className="relative z-10 w-full text-center">
                        <div className="font-cyber text-sm sm:text-base font-bold uppercase tracking-widest text-white">
                          {product.title[lang]}
                        </div>
                        <div className="mt-2 inline-flex items-center gap-1.5 border border-cyan-400/40 bg-cyan-500/10 px-2 py-1 font-cyber text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-cyan-300">
                          <BrainCircuit className="h-3.5 w-3.5" />
                          {t.aiBadge}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Yön okları + sayaç */}
          <div className="relative z-20 -mt-4 flex items-center justify-center gap-5 sm:gap-8">
            <button
              onClick={() => spinBy(1)}
              aria-label="previous"
              className={`group grid h-10 w-10 place-items-center border transition-all ${
                isLight
                  ? "border-teal-600/50 text-teal-700 hover:bg-teal-600 hover:text-white"
                  : "border-teal-400/40 text-teal-300 hover:bg-teal-400/20 hover:border-teal-300"
              }`}
              style={{ clipPath: "polygon(25% 0, 100% 0, 100% 75%, 75% 100%, 0 100%, 0 25%)" }}
            >
              <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <div className={`font-cyber text-xs sm:text-sm tracking-[0.35em] ${isLight ? "text-slate-700" : "text-slate-300"}`}>
              {`0${activeIndex + 1}`}
              <span className={isLight ? "text-slate-400" : "text-slate-600"}>{` / 0${COUNT} `}</span>
              <span className="text-pink-500">{t.unitLabel}</span>
            </div>

            <button
              onClick={() => spinBy(-1)}
              aria-label="next"
              className={`group grid h-10 w-10 place-items-center border transition-all ${
                isLight
                  ? "border-teal-600/50 text-teal-700 hover:bg-teal-600 hover:text-white"
                  : "border-teal-400/40 text-teal-300 hover:bg-teal-400/20 hover:border-teal-300"
              }`}
              style={{ clipPath: "polygon(0 0, 75% 0, 100% 25%, 100% 100%, 25% 100%, 0 75%)" }}
            >
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* AKTİF ÜRÜN DETAY PANELİ
            Sabit min-height + popLayout: panel içeriği değişirken yükseklik sıfırlanmasın,
            yoksa alttaki bölümler her ürün geçişinde kayıyor (sayfa kendi kendine scroll oluyor gibi). */}
        <div className="relative mx-auto mt-8 sm:mt-10 max-w-4xl min-h-[560px] sm:min-h-[420px] lg:min-h-[380px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`relative w-full overflow-hidden border p-5 sm:p-7 backdrop-blur-md min-h-[560px] sm:min-h-[420px] lg:min-h-[380px] ${
                isLight ? "bg-white/85 border-teal-600/30" : "bg-[#0a0f1a]/85 border-teal-400/25"
              }`}
              style={{ clipPath: "polygon(3% 0, 100% 0, 100% 88%, 97% 100%, 0 100%, 0 12%)" }}
            >
              <div className="cyber-frame-corner cyber-frame-corner-tl" />
              <div className="cyber-frame-corner cyber-frame-corner-br" />
              <div className="cyber-panel-scanline" />

              <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className={`mb-1 font-cyber text-[9px] sm:text-[10px] tracking-[0.3em] uppercase ${isLight ? "text-teal-700" : "text-teal-300"}`}>
                    {`> ${activeProduct.eyebrow[lang]}`}
                  </div>
                  <h3 className={`font-cyber text-xl sm:text-2xl font-bold uppercase tracking-wider ${isLight ? "text-slate-900" : "text-white"}`}>
                    {activeProduct.title[lang]}
                  </h3>
                  <div className="mt-2 h-0.5 w-14 bg-gradient-to-r from-pink-500 via-orange-400 to-amber-400" />
                  <p className={`mt-3 text-xs sm:text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                    {activeProduct.description[lang]}
                  </p>
                </div>

                <div className="grid w-full shrink-0 grid-cols-3 gap-2 sm:flex sm:w-auto sm:flex-col sm:items-end">
                  {[
                    { icon: CircuitBoard, label: t.moduleLabel, value: activeProduct.modules[lang].length },
                    { icon: SlidersHorizontal, label: t.parameterLabel, value: activeProduct.parameters[lang].length },
                    { icon: Network, label: t.integrationLabel, value: activeProduct.integrations[lang].length }
                  ].map((metric) => {
                    const MetricIcon = metric.icon;
                    return (
                      <div
                        key={metric.label}
                        className={`flex flex-col items-center gap-1 border px-2 py-2 text-center sm:flex-row sm:gap-2 sm:px-2.5 sm:py-1.5 sm:text-left ${
                          isLight ? "border-cyan-300 bg-white/70 text-slate-700" : "border-cyan-400/20 bg-white/[0.04] text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 sm:contents">
                          <MetricIcon className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                          <span className="font-cyber text-sm font-black text-pink-500 sm:order-last">{metric.value}</span>
                        </div>
                        <span className="text-[8px] font-bold uppercase leading-tight tracking-wide sm:text-[9px]">{metric.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2">
                {activeProduct.features[lang].slice(0, 4).map((f, i) => (
                  <span
                    key={i}
                    className={`border px-2 py-1 text-[10px] sm:text-[11px] ${
                      isLight ? "border-slate-300 bg-slate-100 text-slate-700" : "border-white/10 bg-white/5 text-gray-300"
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedProduct(activeProduct)}
                className="relative z-10 mt-5 inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 via-orange-500 to-amber-400 px-6 py-2.5 font-cyber text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white shadow-[0_0_20px_rgba(219,39,119,0.35)] transition-all hover:shadow-[0_0_32px_rgba(219,39,119,0.55)]"
                style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
              >
                {`${t.buttonText} // 0${activeIndex + 1}`}
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* MODAL */}
      <ProductModal
        product={
          selectedProduct
            ? {
                ...selectedProduct,
                productKey: getProductKey(selectedProduct),
                title: selectedProduct.title[lang],
                eyebrow: selectedProduct.eyebrow[lang],
                description: selectedProduct.description[lang],
                features: selectedProduct.features[lang],
                modules: selectedProduct.modules[lang],
                integrations: selectedProduct.integrations[lang],
                parameters: selectedProduct.parameters[lang]
              }
            : null
        }
        onClose={() => setSelectedProduct(null)}
        language={lang}
        theme={theme}
      />
    </section>
  );
}
