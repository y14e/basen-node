/**
 * BaseN (Node.js)
 *
 * @version 1.0.3
 * @author Yusuke Kamiyamane
 * @license MIT
 * @copyright Copyright (c) Yusuke Kamiyamane
 * @see {@link https://github.com/y14e/basen-node}
 */

// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import { createHash } from 'node:crypto';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Data = string | Buffer;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const BASE36_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';
const BASE62_CHARS =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const DEFAULT_LENGTH = 8;

// -----------------------------------------------------------------------------
// APIs
// -----------------------------------------------------------------------------

export function generateBase36Hash(
  data: Data = '',
  length = DEFAULT_LENGTH,
): string {
  return generateBaseNHash(BASE36_CHARS, data, length);
}

export function generateBase36Random(length = DEFAULT_LENGTH): string {
  return generateBaseNRandom(BASE36_CHARS, length);
}

export function generateBase62Hash(
  data: Data = '',
  length = DEFAULT_LENGTH,
): string {
  return generateBaseNHash(BASE62_CHARS, data, length);
}

export function generateBase62Random(length = DEFAULT_LENGTH): string {
  return generateBaseNRandom(BASE62_CHARS, length);
}

// -----------------------------------------------------------------------------
// Core
// -----------------------------------------------------------------------------

function generateBaseNHash(chars: string, data: Data, length: number): string {
  if (typeof data !== 'string' && !Buffer.isBuffer(data)) {
    console.warn('Invalid data. Fallback: empty string.');
    data = '';
  }

  length = clamp(length);
  let result = '';
  let n = BigInt(`0x${createHash('sha256').update(data).digest('hex')}`);
  const base = BigInt(chars.length);

  while (result.length < length) {
    result = chars[Number(n % base)] + result;
    n /= base;
  }

  return result;
}

function generateBaseNRandom(chars: string, length: number): string {
  length = clamp(length);
  let result = '';
  const randoms = crypto.getRandomValues(new Uint8Array(length));
  const base = chars.length;

  for (let i = 0; i < length; i++) {
    result += chars[(randoms[i] ?? 0) % base];
  }

  return result;
}

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

function clamp(length: number): number {
  function fallback(length: number): number {
    console.warn(`Invalid length. Fallback: ${length}.`);
    return length;
  }

  if (typeof length !== 'number' || Number.isNaN(length)) {
    return fallback(DEFAULT_LENGTH);
  }

  if (length < 1) {
    return fallback(1);
  }

  if (length > 64) {
    return fallback(64);
  }

  return length;
}
