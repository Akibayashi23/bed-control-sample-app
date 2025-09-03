import '@testing-library/jest-dom'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

// グローバルVueセットアップ
const localVue = createLocalVue()
localVue.use(Vuex)

// テスト用のモック設定
global.localVue = localVue

// コンソール警告を抑制（必要に応じて）
const originalWarn = console.warn
console.warn = (...args) => {
  // Vue警告を抑制
  if (typeof args[0] === 'string' && args[0].includes('[Vue warn]')) {
    return
  }
  originalWarn(...args)
}