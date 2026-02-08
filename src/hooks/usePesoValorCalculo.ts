'use client';

import { useState, useCallback } from 'react';

const MAX_INTEGER_DIGITS = 5;
const PESO_DECIMALS = 5;
const VALOR_POR_PESO_DECIMALS = 4;
const VALOR_TOTAL_DECIMALS = 2;

/**
 * Precision-scale style mask: digits enter from the right and shift left.
 * Buffer = digits only (no comma). Comma position is fixed (e.g. 5 decimals = last 5 digits are decimal part).
 * Each new digit pushes previous ones one step to the left. Empty buffer shows "0,00000" (or 4/2 decimals).
 */

function scaleBufferToNumber(buffer: string, decimalPlaces: number): number {
  if (buffer === '') return 0;
  const maxLen = MAX_INTEGER_DIGITS + decimalPlaces;
  const padded = buffer.replace(/\D/g, '').slice(-maxLen).padStart(maxLen, '0');
  const intPart = padded.slice(0, MAX_INTEGER_DIGITS);
  const decPart = padded.slice(MAX_INTEGER_DIGITS);
  return parseFloat(intPart + '.' + decPart);
}

function numberToScaleBuffer(value: number, decimalPlaces: number): string {
  const fixed = value.toFixed(decimalPlaces);
  const [intPart, decPart] = fixed.split('.');
  const intPadded = (intPart || '0').replace(/\D/g, '').slice(-MAX_INTEGER_DIGITS).padStart(MAX_INTEGER_DIGITS, '0');
  const decPadded = (decPart || '').padEnd(decimalPlaces, '0').slice(0, decimalPlaces);
  const combined = intPadded + decPadded;
  return combined.replace(/^0+/, '') || '0';
}

function formatScaleDisplay(buffer: string, decimalPlaces: number): string {
  const maxLen = MAX_INTEGER_DIGITS + decimalPlaces;
  const padded = (buffer === '' ? '' : buffer.replace(/\D/g, '').slice(-maxLen)).padStart(maxLen, '0');
  const intPart = padded.slice(0, MAX_INTEGER_DIGITS).replace(/^0+/, '') || '0';
  const decPart = padded.slice(MAX_INTEGER_DIGITS);
  return intPart + ',' + decPart;
}

function applyScaleInput(value: string, decimalPlaces: number): string {
  const maxLen = MAX_INTEGER_DIGITS + decimalPlaces;
  return value.replace(/\D/g, '').slice(-maxLen);
}

export function usePesoValorCalculo() {
  const [pesoBuffer, setPesoBuffer] = useState('');
  const [valorPorPesoBuffer, setValorPorPesoBuffer] = useState('');
  const [valorTotalBuffer, setValorTotalBuffer] = useState('');

  const peso = formatScaleDisplay(pesoBuffer, PESO_DECIMALS);
  const valorPorPeso = formatScaleDisplay(valorPorPesoBuffer, VALOR_POR_PESO_DECIMALS);
  const valorTotal = formatScaleDisplay(valorTotalBuffer, VALOR_TOTAL_DECIMALS);

  const recalcularTotal = useCallback((p: number, v: number) => {
    const total = Number((v * p).toFixed(VALOR_TOTAL_DECIMALS));
    setValorTotalBuffer(numberToScaleBuffer(total, VALOR_TOTAL_DECIMALS));
  }, []);

  const recalcularValorPorPeso = useCallback((p: number, t: number) => {
    const valor = p ? Number((t / p).toFixed(VALOR_POR_PESO_DECIMALS)) : 0;
    setValorPorPesoBuffer(numberToScaleBuffer(valor, VALOR_POR_PESO_DECIMALS));
  }, []);

  const handlePesoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBuffer = applyScaleInput(e.target.value, PESO_DECIMALS);
    setPesoBuffer(newBuffer);
    const p = scaleBufferToNumber(newBuffer, PESO_DECIMALS);
    if (valorPorPesoBuffer) {
      recalcularTotal(p, scaleBufferToNumber(valorPorPesoBuffer, VALOR_POR_PESO_DECIMALS));
    } else if (valorTotalBuffer) {
      recalcularValorPorPeso(p, scaleBufferToNumber(valorTotalBuffer, VALOR_TOTAL_DECIMALS));
    }
  };

  const handleValorPorPesoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBuffer = applyScaleInput(e.target.value, VALOR_POR_PESO_DECIMALS);
    setValorPorPesoBuffer(newBuffer);
    const p = scaleBufferToNumber(pesoBuffer, PESO_DECIMALS);
    if (p) {
      recalcularTotal(p, scaleBufferToNumber(newBuffer, VALOR_POR_PESO_DECIMALS));
    }
  };

  const handleValorTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBuffer = applyScaleInput(e.target.value, VALOR_TOTAL_DECIMALS);
    setValorTotalBuffer(newBuffer);
    const p = scaleBufferToNumber(pesoBuffer, PESO_DECIMALS);
    if (p) {
      recalcularValorPorPeso(p, scaleBufferToNumber(newBuffer, VALOR_TOTAL_DECIMALS));
    }
  };

  return {
    peso,
    setPeso: (s: string) => setPesoBuffer(applyScaleInput(s, PESO_DECIMALS)),
    handlePesoChange,
    valorPorPeso,
    setValorPorPeso: (s: string) => setValorPorPesoBuffer(applyScaleInput(s, VALOR_POR_PESO_DECIMALS)),
    handleValorPorPesoChange,
    valorTotal,
    setValorTotal: (s: string) => setValorTotalBuffer(applyScaleInput(s, VALOR_TOTAL_DECIMALS)),
    handleValorTotalChange,
  };
}
