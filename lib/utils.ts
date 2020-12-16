export const isObjectButNotArray = (value:any) => typeof value === 'object' && !Array.isArray(value)
export const isObjectButNotNull = (value:any) => typeof value === 'object' && value !== null
