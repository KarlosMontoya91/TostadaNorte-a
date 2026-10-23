/**
 * price-formatter.js — Formateo monetario en centavos MXN según Intl.NumberFormat
 */

const mxnFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

/**
 * Convierte un entero en centavos MXN a texto monetario (ej. 9000 -> "$90.00")
 * @param {number} cents 
 * @returns {string}
 */
export function formatMoney(cents) {
  if (typeof cents !== 'number' || isNaN(cents)) {
    return '$0.00';
  }
  return mxnFormatter.format(cents / 100);
}

/**
 * Convierte un monto en centavos a texto para accesibilidad y lectores de pantalla
 * (ej. 9000 -> "90 pesos mexicanos")
 * @param {number} cents 
 * @returns {string}
 */
export function formatMoneyAria(cents) {
  const pesos = Math.floor(cents / 100);
  const remainder = cents % 100;
  if (remainder === 0) {
    return `${pesos} pesos`;
  }
  return `${pesos} pesos con ${remainder} centavos`;
}
