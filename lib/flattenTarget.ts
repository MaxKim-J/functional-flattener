import cloneDeep from 'lodash.clonedeep'
import { caseTargetToCamelCase, applyProcessPlanToTarget } from './utils'
import { Target, Plan } from './types'

class FlattenTarget {
  constructor(private target:Target) {}

  casing():FlattenTarget {
    const cloneTarget = cloneDeep(this.target)
    const result = caseTargetToCamelCase({}, cloneTarget)
    return new FlattenTarget(result)
  }

  process(processPlan:Plan):FlattenTarget {
    const cloneTarget = cloneDeep(this.target)
    const resolvedPlan = processPlan(cloneTarget)
    const result = applyProcessPlanToTarget({}, cloneTarget, resolvedPlan)
    return new FlattenTarget(result)
  }

  generate() {

  }

  separate() {

  }

  returnResult() {
    return cloneDeep(this.target)
  }
}
export default FlattenTarget
