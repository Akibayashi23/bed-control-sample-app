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
            :class="{ 'active': activePresetType === preset.type }"
            :disabled="isLocked"
            @click="applyPreset(preset.type)"
          >
            <div class="preset-icon">{{ preset.icon }}</div>
            <span>{{ preset.label }}</span>
          </button>
        </div>
        
        <!-- カスタムプリセット -->
        <div v-if="customPresets.length > 0" class="custom-presets">
          <h3 class="custom-preset-title">カスタムプリセット</h3>
          <div class="custom-preset-buttons">
            <div 
              v-for="preset in customPresets" 
              :key="preset.id"
              class="custom-preset-container"
            >
              <button 
                class="preset-btn custom-preset-btn"
                :class="{ 'active': activeCustomPresetId === preset.id }"
                :disabled="isLocked"
                @click="applyCustomPreset(preset.id)"
              >
                <div class="preset-icon">⭐</div>
                <span>{{ preset.name }}</span>
              </button>
              <button 
                class="delete-btn"
                :disabled="isLocked"
                @click="confirmDeletePreset(preset)"
                :title="`${preset.name}を削除`"
              >
                ×
              </button>
            </div>
          </div>
        </div>
        
        <!-- カスタムプリセット追加ボタン -->
        <button 
          class="add-custom-btn"
          :disabled="isLocked"
          @click="showCustomPresetModal = true"
        >
          <div class="add-icon">＋</div>
          <span>カスタム追加</span>
        </button>
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

    <!-- カスタムプリセット追加モーダル -->
    <BaseModal :isOpen="showCustomPresetModal" @close="closeCustomPresetModal">
      <template #title>
        カスタムプリセット追加
      </template>
      <template #content>
        <form @submit.prevent="saveCustomPreset">
          <div class="form-group">
            <label for="presetName">プリセット名 <span class="required">*</span></label>
            <input
              type="text"
              id="presetName"
              v-model="customPresetForm.name"
              placeholder="例: リラックス"
              required
              maxlength="20"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>姿勢設定</label>
            <div class="position-controls">
              <div class="position-item">
                <label for="customBack">背上げ: {{ customPresetForm.back }}%</label>
                <input
                  type="range"
                  id="customBack"
                  v-model.number="customPresetForm.back"
                  min="0"
                  max="90"
                  step="5"
                  class="range-input"
                />
              </div>
              
              <div class="position-item">
                <label for="customLeg">脚上げ: {{ customPresetForm.leg }}%</label>
                <input
                  type="range"
                  id="customLeg"
                  v-model.number="customPresetForm.leg"
                  min="0"
                  max="45"
                  step="5"
                  class="range-input"
                />
              </div>
              
              <div class="position-item">
                <label for="customHeight">高さ: {{ customPresetForm.height }}%</label>
                <input
                  type="range"
                  id="customHeight"
                  v-model.number="customPresetForm.height"
                  min="20"
                  max="80"
                  step="5"
                  class="range-input"
                />
              </div>
            </div>
          </div>
        </form>
      </template>
      <template #footer>
        <button @click="closeCustomPresetModal" class="modal-btn secondary">
          キャンセル
        </button>
        <button @click="saveCustomPreset" class="modal-btn primary" :disabled="!customPresetForm.name.trim()">
          保存
        </button>
      </template>
    </BaseModal>

    <!-- 削除確認モーダル -->
    <BaseModal :isOpen="showDeleteConfirmModal" @close="closeDeleteConfirmModal">
      <template #title>
        プリセット削除
      </template>
      <template #content>
        <p>「<strong>{{ presetToDelete?.name }}</strong>」を削除しますか？</p>
        <p class="delete-warning">この操作は取り消せません。</p>
      </template>
      <template #footer>
        <button @click="closeDeleteConfirmModal" class="modal-btn secondary">
          キャンセル
        </button>
        <button @click="deleteCustomPreset" class="modal-btn danger">
          削除
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import BaseModal from './BaseModal.vue';

const { mapGetters: mapBedGetters, mapActions: mapBedActions } = createNamespacedHelpers('bed');
const { mapGetters: mapSettingsGetters } = createNamespacedHelpers('settings');

