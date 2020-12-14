import cloneDeep from 'lodash.clonedeep'
import camelCase from 'lodash.camelcase'
import snakeCase from 'lodash.snakecase'

import {
  caseTargetWithCasingFunction,
  applyProcessPlanToTarget,
  applyAugmentPlanToTarget,
  applyRemovePlanToTarget,
  applyKeyChangePlanToTarget,
} from './utils'
import {
  Target,
  ProcessPlan,
  AugmentPlan,
  ChangeKeyPlan,
  CasingOption,
  RemovePlan,
} from './types'

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

  changeKey(changePlan:ChangeKeyPlan):FlattenTarget {
    const cloneTarget = this.clone()
    const result = applyKeyChangePlanToTarget(cloneTarget, changePlan)
    return new FlattenTarget(result)
  }

  process(processPlan:ProcessPlan):FlattenTarget {
    const cloneTarget = this.clone()
    const resolvedPlan = processPlan(cloneTarget)
    const result = applyProcessPlanToTarget({}, cloneTarget, resolvedPlan)
    return new FlattenTarget(result)
  }

  augment(augmentPlan:AugmentPlan):FlattenTarget {
    const cloneTarget = this.clone()
    const resolvedPlan = augmentPlan(cloneTarget)
    const result = applyAugmentPlanToTarget(cloneTarget, resolvedPlan)
    return new FlattenTarget(result)
  }

  remove(removePlan:RemovePlan):FlattenTarget {
    const cloneTarget = this.clone()
    const result = applyRemovePlanToTarget(cloneTarget, removePlan)
    return new FlattenTarget(result)
  }

  returnResult() {
    return this.clone()
  }
}
export default FlattenTarget
