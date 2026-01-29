import {
  hasDuplicates,
  hasDuplicatesBy,
  isArray,
  isBoolean,
  isEmpty,
  isFunction,
  isNumber,
  isPlainObject,
  isString,
  isSymbol,
} from 'rattail'

export type RulerFactoryMessage = string | (() => string)

const EMAIL_REGEX = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\\-]*\.)+[a-z]{2,}$/i

export type RulerFactoryValidator = (value: any) => undefined | Error

export type RulerFactoryGenerator<R, P> = (validator: RulerFactoryValidator, params?: P) => R

export type RulerContext<R, P, E> = Omit<
  {
    // helpers
    rules: R[]
    addRule: (validator: RulerFactoryValidator, params?: P) => RulerContext<R, P, E>
    generator: RulerFactoryGenerator<R, P>
    getMessage: (message: RulerFactoryMessage) => string
    // type
    type: string
    string: (message?: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    number: (message?: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    array: (message?: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    boolean: (message?: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    object: (message?: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    symbol: (message?: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    bigint: (message?: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    null: (message?: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    undefined: (message?: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    true: (message?: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    false: (message?: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    // validation
    length: (v: number, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    min: (v: number | bigint, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    max: (v: number | bigint, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    regex: (v: RegExp, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    required: (message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    startsWith: (v: string, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    endsWith: (v: string, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    includes: (v: string, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    uppercase: (message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    lowercase: (message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    email: (message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    gt: (v: number | bigint, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    gte: (v: number | bigint, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    lt: (v: number | bigint, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    lte: (v: number | bigint, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    positive: (message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    negative: (message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    uniq: (message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    uniqBy: (v: (a: any, b: any) => any, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    is: (v: (value: any) => boolean, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    not: (v: (value: any) => boolean, message: RulerFactoryMessage, params?: P) => RulerContext<R, P, E>
    done: () => R[]
    // transform
    transformer: (value: any) => any
    transform: (v: (value: any) => any) => void
    trim: () => RulerContext<R, P, E>
    shouldTrim: boolean
    toLowerCase: () => RulerContext<R, P, E>
    shouldToLowerCase: boolean
    toUpperCase: () => RulerContext<R, P, E>
    shouldToUpperCase: boolean
  },
  keyof E
> &
  E

export function rulerFactory<R, P = R, E extends Record<string, any> = {}>(
  generator: RulerFactoryGenerator<R, P>,
  extend?: (ctx: RulerContext<R, P, E>) => E,
) {
  return function ruler(): RulerContext<R, P, E> {
    const rules: R[] = []

    const ctx: RulerContext<R, P, {}> = {
      // helpers
      rules,
      addRule,
      generator,
      getMessage,
      // type
      type: 'string',
      string,
      number,
      array,
      boolean,
      object,
      symbol,
      bigint,
      null: _null,
      undefined: _undefined,
      true: _true,
      false: _false,
      // validation
      length,
      min,
      max,
      regex,
      required,
      startsWith,
      endsWith,
      includes,
      uppercase,
      lowercase,
      email,
      gt,
      gte,
      lt,
      lte,
      positive,
      negative,
      uniq,
      uniqBy,
      is,
      not,
      done,
      // transform
      transformer,
      transform,
      trim,
      shouldTrim: false,
      toLowerCase,
      shouldToLowerCase: false,
      toUpperCase,
      shouldToUpperCase: false,
    }

    Object.assign(ctx, (extend?.(ctx as any) ?? {}) as E)

    function string(message?: RulerFactoryMessage, params?: P) {
      ctx.type = 'string'

      addRule((value: any) => {
        if (message == null) {
          return
        }

        if (!isString(value)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function number(message?: RulerFactoryMessage, params?: P) {
      ctx.type = 'number'

      addRule((value) => {
        if (message == null) {
          return
        }

        if (!isNumber(value)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function object(message?: RulerFactoryMessage, params?: P) {
      ctx.type = 'object'

      addRule((value) => {
        if (message == null) {
          return
        }

        if (!isPlainObject(value)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function array(message?: RulerFactoryMessage, params?: P) {
      ctx.type = 'array'

      addRule((value) => {
        if (message == null) {
          return
        }

        if (!isArray(value)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function boolean(message?: RulerFactoryMessage, params?: P) {
      ctx.type = 'boolean'

      addRule((value) => {
        if (message == null) {
          return
        }

        if (!isBoolean(value)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function _true(message?: RulerFactoryMessage, params?: P) {
      ctx.type = 'boolean'

      addRule((value) => {
        if (message == null) {
          return
        }

        if (value !== true) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function _false(message?: RulerFactoryMessage, params?: P) {
      ctx.type = 'boolean'

      addRule((value) => {
        if (message == null) {
          return
        }

        if (value !== false) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function symbol(message?: RulerFactoryMessage, params?: P) {
      ctx.type = 'symbol'

      addRule((value) => {
        if (message == null) {
          return
        }

        if (!isSymbol(value)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function _null(message?: RulerFactoryMessage, params?: P) {
      ctx.type = 'null'

      addRule((value) => {
        if (message == null) {
          return
        }

        if (value !== null) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function _undefined(message?: RulerFactoryMessage, params?: P) {
      ctx.type = 'undefined'

      addRule((value) => {
        if (message == null) {
          return
        }

        if (value !== undefined) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function bigint(message?: RulerFactoryMessage, params?: P) {
      ctx.type = 'bigint'

      addRule((value) => {
        if (message == null) {
          return
        }

        if (typeof value !== 'bigint') {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function required(message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (isEmpty(value)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function email(message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'string' && (!isString(value) || !EMAIL_REGEX.test(value))) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function min(v: number | bigint, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'string' && (!isString(value) || value.length < v)) {
          return new Error(getMessage(message))
        }

        if (ctx.type === 'number' || ctx.type === 'bigint') {
          if (!isNumber(value) && typeof value !== 'bigint') {
            return new Error(getMessage(message))
          }

          if (value < v) {
            return new Error(getMessage(message))
          }
        }

        if (ctx.type === 'array' && (!isArray(value) || value.length < v)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function max(v: number | bigint, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'string' && (!isString(value) || value.length > v)) {
          return new Error(getMessage(message))
        }

        if (ctx.type === 'number' || ctx.type === 'bigint') {
          if (!isNumber(value) && typeof value !== 'bigint') {
            return new Error(getMessage(message))
          }

          if (value > v) {
            return new Error(getMessage(message))
          }
        }

        if (ctx.type === 'array' && (!isArray(value) || value.length > v)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function length(v: number, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'string' && (!isString(value) || value.length !== v)) {
          return new Error(getMessage(message))
        }

        if (ctx.type === 'array' && (!isArray(value) || value.length !== v)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function regex(v: RegExp, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'string' && (!isString(value) || !v.test(value))) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function startsWith(v: string, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'string' && (!isString(value) || !value.startsWith(v))) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function endsWith(v: string, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'string' && (!isString(value) || !value.endsWith(v))) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function includes(v: string, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'string' && (!isString(value) || !value.includes(v))) {
          return new Error(getMessage(message))
        }

        if (ctx.type === 'array' && (!isArray(value) || !value.includes(v))) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function uppercase(message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'string' && (!isString(value) || value !== value.toUpperCase())) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function lowercase(message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'string' && (!isString(value) || value !== value.toLowerCase())) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function gt(v: number | bigint, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'number' || ctx.type === 'bigint') {
          if (!isNumber(value) && typeof value !== 'bigint') {
            return new Error(getMessage(message))
          }

          if (value <= v) {
            return new Error(getMessage(message))
          }
        }
      }, params)

      return ctx
    }

    function gte(v: number | bigint, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'number' || ctx.type === 'bigint') {
          if (!isNumber(value) && typeof value !== 'bigint') {
            return new Error(getMessage(message))
          }

          if (value < v) {
            return new Error(getMessage(message))
          }
        }
      }, params)

      return ctx
    }

    function lt(v: number | bigint, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'number' || ctx.type === 'bigint') {
          if (!isNumber(value) && typeof value !== 'bigint') {
            return new Error(getMessage(message))
          }

          if (value >= v) {
            return new Error(getMessage(message))
          }
        }
      }, params)

      return ctx
    }

    function lte(v: number | bigint, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'number' || ctx.type === 'bigint') {
          if (!isNumber(value) && typeof value !== 'bigint') {
            return new Error(getMessage(message))
          }

          if (value > v) {
            return new Error(getMessage(message))
          }
        }
      }, params)

      return ctx
    }

    function positive(message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'number' || ctx.type === 'bigint') {
          if (!isNumber(value) && typeof value !== 'bigint') {
            return new Error(getMessage(message))
          }

          if (value <= 0) {
            return new Error(getMessage(message))
          }
        }
      }, params)

      return ctx
    }

    function negative(message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'number' || ctx.type === 'bigint') {
          if (!isNumber(value) && typeof value !== 'bigint') {
            return new Error(getMessage(message))
          }

          if (value >= 0) {
            return new Error(getMessage(message))
          }
        }
      }, params)

      return ctx
    }

    function uniq(message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'array' && hasDuplicates(value)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function uniqBy(v: (a: any, b: any) => any, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (ctx.type === 'array' && hasDuplicatesBy(value, v)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function is(v: (value: any) => boolean, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (!v(value)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function not(v: (value: any) => boolean, message: RulerFactoryMessage, params?: P) {
      addRule((value) => {
        if (v(value)) {
          return new Error(getMessage(message))
        }
      }, params)

      return ctx
    }

    function trim() {
      ctx.shouldTrim = true
      return ctx
    }

    function toLowerCase() {
      ctx.shouldToLowerCase = true
      return ctx
    }

    function toUpperCase() {
      ctx.shouldToUpperCase = true
      return ctx
    }

    function transformer(value: any) {
      if (ctx.type === 'string' && isString(value)) {
        ctx.shouldTrim && (value = value.trim())
        ctx.shouldToLowerCase && (value = value.toLowerCase())
        ctx.shouldToUpperCase && (value = value.toUpperCase())
      }

      return value
    }

    function transform(v: (value: any) => any) {
      ctx.transformer = v
    }

    function addRule(validator: RulerFactoryValidator, params?: P) {
      rules.push(
        generator((value) => {
          value = ctx.transformer(value)

          return validator(value)
        }, params),
      )

      return ctx
    }

    function done() {
      return rules
    }

    function getMessage(message: RulerFactoryMessage) {
      return isFunction(message) ? message() : message
    }

    return ctx as unknown as RulerContext<R, P, E>
  }
}
