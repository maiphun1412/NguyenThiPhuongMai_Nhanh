import { faqData } from "@/src/lib/faq-data";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreMatch(input: string, question: string) {
  const a = normalize(input);
  const b = normalize(question);

  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.9;

  const aWords = a.split(" ");
  const bWords = b.split(" ");

  let same = 0;
  for (const word of aWords) {
    if (bWords.includes(word)) same++;
  }

  return same / Math.max(aWords.length, bWords.length);
}

export function findBestFAQ(userMessage: string) {
  let bestItem: (typeof faqData)[number] | null = null;
  let bestScore = 0;

  for (const item of faqData) {
    const score = scoreMatch(userMessage, item.question);
    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  return {
    bestItem,
    bestScore,
  };
}