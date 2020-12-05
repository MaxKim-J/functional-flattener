import cloneDeep from 'lodash.clonedeep'
import { caseTargetToCamelCase } from './utils'

class FlattenTarget {
  constructor(private target:object) {}

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
    return this.initialTarget
  }
}
export default FlattenTarget
