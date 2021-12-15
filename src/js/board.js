/**
 * Returns rows and columns of the board
 *
 * @param {number} uniqueCards The number of unique cards
 * @param {number} maxColumns Max columns allowed
 * @return {object} calculated rows and columns
 */
export function getSize(uniqueCards, maxColumns) {
  if (uniqueCards < 1) throw new Error('Unique cards must be greater than zero');

  const cards = uniqueCards * 2;
  let side = Math.ceil(Math.sqrt(cards));

  let cols;
  let rows;
  for (let i = side; i <= maxColumns; i++) {
    if (cards % i === 0) {
      cols = i;
      rows = cards / i;
      break;
    }
  }

  if (!cols) {
    side = Math.floor(Math.sqrt(cards));
    if (side > maxColumns) side = maxColumns;
    for (let i = side; i > 1; i--) {
      if (cards % i === 0) {
        cols = i;
        rows = cards / i;
        break;
      }
    }
  }

  if (!cols) {
    cols = uniqueCards;
    rows = 2;
  }

  if (cols > maxColumns) {
    [cols, rows] = [rows, cols];
  }

  return { rows, cols };
}

export default {
  getSize,
};
