import type { TransformJsOptions } from './transformJs'
import transformJs from './transformJs'
import type { TransformVueOptions } from './transformVue'
import transformVue from './transformVue'
import KeyCollector from './collector'

export * from './parse'
export * from './tools'
export {
  KeyCollector, transformJs,
  transformVue,
}

export type {
  TransformJsOptions, TransformVueOptions,
}