export default Vue.extend({
  name: 'ControlView',
  components: {
    BaseModal
  },
  data() {
    return {
      presets: [
        { type: 'sleep', label: '就寝', icon: '😴' },
        { type: 'reading', label: '読書', icon: '📖' },
        { type: 'eating', label: '食事', icon: '🍽️' }
      ],
      showCustomPresetModal: false,
      showDeleteConfirmModal: false,
      presetToDelete: null,
      customPresetForm: {
        name: '',
        back: 0,
        leg: 0,
        height: 30
      }
    };
  },
  computed: {
    ...mapBedGetters(['bedPosition', 'isLocked', 'batteryLevel', 'customPresets', 'activePresetType', 'activeCustomPresetId']),
    ...mapSettingsGetters(['fontSize'])
  },
  methods: {
    ...mapBedActions(['applyPreset', 'adjustBack', 'adjustLeg', 'adjustHeight', 'addCustomPreset', 'applyCustomPreset', 'removeCustomPreset']),
    toggleLock() {
      this.$store.commit('bed/TOGGLE_LOCK');
    },
    closeCustomPresetModal() {
      this.showCustomPresetModal = false;
      this.resetCustomPresetForm();
    },
    resetCustomPresetForm() {
      this.customPresetForm = {
        name: '',
        back: this.bedPosition.back,
        leg: this.bedPosition.leg,
        height: this.bedPosition.height
      };
    },
    saveCustomPreset() {
      if (!this.customPresetForm.name.trim()) return;
      
      this.addCustomPreset({
        name: this.customPresetForm.name.trim(),
        position: {
          back: this.customPresetForm.back,
          leg: this.customPresetForm.leg,
          height: this.customPresetForm.height
        }
      });
      
      this.closeCustomPresetModal();
    },
    confirmDeletePreset(preset) {
      this.presetToDelete = preset;
      this.showDeleteConfirmModal = true;
    },
    closeDeleteConfirmModal() {
      this.showDeleteConfirmModal = false;
      this.presetToDelete = null;
    },
    deleteCustomPreset() {
      if (this.presetToDelete) {
        this.removeCustomPreset(this.presetToDelete.id);
        this.closeDeleteConfirmModal();
      }
    }
  },
  watch: {
    showCustomPresetModal(newValue) {
      if (newValue) {
        // モーダル開く時に現在の姿勢を初期値として設定
        this.resetCustomPresetForm();
      }
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

.preset-btn.active {
  background: #2196F3;
  color: white;
  border-color: #1976D2;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
}

.preset-btn.active:hover:not(:disabled) {
  background: #1976D2;
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

/* カスタムプリセット */
.custom-presets {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.custom-preset-title {
  margin: 0 0 15px 0;
  font-size: 1em;
  color: #666;
  font-weight: 500;
}

.custom-preset-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.custom-preset-container {
  position: relative;
  display: flex;
  flex-direction: column;
}

.custom-preset-container .preset-btn {
  flex: 1;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #f44336;
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.delete-btn:hover:not(:disabled) {
  background: #d32f2f;
  transform: scale(1.1);
}

.delete-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.custom-preset-btn {
  border: 2px solid #FF9800;
  background: linear-gradient(135deg, #FFF8E1, #FFECB3);
}

.custom-preset-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #FF9800, #F57C00);
  color: white;
}

.custom-preset-btn.active {
  background: linear-gradient(135deg, #FF9800, #F57C00) !important;
  color: white !important;
  border-color: #E65100 !important;
  box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.2) !important;
}

.custom-preset-btn.active:hover:not(:disabled) {
  background: linear-gradient(135deg, #F57C00, #E65100) !important;
}

.add-custom-btn {
  width: 100%;
  background: #f8f9fa;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
  margin-top: 15px;
}

.add-custom-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #2196F3;
  color: #2196F3;
}

.add-custom-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: #ddd;
  color: #999;
}

.add-icon {
  font-size: 1.2em;
  font-weight: bold;
}

/* モーダルフォーム */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #f44336;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2196F3;
}

.position-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.position-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.position-item label {
  font-size: 14px;
  color: #555;
  margin-bottom: 0;
}

.range-input {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e0e0e0;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2196F3;
  cursor: pointer;
}

.range-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2196F3;
  cursor: pointer;
  border: none;
}

.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.modal-btn.primary {
  background: #2196F3;
  color: white;
}

.modal-btn.primary:hover:not(:disabled) {
  background: #1976D2;
}

.modal-btn.primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.modal-btn.secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.modal-btn.secondary:hover {
  background: #e9ecef;
}

.modal-btn.danger {
  background: #f44336;
  color: white;
}

.modal-btn.danger:hover {
  background: #d32f2f;
}

.delete-warning {
  color: #666;
  font-size: 14px;
  margin-top: 10px;
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
  
  .custom-preset-buttons {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}</style>