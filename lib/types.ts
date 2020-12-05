export interface CasingOption {
  to: 'pascal' | 'camel'
}
export interface Target {
  [key: string]:any
}

export type Plan = (target:Target) => Target
