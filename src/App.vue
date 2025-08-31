<template>
  <div id="app" :class="{ 'large-font': fontSize === 'large' }">
    <header class="app-header">
      <h1 class="app-title">介護ベッド操作</h1>
    </header>

    <nav class="app-nav">
      <router-link to="/home" class="nav-link" active-class="active">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">ホーム</span>
      </router-link>
      <router-link to="/control" class="nav-link" active-class="active">
        <span class="nav-icon">🎮</span>
        <span class="nav-text">操作</span>
      </router-link>
      <router-link to="/settings" class="nav-link" active-class="active">
        <span class="nav-icon">⚙️</span>
        <span class="nav-text">設定</span>
      </router-link>
    </nav>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'App',
  computed: {
    ...mapGetters(['fontSize'])
  },
  created() {
    this.initializeSettings();
  },
  methods: {
    ...mapActions(['initializeSettings'])
  }
});
</script>

<style>
/* グローバルスタイル */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', 'Hiragino Sans', 'ヒラギノ角ゴシック', 'Yu Gothic', '游ゴシック', 'Meiryo', 'メイリオ', sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#app.large-font {
  font-size: 1.2em;
}

/* ヘッダー */
.app-header {
  background: linear-gradient(135deg, #2196F3, #1976D2);
  color: white;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-title {
  margin: 0;
  font-size: 1.5em;
  font-weight: 500;
}

/* ナビゲーション */
.app-nav {
  display: flex;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-link {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 10px;
  text-decoration: none;
  color: #666;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.nav-link:hover {
  background: #f9f9f9;
  color: #2196F3;
}

.nav-link.active {
  color: #2196F3;
  border-bottom-color: #2196F3;
  background: #f0f8ff;
}

.nav-icon {
  font-size: 1.5em;
  margin-bottom: 4px;
}

.nav-text {
  font-size: 0.9em;
  font-weight: 500;
}

/* メインコンテンツ */
.app-main {
  flex: 1;
  padding: 0;
  background: #f5f5f5;
  min-height: calc(100vh - 140px);
}

/* ボタン共通スタイル */
button {
  font-family: inherit;
  font-size: inherit;
}

button:focus {
  outline: 2px solid #2196F3;
  outline-offset: 2px;
}

/* レスポンシブ対応 */
@media (max-width: 600px) {
  .app-title {
    font-size: 1.3em;
  }
  
  .nav-icon {
    font-size: 1.3em;
  }
  
  .nav-text {
    font-size: 0.8em;
  }
}

/* アクセシビリティ */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ダークモード対応準備 */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #121212;
    color: #ffffff;
  }
}
</style>