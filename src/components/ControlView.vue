<template>
  <div class="control-view" :class="{ 'large-font': fontSize === 'large' }">
    <h1 class="title">ベッド操作</h1>
    
    <div class="control-sections">
      <!-- プリセット操作 -->
      <div class="control-card">
        <h2 class="section-title">プリセット</h2>
        <div class="preset-buttons">
          <button 
            v-for="preset in presets" 
            :key="preset.type"
            class="preset-btn"
            :disabled="isLocked"
            @click="applyPreset(preset.type)"
          >
            <div class="preset-icon">{{ preset.icon }}</div>
            <span>{{ preset.label }}</span>
          </button>
        </div>
      </div>

      <!-- ロック操作 -->
      <div class="control-card">
        <h2 class="section-title">安全ロック</h2>
        <div class="lock-control">
          <button 
            class="lock-toggle-btn"
            :class="{ 'locked': isLocked }"
            @click="toggleLock"
          >
            <div class="lock-icon">{{ isLocked ? '🔒' : '🔓' }}</div>
            <span>{{ isLocked ? 'ロック解除' : 'ロック' }}</span>
          </button>
          <p class="lock-description">
            {{ isLocked ? '操作がロックされています' : '操作可能です' }}
          </p>
        </div>
      </div>

      <!-- 微調整操作 -->
      <div class="control-card">
        <h2 class="section-title">微調整 (±5%)</h2>
        <div class="fine-controls">
          <!-- 背上げ -->
          <div class="fine-control-group">
            <label class="control-label">背上げ ({{ bedPosition.back }}%)</label>
            <div class="control-buttons">
              <button 
                class="control-btn decrease"
                :disabled="isLocked || bedPosition.back <= 0"
                @click="adjustBack(-5)"
              >
                ー
              </button>
              <button 
                class="control-btn increase"
                :disabled="isLocked || bedPosition.back >= 90"
                @click="adjustBack(5)"
              >
                ＋
              </button>
            </div>
          </div>

          <!-- 脚上げ -->
          <div class="fine-control-group">
            <label class="control-label">脚上げ ({{ bedPosition.leg }}%)</label>
            <div class="control-buttons">
              <button 
                class="control-btn decrease"
                :disabled="isLocked || bedPosition.leg <= 0"
                @click="adjustLeg(-5)"
              >
                ー
              </button>
              <button 
                class="control-btn increase"
                :disabled="isLocked || bedPosition.leg >= 45"
                @click="adjustLeg(5)"
              >
                ＋
              </button>
            </div>
          </div>

          <!-- 高さ -->
          <div class="fine-control-group">
            <label class="control-label">高さ ({{ bedPosition.height }}%)</label>
            <div class="control-buttons">
              <button 
                class="control-btn decrease"
                :disabled="isLocked || bedPosition.height <= 20"
                @click="adjustHeight(-5)"
              >
                ー
              </button>
              <button 
                class="control-btn increase"
                :disabled="isLocked || bedPosition.height >= 80"
                @click="adjustHeight(5)"
              >
                ＋
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ロック時のオーバーレイメッセージ -->
    <div v-if="isLocked" class="lock-overlay">
      <p>⚠️ 誤操作防止のため操作がロックされています</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { PresetType } from '@/types';

export default Vue.extend({
  name: 'ControlView',
  data() {
    return {
      presets: [
        { type: 'sleep' as PresetType, label: '就寝', icon: '😴' },
        { type: 'reading' as PresetType, label: '読書', icon: '📖' },
        { type: 'eating' as PresetType, label: '食事', icon: '🍽️' }
      ]
    };
  },
  computed: {
    ...mapGetters(['bedPosition', 'isLocked', 'fontSize'])
  },
  methods: {
    ...mapActions(['applyPreset', 'adjustBack', 'adjustLeg', 'adjustHeight']),
    toggleLock() {
      this.$store.commit('TOGGLE_LOCK');
    }
  }
});
</script>

<style scoped>
.control-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.large-font {
  font-size: 1.2em;
}

.title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.control-sections {
  display: grid;
  gap: 25px;
}

.control-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.section-title {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
  font-size: 1.2em;
}

/* プリセットボタン */
.preset-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border: 2px solid #2196F3;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1em;
}

.preset-btn:hover:not(:disabled) {
  background: #2196F3;
  color: white;
}

.preset-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #ccc;
}

.preset-icon {
  font-size: 2em;
}

/* ロック操作 */
.lock-control {
  text-align: center;
}

.lock-toggle-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 2px solid #4CAF50;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1em;
  margin: 0 auto;
  min-width: 120px;
}

.lock-toggle-btn.locked {
  border-color: #f44336;
  background: #ffebee;
}

.lock-toggle-btn:hover {
  background: #f5f5f5;
}

.lock-icon {
  font-size: 2em;
}

.lock-description {
  margin-top: 15px;
  color: #666;
  font-size: 0.9em;
}

/* 微調整操作 */
.fine-controls {
  display: grid;
  gap: 20px;
}

.fine-control-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.control-label {
  font-weight: 500;
  color: #333;
  min-width: 120px;
}

.control-buttons {
  display: flex;
  gap: 10px;
}

.control-btn {
  width: 50px;
  height: 50px;
  border: 2px solid #2196F3;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.5em;
  font-weight: bold;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover:not(:disabled) {
  background: #2196F3;
  color: white;
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: #ccc;
}

.control-btn.decrease {
  border-color: #f44336;
}

.control-btn.decrease:hover:not(:disabled) {
  background: #f44336;
}

.control-btn.increase {
  border-color: #4CAF50;
}

.control-btn.increase:hover:not(:disabled) {
  background: #4CAF50;
}

/* ロック時のオーバーレイ */
.lock-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(244, 67, 54, 0.9);
  color: white;
  text-align: center;
  padding: 15px;
  font-weight: bold;
  z-index: 1000;
}

@media (max-width: 600px) {
  .fine-control-group {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
    text-align: center;
  }
  
  .control-buttons {
    justify-content: center;
  }
}</style>