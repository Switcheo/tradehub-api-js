import { camelCase, isArray, isPlainObject } from 'lodash'

export function camelCaseDeep<T>(t?: T): T {
  if (isArray(t)) {
    return (t as any).map(camelCaseDeep)
  } else if (isPlainObject(t)) {
    return Object.fromEntries(
      Object.entries(t).map(([k, v]: [string, any]) => [camelCase(k), camelCaseDeep(v)])
    )
  } else {
    return t
  }
}
