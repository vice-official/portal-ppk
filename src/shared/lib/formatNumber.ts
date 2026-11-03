export function formatNumber(value: number): string {
    const formatter = new Intl.NumberFormat('ru-RU');
    return formatter.format(value);
}