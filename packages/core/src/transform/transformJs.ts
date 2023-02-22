import { createRequire } from 'module'
import type { NodePath } from '@babel/traverse'
import type {
  ArrayExpression,
  CallExpression,
  Comment,
  Expression,
  ImportDeclaration,
  JSXAttribute,
  JSXText,
  MemberExpression,
  ObjectExpression,
  ObjectProperty,
  Program,
  StringLiteral,
  TemplateLiteral,
} from '@babel/types'
import type { GeneratorResult } from '@babel/generator'
import template from '@babel/template'
import { isEmpty, isObject } from 'lodash-es'
import t from '@babel/types'
import type * as traverseType from '@babel/traverse/index'
import type * as generatorType from '@babel/generator/index'
import type { ParseResult } from '@babel/core'
import type { Collector, I18nCallRule, Log } from '../types'
import { includeChinese } from '../utils/help'
import { IGNORE_REMARK } from '../config/constants'
import { getAutoBaseConfig as getAutoConfig } from '../config/config'
import { escapeQuotes, getCallExpression, getStringLiteral } from './tools'

const require = createRequire(import.meta.url)
// see https://github.com/babel/babel/issues/13855
const traverse: typeof traverseType.default = require('@babel/traverse').default
const babelGenerator: typeof generatorType.default = require('@babel/generator').default

interface NamedInterpolationParams {
  [k: string]:
  | string
  | {
    isAstNode: true
    value: Expression
  }
}

type ListInterpolationParams = Array< string
| {
  isAstNode: true
  value: Expression
}>

interface TransformJsOptions {
  rule: I18nCallRule
  parse: (code: string) => ParseResult | null

  replace: boolean

  /**
   * Whether handle js in vue
   */
  isJsInVue?: boolean

  loger?: Log<any>

  collector: Collector
}

const getObjectExpression = (obj: NamedInterpolationParams): ObjectExpression => {
  const ObjectPropertyArr: ObjectProperty[] = []
  Object.keys(obj).forEach((k) => {
    const tempValue = obj[k]
    let newValue: Expression
    if (isObject(tempValue))
      newValue = tempValue.value
    else
      newValue = t.identifier(tempValue)

    ObjectPropertyArr.push(t.objectProperty(t.identifier(k), newValue))
  })
  const ast = t.objectExpression(ObjectPropertyArr)
  return ast
}

const getArrayExpression = (params: ListInterpolationParams): ArrayExpression => {
  const ObjectPropertyArr: Expression [] = []
  params.forEach((tempValue) => {
    let newValue: Expression
    if (isObject(tempValue))
      newValue = tempValue.value
    else
      newValue = t.identifier(tempValue)

    ObjectPropertyArr.push(newValue)
  })
  const ast = t.arrayExpression(ObjectPropertyArr)
  return ast
}

/**
 * 判断节点是否是vue组件props属性的默认值，例如：
 * ```
 * props: {
    title: {
      default: '标题'
    }
  }
 * ```
 */
const isPropDefaultStringLiteralNode = (path: NodePath<StringLiteral>): boolean => {
  const objWithProps = path.parentPath?.parentPath?.parentPath?.parentPath?.parent
  const rootNode
    = path.parentPath?.parentPath?.parentPath?.parentPath?.parentPath?.parentPath?.parent
  let isMeetProp = false
  let isMeetKey = false
  let isMeetContainer = false
  // 属性是否包含在props结构里
  if (
    objWithProps
    && objWithProps.type === 'ObjectProperty'
    && objWithProps.key.type === 'Identifier'
    && objWithProps.key.name === 'props'
  )
    isMeetProp = true

  // 对应key是否是default
  if (
    path.parent
    && path.parent.type === 'ObjectProperty'
    && path.parent.key.type === 'Identifier'
    && path.parent.key.name === 'default'
  )
    isMeetKey = true

  // 遍历到指定层数后是否是导出声明
  if (rootNode && rootNode.type === 'ExportDefaultDeclaration')
    isMeetContainer = true

  return isMeetProp && isMeetKey && isMeetContainer
}

