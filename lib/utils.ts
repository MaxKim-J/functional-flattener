/* eslint-disable no-param-reassign */
import camelCase from 'lodash.camelcase'
import { Target } from './types'

const helper = () => 'helper'

export const caseTargetWithCasingFunction = (
  result:Target,
  target:Target,
  casingFunction:(arg:string) => string,
):Target => {
  const targetKeys = Object.keys(target)
  targetKeys.forEach((key) => {
    const keyParseToNumber = parseInt(key, 10)
    const newKey = Number.isNaN(keyParseToNumber) ? casingFunction(key) : key
    const value = target[key]
    if (typeof value === 'object') {
      const childPropertyResult = Array.isArray(value) ? [] : {}
      result[newKey] = caseTargetWithCasingFunction(childPropertyResult, value, casingFunction)
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

export const applyExtractPlanToTarget = (target:Target, extractPlan:string[]) => {
  extractPlan.forEach((extractKey) => {
    const referenceArr = extractKey.split('.')
    const lastReference = referenceArr.pop()
    let extractTargetProperty:Target = target
    referenceArr.forEach((key) => {
      extractTargetProperty = extractTargetProperty[key]
    })
    if (!extractTargetProperty[`${lastReference}`]) {
      throw Error(`${extractKey} does not exist in target`)
    }
    delete extractTargetProperty[`${lastReference}`]
  })
  return target
}

export default helper
