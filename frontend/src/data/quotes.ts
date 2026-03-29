export type Mood = "ramro" | "thikai" | "almaleko" | "garo" | "eklo";

export interface Quote {
  id: string;
  text: string;
  originalText?: string;
  author: string;
  country: string;
  moods: Mood[];
  themes: string[];
}

export const MOOD_LABELS: Record<Mood, { ne: string; en: string }> = {
  ramro: { ne: "राम्रो", en: "Good" },
  thikai: { ne: "ठिकै", en: "Okay" },
  almaleko: { ne: "अलमलेको", en: "Confused" },
  garo: { ne: "गारो", en: "Hard" },
  eklo: { ne: "एक्लो", en: "Lonely" },
};

export const MOOD_ACTIVITIES: Record<Mood, { emoji: string; ne: string }> = {
  ramro: { emoji: "📝", ne: "Aaja ko ramro kura journal garnus" },
  thikai: { emoji: "🎵", ne: "Mann pareko gaana sunnus" },
  almaleko: { emoji: "🌬️", ne: "3 choti lamo sas linus" },
  garo: { emoji: "🫂", ne: "Sahara page herna saknus" },
  eklo: { emoji: "💬", ne: "Katha padnus — timi eklai chhainau" },
};

export const FALLBACK_REFLECTIONS: Record<Mood, string> = {
  ramro: "Timro khusi dekhda mann ramro lagyo — yo energy lai hold garnus.",
  thikai: "Thikai hunu pani thik ho — hardin perfect huna pardaina.",
  almaleko: "Almaleko bela ma pani timi brave chhau — bato bhetinchha.",
  garo: "Garo chha tara timi gaaro bhandai pani yahaa aayau — tyo himmat ho.",
  eklo: "Eklo lagda pani yaad rakhnus — Chhaya ma timi eklai chhainau.",
};

