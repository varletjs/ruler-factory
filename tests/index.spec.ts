import { describe, expect, it } from 'vitest'
import { rulerFactory } from '../src/index'

describe('rulerFactory', () => {
  const ruler = rulerFactory((validator) => validator)

  describe('edge cases: message === undefined', () => {
    it('string(undefined) should not return error', () => {
      const rules = ruler().string(undefined).done()
      expect(rules[0](123)).toBeUndefined()
      expect(rules[0]('abc')).toBeUndefined()
    })
    it('string(undefined) should not return error', () => {
      const rules = ruler().string(undefined).done()
      expect(rules[0](123)).toBeUndefined()
      expect(rules[0]('abc')).toBeUndefined()
    })
    it('number(undefined) should not return error', () => {
      const rules = ruler().number(undefined).done()
      expect(rules[0]('abc')).toBeUndefined()
      expect(rules[0](123)).toBeUndefined()
    })
    it('array(undefined) should not return error', () => {
      const rules = ruler().array(undefined).done()
      expect(rules[0]({})).toBeUndefined()
      expect(rules[0]([])).toBeUndefined()
    })
    it('boolean(undefined) should not return error', () => {
      const rules = ruler().boolean(undefined).done()
      expect(rules[0](123)).toBeUndefined()
      expect(rules[0](true)).toBeUndefined()
    })
    it('true(undefined) should not return error', () => {
      const rules = ruler().true(undefined).done()
      expect(rules[0](false)).toBeUndefined()
      expect(rules[0](true)).toBeUndefined()
    })
    it('false(undefined) should not return error', () => {
      const rules = ruler().false(undefined).done()
      expect(rules[0](true)).toBeUndefined()
      expect(rules[0](false)).toBeUndefined()
    })
    it('symbol(undefined) should not return error', () => {
      const rules = ruler().symbol(undefined).done()
      expect(rules[0](123)).toBeUndefined()
      expect(rules[0](Symbol('a'))).toBeUndefined()
    })
    it('null(undefined) should not return error', () => {
      const rules = ruler().null(undefined).done()
      expect(rules[0](undefined)).toBeUndefined()
      expect(rules[0](null)).toBeUndefined()
    })
    it('undefined(undefined) should not return error', () => {
      const rules = ruler().undefined(undefined).done()
      expect(rules[0](null)).toBeUndefined()
      expect(rules[0](undefined)).toBeUndefined()
    })
    it('bigint(undefined) should not return error', () => {
      const rules = ruler().bigint(undefined).done()
      expect(rules[0](123)).toBeUndefined()
      expect(rules[0](BigInt(123))).toBeUndefined()
    })
    it('object(undefined) should not return error', () => {
      const rules = ruler().object(undefined).done()
      expect(rules[0](123)).toBeUndefined()
      expect(rules[0]({})).toBeUndefined()
    })
  })

  it('should validate string type', () => {
    const rules = ruler().string('Must be string').done()
    expect(rules[0](123)).toEqual(new Error('Must be string'))
    expect(rules[0]('abc')).toBeUndefined()
  })

  it('should validate number type', () => {
    const rules = ruler().number('Must be number').done()
    expect(rules[0]('abc')).toEqual(new Error('Must be number'))
    expect(rules[0](123)).toBeUndefined()
  })

  it('should validate object type', () => {
    const rules = ruler().object('Must be object').done()
    expect(rules[0](123)).toEqual(new Error('Must be object'))
    expect(rules[0]({})).toBeUndefined()
  })

  it('should validate array type', () => {
    const rules = ruler().array('Must be array').done()
    expect(rules[0]({})).toEqual(new Error('Must be array'))
    expect(rules[0]([])).toBeUndefined()
  })

  it('should validate boolean type', () => {
    const rules = ruler().boolean('Must be boolean').done()
    expect(rules[0](123)).toEqual(new Error('Must be boolean'))
    expect(rules[0](true)).toBeUndefined()
  })

  it('should validate true', () => {
    const rules = ruler().true('Must be true').done()
    expect(rules[0](false)).toEqual(new Error('Must be true'))
    expect(rules[0](true)).toBeUndefined()
  })

  it('should validate false', () => {
    const rules = ruler().false('Must be false').done()
    expect(rules[0](true)).toEqual(new Error('Must be false'))
    expect(rules[0](false)).toBeUndefined()
  })

  it('should validate symbol type', () => {
    const rules = ruler().symbol('Must be symbol').done()
    expect(rules[0](123)).toEqual(new Error('Must be symbol'))
    expect(rules[0](Symbol('a'))).toBeUndefined()
  })

  it('should validate null', () => {
    const rules = ruler().null('Must be null').done()
    expect(rules[0](undefined)).toEqual(new Error('Must be null'))
    expect(rules[0](null)).toBeUndefined()
  })

  it('should validate undefined', () => {
    const rules = ruler().undefined('Must be undefined').done()
    expect(rules[0](null)).toEqual(new Error('Must be undefined'))
    expect(rules[0](undefined)).toBeUndefined()
  })

  it('should validate bigint type', () => {
    const rules = ruler().bigint('Must be bigint').done()
    expect(rules[0](123)).toEqual(new Error('Must be bigint'))
    expect(rules[0](BigInt(123))).toBeUndefined()
  })

  it('should validate required', () => {
    const rules = ruler().string().required('Required').done()
    expect(rules[1]('')).toEqual(new Error('Required'))
    expect(rules[1]('abc')).toBeUndefined()
  })

  it('should validate email', () => {
    const rules = ruler().string().email('Invalid email').done()
    expect(rules[1]('not-an-email')).toEqual(new Error('Invalid email'))
    expect(rules[1]('test@example.com')).toBeUndefined()
  })

  it('should validate min', () => {
    const rules = ruler().string().min(3, 'Too short').done()
    expect(rules[1]('ab')).toEqual(new Error('Too short'))
    expect(rules[1]('abc')).toBeUndefined()
    const numRules = ruler().number().min(3, 'Too small').done()
    expect(numRules[1](2)).toEqual(new Error('Too small'))
    expect(numRules[1](3)).toBeUndefined()
    const arrRules = ruler().array().min(2, 'Too few').done()
    expect(arrRules[1]([1])).toEqual(new Error('Too few'))
    expect(arrRules[1]([1, 2])).toBeUndefined()
  })

  it('should validate max', () => {
    const rules = ruler().string().max(3, 'Too long').done()
    expect(rules[1]('abcd')).toEqual(new Error('Too long'))
    expect(rules[1]('abc')).toBeUndefined()
    const numRules = ruler().number().max(3, 'Too big').done()
    expect(numRules[1](4)).toEqual(new Error('Too big'))
    expect(numRules[1](3)).toBeUndefined()
    const arrRules = ruler().array().max(2, 'Too many').done()
    expect(arrRules[1]([1, 2, 3])).toEqual(new Error('Too many'))
    expect(arrRules[1]([1, 2])).toBeUndefined()
  })

  it('should validate length', () => {
    const rules = ruler().string().length(3, 'Wrong length').done()
    expect(rules[1]('ab')).toEqual(new Error('Wrong length'))
    expect(rules[1]('abc')).toBeUndefined()
    const arrRules = ruler().array().length(2, 'Wrong length').done()
    expect(arrRules[1]([1])).toEqual(new Error('Wrong length'))
    expect(arrRules[1]([1, 2])).toBeUndefined()
  })

  it('should validate regex', () => {
    const rules = ruler().string().regex(/abc/, 'No match').done()
    expect(rules[1]('def')).toEqual(new Error('No match'))
    expect(rules[1]('abc')).toBeUndefined()
  })

  it('should validate startsWith', () => {
    const rules = ruler().string().startsWith('abc', 'Must start with abc').done()
    expect(rules[1]('def')).toEqual(new Error('Must start with abc'))
    expect(rules[1]('abcde')).toBeUndefined()
  })

  it('should validate endsWith', () => {
    const rules = ruler().string().endsWith('abc', 'Must end with abc').done()
    expect(rules[1]('def')).toEqual(new Error('Must end with abc'))
    expect(rules[1]('xxabc')).toBeUndefined()
  })

  it('should validate includes', () => {
    const rules = ruler().string().includes('abc', 'Must include abc').done()
    expect(rules[1]('def')).toEqual(new Error('Must include abc'))
    expect(rules[1]('xxabcxx')).toBeUndefined()
    const arrRules = ruler().array().includes('abc', 'Must include abc').done()
    expect(arrRules[1](['def'])).toEqual(new Error('Must include abc'))
    expect(arrRules[1](['abc', 'def'])).toBeUndefined()
  })

  it('should validate uppercase', () => {
    const rules = ruler().string().uppercase('Must be uppercase').done()
    expect(rules[1]('abc')).toEqual(new Error('Must be uppercase'))
    expect(rules[1]('ABC')).toBeUndefined()
  })

  it('should validate lowercase', () => {
    const rules = ruler().string().lowercase('Must be lowercase').done()
    expect(rules[1]('ABC')).toEqual(new Error('Must be lowercase'))
    expect(rules[1]('abc')).toBeUndefined()
  })

  it('should validate is', () => {
    const rules = ruler()
      .is((v) => v === 1, 'Must be 1')
      .done()
    expect(rules[0](2)).toEqual(new Error('Must be 1'))
    expect(rules[0](1)).toBeUndefined()
  })

  it('should validate not', () => {
    const rules = ruler()
      .not((v) => v === 1, 'Cannot be 1')
      .done()
    expect(rules[0](1)).toEqual(new Error('Cannot be 1'))
    expect(rules[0](2)).toBeUndefined()
  })

  it('should support trim, toLowerCase, toUpperCase', () => {
    const ctx = ruler().string().trim().toLowerCase().toUpperCase()
    expect(ctx.shouldTrim).toBe(true)
    expect(ctx.shouldToLowerCase).toBe(true)
    expect(ctx.shouldToUpperCase).toBe(true)
    expect(ctx.transformer('  Abc ')).toBe('ABC')
  })

  it('should support transform', () => {
    const ctx = ruler().string()
    ctx.transform((v) => v + 'x')
    expect(typeof ctx.transform).toBe('function')
  })

  it('should get message from function', () => {
    const rules = ruler()
      .string(() => 'msg')
      .done()
    expect(rules[0](123)).toEqual(new Error('msg'))
  })

  it('should validate gt for number', () => {
    const rules = ruler().number().gt(5, 'Must be > 5').done()
    expect(rules[1](5)).toEqual(new Error('Must be > 5'))
    expect(rules[1](6)).toBeUndefined()
    expect(rules[1](4)).toEqual(new Error('Must be > 5'))
  })

  it('should validate gt for bigint', () => {
    const rules = ruler().bigint().gt(BigInt(5), 'Must be > 5').done()
    expect(rules[1](BigInt(5))).toEqual(new Error('Must be > 5'))
    expect(rules[1](BigInt(6))).toBeUndefined()
    expect(rules[1](BigInt(4))).toEqual(new Error('Must be > 5'))
  })

  it('should validate gte for number', () => {
    const rules = ruler().number().gte(5, 'Must be >= 5').done()
    expect(rules[1](4)).toEqual(new Error('Must be >= 5'))
    expect(rules[1](5)).toBeUndefined()
    expect(rules[1](6)).toBeUndefined()
  })

  it('should validate gte for bigint', () => {
    const rules = ruler().bigint().gte(BigInt(5), 'Must be >= 5').done()
    expect(rules[1](BigInt(4))).toEqual(new Error('Must be >= 5'))
    expect(rules[1](BigInt(5))).toBeUndefined()
    expect(rules[1](BigInt(6))).toBeUndefined()
  })

  it('should validate lt for number', () => {
    const rules = ruler().number().lt(5, 'Must be < 5').done()
    expect(rules[1](5)).toEqual(new Error('Must be < 5'))
    expect(rules[1](4)).toBeUndefined()
    expect(rules[1](6)).toEqual(new Error('Must be < 5'))
  })

  it('should validate lt for bigint', () => {
    const rules = ruler().bigint().lt(BigInt(5), 'Must be < 5').done()
    expect(rules[1](BigInt(5))).toEqual(new Error('Must be < 5'))
    expect(rules[1](BigInt(4))).toBeUndefined()
    expect(rules[1](BigInt(6))).toEqual(new Error('Must be < 5'))
  })

  it('should validate lte for number', () => {
    const rules = ruler().number().lte(5, 'Must be <= 5').done()
    expect(rules[1](6)).toEqual(new Error('Must be <= 5'))
    expect(rules[1](5)).toBeUndefined()
    expect(rules[1](4)).toBeUndefined()
  })

  it('should validate lte for bigint', () => {
    const rules = ruler().bigint().lte(BigInt(5), 'Must be <= 5').done()
    expect(rules[1](BigInt(6))).toEqual(new Error('Must be <= 5'))
    expect(rules[1](BigInt(5))).toBeUndefined()
    expect(rules[1](BigInt(4))).toBeUndefined()
  })

  it('should validate positive for number', () => {
    const rules = ruler().number().positive('Must be positive').done()
    expect(rules[1](0)).toEqual(new Error('Must be positive'))
    expect(rules[1](-1)).toEqual(new Error('Must be positive'))
    expect(rules[1](1)).toBeUndefined()
  })

  it('should validate positive for bigint', () => {
    const rules = ruler().bigint().positive('Must be positive').done()
    expect(rules[1](BigInt(0))).toEqual(new Error('Must be positive'))
    expect(rules[1](BigInt(-1))).toEqual(new Error('Must be positive'))
    expect(rules[1](BigInt(1))).toBeUndefined()
  })

  it('should validate negative for number', () => {
    const rules = ruler().number().negative('Must be negative').done()
    expect(rules[1](0)).toEqual(new Error('Must be negative'))
    expect(rules[1](1)).toEqual(new Error('Must be negative'))
    expect(rules[1](-1)).toBeUndefined()
  })

  it('should validate negative for bigint', () => {
    const rules = ruler().bigint().negative('Must be negative').done()
    expect(rules[1](BigInt(0))).toEqual(new Error('Must be negative'))
    expect(rules[1](BigInt(1))).toEqual(new Error('Must be negative'))
    expect(rules[1](BigInt(-1))).toBeUndefined()
  })

  it('should validate min for bigint', () => {
    const rules = ruler().bigint().min(BigInt(3), 'Too small').done()
    expect(rules[1](BigInt(2))).toEqual(new Error('Too small'))
    expect(rules[1](BigInt(3))).toBeUndefined()
    expect(rules[1](BigInt(4))).toBeUndefined()
  })

  it('should validate max for bigint', () => {
    const rules = ruler().bigint().max(BigInt(3), 'Too big').done()
    expect(rules[1](BigInt(4))).toEqual(new Error('Too big'))
    expect(rules[1](BigInt(3))).toBeUndefined()
    expect(rules[1](BigInt(2))).toBeUndefined()
  })

  it('should validate uniq for array', () => {
    const rules = ruler().array().uniq('Must be unique').done()
    expect(rules[1]([1, 2, 2])).toEqual(new Error('Must be unique'))
    expect(rules[1]([1, 2, 3])).toBeUndefined()
  })

  it('should validate uniqBy for array', () => {
    const rules = ruler()
      .array()
      .uniqBy((a, b) => a.id === b.id, 'Must be unique by id')
      .done()
    expect(rules[1]([{ id: 1 }, { id: 2 }, { id: 1 }])).toEqual(new Error('Must be unique by id'))
    expect(rules[1]([{ id: 1 }, { id: 2 }, { id: 3 }])).toBeUndefined()
  })
})
