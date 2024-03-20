export const throwCoinWithProbability = (probability = 100): boolean => {
  if (probability > 100) {
    throw new Error("Probability may not be greater than 100");
  }

  if (probability <= 0) {
    throw new Error('Probability must be greater than "0"');
  }

  const randomNumber = Math.random();
  return randomNumber < Number((probability / 100).toFixed(2));
};
