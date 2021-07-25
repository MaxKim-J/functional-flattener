import { camelCase, snakeCase } from 'change-case'
import {
  caseTargetWithCasingFunction,
  applyProcessPlanToTarget,
  applyAugmentPlanToTarget,
  applyRemovePlanToTarget,
  applyKeyChangePlanToTarget,
} from './core'
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

  case(option:CasingOption):FlattenTarget {
    let casingFunction
    switch (option.to) {
      case 'snake':
        casingFunction = snakeCase
        break
      case 'camel':
      default:
        casingFunction = camelCase
        break
    }
    const result = caseTargetWithCasingFunction({}, this.target, casingFunction)
    return new FlattenTarget(result)
  }

  changeKey(changePlan:ChangeKeyPlan):FlattenTarget {
    const result = applyKeyChangePlanToTarget(this.target, changePlan)
    return new FlattenTarget(result)
  }

  process(processPlan:ProcessPlan):FlattenTarget {
    const resolvedPlan = processPlan(this.target)
    const result = applyProcessPlanToTarget({}, this.target, resolvedPlan)
    return new FlattenTarget(result)
  }

  augment(augmentPlan:AugmentPlan):FlattenTarget {
    const resolvedPlan = augmentPlan(this.target)
    const result = applyAugmentPlanToTarget(this.target, resolvedPlan)
    return new FlattenTarget(result)
  }

  remove(removePlan:RemovePlan):FlattenTarget {
    const result = applyRemovePlanToTarget(this.target, removePlan)
    return new FlattenTarget(result)
  }

  returnResult() {
    return this.target
  }
}
export default FlattenTarget
