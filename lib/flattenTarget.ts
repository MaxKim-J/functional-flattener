import cloneDeep from 'lodash.clonedeep'
import { caseTargetToCamelCase } from './utils'
import { Target } from './types'

class FlattenTarget {
  constructor(private target:Target) {}

  casing():FlattenTarget {
    const cloneTarget = cloneDeep(this.target)
    const result = caseTargetToCamelCase(cloneTarget)
    return new FlattenTarget(result)
  }

  process() {

  }

  generate() {

  }

  separate() {

  }

  returnResult() {
    return this.target
  }
}
export default FlattenTarget
