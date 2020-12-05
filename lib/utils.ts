/* eslint-disable no-param-reassign */
import camelCase from 'lodash.camelcase'
import cloneDeep from 'lodash.clonedeep'

const helper = () => 'helper'

type targetObject = {
  [key: string]:any
}

export const caseTargetToCamelCase = (target:targetObject) => {
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
  return cloneDeep(target)
}

export default helper
