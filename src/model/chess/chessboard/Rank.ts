type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export default Rank;

export const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8];

export const isRank = (
  potentialRank: string | number | Rank
): potentialRank is Rank => {
  return ranks.map(r => r.toString()).includes(potentialRank.toString());
};
