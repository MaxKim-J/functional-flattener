import cloneDeep from 'lodash.clonedeep'
import { caseTargetToCamelCase, applyProcessPlanToTarget } from './utils'
import { Target, Plan } from './types'

class FlattenTarget {
  constructor(private target:Target) {}

  private clone() {
    return cloneDeep(this.target)
  }

  caseToCamel():FlattenTarget {
    const cloneTarget = this.clone()
    const result = caseTargetToCamelCase({}, cloneTarget)
    return new FlattenTarget(result)
  }

  process(processPlan:Plan):FlattenTarget {
    const cloneTarget = this.clone()
    const resolvedPlan = processPlan(cloneTarget)
    const result = applyProcessPlanToTarget({}, cloneTarget, resolvedPlan)
    return new FlattenTarget(result)
  }

  augment() {

  }

  extract() {

  }

  returnResult() {
    return this.clone()
  }
}
export default FlattenTarget
