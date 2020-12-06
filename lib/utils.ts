/* eslint-disable no-param-reassign */
import camelCase from 'lodash.camelcase'
import { Target } from './types'

const helper = () => 'helper'

export const caseTargetToCamelCase = (result:Target, target:Target):Target => {
  const targetKeys = Object.keys(target)
  targetKeys.forEach((key) => {
    const keyParseToNumber = parseInt(key, 10)
    const newKey = Number.isNaN(keyParseToNumber) ? camelCase(key) : key
    const value = target[key]
    if (typeof value === 'object') {
      const childPropertyResult = Array.isArray(value) ? [] : {}
      result[newKey] = caseTargetToCamelCase(childPropertyResult, value)
    } else {
      result[newKey] = value
    }
  })
  return result
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

export const applyAugmentPlanToTarget = (target:Target, plan:Target):Target => {
  const planKeys = Object.keys(plan)
  planKeys.forEach((key) => {
    if (typeof plan[key] === 'function') {
      throw Error('Augment plan object should not include function')
    }
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      target[key] = applyAugmentPlanToTarget(target[key], plan[key])
    } else {
      target[key] = plan[key]
    }
  })
  return target
}

export default helper
