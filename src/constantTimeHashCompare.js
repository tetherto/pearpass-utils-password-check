const HASH_LENGTH_BYTES = 32

/**
 * Performs constant-time comparison of two buffers.
 * Always iterates through all bytes to prevent timing attacks.
 *
 * @param {Buffer} a - First buffer
 * @param {Buffer} b - Second buffer
 * @returns {boolean} - true if buffers are equal, false otherwise
 */
const constantTimeEqual = (a, b) => {
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i]
  }
  return result === 0
}

/**
 * Performs constant-time comparison of two encoded 32-byte values.
 * Uses XOR + OR accumulation to prevent timing side-channel attacks.
 *
 * @param {string} value1 - First encoded value (32 bytes when decoded)
 * @param {string} value2 - Second encoded value (32 bytes when decoded)
 * @param {string} [encoding='hex'] - Encoding format ('hex' or 'base64')
 * @returns {boolean} - true if values are equal, false otherwise
 * @throws {TypeError} If either value is not a string
 * @throws {Error} If either value does not decode to exactly 32 bytes
 */
export const constantTimeHashCompare = (value1, value2, encoding = 'hex') => {
  if (typeof value1 !== 'string' || typeof value2 !== 'string') {
    throw new TypeError('Both values must be strings')
  }

  const buffer1 = Buffer.from(value1, encoding)
  const buffer2 = Buffer.from(value2, encoding)

  if (buffer1.length !== HASH_LENGTH_BYTES) {
    throw new Error(
      `Invalid value1 length: expected ${HASH_LENGTH_BYTES} bytes, got ${buffer1.length}`
    )
  }

  if (buffer2.length !== HASH_LENGTH_BYTES) {
    throw new Error(
      `Invalid value2 length: expected ${HASH_LENGTH_BYTES} bytes, got ${buffer2.length}`
    )
  }

  return constantTimeEqual(buffer1, buffer2)
}
