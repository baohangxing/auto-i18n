import type { SFCDescriptor, SFCScriptBlock, SFCStyleBlock, SFCTemplateBlock } from '@vue/compiler-sfc'

const generateTemplate = (template: SFCTemplateBlock) => {
  // TODO
  return `<template>${template.content}</template>\n`
}

const generateScript = (script: SFCScriptBlock) => {
  let attr = ''

  if (script.lang)
    attr += ` lang="${script.lang}"`
  if (script.setup)
    attr += ' setup'
  // TODO
  return `<script${attr}>${script.content}</script>\n`
}

const generateStyle = (style: SFCStyleBlock) => {
  let attr = ''

  if (style.lang)
    attr += ` lang="${style.lang}"`
  if (style.scoped)
    attr += ' scoped'

  return `<style${attr}>${style.content}</style>\n`
}

const generateStyles = (styles: SFCStyleBlock[]) => {
  return styles.map(x => generateStyle(x)).join('\n')
}

const generateSFC = (descriptor: SFCDescriptor) => {
  let sfcContent = ''

  descriptor.template && (sfcContent += generateTemplate(descriptor.template))

  descriptor.script && (sfcContent += generateScript(descriptor.script))

  descriptor.scriptSetup && (sfcContent += generateScript(descriptor.scriptSetup))

  sfcContent += generateStyles(descriptor.styles)

  return sfcContent
}

export { generateSFC }
