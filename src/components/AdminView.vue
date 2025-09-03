<template>
  <div class="admin-view">
    <div class="admin-header">
      <h1>管理画面</h1>
      <p>ユーザー管理システム</p>
    </div>

    <div class="search-section">
      <div class="search-form">
        <input 
          type="text" 
          placeholder="ユーザーを検索..." 
          class="search-input"
        />
        <button class="search-button">検索</button>
      </div>
    </div>

    <div class="users-section">
      <h2>ユーザー一覧</h2>
      <div class="table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>名前</th>
              <th>メール</th>
              <th>ロール</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ getRoleDisplayName(user.role) }}</td>
              <td>
                <span :class="['status-badge', user.status]">
                  {{ getStatusDisplayName(user.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminView',
  data() {
    return {
      users: [
        {
          id: 1,
          name: '田中太郎',
          email: 'tanaka@example.com',
          role: 'admin',
          status: 'active'
        },
        {
          id: 2,
          name: '佐藤花子',
          email: 'sato@example.com',
          role: 'caregiver',
          status: 'active'
        },
        {
          id: 3,
          name: '鈴木一郎',
          email: 'suzuki@example.com',
          role: 'viewer',
          status: 'inactive'
        },
        {
          id: 4,
          name: '高橋美咲',
          email: 'takahashi@example.com',
          role: 'caregiver',
          status: 'active'
        },
        {
          id: 5,
          name: '山田健太',
          email: 'yamada@example.com',
          role: 'viewer',
          status: 'pending'
        }
      ]
    };
  },
  methods: {
    getRoleDisplayName(role) {
      const roleMap = {
        'admin': '管理者',
        'caregiver': '介護士',
        'viewer': '閲覧者'
      };
      return roleMap[role] || role;
    },
    getStatusDisplayName(status) {
      const statusMap = {
        'active': 'アクティブ',
        'inactive': '非アクティブ',
        'pending': '承認待ち'
      };
      return statusMap[status] || status;
    }
  }
};
</script>

<style scoped>
.admin-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  margin-bottom: 30px;
  text-align: center;
}

.admin-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 8px;
}

.admin-header p {
  color: #666;
  font-size: 1.1rem;
}

.search-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.search-form {
  display: flex;
  gap: 10px;
  max-width: 400px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #0056b3;
}

.users-section h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.table-container {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background-color: #f1f3f4;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}

.users-table td {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.users-table tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  display: inline-block;
  min-width: 60px;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

@media (max-width: 768px) {
  .admin-view {
    padding: 10px;
  }
  
  .search-form {
    flex-direction: column;
  }
  
  .users-table {
    font-size: 14px;
  }
  
  .users-table th,
  .users-table td {
    padding: 10px 8px;
  }
}
</style>