import { constantTimeHashCompare } from './constantTimeHashCompare'

describe('constantTimeHashCompare', () => {
  describe('with hex encoding (default)', () => {
    it('should return true for equal hashes', () => {
      const hash = Buffer.alloc(32, 'a').toString('hex')

      const result = constantTimeHashCompare(hash, hash)

      expect(result).toBe(true)
    })

    it('should return false for different hashes', () => {
      const hash1 = Buffer.alloc(32, 'a').toString('hex')
      const hash2 = Buffer.alloc(32, 'b').toString('hex')

      const result = constantTimeHashCompare(hash1, hash2)

      expect(result).toBe(false)
    })

    it('should throw for invalid hash length (too short)', () => {
      const validHash = Buffer.alloc(32, 'a').toString('hex')
      const shortHash = Buffer.alloc(16, 'b').toString('hex')

      expect(() => constantTimeHashCompare(validHash, shortHash)).toThrow(
        'Invalid value2 length: expected 32 bytes, got 16'
      )
    })

    it('should throw for invalid hash length (too long)', () => {
      const validHash = Buffer.alloc(32, 'a').toString('hex')
      const longHash = Buffer.alloc(64, 'b').toString('hex')

      expect(() => constantTimeHashCompare(validHash, longHash)).toThrow(
        'Invalid value2 length: expected 32 bytes, got 64'
      )
    })
  })

  describe('with base64 encoding', () => {
    it('should return true for equal base64-encoded values', () => {
      const value = Buffer.alloc(32, 'x').toString('base64')

      const result = constantTimeHashCompare(value, value, 'base64')

      expect(result).toBe(true)
    })

    it('should return false for different base64-encoded values', () => {
      const value1 = Buffer.alloc(32, 'x').toString('base64')
      const value2 = Buffer.alloc(32, 'y').toString('base64')

      const result = constantTimeHashCompare(value1, value2, 'base64')

      expect(result).toBe(false)
    })

    it('should throw for invalid base64 length', () => {
      const validValue = Buffer.alloc(32, 'a').toString('base64')
      const shortValue = Buffer.alloc(16, 'b').toString('base64')

      expect(() =>
        constantTimeHashCompare(validValue, shortValue, 'base64')
      ).toThrow('Invalid value2 length: expected 32 bytes, got 16')
    })
  })

  describe('input validation', () => {
    it('should throw TypeError for non-string inputs', () => {
      const validHash = Buffer.alloc(32, 'a').toString('hex')

      expect(() => constantTimeHashCompare(null, validHash)).toThrow(TypeError)
      expect(() => constantTimeHashCompare(validHash, null)).toThrow(TypeError)
      expect(() => constantTimeHashCompare(undefined, validHash)).toThrow(
        TypeError
      )
      expect(() => constantTimeHashCompare(123, validHash)).toThrow(TypeError)
      expect(() => constantTimeHashCompare({}, validHash)).toThrow(TypeError)
    })

    it('should throw when both values have invalid length', () => {
      const shortHash1 = Buffer.alloc(16, 'a').toString('hex')
      const shortHash2 = Buffer.alloc(16, 'b').toString('hex')

      expect(() => constantTimeHashCompare(shortHash1, shortHash2)).toThrow(
        'Invalid value1 length: expected 32 bytes, got 16'
      )
    })
  })

  describe('constant-time behavior', () => {
    it('should compare all bytes even when first byte differs', () => {
      const hash1 = Buffer.alloc(32, 0x00).toString('hex')
      const hash2 = Buffer.alloc(32, 0xff).toString('hex')

      const result = constantTimeHashCompare(hash1, hash2)

      expect(result).toBe(false)
    })

    it('should compare all bytes even when only last byte differs', () => {
      const buffer1 = Buffer.alloc(32, 'a')
      const buffer2 = Buffer.alloc(32, 'a')
      buffer2[31] = 0xff

      const result = constantTimeHashCompare(
        buffer1.toString('hex'),
        buffer2.toString('hex')
      )

      expect(result).toBe(false)
    })
  })
})
