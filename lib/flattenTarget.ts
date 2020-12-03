import cloneDeep from 'lodash.clonedeep'
import { CasingOption } from './types'
import { caseTargetToCamelCase } from './utils'

class FlattenTarget<T> {
  constructor(private target:T) {}

  casing():void {
    const cloneTarget = cloneDeep(this.target)
    return caseTargetToCamelCase(cloneTarget)
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