export const quotes: Quote[] = [
  // ── Ramro (Good) ──
  {
    id: "q01",
    text: "The wound is the place where the Light enters you.",
    originalText: "زخم جایی است که نور از آن وارد می‌شود",
    author: "Rumi",
    country: "Persia",
    moods: ["ramro", "garo"],
    themes: ["healing", "hope"],
  },
  {
    id: "q02",
    text: "You are not a drop in the ocean. You are the entire ocean in a drop.",
    author: "Rumi",
    country: "Persia",
    moods: ["ramro", "eklo"],
    themes: ["self-worth", "identity"],
  },
  {
    id: "q03",
    text: "Where there is ruin, there is hope for a treasure.",
    author: "Rumi",
    country: "Persia",
    moods: ["ramro", "garo"],
    themes: ["hope", "resilience"],
  },
  {
    id: "q04",
    text: "The soul that sees beauty may sometimes walk alone.",
    author: "Goethe (loved by Tagore)",
    country: "Bengal",
    moods: ["ramro", "eklo"],
    themes: ["solitude", "beauty"],
  },
  // ── Thikai (Okay) ──
  {
    id: "q05",
    text: "Let life be beautiful like summer flowers and death like autumn leaves.",
    originalText: "জীবন যখন শুকায়ে যায় করুণাধারায় এসো",
    author: "Rabindranath Tagore",
    country: "Bengal",
    moods: ["thikai", "ramro"],
    themes: ["acceptance", "flow"],
  },
  {
    id: "q06",
    text: "The butterfly counts not months but moments, and has time enough.",
    author: "Rabindranath Tagore",
    country: "Bengal",
    moods: ["thikai", "almaleko"],
    themes: ["patience", "presence"],
  },
  {
    id: "q07",
    text: "Don't grieve. Anything you lose comes round in another form.",
    author: "Rumi",
    country: "Persia",
    moods: ["thikai", "garo"],
    themes: ["loss", "hope"],
  },
  {
    id: "q08",
    text: "Stars are not afraid to appear like fireflies.",
    author: "Rabindranath Tagore",
    country: "Bengal",
    moods: ["thikai", "almaleko"],
    themes: ["courage", "self-expression"],
  },
  // ── Almaleko (Confused) ──
  {
    id: "q09",
    text: "In the middle of difficulty lies opportunity.",
    author: "Laxmi Prasad Devkota",
    country: "Nepal",
    moods: ["almaleko", "garo"],
    themes: ["confusion", "growth"],
  },
  {
    id: "q10",
    text: "The moon stays bright when it doesn't avoid the night.",
    author: "Rumi",
    country: "Persia",
    moods: ["almaleko", "garo"],
    themes: ["darkness", "resilience"],
  },
  {
    id: "q11",
    text: "If you are irritated by every rub, how will your mirror be polished?",
    author: "Rumi",
    country: "Persia",
    moods: ["almaleko", "thikai"],
    themes: ["growth", "patience"],
  },
  {
    id: "q12",
    text: "Clouds come floating into my life, no longer to carry rain, but to add color to my sunset sky.",
    author: "Rabindranath Tagore",
    country: "Bengal",
    moods: ["almaleko", "thikai"],
    themes: ["perspective", "beauty"],
  },
  // ── Garo (Hard) ──
  {
    id: "q13",
    text: "This too shall pass.",
    originalText: "این نیز بگذرد",
    author: "Persian Proverb",
    country: "Persia",
    moods: ["garo", "almaleko"],
    themes: ["impermanence", "hope"],
  },
  {
    id: "q14",
    text: "The earth has music for those who listen.",
    author: "Nepali Proverb",
    country: "Nepal",
    moods: ["garo", "eklo"],
    themes: ["presence", "comfort"],
  },
  {
    id: "q15",
    text: "You were born with wings, why prefer to crawl through life?",
    author: "Rumi",
    country: "Persia",
    moods: ["garo", "almaleko"],
    themes: ["strength", "potential"],
  },
  {
    id: "q16",
    text: "I have become my own version of an optimist — if I can't make it through one door, I'll go through another.",
    author: "Fatima Jinnah",
    country: "Pakistan",
    moods: ["garo", "almaleko"],
    themes: ["resilience", "determination"],
  },
  {
    id: "q17",
    text: "Be like water making its way through cracks — nothing can stop the gentle persistence.",
    author: "South Asian Wisdom",
    country: "India",
    moods: ["garo", "thikai"],
    themes: ["persistence", "gentleness"],
  },
  // ── Eklo (Lonely) ──
  {
    id: "q18",
    text: "You think you are alone, but there are a thousand friends waiting behind the wall.",
    author: "Rumi",
    country: "Persia",
    moods: ["eklo", "garo"],
    themes: ["connection", "hope"],
  },
  {
    id: "q19",
    text: "I am mine before I am ever anyone else's.",
    author: "Nayyirah Waheed",
    country: "India",
    moods: ["eklo", "ramro"],
    themes: ["self-love", "identity"],
  },
  {
    id: "q20",
    text: "The flower bloomed and faded. The sun rose and set. The lover loved and went.",
    author: "Rabindranath Tagore",
    country: "Bengal",
    moods: ["eklo", "thikai"],
    themes: ["impermanence", "acceptance"],
  },
  {
    id: "q21",
    text: "Loneliness is the human condition — but being understood can make it bearable.",
    author: "South Asian Proverb",
    country: "Nepal",
    moods: ["eklo", "garo"],
    themes: ["loneliness", "connection"],
  },
  {
    id: "q22",
    text: "Even the darkest night will end and the sun will rise.",
    author: "Parijat",
    country: "Nepal",
    moods: ["eklo", "garo"],
    themes: ["hope", "dawn"],
  },
  {
    id: "q23",
    text: "Faith is the bird that feels the light when the dawn is still dark.",
    author: "Rabindranath Tagore",
    country: "Bengal",
    moods: ["eklo", "almaleko"],
    themes: ["faith", "hope"],
  },
  {
    id: "q24",
    text: "Out beyond ideas of wrongdoing and rightdoing there is a field. I'll meet you there.",
    author: "Rumi",
    country: "Persia",
    moods: ["eklo", "almaleko"],
    themes: ["acceptance", "connection"],
  },
  {
    id: "q25",
    text: "A woman is like a tea bag — you can't tell how strong she is until you put her in hot water.",
    author: "Begum Rokeya",
    country: "Bengal",
    moods: ["garo", "ramro"],
    themes: ["strength", "womanhood"],
  },
  {
    id: "q26",
    text: "The river that flows in you also flows in me.",
    originalText: "जो नदी तिमीमा बग्छ, त्यही नदी ममा पनि बग्छ",
    author: "Laxmi Prasad Devkota",
    country: "Nepal",
    moods: ["eklo", "ramro"],
    themes: ["unity", "connection"],
  },
];
