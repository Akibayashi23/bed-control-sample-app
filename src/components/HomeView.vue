<template>
  <div class="home-view" :class="{ 'large-font': fontSize === 'large' }">
    <h1 class="title">介護ベッド状態</h1>
    
    <div class="status-grid">
      <div class="status-card">
        <h2 class="status-title">現在姿勢</h2>
        <div class="position-display">
          <div class="position-item">
            <span class="position-label">背上げ</span>
            <span class="position-value">{{ bedPosition.back }}%</span>
          </div>
          <div class="position-item">
            <span class="position-label">脚上げ</span>
            <span class="position-value">{{ bedPosition.leg }}%</span>
          </div>
          <div class="position-item">
            <span class="position-label">高さ</span>
            <span class="position-value">{{ bedPosition.height }}%</span>
          </div>
        </div>
      </div>

      <div class="status-card">
        <h2 class="status-title">ロック状態</h2>
        <div class="lock-display">
          <div class="lock-icon" :class="{ 'locked': isLocked }">
            {{ isLocked ? '🔒' : '🔓' }}
          </div>
          <span class="lock-text">{{ isLocked ? 'ロック中' : 'ロック解除' }}</span>
        </div>
      </div>

      <div class="status-card">
        <h2 class="status-title">バッテリー</h2>
        <div class="battery-display">
          <div class="battery-icon">
            <div class="battery-body">
              <div class="battery-level" :style="{ width: batteryLevel + '%' }" :class="batteryClass"></div>
            </div>
            <div class="battery-tip"></div>
          </div>
          <span class="battery-text">{{ batteryLevel }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';

const { mapGetters: mapBedGetters } = createNamespacedHelpers('bed');
const { mapGetters: mapSettingsGetters } = createNamespacedHelpers('settings');

export default Vue.extend({
  name: 'HomeView',
  computed: {
    ...mapBedGetters(['bedPosition', 'isLocked', 'batteryLevel']),
    ...mapSettingsGetters(['fontSize']),
    
    batteryClass() {
      const level = this.batteryLevel;
      if (level <= 20) return 'low';
      if (level <= 50) return 'medium';
      return 'high';
    }
  }
});
</script>

<style scoped>
.home-view {
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

.status-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .status-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.status-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.status-title {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1em;
  text-align: center;
}

.position-display {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.position-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 6px;
}

.position-label {
  font-weight: 500;
  color: #555;
}

.position-value {
  font-weight: bold;
  color: #2196F3;
  font-size: 1.1em;
}

.lock-display {
  text-align: center;
}

.lock-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.lock-text {
  display: block;
  font-weight: 500;
  color: #333;
}

.locked .lock-text {
  color: #f44336;
}

.battery-display {
  text-align: center;
}

.battery-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.battery-body {
  width: 40px;
  height: 20px;
  border: 2px solid #333;
  border-radius: 2px;
  position: relative;
  background: #f5f5f5;
}

.battery-level {
  height: 100%;
  border-radius: 1px;
  transition: width 0.3s ease;
}

.battery-level.high {
  background-color: #4CAF50;
}

.battery-level.medium {
  background-color: #FF9800;
}

.battery-level.low {
  background-color: #f44336;
}

.battery-tip {
  width: 3px;
  height: 10px;
  background: #333;
  margin-left: 1px;
  border-radius: 0 2px 2px 0;
}

.battery-text {
  font-weight: bold;
  color: #333;
}
</style>