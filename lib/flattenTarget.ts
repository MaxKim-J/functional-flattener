import cloneDeep from 'lodash.clonedeep'
import camelCase from 'lodash.camelcase'
import snakeCase from 'lodash/snakecase'

import {
  caseTargetWithCasingFunction,
  applyProcessPlanToTarget,
  applyAugmentPlanToTarget,
  applyExtractPlanToTarget,
} from './utils'
import { Target, Plan, CasingOption } from './types'

class FlattenTarget {
  constructor(private target:Target) {}

  private clone() {
    return cloneDeep(this.target)
  }

  case(option:CasingOption):FlattenTarget {
    const cloneTarget = this.clone()
    let casingFunction
    switch (option.to) {
      default:
      case 'camel':
        casingFunction = camelCase
        break
      case 'snake':
        casingFunction = snakeCase
    }
    const result = caseTargetWithCasingFunction({}, cloneTarget, casingFunction)
    return new FlattenTarget(result)
  }

  process(processPlan:Plan):FlattenTarget {
    const cloneTarget = this.clone()
    const resolvedPlan = processPlan(cloneTarget)
    const result = applyProcessPlanToTarget({}, cloneTarget, resolvedPlan)
    return new FlattenTarget(result)
  }

  augment(augmentPlan:Plan):FlattenTarget {
    const cloneTarget = this.clone()
    const resolvedPlan = augmentPlan(cloneTarget)
    const result = applyAugmentPlanToTarget(cloneTarget, resolvedPlan)
    return new FlattenTarget(result)
  }

  extract(extractPlan:string[]):FlattenTarget {
    const cloneTarget = this.clone()
    const result = applyExtractPlanToTarget(cloneTarget, extractPlan)
    return new FlattenTarget(result)
  }

  returnResult() {
    return this.clone()
  }
}
export default FlattenTarget
