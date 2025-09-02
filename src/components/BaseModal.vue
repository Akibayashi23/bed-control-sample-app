<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="modal-overlay"
      @click="handleOverlayClick"
      @keydown.esc="closeModal"
    >
      <div
        class="modal-container"
        @click.stop
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="contentId"
      >
        <div class="modal-header">
          <h2 :id="titleId" class="modal-title">
            <slot name="title">モーダル</slot>
          </h2>
          <button
            class="modal-close"
            @click="closeModal"
            aria-label="閉じる"
            ref="closeButton"
          >
            ×
          </button>
        </div>
        
        <div class="modal-body" :id="contentId">
          <slot name="content">
            <p>モーダルの内容がここに表示されます。</p>
          </slot>
        </div>
        
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      titleId: `modal-title-${Symbol().toString()}`,
      contentId: `modal-content-${Symbol().toString()}`
    };
  },
  watch: {
    isOpen(newValue: boolean) {
      if (newValue) {
        this.onOpen();
      } else {
        this.onClose();
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleOverlayClick() {
      if (this.closeOnBackdrop) {
        this.closeModal();
      }
    },
    onOpen() {
      // 次のティックで closeButton にフォーカスを当てる
      this.$nextTick(() => {
        const closeButton = this.$refs.closeButton as HTMLButtonElement;
        if (closeButton) {
          closeButton.focus();
        }
      });
      
      // ESCキーのリスナーを追加
      document.addEventListener('keydown', this.handleEscKey);
    },
    onClose() {
      // ESCキーのリスナーを削除
      document.removeEventListener('keydown', this.handleEscKey);
    },
    handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    }
  },
  beforeDestroy() {
    // コンポーネント破棄時にイベントリスナーをクリーンアップ
    document.removeEventListener('keydown', this.handleEscKey);
  }
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8f9fa;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #718096;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  line-height: 1;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e2e8f0;
  color: #2d3748;
}

.modal-close:focus {
  outline: 2px solid #3182ce;
  outline-offset: 2px;
}

.modal-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  color: #2d3748;
}

.modal-body p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 12px;
}

.modal-body p:last-child {
  margin-bottom: 0;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8f9fa;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* レスポンシブ対応 */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .modal-title {
    font-size: 1.125rem;
  }
}

/* アクセシビリティ */
@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: none;
  }
}
</style>