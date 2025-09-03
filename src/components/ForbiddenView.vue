<template>
  <div class="forbidden-view">
    <div class="forbidden-container">
      <div class="forbidden-icon">🚫</div>
      <h1 class="forbidden-title">アクセス拒否</h1>
      <p class="forbidden-message">
        この画面を表示する権限がありません。
      </p>
      <div class="forbidden-details">
        <p>現在のロール: <strong>{{ userRole || '不明' }}</strong></p>
        <p>必要なロール: <strong>{{ requiredRole || '不明' }}</strong></p>
      </div>
      <div class="forbidden-actions">
        <button @click="goBack" class="btn-secondary">
          前のページに戻る
        </button>
        <button @click="goHome" class="btn-primary">
          ホームに戻る
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';

const { mapGetters: mapAuthGetters } = createNamespacedHelpers('auth');

export default Vue.extend({
  name: 'ForbiddenView',
  computed: {
    ...mapAuthGetters(['userRole']),
    
    requiredRole() {
      return this.$route.query.requiredRole || this.$route.meta?.requiredRole;
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goHome() {
      this.$router.push('/home');
    }
  }
});
</script>

<style scoped>
.forbidden-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.forbidden-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.forbidden-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.forbidden-title {
  color: #f44336;
  font-size: 2rem;
  margin-bottom: 16px;
}

.forbidden-message {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 24px;
  line-height: 1.6;
}

.forbidden-details {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
}

.forbidden-details p {
  margin: 8px 0;
  color: #333;
}

.forbidden-details strong {
  color: #2196F3;
}

.forbidden-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: #2196F3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background: #1976D2;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.btn-secondary:hover {
  background: #e9ecef;
}

@media (max-width: 600px) {
  .forbidden-container {
    padding: 24px;
  }
  
  .forbidden-icon {
    font-size: 3rem;
  }
  
  .forbidden-title {
    font-size: 1.5rem;
  }
  
  .forbidden-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>