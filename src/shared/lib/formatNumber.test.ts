import { describe, it, expect } from 'vitest';
import { formatNumber } from './formatNumber';

describe('formatNumber', () => {
  it('форматирует целые числа с разделителями разрядов', () => {
    const result = formatNumber(124580);
    expect(result.replace(/\u00a0/g, ' ')).toBe('124 580');
  });

  it('корректно обрабатывает ноль', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('обрабатывает отрицательные числа', () => {
    const result = formatNumber(-5000);
    expect(result.replace(/\u00a0/g, ' ')).toBe('-5 000');
  });
});
