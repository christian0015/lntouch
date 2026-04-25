"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { COIFFURES, EXTRAS, AVAILABILITIES, SALON } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// ─── Construction de STYLES à partir de COIFFURES ──────────────────────────
// Sélectionne les 8 coiffures pour le formulaire (mêmes que Gallery)
const STYLES = COIFFURES.filter((c) =>
  [
    "knotless-braids-medium",
    "knotless-braids-large",
    "boho-braids-short",
    "boho-braids-long",
    "fulani-braids",
    "fulani-crochet",
    "braided-ponytail",
    "french-curl",
  ].includes(c.slug)
).map((c) => ({
  id: c.slug,
  name: `${c.name} ${c.variant}`,
  image: c.images[0],
  duration: c.duration,
  price: c.price,
}));

// EXTRAS, AVAILABILITIES, SALON sont directement importés de data.ts
// Pas besoin de les redéfinir

const STEPS = [
  { id: 1, label: "Contact",          short: "Qui êtes-vous ?" },
  { id: 2, label: "Style",            short: "Votre coiffure" },
  { id: 3, label: "Extras",           short: "Finitions" },
  { id: 4, label: "Créneau",          short: "Date & heure" },
  { id: 5, label: "Confirmation",     short: "C'est parti !" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function pad(n: number) { return String(n).padStart(2, "0"); }
function dateKey(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function today() {
  const t = new Date();
  return dateKey(t.getFullYear(), t.getMonth(), t.getDate());
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressLine({ step }: { step: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        width: "100%",
      }}
    >
      {STEPS.map((s, i) => {
        const active  = step === s.id;
        const done    = step > s.id;
        const upcoming = step < s.id;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  border: `1px solid ${active ? "#fff" : done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}`,
                  background: active ? "#ffffff" : done ? "rgba(255,255,255,0.3)" : "transparent",
                  transition: "all 0.4s ease",
                  marginTop: "3px",
                }}
              />
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    width: "1px",
                    height: "52px",
                    background: done
                      ? "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.15))"
                      : "rgba(255,255,255,0.07)",
                    transition: "background 0.5s ease",
                  }}
                />
              )}
            </div>
            <div style={{ paddingTop: "1px" }}>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "8px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: active ? "#ffffff" : done ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.15)",
                  transition: "color 0.4s ease",
                  marginBottom: "2px",
                }}
              >
                {pad(s.id)} — {s.label}
              </div>
              {active && (
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "11px",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {s.short}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniCalendar({ year, month, selected, onSelect }: { 
  year: number; 
  month: number; 
  selected: string | null; 
  onSelect: (date: string) => void;
}) {
  const days = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = today();
  const cells: (number | null)[] = [];

  const startDay = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const monthNames = ["Janv","Févr","Mars","Avr","Mai","Juin","Juil","Août","Sept","Oct","Nov","Déc"];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1rem",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {monthNames[month]} {year}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px",
          marginBottom: "6px",
        }}
      >
        {["L","M","M","J","V","S","D"].map((d, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.2)",
              textAlign: "center",
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />;
          const key = dateKey(year, month, d);
          const slots = AVAILABILITIES[key];
          const hasSlots = slots && slots.length > 0;
          const isPast = key < todayStr;
          const isSelected = selected === key;
          const isToday = key === todayStr;

          return (
            <button
              key={key}
              disabled={!hasSlots || isPast}
              onClick={() => onSelect(key)}
              style={{
                aspectRatio: "1",
                borderRadius: "2px",
                border: isSelected
                  ? "1px solid rgba(255,255,255,0.6)"
                  : isToday
                  ? "1px solid rgba(255,255,255,0.2)"
                  : "1px solid transparent",
                background: isSelected
                  ? "rgba(255,255,255,0.12)"
                  : hasSlots && !isPast
                  ? "rgba(255,255,255,0.04)"
                  : "transparent",
                color: isPast || !hasSlots
                  ? "rgba(255,255,255,0.13)"
                  : isSelected
                  ? "#ffffff"
                  : "rgba(255,255,255,0.6)",
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                cursor: hasSlots && !isPast ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {d}
              {hasSlots && !isPast && !isSelected && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "3px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.3)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step Panels ──────────────────────────────────────────────────────────────

function StepContact({ data, onChange, onNext, onSkip }: { 
  data: any; 
  onChange: (patch: any) => void; 
  onNext: () => void; 
  onSkip: () => void;
}) {
  const [email, setEmail] = useState(data.email || "");
  const [phone, setPhone] = useState(data.phone || "");
  const valid = email.trim() !== "" || phone.trim() !== "";

  const handleNext = () => {
    onChange({ email, phone });
    onNext();
  };

  return (
    <div className="step-panel">
      <StepHeader step={1} title="Entrons en contact." sub="Un email ou un WhatsApp — on vous confirme sous 12h." />

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "420px" }}>
        <InputField
          label="Email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={setEmail}
        />
        <InputField
          label="WhatsApp / Téléphone"
          type="tel"
          placeholder="+33 6 00 00 00 00"
          value={phone}
          onChange={setPhone}
        />
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", marginTop: "0.25rem" }}>
          Au moins un champ requis · Vos données ne sont jamais partagées.
        </p>
      </div>

      <StepActions
        onNext={handleNext}
        onSkip={onSkip}
        nextDisabled={!valid}
        nextLabel="Continuer →"
        skipLabel="Passer cette étape"
      />
    </div>
  );
}

function StepStyle({ data, onChange, onNext, onBack }: { 
  data: any; 
  onChange: (patch: any) => void; 
  onNext: () => void; 
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(data.style || null);

  const handleNext = () => {
    onChange({ style: selected });
    onNext();
  };

  return (
    <div className="step-panel">
      <StepHeader step={2} title="Quel style vous attire ?" sub="Choisissez votre coiffure — on s'occupe du reste." />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "10px",
          maxWidth: "560px",
        }}
      >
        {STYLES.map((s) => {
          const isSelected = selected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              style={{
                background: isSelected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
                border: isSelected ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "2px",
                padding: 0,
                cursor: "pointer",
                overflow: "hidden",
                transition: "border-color 0.25s ease, background 0.25s ease",
                textAlign: "left",
              }}
            >
              <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
                <img
                  src={s.image}
                  alt={s.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: isSelected ? "brightness(0.9)" : "brightness(0.55)",
                    transition: "filter 0.3s ease, transform 0.3s ease",
                    transform: isSelected ? "scale(1.04)" : "scale(1)",
                  }}
                />
              </div>
              <div style={{ padding: "8px 10px" }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: isSelected ? "#ffffff" : "rgba(255,255,255,0.55)",
                    marginBottom: "3px",
                    lineHeight: 1.3,
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "8px",
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  {s.duration} · {s.price}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <StepActions
        onNext={handleNext}
        onBack={onBack}
        nextDisabled={!selected}
        nextLabel="Continuer →"
      />
    </div>
  );
}

function StepExtras({ data, onChange, onNext, onBack }: { 
  data: any; 
  onChange: (patch: any) => void; 
  onNext: () => void; 
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(data.extras || []);
  const [custom, setCustom] = useState(data.customNote || "");

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    onChange({ extras: selected, customNote: custom });
    onNext();
  };

  return (
    <div className="step-panel">
      <StepHeader step={3} title="Des finitions particulières ?" sub="Optionnel — personnalisez votre expérience." />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "420px" }}>
        {EXTRAS.map((e) => {
          const isOn = selected.includes(e.id);
          return (
            <button
              key={e.id}
              onClick={() => toggle(e.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: isOn ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                border: isOn ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "12px", color: isOn ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }}>
                  {e.icon}
                </span>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1rem",
                    fontStyle: "italic",
                    color: isOn ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
                    transition: "color 0.25s ease",
                  }}
                >
                  {e.label}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  color: isOn ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)",
                }}
              >
                {e.price}
              </span>
            </button>
          );
        })}

        <div style={{ marginTop: "0.5rem" }}>
          <label
            style={{
              display: "block",
              fontFamily: "'Space Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.24em",
              color: "rgba(255,255,255,0.22)",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Autre demande personnalisée
          </label>
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Ex : tresses colorées, longueur spécifique, allergie aux produits..."
            rows={3}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "2px",
              padding: "12px 14px",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1rem",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.6)",
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
        </div>
      </div>

      <StepActions
        onNext={handleNext}
        onBack={onBack}
        nextLabel="Continuer →"
      />
    </div>
  );
}

function StepCreneau({ data, onChange, onNext, onBack }: { 
  data: any; 
  onChange: (patch: any) => void; 
  onNext: () => void; 
  onBack: () => void;
}) {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(data.date || null);
  const [selectedTime, setSelectedTime] = useState<string | null>(data.time || null);

  const slots = selectedDate ? (AVAILABILITIES[selectedDate] || []) : [];

  const handleNext = () => {
    onChange({ date: selectedDate, time: selectedTime });
    onNext();
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const monthNames = ["Janv","Févr","Mars","Avr","Mai","Juin","Juil","Août","Sept","Oct","Nov","Déc"];

  return (
    <div className="step-panel">
      <StepHeader step={4} title="Choisissez votre moment." sub="Les créneaux grisés sont déjà pris — les autres vous attendent." />

      <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap", maxWidth: "600px" }}>
        <div style={{ flex: "0 0 240px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <button onClick={prevMonth} style={navBtnStyle}>←</button>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.6)" }}>
              {monthNames[calMonth]} {calYear}
            </span>
            <button onClick={nextMonth} style={navBtnStyle}>→</button>
          </div>
          <MiniCalendar
            year={calYear}
            month={calMonth}
            selected={selectedDate}
            onSelect={(d) => { setSelectedDate(d); setSelectedTime(null); }}
          />
        </div>

        <div style={{ flex: 1, minWidth: "140px" }}>
          {selectedDate ? (
            <>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "8px",
                  letterSpacing: "0.28em",
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                Créneaux disponibles
              </div>
              {slots.length === 0 ? (
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
                  Aucun créneau ce jour.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {slots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      style={{
                        padding: "10px 14px",
                        background: selectedTime === t ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                        border: selectedTime === t ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "2px",
                        color: selectedTime === t ? "#ffffff" : "rgba(255,255,255,0.45)",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "11px",
                        letterSpacing: "0.14em",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        textAlign: "left",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                minHeight: "120px",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.18)",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              Sélectionnez<br />une date d'abord
            </div>
          )}

          <div
            style={{
              marginTop: "1.5rem",
              padding: "14px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "2px",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "7.5px",
                letterSpacing: "0.28em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Adresse du salon
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
                marginBottom: "4px",
              }}
            >
              {SALON.commune}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "10px",
                lineHeight: 1.5,
              }}
            >
              {SALON.quartier}
              <br />
              {SALON.detail}
            </div>
            <a
              href={SALON.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "8px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.3)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                textTransform: "uppercase",
              }}
            >
              Voir sur la carte
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 5H9M5 1L9 5L5 9" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <StepActions
        onNext={handleNext}
        onBack={onBack}
        nextDisabled={!selectedDate || !selectedTime}
        nextLabel="Continuer →"
      />
    </div>
  );
}

function StepConfirm({ data, onBack, onSubmit }: { 
  data: any; 
  onBack: () => void; 
  onSubmit: (data: any) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const styleObj = STYLES.find(s => s.id === data.style);
  const extraList = (data.extras || []).map((id: string) => EXTRAS.find(e => e.id === id)?.label).filter(Boolean);

  const handleSubmit = () => {
    if (btnRef.current) {
      gsap.to(btnRef.current, {
        scale: 0.96,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          setSubmitted(true);
          onSubmit && onSubmit(data);
        },
      });
    }
  };

  if (submitted) {
    return (
      <div className="step-panel" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <div
          style={{
            width: "52px",
            height: "52px",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            animation: "popIn 0.4s ease",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L8 14L16 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 1rem",
          }}
        >
          C'est dans la boîte. ✦
        </h3>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: "1.05rem",
            color: "rgba(255,255,255,0.45)",
            maxWidth: "340px",
            lineHeight: 1.8,
          }}
        >
          Votre demande a bien été reçue. Vous recevrez une confirmation dans les <strong style={{ color: "rgba(255,255,255,0.65)", fontStyle: "normal" }}>12 heures</strong> qui suivent.
        </p>
        <div
          style={{
            marginTop: "2rem",
            padding: "1px 0",
            width: "40px",
            background: "rgba(255,255,255,0.12)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="step-panel">
      <StepHeader step={5} title="Prête pour la magie ?" sub="Récapitulatif de votre réservation." />

      <div
        style={{
          maxWidth: "420px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "2px",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {[
          { icon: "◇", label: "Style", value: styleObj ? `${styleObj.name} · ${styleObj.price}` : "—" },
          { icon: "○", label: "Extras", value: extraList.length ? extraList.join(", ") : "Aucun" },
          { icon: "△", label: "Créneau", value: data.date && data.time ? `${data.date} à ${data.time}` : "—" },
          { icon: "□", label: "Contact", value: data.email || data.phone || "—" },
        ].map((row) => (
          <div key={row.label} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: "3px", flexShrink: 0 }}>{row.icon}</span>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "7.5px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: "3px" }}>
                {row.label}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                {row.value}
              </div>
            </div>
          </div>
        ))}

        {data.customNote && (
          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: "3px", flexShrink: 0 }}>✦</span>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "7.5px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: "3px" }}>Note</div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                {data.customNote}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
        <button
          ref={btnRef}
          onClick={handleSubmit}
          style={{
            padding: "16px 40px",
            background: "#ffffff",
            color: "#000000",
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
            transition: "opacity 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span>J'ai hâte, on y va !</span>
          <span style={{ fontSize: "14px" }}>✦</span>
        </button>
        <button
          onClick={onBack}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "8.5px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.25)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          ← Modifier
        </button>
      </div>
    </div>
  );
}

// ─── Shared micro-components ──────────────────────────────────────────────────

function StepHeader({ step, title, sub }: { step: number; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
          }}
        >
          Étape {pad(step)} / {pad(STEPS.length)}
        </span>
        <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.1)" }} />
      </div>
      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)",
          fontWeight: 700,
          color: "#ffffff",
          margin: "0 0 0.6rem",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontSize: "1.05rem",
          color: "rgba(255,255,255,0.38)",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {sub}
      </p>
    </div>
  );
}

function InputField({ label, type, placeholder, value, onChange }: { 
  label: string; 
  type: string; 
  placeholder: string; 
  value: string; 
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "'Space Mono', monospace",
          fontSize: "8px",
          letterSpacing: "0.26em",
          color: "rgba(255,255,255,0.22)",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 14px",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: "2px",
          color: "rgba(255,255,255,0.75)",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1rem",
          fontStyle: "italic",
          outline: "none",
          transition: "border-color 0.2s ease",
        }}
      />
    </div>
  );
}

