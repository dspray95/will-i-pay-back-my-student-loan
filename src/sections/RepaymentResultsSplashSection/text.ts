const YES = ["YES", "YEP", "AYE"];

const YES_SNARK = [
  "congrats, I'm happy for you.",
  "well done, I hope you're very happy.",
  "nice (or not, depending on your perspective).",
];

const NO = ["NO", "NOPE", "NAH", "NAW"];

const NO_SNARK = [
  "ah well, you tried.",
  "nice.",
  "good effort though.",
  "its basically a tax anyway",
];

const getRandomElement = <T>(arr: T[]): T => {
  if (arr.length === 0) {
    throw "tried to get random element from array of length 0";
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export const getCopyText = (
  copyType: "yes" | "no" | "yes-snark" | "no-snark"
): string => {
  switch (copyType) {
    case "yes":
      return getRandomElement(YES);
    case "no":
      return getRandomElement(NO);
    case "yes-snark":
      return getRandomElement(YES_SNARK);
    case "no-snark":
      return getRandomElement(NO_SNARK);
  }
};