const getReplaceValue = (rule: I18nCallRule, value: string, replaceValue: string,
  params?: NamedInterpolationParams | ListInterpolationParams,
): Expression => {
  value = escapeQuotes(value)
  const { transCaller, transIdentifier } = rule
  let expression: string
  if (params) {
    const keyLiteral = getStringLiteral(replaceValue)
    if (transCaller) {
      return t.callExpression(
        t.memberExpression(t.identifier(transCaller), t.identifier(transIdentifier)),
        [keyLiteral, !Array.isArray(params)
          ? getObjectExpression(params)
          : getArrayExpression(params),
        ],
      )
    }
    else {
      return t.callExpression(t.identifier(transIdentifier), [
        keyLiteral,
        !Array.isArray(params)
          ? getObjectExpression(params)
          : getArrayExpression(params),
      ])
    }
  }
  else {
    expression = getCallExpression(rule, replaceValue)
    return template.expression(expression)()
  }
}

const transformJs = (code: string, options: TransformJsOptions): GeneratorResult => {
  const autoConfig = getAutoConfig()

  const rule = options.rule
  // 文件是否导入过i18n
  let hasImportI18n = false

  // 文件里是否存在中文转换，有的话才有必要导入i18n
  let hasTransformed = false

  const transformAST = (code: string, options: TransformJsOptions) => {
    const collector = options.collector

    function getTraverseOptions() {
      return {
        enter(path: NodePath) {
          const leadingComments = path.node.leadingComments
          if (leadingComments) {
            // 是否跳过翻译
            let isSkipTransform = false
            leadingComments.every((comment: Comment) => {
              if (comment.value.includes(IGNORE_REMARK)) {
                isSkipTransform = true
                return false
              }
              return true
            })
            if (isSkipTransform)
              path.skip()
          }
        },

        StringLiteral(path: NodePath<StringLiteral>) {
          if (includeChinese(path.node.value) && options.isJsInVue && isPropDefaultStringLiteralNode(path)) {
            collector.add(path.node.value)
            if (options.replace) {
              const expression = `() => ${getCallExpression(rule, collector.getKey(path.node.value))}`
              path.replaceWith(template.expression(expression)())
              hasTransformed = true
            }
            path.skip()
            return
          }

          if (includeChinese(path.node.value)) {
            collector.add(path.node.value)
            if (options.replace) {
              path.replaceWith(
                getReplaceValue(rule, path.node.value, collector.getKey(path.node.value)),
              )
              hasTransformed = true
            }
          }
          path.skip()
        },

        TemplateLiteral(path: NodePath<TemplateLiteral>) {
          const { node } = path
          const templateMembers = [...node.quasis, ...node.expressions]
          templateMembers.sort((a, b) => (a.start as number) - (b.start as number))

          const shouldReplace = node.quasis.some(node => includeChinese(node.value.raw))

          if (shouldReplace) {
            let value = ''
            let slotParams: NamedInterpolationParams | ListInterpolationParams | undefined

            if (autoConfig.transInterpolationsMode === 'NamedInterpolationMode') {
              let slotIndex = 1
              const params: NamedInterpolationParams = {}
              templateMembers.forEach((node) => {
                if (node.type === 'Identifier') {
                  value += `{${node.name}}`
                  params[node.name] = node.name
                }
                else if (node.type === 'TemplateElement') {
                  value += node.value.raw.replace(/[\r\n]/g, '') // 用raw防止字符串中出现 /n
                }
                else if (node.type === 'MemberExpression') {
                  const key = `slot${slotIndex++}`
                  value += `{${key}}`
                  params[key] = {
                    isAstNode: true,
                    value: node as MemberExpression,
                  }
                }
                else {
                // 处理${}内容为表达式的情况。例如`测试${a + b}`，
                // 把 a + b 这个语法树作为params的值, 并自定义params的键为slot加数字的形式
                  const key = `slot${slotIndex++}`
                  value += `{${key}}`
                  const expression = babelGenerator(node).code
                  const tempAst = transformAST(expression, options) as any
                  const expressionAst = tempAst.program.body[0].expression
                  params[key] = {
                    isAstNode: true,
                    value: expressionAst,
                  }
                }
              })

              slotParams = isEmpty(params) ? undefined : params
            }
            else if (autoConfig.transInterpolationsMode === 'ListInterpolationMode') {
              let index = 0
              const params: ListInterpolationParams = []
              templateMembers.forEach((node) => {
                if (node.type === 'Identifier') {
                  value += `{${index++}}`
                  params.push(node.name)
                }
                else if (node.type === 'TemplateElement') {
                  value += node.value.raw.replace(/[\r\n]/g, '')
                  // TODO 用raw防止字符串中出现 /n??
                }
                else if (node.type === 'MemberExpression') {
                  value += `{${index++}}`
                  params.push({
                    isAstNode: true,
                    value: node as MemberExpression,
                  })
                }
                else {
                  value += `{${index++}}`
                  const expression = babelGenerator(node).code
                  const tempAst = transformAST(expression, options) as any
                  const expressionAst = tempAst.program.body[0].expression
                  params.push({
                    isAstNode: true,
                    value: expressionAst,
                  })
                }
              })

              slotParams = isEmpty(params) ? undefined : params
            }
            else {
              options.loger?.error('AutoConfig.transInterpolationsMode must is '
                + '\'NamedInterpolationMode\' or \'ListInterpolationMode\'')
            }

            collector.add(value)

            if (options.replace) {
              path.replaceWith(getReplaceValue(rule, value, collector.getKey(value), slotParams))
              hasTransformed = true
            }
          }
        },

        JSXText(path: NodePath<JSXText>) {
          if (includeChinese(path.node.value)) {
            collector.add(path.node.value)
            if (options.replace) {
              // TODO trim
              path.replaceWith(t.jSXExpressionContainer(
                getReplaceValue(rule, path.node.value, collector.getKey(path.node.value))))
              hasTransformed = true
            }
          }
          path.skip()
        },

        JSXAttribute(path: NodePath<JSXAttribute>) {
          const node = path.node as NodePath<JSXAttribute>['node']
          const valueType = node.value?.type
          if (valueType === 'StringLiteral' && node.value && includeChinese(node.value.value)) {
            collector.add(node.value.value)
            if (options.replace) {
              const jsxIdentifier = t.jsxIdentifier(node.name.name as string)
              const jsxContainer = t.jSXExpressionContainer(
                getReplaceValue(rule, node.value.value, collector.getKey(node.value.value)),
              )
              path.replaceWith(t.jsxAttribute(jsxIdentifier, jsxContainer))
              hasTransformed = true
            }
            path.skip()
          }
        },

        CallExpression(path: NodePath<CallExpression>) {
          const { node } = path
          const { transCaller, transIdentifier } = rule
          const callee = node.callee

          // 无调用对象的情况，例如 t('xx')
          if (!transCaller && callee.type === 'Identifier' && callee.name === transIdentifier) {
            path.skip()
            return
          }

          // 有调用对象的情况，例如this.$t('xx')、i18n.$t('xx')
          if (callee.type === 'MemberExpression') {
            if (callee.property && callee.property.type === 'Identifier') {
              if (callee.property.name === transIdentifier) {
                // 处理形如i18n.$t('xx')的情况
                if (callee.object.type === 'Identifier' && callee.object.name === transCaller) {
                  path.skip()
                  return
                }
                // 处理形如this.$t('xx')的情况
                if (callee.object.type === 'ThisExpression' && transCaller === 'this')
                  path.skip()
              }
            }
          }
        },

        ImportDeclaration(path: NodePath<ImportDeclaration>) {
          const { importDeclaration, variableDeclaration } = rule
          const res = importDeclaration.match(/from ["'](.*)["']/)
          const packageName = res ? res[1] : ''

          if (path.node.source.value === packageName)
            hasImportI18n = true

          if (!hasImportI18n && hasTransformed) {
            const program = path.parent as Program
            const lastImportIndex = program.body.findIndex(x => x.type !== 'ImportDeclaration')

            const variableAst = template.statements(variableDeclaration)().reverse()

            variableAst.forEach((statement) => {
              program.body.splice(lastImportIndex, 0, statement)
            })

            const importAst = template.statements(importDeclaration)().reverse()

            importAst.forEach((statement) => {
              program.body.splice(lastImportIndex, 0, statement)
            })

            hasImportI18n = true
          }
        },
      }
    }

    const ast = options.parse(code)
    traverse(ast, getTraverseOptions())
    return ast
  }

  const ast = transformAST(code, options)

  if (!hasImportI18n && hasTransformed && ast) {
    const { importDeclaration, variableDeclaration } = rule
    const program = ast.program
    const lastImportIndex = program.body.findIndex(x => x.type !== 'ImportDeclaration')

    const variableAst = template.statements(variableDeclaration)().reverse()

    variableAst.forEach((statement) => {
      program.body.splice(lastImportIndex, 0, statement)
    })

    const importAst = template.statements(importDeclaration)().reverse()

    importAst.forEach((statement) => {
      program.body.splice(lastImportIndex, 0, statement)
    })
    hasImportI18n = true
  }

  const result = (!ast ? code : babelGenerator(ast)) as GeneratorResult

  return result
}

export default transformJs

export type { TransformJsOptions }