function StepActions({ onNext, onBack, onSkip, nextDisabled, nextLabel = "Suivant", skipLabel }: { 
  onNext: () => void; 
  onBack?: () => void; 
  onSkip?: () => void; 
  nextDisabled?: boolean; 
  nextLabel?: string; 
  skipLabel?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "8.5px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.25)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          ← Retour
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        style={{
          padding: "13px 30px",
          background: nextDisabled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.1)",
          border: `1px solid ${nextDisabled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.25)"}`,
          borderRadius: "2px",
          color: nextDisabled ? "rgba(255,255,255,0.2)" : "#ffffff",
          fontFamily: "'Space Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          cursor: nextDisabled ? "not-allowed" : "pointer",
          transition: "all 0.25s ease",
        }}
      >
        {nextLabel}
      </button>
      {onSkip && (
        <button
          onClick={onSkip}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "8px",
            letterSpacing: "0.16em",
            color: "rgba(255,255,255,0.18)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}

const navBtnStyle = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "2px",
  color: "rgba(255,255,255,0.4)",
  width: "28px",
  height: "28px",
  cursor: "pointer",
  fontFamily: "'Space Mono', monospace",
  fontSize: "11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "border-color 0.2s ease, color 0.2s ease",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Process() {
  const sectionRef   = useRef<HTMLElement>(null);
  const leftRef      = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);
  const titleLineRef = useRef<HTMLDivElement>(null);

  const [step, setStep]   = useState(1);
  const [formData, setFormData] = useState({
    email: "", phone: "",
    style: null, extras: [], customNote: "",
    date: null, time: null,
  });

  const update = (patch: any) => setFormData((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    const panel = rightRef.current?.querySelector(".step-panel");
    if (!panel) return;
    gsap.fromTo(
      panel,
      { opacity: 0, x: 20, filter: "blur(6px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.55, ease: "power3.out" }
    );
  }, [step]);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      if (!titleLineRef.current) return;
      gsap.fromTo(
        titleLineRef.current.querySelectorAll("[data-reveal]"),
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    });
    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 768 && rightRef.current) {
      rightRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "linear-gradient(135deg, #0c0c0c 0%, #0a0a0a 60%, #0f0808 100%)",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <svg
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        <line x1="280" y1="0" x2="280" y2="1000" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="0" y1="80" x2="280" y2="80" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="0" y1="0" x2="280" y2="1000" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <path d="M 20 52 L 20 20 L 52 20" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
        <path d="M 980 948 L 980 980 L 948 980" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
        <path d="M 0 600 Q 140 500 280 560 Q 500 650 700 580 Q 880 520 1000 600" stroke="rgba(255,255,255,0.025)" strokeWidth="1" fill="none" />
        <rect x="274" y="494" width="12" height="12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" transform="rotate(45 280 500)" />
        <polyline
          points="997,0 991,50 997,100 991,150 997,200 991,250 997,300 991,350 997,400 991,450 997,500 991,550 997,600 991,650 997,700 991,750 997,800 991,850 997,900 991,950 997,1000"
          stroke="rgba(255,255,255,0.025)" strokeWidth="1" fill="none"
        />
      </svg>

      <div style={{ position: "absolute", top: "1.75rem", left: "2rem", zIndex: 10, pointerEvents: "none" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>
          04&nbsp;/&nbsp;07
        </span>
      </div>
      <div style={{ position: "absolute", top: "1.75rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, pointerEvents: "none", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.07)" }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.32em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
          Réservation
        </span>
        <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.07)" }} />
      </div>
      <div style={{ position: "absolute", top: "1.75rem", right: "2rem", zIndex: 10, pointerEvents: "none" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase" }}>
          Process
        </span>
      </div>

      <div
        className="hidden md:block"
        style={{ position: "absolute", bottom: "4rem", right: "1.75rem", zIndex: 10, pointerEvents: "none" }}
      >
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase", writingMode: "vertical-rl", display: "block" }}>
          Contact · Style · Créneau
        </span>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          minHeight: "100vh",
          paddingTop: "5rem",
        }}
        className="process-layout"
      >
        <div
          ref={leftRef}
          className="process-left"
          style={{
            width: "28%",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "6rem 2.5rem 6rem 3rem",
            borderRight: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div ref={titleLineRef}>
            <div data-reveal style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
              <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.12)" }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" }}>
                Simple · Rapide · Sans stress
              </span>
            </div>

            <h2
              data-reveal
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem, 3vw, 3rem)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                margin: "0 0 0.5rem",
              }}
            >
              Réservez
              <br />
              <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}>
                votre séance.
              </span>
            </h2>

            <p
              data-reveal
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "1rem",
                color: "rgba(255,255,255,0.32)",
                margin: "0 0 2.5rem",
                lineHeight: 1.7,
              }}
            >
              4 étapes, pas une de plus.<br />
              On s'occupe du reste.
            </p>

            <div data-reveal>
              <ProgressLine step={step} />
            </div>
          </div>
        </div>

        <div
          ref={rightRef}
          className="process-right"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "6rem 5% 6rem 7%",
            minHeight: "100vh",
          }}
        >
          {step === 1 && (
            <StepContact
              data={formData}
              onChange={update}
              onNext={() => setStep(2)}
              onSkip={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepStyle
              data={formData}
              onChange={update}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepExtras
              data={formData}
              onChange={update}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <StepCreneau
              data={formData}
              onChange={update}
              onNext={() => setStep(5)}
              onBack={() => setStep(3)}
            />
          )}
          {step === 5 && (
            <StepConfirm
              data={formData}
              onBack={() => setStep(4)}
              onSubmit={(d) => console.log("Réservation:", d)}
            />
          )}
        </div>
      </div>

      <style>{`
        .step-panel {
          width: 100%;
          max-width: 640px;
        }
        @keyframes popIn {
          from { transform: scale(0.8); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @media (max-width: 1024px) {
          .process-left { width: 32% !important; padding: 5rem 2rem 5rem 2rem !important; }
          .process-right { padding: 5rem 3% 5rem 4% !important; }
        }
        @media (max-width: 768px) {
          .process-layout { flex-direction: column !important; padding-top: 4rem !important; }
          .process-left {
            width: 100% !important;
            position: relative !important;
            height: auto !important;
            padding: 4rem 1.5rem 2rem !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.05) !important;
          }
          .process-right {
            padding: 2rem 1.5rem 5rem !important;
            min-height: auto !important;
            align-items: flex-start !important;
          }
          .step-panel { max-width: 100% !important; }
        }
      `}</style>
    </section>
  );
}