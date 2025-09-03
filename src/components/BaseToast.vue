<template>
  <transition name="toast-fade">
    <div
      v-if="visible"
      :class="['toast', `toast-${type}`]"
      role="alert"
      aria-live="polite"
    >
      <div class="toast-icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✗</span>
        <span v-else-if="type === 'warning'">!</span>
        <span v-else-if="type === 'info'">i</span>
      </div>
      <div class="toast-content">
        <div class="toast-message">{{ message }}</div>
        <div v-if="description" class="toast-description">{{ description }}</div>
      </div>
      <button
        v-if="closable"
        @click="close"
        class="toast-close"
        aria-label="閉じる"
      >
        ×
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseToast',
  props: {
    message: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info',
      validator: value => ['success', 'error', 'warning', 'info'].includes(value)
    },
    duration: {
      type: Number,
      default: 3000
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      timer: null
    };
  },
  mounted() {
    this.show();
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    show() {
      this.visible = true;
      
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.close();
        }, this.duration);
      }
    },
    close() {
      this.visible = false;
      
      // トランジション完了後にコンポーネントを破棄
      setTimeout(() => {
        this.$emit('close');
      }, 300);
    }
  }
};
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  max-width: 400px;
  min-width: 300px;
  font-family: inherit;
  position: relative;
}

.toast-success {
  background-color: rgba(34, 197, 94, 0.95);
  color: white;
  border-left: 4px solid #16a34a;
}

.toast-error {
  background-color: rgba(239, 68, 68, 0.95);
  color: white;
  border-left: 4px solid #dc2626;
}

.toast-warning {
  background-color: rgba(245, 158, 11, 0.95);
  color: white;
  border-left: 4px solid #d97706;
}

.toast-info {
  background-color: rgba(59, 130, 246, 0.95);
  color: white;
  border-left: 4px solid #2563eb;
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-message {
  font-weight: 500;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 2px;
}

.toast-description {
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.3;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
  opacity: 0.7;
}

.toast-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
  opacity: 1;
}

.toast-close:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* モバイル対応 */
@media (max-width: 480px) {
  .toast {
    min-width: 280px;
    max-width: calc(100vw - 20px);
    margin-left: 10px;
    margin-right: 10px;
  }
  
  .toast-message {
    font-size: 13px;
  }
  
  .toast-description {
    font-size: 12px;
  }
}

/* アクセシビリティ */
@media (prefers-reduced-motion: reduce) {
  .toast-fade-enter-active,
  .toast-fade-leave-active {
    transition: none;
  }
  
  .toast-fade-enter-from,
  .toast-fade-leave-to {
    transform: none;
  }
}
</style>