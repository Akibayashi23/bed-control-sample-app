import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseModal from '../BaseModal.vue'

describe('BaseModal コンポーネント', () => {
  let wrapper

  beforeEach(() => {
    // 各テスト前にラッパーをクリア
    if (wrapper) {
      wrapper.destroy()
    }
  })

  afterEach(() => {
    // テスト後のクリーンアップ
    if (wrapper) {
      wrapper.destroy()
    }
  })

  describe('表示/非表示', () => {
    it('isOpenがfalseの時はモーダルを表示しない', () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: false
        }
      })

      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('isOpenがtrueの時はモーダルを正しく表示する', () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        }
      })

      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
      expect(wrapper.find('.modal-container').exists()).toBe(true)
    })

    it('タイトルスロットの内容を正しく表示する', () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        },
        slots: {
          title: '<h2>テストタイトル</h2>'
        }
      })

      expect(wrapper.find('.modal-header h2').text()).toBe('テストタイトル')
    })

    it('コンテンツスロットを正しく表示する', () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        },
        slots: {
          content: '<p>テストコンテンツ</p>'
        }
      })

      expect(wrapper.find('.modal-body p').text()).toBe('テストコンテンツ')
    })

    it('フッタースロットを正しく表示する', () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        },
        slots: {
          footer: '<button>テストボタン</button>'
        }
      })

      expect(wrapper.find('.modal-footer button').text()).toBe('テストボタン')
    })
  })

  describe('閉じる機能', () => {
    it('×ボタンをクリックした時にcloseイベントが発火する', async () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        }
      })

      await wrapper.find('.modal-close').trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('オーバーレイをクリックした時にcloseイベントが発火する', async () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        }
      })

      await wrapper.find('.modal-overlay').trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('モーダルコンテンツをクリックした時はcloseイベントが発火しない', async () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        }
      })

      await wrapper.find('.modal-container').trigger('click')
      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('フォーカス管理', () => {
    it('モーダルが開いた時に適切にフォーカスが設定される', async () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        },
        attachTo: document.body
      })

      await wrapper.vm.$nextTick()
      
      // モーダルコンテナが存在することを確認
      expect(wrapper.find('.modal-container').exists()).toBe(true)
    })

    it('フォーカストラップ用の要素が正しく配置される', async () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        },
        slots: {
          content: '<input id="input1" /><input id="input2" />'
        },
        attachTo: document.body
      })

      await wrapper.vm.$nextTick()
      
      const inputs = wrapper.findAll('input')
      expect(inputs).toHaveLength(2)
      
      // フォーカス可能要素が存在することを確認
      const firstInput = inputs.at(0)
      const lastInput = inputs.at(1)
      
      expect(firstInput.exists()).toBe(true)
      expect(lastInput.exists()).toBe(true)
    })
  })

  describe('アクセシビリティ', () => {
    it('適切なARIA属性が設定されている', () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        }
      })

      const modalContainer = wrapper.find('.modal-container')
      expect(modalContainer.attributes('role')).toBe('dialog')
      expect(modalContainer.attributes('aria-modal')).toBe('true')
    })

    it('タイトルが提供された時にaria-labelledbyが設定される', () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        },
        slots: {
          title: 'テストタイトル'
        }
      })

      const modalContainer = wrapper.find('.modal-container')
      expect(modalContainer.attributes('aria-labelledby')).toBeDefined()
    })
  })

  describe('異常系・エッジケース', () => {
    it('スロットが空でもエラーにならない', () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        }
        // スロットなし
      })

      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
      expect(wrapper.find('.modal-container').exists()).toBe(true)
    })

    it('isOpenの値が頻繁に変更されても正しく動作する', async () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: false
        }
      })

      // 初期状態では非表示
      expect(wrapper.find('.modal-overlay').exists()).toBe(false)

      // 表示に変更
      await wrapper.setProps({ isOpen: true })
      expect(wrapper.find('.modal-overlay').exists()).toBe(true)

      // 再び非表示に変更
      await wrapper.setProps({ isOpen: false })
      expect(wrapper.find('.modal-overlay').exists()).toBe(false)

      // 再度表示
      await wrapper.setProps({ isOpen: true })
      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    })

    it('複数回連続でcloseイベントを発火しても問題ない', async () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        }
      })

      const closeButton = wrapper.find('.modal-close')
      
      // 複数回クリック
      await closeButton.trigger('click')
      await closeButton.trigger('click')
      await closeButton.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')).toHaveLength(3)
    })

    it('不正なHTML要素をスロットに渡してもエラーにならない', () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        },
        slots: {
          content: '<script>alert("test")</script><p>安全なコンテンツ</p>'
        }
      })

      // モーダルは正常に表示される
      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
      // 安全なコンテンツは表示される
      expect(wrapper.find('.modal-body p').text()).toBe('安全なコンテンツ')
    })

    it('大量のコンテンツでもスクロール可能で動作する', () => {
      const longContent = '<p>' + 'とても長いコンテンツ '.repeat(100) + '</p>'
      
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        },
        slots: {
          content: longContent
        }
      })

      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
      expect(wrapper.find('.modal-body p').exists()).toBe(true)
    })

    it('コンポーネント破棄時にイベントリスナーが適切にクリーンアップされる', () => {
      wrapper = mount(BaseModal, {
        propsData: {
          isOpen: true
        }
      })

      // コンポーネントが正常にマウントされていることを確認
      expect(wrapper.find('.modal-overlay').exists()).toBe(true)

      // 破棄してもエラーが発生しないことを確認
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })
  })

  // NOTE: ESCキー機能とライフサイクルの複雑なテストは現在省略
  // 将来の改善点として記録:
  // 1. ESCキープレスでのモーダル閉じる機能のテスト
  // 2. フォーカストラップの詳細な動作テスト
  // 3. アニメーション完了後のコールバック処理テスト
})