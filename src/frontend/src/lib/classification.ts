// DDC (Dewey Decimal Classification) number lookup by category
export const DDC_NUMBERS: Record<string, string> = {
  computerscience: "004",
  math: "510",
  physics: "530",
  chemistry: "540",
  biology: "570",
  economics: "330",
  law: "340",
  literature: "800",
  philosophy: "100",
  psychology: "150",
  fiction: "813",
  nonFiction: "070",
  generalKnowledge: "030",
};

export const DDC_LABELS: Record<string, string> = {
  computerscience: "004 - Computer Science",
  math: "510 - Mathematics",
  physics: "530 - Physics",
  chemistry: "540 - Chemistry",
  biology: "570 - Biology",
  economics: "330 - Economics",
  law: "340 - Law",
  literature: "800 - Literature",
  philosophy: "100 - Philosophy",
  psychology: "150 - Psychology",
  fiction: "813 - Fiction",
  nonFiction: "070 - Non-Fiction",
  generalKnowledge: "030 - General Knowledge",
};

// Colon Classification facets by category
export const COLON_NUMBERS: Record<string, string> = {
  computerscience: "Q:4",
  math: "B:1",
  physics: "C:2",
  chemistry: "E:1",
  biology: "G:5",
  economics: "X:1",
  law: "Y:2",
  literature: "O:1",
  philosophy: "A:1",
  psychology: "S:1",
  fiction: "O:F",
  nonFiction: "O:N",
  generalKnowledge: "A:K",
};

export const CATEGORY_LABELS: Record<string, string> = {
  computerscience: "Computer Science",
  math: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  economics: "Economics",
  law: "Law",
  literature: "Literature",
  philosophy: "Philosophy",
  psychology: "Psychology",
  fiction: "Fiction",
  nonFiction: "Non-Fiction",
  generalKnowledge: "General Knowledge",
};

export const CATEGORY_COLORS: Record<string, string> = {
  computerscience: "#22B7AD",
  math: "#D18A4A",
  physics: "#7B5EA7",
  chemistry: "#2ECC9A",
  biology: "#4ECDC4",
  economics: "#FFA47A",
  law: "#E74C6F",
  literature: "#45B7D1",
  philosophy: "#9B59B6",
  psychology: "#F39C12",
  fiction: "#1ABC9C",
  nonFiction: "#7F93A8",
  generalKnowledge: "#A9B6C6",
};

export function getClassificationLabel(
  category: string,
  classification: string,
): string {
  if (classification === "ddc") {
    return DDC_LABELS[category] || "000 - General";
  }
  return COLON_NUMBERS[category] || "A:1";
}
