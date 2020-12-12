export interface CasingOption {
  to: 'snake' | 'camel'
}
export interface Target {
  [key: string]:any
}

export type ProcessPlan = (target:Target) => Target
export type AugmentPlan = (target:Target) => Target
export type ExtractPlan = string[]
export interface ChangeKeyPlan {
  [key: string]: string | ChangeKeyPlan
}
