import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import type { Mood, Quote } from "../data/quotes";
import { MOOD_LABELS, MOOD_ACTIVITIES } from "../data/quotes";
import { getCheckInQuote } from "../services/quoteService";

const SESSION_KEY = "chhaya_checkin_done";
const STREAK_KEY = "chhaya_streak";

interface StreakData {
  lastDate: string;
  count: number;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function getStreak(): StreakData {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"lastDate":"","count":0}');
  } catch {
    return { lastDate: "", count: 0 };
  }
}

function updateStreak(): StreakData {
  const streak = getStreak();
  const today = todayStr();
  if (streak.lastDate === today) return streak;

  let count: number;
  if (streak.lastDate === yesterdayStr()) {
    count = streak.count + 1;
  } else {
    count = 1;
  }
  const updated = { lastDate: today, count };
  localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  return updated;
}

function streakMessage(count: number): string {
  if (count >= 100) return "Sau din — timi inspiration chhau";
  if (count >= 30) return "Ek mahina — Chhaya timro ghar bhaisakyo";
  if (count >= 14) return "Dui hapta — yo himmat ho";
  if (count >= 7) return "Ek hapta — timi aairaheko chhau";
  if (count >= 3) return "Ramro suru — 3 din";
  return "Pahilo diyo — suru bhayo";
}

/* ── Weather SVG Icons ── */

function SunnyIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="6" fill="#E8A020" />
      <g stroke="#E8A020" strokeWidth="2" strokeLinecap="round">
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="16" y1="26" x2="16" y2="30" />
        <line x1="2" y1="16" x2="6" y2="16" />
        <line x1="26" y1="16" x2="30" y2="16" />
        <line x1="6.1" y1="6.1" x2="8.9" y2="8.9" />
        <line x1="23.1" y1="23.1" x2="25.9" y2="25.9" />
        <line x1="6.1" y1="25.9" x2="8.9" y2="23.1" />
        <line x1="23.1" y1="8.9" x2="25.9" y2="6.1" />
      </g>
    </svg>
  );
}

function PartlyCloudyIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="10" r="5" fill="#E8A020" />
      <g stroke="#E8A020" strokeWidth="1.5" strokeLinecap="round">
        <line x1="20" y1="1" x2="20" y2="3.5" />
        <line x1="27" y1="10" x2="29.5" y2="10" />
        <line x1="25" y1="5" x2="26.8" y2="3.2" />
        <line x1="25" y1="15" x2="26.8" y2="16.8" />
      </g>
      <path d="M8 26h14a5 5 0 1 0-3-9h-1a4.5 4.5 0 0 0-8.5 1.5A3.5 3.5 0 0 0 8 26z" fill="#D4C5A9" />
    </svg>
  );
}

function CloudyIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 24h16a6 6 0 1 0-3.5-10.8 5.5 5.5 0 0 0-10.2 1.3A4 4 0 0 0 8 24z" fill="#9A7B5A" />
    </svg>
  );
}

function RainyIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 18h16a5.5 5.5 0 1 0-3.2-10 5 5 0 0 0-9.3 1.2A3.8 3.8 0 0 0 7 18z" fill="#7B3F2B" />
      <g stroke="#9A7B5A" strokeWidth="1.5" strokeLinecap="round">
        <line x1="10" y1="21" x2="9" y2="25" />
        <line x1="15" y1="21" x2="14" y2="27" />
        <line x1="20" y1="21" x2="19" y2="25" />
      </g>
    </svg>
  );
}

function StormyIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 16h16a5.5 5.5 0 1 0-3.2-10 5 5 0 0 0-9.3 1.2A3.8 3.8 0 0 0 7 16z" fill="#5C4A35" />
      <g stroke="#9A7B5A" strokeWidth="1.5" strokeLinecap="round">
        <line x1="9" y1="19" x2="8" y2="22" />
        <line x1="21" y1="19" x2="20" y2="22" />
      </g>
      <path d="M16 19l-2 5h4l-2 5" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

const WEATHER_ICONS: Record<Mood, (props: { className?: string }) => ReactElement> = {
  ramro: SunnyIcon,
  thikai: PartlyCloudyIcon,
  almaleko: CloudyIcon,
  garo: RainyIcon,
  eklo: StormyIcon,
};

const MOODS: Mood[] = ["ramro", "thikai", "almaleko", "garo", "eklo"];

type Step = "mood" | "loading" | "quote" | "streak";

