import FlattenTarget from './flattenTarget'
import { Target } from './types'

const flattener = (target:Target) => new FlattenTarget(target)

export default flattener
