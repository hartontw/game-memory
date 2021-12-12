import { getSize } from './board';

// Board test
describe('Board size test', () => {
  test('2 Cards | 2 Columns', () => {
    expect(getSize(2, 2)).toStrictEqual({ rows: 2, cols: 2 });
  });

  test('3 Cards | 2 Columns', () => {
    expect(getSize(3, 2)).toStrictEqual({ rows: 3, cols: 2 });
  });

  test('3 Cards | 3 Columns', () => {
    expect(getSize(3, 3)).toStrictEqual({ rows: 2, cols: 3 });
  });

  test('4 Cards | 3 Columns', () => {
    expect(getSize(4, 3)).toStrictEqual({ rows: 4, cols: 2 });
  });

  test('6 Cards | 2 Columns', () => {
    expect(getSize(6, 2)).toStrictEqual({ rows: 6, cols: 2 });
  });

  test('6 Cards | 4 Columns', () => {
    expect(getSize(6, 4)).toStrictEqual({ rows: 3, cols: 4 });
  });

  test('8 Cards | 3 Columns', () => {
    expect(getSize(8, 3)).toStrictEqual({ rows: 8, cols: 2 });
  });

  test('8 Cards | 8 Columns', () => {
    expect(getSize(8, 8)).toStrictEqual({ rows: 4, cols: 4 });
  });

  test('15 Cards | 4 Columns', () => {
    expect(getSize(15, 4)).toStrictEqual({ rows: 10, cols: 3 });
  });

  test('15 Cards | 5 Columns', () => {
    expect(getSize(15, 5)).toStrictEqual({ rows: 6, cols: 5 });
  });

  test('15 Cards | 8 Columns', () => {
    expect(getSize(15, 8)).toStrictEqual({ rows: 5, cols: 6 });
  });
});
