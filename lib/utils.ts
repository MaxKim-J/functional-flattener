import { Target } from './types'

export const isObjectButNotArray = (value:any) => typeof value === 'object' && !Array.isArray(value)
export const isObjectButNotNull = (value:any) => typeof value === 'object' && value !== null

export const cloneDeep = (target:Target) => {
  const result:Target = Array.isArray(target) ? [] : {}
  const objKeys:string[] = Object.keys(target)

  objKeys.forEach((key) => {
    if (isObjectButNotNull(target[key])) {
      result[key] = cloneDeep(target[key])
    } else {
      result[key] = target[key]
    }
  })

  return result
}
