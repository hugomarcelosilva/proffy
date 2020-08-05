const formatValue = (value: number): string =>
  Intl.NumberFormat('ja-JP', {
    minimumFractionDigits: 2,
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export default formatValue;
