/* eslint-disable no-param-reassign */
import { Target, ChangeKeyPlan, RemovePlan } from './types'

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

export const applyKeyChangePlanToTarget = (target:Target, plan:ChangeKeyPlan):Target => {
  const planKeys = Object.keys(plan)
  planKeys.forEach((key) => {
    const [currentKey, newObjectKey] = key.split(':')
    const newKey = newObjectKey || plan[key] as string
    if (!target[currentKey]) { throw Error(`There is no such a key name ${currentKey} in target object`) }
    if (newObjectKey) {
      target[newKey] = applyKeyChangePlanToTarget(target[currentKey], plan[key] as ChangeKeyPlan)
      delete target[currentKey]
    } else {
      target[newKey] = target[key]
      delete target[key]
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

export const applyRemovePlanToTarget = (target:Target, removePlan:RemovePlan) => {
  removePlan.forEach((removeKey) => {
    const referenceArr = removeKey.split('.')
    const lastReference = referenceArr.pop()
    let removeTargetProperty:Target = target
    referenceArr.forEach((key) => {
      removeTargetProperty = removeTargetProperty[key]
    })
    if (!removeTargetProperty[`${lastReference}`]) {
      throw Error(`${removeKey} does not exist in target`)
    }
    delete removeTargetProperty[`${lastReference}`]
  })
  return target
}
