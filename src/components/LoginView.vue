<template>
  <div class="login-container">
    <div class="login-form">
      <h2>ログイン</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="form-group">
          <label for="password">パスワード</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            :disabled="isLoading"
          />
        </div>
        <div v-if="authError" class="error-message">
          {{ authError }}
        </div>
        <button type="submit" :disabled="isLoading" class="login-button">
          {{ isLoading ? 'ログイン中...' : 'ログイン' }}
        </button>
      </form>
      <div class="demo-credentials">
        <p>デモ用認証情報:</p>
        <p>Email: demo@example.com</p>
        <p>Password: demo1234</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createNamespacedHelpers } from 'vuex';

const { mapGetters: mapAuthGetters } = createNamespacedHelpers('auth');

export default defineComponent({
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      isLoading: false
    };
  },
  computed: {
    ...mapAuthGetters(['authError'])
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      
      const success = await this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password
      });
      
      this.isLoading = false;
      
      if (success) {
        this.$router.push('/');
      }
    }
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-form {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

h2 {
  color: #2c5282;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2d3748;
  font-weight: 500;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3182ce;
}

input:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
}

.login-button {
  width: 100%;
  background: #3182ce;
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover:not(:disabled) {
  background: #2c5282;
}

.login-button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.error-message {
  background: #fed7d7;
  border: 1px solid #fc8181;
  color: #9b2c2c;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
}

.demo-credentials {
  margin-top: 30px;
  padding: 20px;
  background: #f7fafc;
  border-radius: 6px;
  border-left: 4px solid #38a169;
}

.demo-credentials p {
  margin: 5px 0;
  font-size: 14px;
  color: #2d3748;
}

.demo-credentials p:first-child {
  font-weight: 600;
  margin-bottom: 10px;
}

@media (max-width: 480px) {
  .login-form {
    padding: 30px 20px;
  }
  
  h2 {
    font-size: 24px;
  }
}
</style>