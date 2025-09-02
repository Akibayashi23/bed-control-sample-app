<template>
  <div class="sleep-view" :class="{ 'large-font': fontSize === 'large' }">
    <h1 class="title">睡眠分析</h1>
    
    <!-- Period selector -->
    <div class="period-selector">
      <button 
        class="period-btn"
        :class="{ 'active': sleepPeriod === 'daily' }"
        @click="setPeriod('daily')"
        :disabled="sleepLoading"
      >
        日別 (14日間)
      </button>
      <button 
        class="period-btn"
        :class="{ 'active': sleepPeriod === 'weekly' }"
        @click="setPeriod('weekly')"
        :disabled="sleepLoading"
      >
        週別 (7週間)
      </button>
    </div>

    <!-- Chart container -->
    <div class="chart-container">
      <div v-if="sleepLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>睡眠データを読み込み中...</p>
      </div>
      
      <div v-else-if="sleepError" class="error-state">
        <div class="error-icon">⚠️</div>
        <p>{{ sleepError }}</p>
        <button @click="retryFetch" class="retry-btn">再試行</button>
      </div>
      
      <div v-else-if="sleepData.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <p>睡眠データがありません</p>
      </div>
      
      <div v-else class="chart-wrapper">
        <SleepChart 
          :chart-data="chartData" 
          :options="chartOptions"
          :height="300"
        />
        
        <!-- Chart legend -->
        <div class="chart-legend">
          <div class="legend-item">
            <div class="legend-color deep-sleep"></div>
            <span>深い眠り</span>
          </div>
          <div class="legend-item">
            <div class="legend-color light-sleep"></div>
            <span>浅い眠り</span>
          </div>
          <div class="legend-item">
            <div class="legend-color awake"></div>
            <span>覚醒</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sleep stats -->
    <div v-if="sleepData.length > 0" class="sleep-stats">
      <h2 class="stats-title">睡眠統計</h2>
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-value">{{ averageSleepTime }}</div>
          <div class="stat-label">平均睡眠時間</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ averageDeepSleep }}%</div>
          <div class="stat-label">深い眠り割合</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ averageAwakeTime }}</div>
          <div class="stat-label">平均覚醒時間</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import SleepChart from './SleepChart.vue';

const { mapGetters: mapSettingsGetters } = createNamespacedHelpers('settings');
const { mapGetters: mapSleepGetters, mapActions: mapSleepActions } = createNamespacedHelpers('sleep');

export default Vue.extend({
  name: 'SleepView',
  components: {
    SleepChart
  },
  computed: {
    ...mapSettingsGetters(['fontSize']),
    ...mapSleepGetters(['sleepData', 'sleepLoading', 'sleepError', 'sleepPeriod']),
    
    chartData() {
      if (!this.sleepData || this.sleepData.length === 0) {
        return null;
      }

      const labels = this.sleepData.map((item) => {
        if (this.sleepPeriod === 'daily') {
          const date = new Date(item.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }
        return item.date;
      });

      return {
        labels,
        datasets: [
          {
            label: '深い眠り',
            backgroundColor: '#4f46e5',
            borderColor: '#4f46e5',
            data: this.sleepData.map((item) => item.deepSleep)
          },
          {
            label: '浅い眠り',
            backgroundColor: '#06b6d4',
            borderColor: '#06b6d4',
            data: this.sleepData.map((item) => item.lightSleep)
          },
          {
            label: '覚醒',
            backgroundColor: '#f59e0b',
            borderColor: '#f59e0b',
            data: this.sleepData.map((item) => item.awake)
          }
        ]
      };
    },
    
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: this.sleepPeriod === 'daily' ? '日付' : '週'
            }
          }],
          yAxes: [{
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: '時間 (分)'
            },
            ticks: {
              beginAtZero: true,
              stepSize: 60,
              callback: (value) => {
                const h = Math.floor(value / 60);
                const m = value % 60;
                return h ? (m ? `${h}h${m}m` : `${h}h`) : `${m}m`;
              }
            }
          }]
        },
        legend: { display: false },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const minutes = tooltipItem.yLabel;
              const h = Math.floor(minutes / 60);
              const m = minutes % 60;
              const label = data.datasets[tooltipItem.datasetIndex].label || '';
              return `${label}: ${h}時間${m}分`;
            }
          }
        }
      };
    },
    
    averageSleepTime() {
      if (!this.sleepData || this.sleepData.length === 0) return '0時間0分';

      console.log('sleepData', this.sleepData);
      
      const totalSleep = this.sleepData.reduce((sum, item) => sum + item.totalSleep, 0);
      const average = totalSleep / this.sleepData.length;
      const hours = Math.floor(average / 60);
      const minutes = Math.round(average % 60);
      
      return `${hours}時間${minutes}分`;
    },
    
    averageDeepSleep() {
      if (!this.sleepData || this.sleepData.length === 0) return 0;
      
      const totalDeepSleep = this.sleepData.reduce((sum, item) => sum + item.deepSleep, 0);
      const totalSleep = this.sleepData.reduce((sum, item) => sum + item.totalSleep, 0);
      
      return Math.round((totalDeepSleep / totalSleep) * 100);
    },
    
    averageAwakeTime() {
      if (!this.sleepData || this.sleepData.length === 0) return '0分';
      
      const totalAwake = this.sleepData.reduce((sum, item) => sum + item.awake, 0);
      const average = Math.round(totalAwake / this.sleepData.length);
      
      return `${average}分`;
    }
  },
  
  methods: {
    ...mapSleepActions(['setSleepPeriod', 'fetchDailySleepData', 'fetchWeeklySleepData']),
    
    setPeriod(period) {
      this.setSleepPeriod(period);
    },
    
    retryFetch() {
      if (this.sleepPeriod === 'daily') {
        this.fetchDailySleepData();
      } else {
        this.fetchWeeklySleepData();
      }
    }
  },
  
  created() {
    // Load initial data
    this.fetchDailySleepData();
  }
});
</script>

<style scoped>
.sleep-view {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.large-font {
  font-size: 1.2em;
}

.title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
}

/* Period selector */
.period-selector {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.period-btn {
  padding: 12px 24px;
  border: 2px solid #2196F3;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.2s ease;
}

.period-btn:hover:not(:disabled) {
  background: #f0f8ff;
}

.period-btn.active {
  background: #2196F3;
  color: white;
}

.period-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Chart container */
.chart-container {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-wrapper {
  width: 100%;
}

/* Loading state */
.loading-state {
  text-align: center;
  color: #666;
}

.loading-state p {
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196F3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error state */
.error-state {
  text-align: center;
  color: #f44336;
}

.error-state p {
  color: #f44336;
}

.error-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.retry-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
  font-size: 1em;
}

.retry-btn:hover {
  background: #d32f2f;
}

/* Empty state */
.empty-state {
  text-align: center;
  color: #999;
}

.empty-state p {
  color: #999;
}

.empty-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

/* Chart legend */
.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-item span {
  color: #333;
  font-weight: 500;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.legend-color.deep-sleep {
  background: #4f46e5;
}

.legend-color.light-sleep {
  background: #06b6d4;
}

.legend-color.awake {
  background: #f59e0b;
}

/* Sleep stats */
.sleep-stats {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.stats-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #2196F3;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 0.9em;
}

/* Responsive design */
@media (max-width: 600px) {
  .period-selector {
    flex-direction: column;
    align-items: center;
  }
  
  .period-btn {
    width: 200px;
  }
  
  .chart-legend {
    flex-direction: column;
    align-items: center;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .title {
    font-size: 1.5em;
  }
}
</style>