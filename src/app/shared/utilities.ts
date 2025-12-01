export const generate6RandomDigitsToString = (): string => {
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
};

export const getRandomBoolean: () => boolean = () => Math.floor(Math.random() * 2) === 0;
