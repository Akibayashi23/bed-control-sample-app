<template>
  <div class="settings-view" :class="{ 'large-font': fontSize === 'large' }">
    <h1 class="title">設定</h1>
    
    <div class="settings-card">
      <h2 class="section-title">表示設定</h2>
      
      <div class="setting-item">
        <label class="setting-label">文字サイズ</label>
        <div class="font-size-controls">
          <button 
            class="font-size-btn"
            :class="{ 'active': fontSize === 'standard' }"
            @click="setFontSize('standard')"
          >
            標準
          </button>
          <button 
            class="font-size-btn"
            :class="{ 'active': fontSize === 'large' }"
            @click="setFontSize('large')"
          >
            大
          </button>
        </div>
      </div>
      
      <div class="setting-preview">
        <p class="preview-text">プレビュー: この文字サイズで表示されます</p>
      </div>
    </div>

    <div class="settings-card">
      <h2 class="section-title">アプリ情報</h2>
      
      <div class="info-item">
        <span class="info-label">アプリ名:</span>
        <span class="info-value">介護ベッド操作アプリ</span>
      </div>
      
      <div class="info-item">
        <span class="info-label">バージョン:</span>
        <span class="info-value">1.0.0</span>
      </div>
      
      <div class="info-item">
        <span class="info-label">対応ベッド:</span>
        <span class="info-value">汎用電動ベッド</span>
      </div>
    </div>

    <div class="settings-card">
      <h2 class="section-title">使い方</h2>
      
      <div class="usage-instructions">
        <div class="instruction-item">
          <strong>🏠 ホーム画面:</strong>
          <p>現在のベッドの状態を確認できます</p>
        </div>
        
        <div class="instruction-item">
          <strong>🎮 操作画面:</strong>
          <p>プリセット適用や細かい調整が行えます</p>
        </div>
        
        <div class="instruction-item">
          <strong>🔒 安全ロック:</strong>
          <p>誤操作を防ぐためのロック機能です</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';

export default Vue.extend({
  name: 'SettingsView',
  computed: {
    ...mapGetters(['fontSize'])
  },
  methods: {
    ...mapMutations(['SET_FONT_SIZE']),
    setFontSize(size: 'standard' | 'large') {
      this.SET_FONT_SIZE(size);
    }
  }
});
</script>

<style scoped>
.settings-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.large-font {
  font-size: 1.2em;
}

.title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.settings-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.section-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2em;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

/* 文字サイズ設定 */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.setting-label {
  font-weight: 500;
  color: #333;
}

.font-size-controls {
  display: flex;
  gap: 10px;
}

.font-size-btn {
  padding: 10px 20px;
  border: 2px solid #2196F3;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1em;
  min-width: 60px;
}

.font-size-btn:hover {
  background: #f0f8ff;
}

.font-size-btn.active {
  background: #2196F3;
  color: white;
}

.setting-preview {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
  border-left: 4px solid #2196F3;
}

.preview-text {
  margin: 0;
  color: #333;
}

/* アプリ情報 */
.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #666;
}

.info-value {
  color: #333;
}

/* 使い方 */
.usage-instructions {
  display: grid;
  gap: 15px;
}

.instruction-item {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
}

.instruction-item strong {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.instruction-item p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .setting-item {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .font-size-controls {
    justify-content: center;
  }
  
  .info-item {
    flex-direction: column;
    gap: 5px;
  }
}</style>