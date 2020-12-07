export interface CasingOption {
  to: 'snake' | 'camel'
}
export interface Target {
  [key: string]:any
}

export type Plan = (target:Target) => Target
