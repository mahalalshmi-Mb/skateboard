import { getLocalStorage } from "../../util/storageUtil";

// Base dictionary: UK → US
const spellingPairs = [
  ["customise", "customize"],
  ["organise", "organize"],
  ["analyse", "analyze"],
  ["apologise", "apologize"],
  ["colour", "color"],
  ["favourite", "favorite"],
  ["centre", "center"],
  ["theatre", "theater"],
  ["catalogue", "catalog"],
  ["travelling", "traveling"],
  ["cancelled", "canceled"],
  ["payment", "pay"],
];

// Generate bidirectional map with common suffixes
const generateVariantMap = (pairs) => {
  const suffixes = ["", "d", "s", "es", "ing", "ed"];
  const ukToUs = {};
  const usToUk = {};

  for (const [uk, us] of pairs) {
    for (const suffix of suffixes) {
      const ukWord = uk + suffix;
      const usWord = us + suffix;
      ukToUs[ukWord] = usWord;
      usToUk[usWord] = ukWord;
    }
  }

  return { ukToUs, usToUk };
};

const { ukToUs, usToUk } = generateVariantMap(spellingPairs);

// Capitalization helper
const matchCapitalization = (source, target) => {
  if (source === source.toUpperCase()) return target.toUpperCase();
  if (source[0] === source[0].toUpperCase())
    return target[0].toUpperCase() + target.slice(1);
  return target;
};

// Conversion function
export const convertSpelling = (text) => {
  const configData = getLocalStorage("config") || {};
  const locale = configData?.countryCode || "US";
  const map = locale.toUpperCase() === "US" ? ukToUs : usToUk;

  return text.replace(/\b\w+\b/g, (word) => {
    const lower = word.toLowerCase();
    const replacement = map[lower];
    return replacement ? matchCapitalization(word, replacement) : word;
  });
};
