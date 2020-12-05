/* eslint-disable no-param-reassign */
import camelCase from 'lodash.camelcase'
import { Target } from './types'

const helper = () => 'helper'

export const caseTargetToCamelCase = (target:Target):Target => {
  const targetKeys = Object.keys(target)
  targetKeys.forEach((key) => {
    const value = target[key]
    let newKey = key
    const keyParseToNumber = parseInt(key, 10)
    if (Number.isNaN(keyParseToNumber)) {
      newKey = camelCase(key)
    }
    delete target[key]
    target[newKey] = value
    if (typeof value === 'object') {
      caseTargetToCamelCase(value)
    }
  })
  return target
}

export const applyProcessPlanToTarget = (result:Target, target:Target, plan:Target):Target => {
  const targetKeys = Object.keys(target)
  targetKeys.forEach((key) => {
    if (typeof plan[key] === 'function') {
      result[key] = plan[key](target[key])
    } else if (typeof plan[key] === 'object' && !Array.isArray(plan[key])) {
      result[key] = applyProcessPlanToTarget({}, target[key], plan[key])
    } else {
      result[key] = plan[key] || target[key]
    }
  })
  return result
}

export default helper
