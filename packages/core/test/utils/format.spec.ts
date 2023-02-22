import path from 'path'
import fs from 'fs'
import { afterAll, describe, expect, it } from 'vitest'
import { checkEslintConfigExist, lintFiles, lintText } from '../../src/utils/format'
import { trimRootPath } from '../_helps/utils'

const filePath = path.join(__dirname, 'format-spec-test.ts')

describe('#checkEslintConfigExist', () => {
  it('should return false', async () => {
    const [reslut, configPath] = checkEslintConfigExist(process.cwd(), false)
    expect(reslut).toEqual(false)
    expect(configPath).toEqual('')
  })

  it('should return true', async () => {
    const root = path.join(process.cwd(), '..', '..')
    const [reslut, configPath] = checkEslintConfigExist(process.cwd(), true)
    expect(reslut).toEqual(true)
    expect(trimRootPath([configPath], root)).toMatchSnapshot()
  })
})

describe('#format', () => {
  it('should format file content', async () => {
    const content = `/**
    * sort Object by lexical recursively, retren a new Object.
    * not support array value
    * @param obj
    * @returns
    */
    const  sortObjectKey = (obj: any): any => {
    if (!obj)   return {}
    const a: any = {};const  keys =    Object.keys( obj ).sort(lexicalComparator)
    for (const key of keys) { if (typeof obj[key] === 'object')
        a[key] = sortObjectKey(obj[key])
      else
        a[key] = obj[key]
    }
      return a
    }`

    fs.writeFileSync(filePath, content, 'utf8')
    await lintFiles(filePath)
    expect(fs.readFileSync(filePath).toString()).toMatchSnapshot()
    expect(fs.readFileSync(filePath).toString()).not.toEqual(content)
  })

  it('should lint text', async () => {
    const content = `/**
    * sort Object by lexical recursively, retren a new Object.
    * not support array value
    * @param obj
    * @returns
    */
    const  sortObjectKey = (obj: any): any => {
    if (!obj)   return {}
    const a: any = {};const  keys =    Object.keys( obj ).sort(lexicalComparator)
    for (const key of keys) { if (typeof obj[key] === 'object')
        a[key] = sortObjectKey(obj[key])
      else
        a[key] = obj[key]
    }
      return a
    }`

    const reslut = await lintText(content)
    expect(reslut).toMatchSnapshot()
    expect(reslut).not.toEqual(content)
  })

  it('should lint text', async () => {
    const content = `
    <template>
  <nav>
    <!--yo-auto-i18n-ignore-->
    <button class="change-button" @click="changeLanguage('zh')">{{ '改变为中文' }}</button>
     <!--yo-auto-i18n-ignore-->
    <button class="change-button" @click="changeLanguage('ja')">{{ '改变为日语' }}</button>
     <!--yo-auto-i18n-ignore-->
             <button class="change-button" @click="changeLanguage('ko')">{{ '改变为韩语' }}</button>
    <hr/>
    <router-link to="/">Home</router-link> |    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
</template>

<script lang="ts" setup>
import {    changeLanguage } from './lang/i18n'
</script>
     `
    const reslut = await lintText(content, 'vue')
    expect(reslut).toMatchSnapshot()
  })
})

afterAll(async () => {
  fs.rmSync(filePath)
})