export function MoodCheckIn() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("mood");
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [reflection, setReflection] = useState("");
  const [streak, setStreak] = useState<StreakData | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  async function handleMoodSelect(mood: Mood) {
    setSelectedMood(mood);
    setStep("loading");

    const result = await getCheckInQuote(mood);
    setQuote(result.quote);
    setReflection(result.aiReflection);
    setStep("quote");
  }

  function handleDiyoBaaln() {
    const updated = updateStreak();
    setStreak(updated);
    setStep("streak");
    sessionStorage.setItem(SESSION_KEY, "true");
  }

  function handleDismiss() {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "true");
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={step === "streak" ? handleDismiss : undefined}
      />

      {/* Card */}
      <div className="relative w-full max-w-lg rounded-2xl bg-pageBg border border-sand shadow-lg overflow-hidden">

        {/* ── STEP: Mood Selection ── */}
        {step === "mood" && (
          <div className="px-8 py-12 text-center">
            <p className="text-textBody text-2xl font-serif font-bold tracking-wide">
              Aaja mann kasto chha?
            </p>
            <p className="text-textMuted text-base mt-2 font-sans font-medium">
              How are you feeling today?
            </p>

            <div className="flex justify-center gap-4 mt-10">
              {MOODS.map((mood) => {
                const Icon = WEATHER_ICONS[mood];
                return (
                  <button
                    key={mood}
                    onClick={() => handleMoodSelect(mood)}
                    className="flex flex-col items-center gap-3 w-18 py-4 px-3 rounded-xl hover:bg-feedBg transition-colors group cursor-pointer"
                  >
                    <Icon className="w-12 h-12 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-textMuted font-sans font-semibold leading-tight">
                      {MOOD_LABELS[mood].ne}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleDismiss}
              className="mt-10 text-sm text-textMuted/60 hover:text-textMuted transition-colors font-sans font-medium"
            >
              Skip for today
            </button>
          </div>
        )}

        {/* ── STEP: Loading ── */}
        {step === "loading" && (
          <div className="px-8 py-20 text-center">
            <div className="w-12 h-12 mx-auto rounded-full border-2 border-sand border-t-marigold animate-spin" />
            <p className="text-textMuted text-base font-semibold mt-6 font-sans">
              Timro lagi kei khojdai...
            </p>
          </div>
        )}

        {/* ── STEP: Quote Card ── */}
        {step === "quote" && quote && selectedMood && (
          <div className="px-8 py-8">
            {/* Mood tag */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {(() => { const Icon = WEATHER_ICONS[selectedMood]; return <Icon className="w-7 h-7" />; })()}
              <span className="text-base text-textMuted font-sans font-semibold">
                {MOOD_LABELS[selectedMood].en}
              </span>
            </div>

            {/* Quote */}
            <div className="bg-feedBg rounded-xl px-6 py-6 border border-sand/60">
              {quote.originalText && (
                <p className="text-textBody text-lg leading-relaxed font-serif font-bold">
                  {quote.originalText}
                </p>
              )}

              <p
                className={`text-textBody/80 leading-relaxed font-sans font-medium ${
                  quote.originalText ? "text-sm mt-3 italic" : "text-base"
                }`}
              >
                {quote.text}
              </p>

              <p className="text-textMuted text-sm mt-4 font-sans font-medium">
                — {quote.author}, {quote.country}
              </p>
            </div>

            {/* AI Reflection */}
            <p className="text-textBody/70 text-base leading-relaxed font-sans italic mt-5 px-1 font-medium">
              {reflection}
            </p>

            {/* Activity suggestion */}
            <div className="mt-5 flex items-center justify-center gap-3 py-3 px-4 bg-feedBg rounded-lg border border-sand/40">
              <span className="text-lg">{MOOD_ACTIVITIES[selectedMood].emoji}</span>
              <span className="text-sm text-textMuted font-sans font-semibold">
                {MOOD_ACTIVITIES[selectedMood].ne}
              </span>
            </div>

            {/* Diyo Baaln button */}
            <button
              onClick={handleDiyoBaaln}
              className="mt-6 w-full bg-ink text-pageBg rounded-lg py-3.5 text-base font-sans font-bold hover:bg-maroon transition-colors"
            >
              Diyo Baaln
            </button>
          </div>
        )}

        {/* ── STEP: Streak ── */}
        {step === "streak" && streak && (
          <div className="px-8 py-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-marigold/15 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8 7 4 10 4 14a8 8 0 0 0 16 0c0-4-4-7-8-12z" fill="#E8A020" />
              </svg>
            </div>
            <p className="text-textBody text-xl font-serif font-bold mt-5">
              Timro diyo baliyo
            </p>
            <p className="text-maroon text-3xl font-bold mt-2 font-sans">
              {streak.count} din
            </p>
            <p className="text-textMuted text-sm mt-3 font-sans font-semibold">
              {streakMessage(streak.count)}
            </p>
            <button
              onClick={handleDismiss}
              className="mt-8 border border-sand text-textBody rounded-lg px-8 py-3 text-sm font-sans font-semibold hover:bg-feedBg transition-colors"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
