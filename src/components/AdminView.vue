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
          v-model="searchKeyword"
          placeholder="名前またはメールで検索..." 
          class="search-input"
        />
        <select v-model="filterRole" class="filter-select">
          <option value="">すべてのロール</option>
          <option value="admin">管理者</option>
          <option value="caregiver">介護士</option>
          <option value="viewer">閲覧者</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">すべての状態</option>
          <option value="active">アクティブ</option>
          <option value="inactive">非アクティブ</option>
          <option value="pending">承認待ち</option>
        </select>
        <button @click="clearFilters" class="clear-button">クリア</button>
      </div>
    </div>

    <div class="users-section">
      <div class="section-header">
        <h2>ユーザー一覧</h2>
        <div class="results-info">
          {{ filteredUsers.length }}件中 {{ startIndex + 1 }}-{{ Math.min(startIndex + itemsPerPage, filteredUsers.length) }}件を表示
        </div>
      </div>
      
      <div class="table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>名前</th>
              <th>メール</th>
              <th>ロール</th>
              <th>状態</th>
              <th v-if="canEditUsers">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ getRoleDisplayName(user.role) }}</td>
              <td>
                <span :class="['status-badge', user.status]">
                  {{ getStatusDisplayName(user.status) }}
                </span>
              </td>
              <td v-if="canEditUsers">
                <button 
                  @click="openEditModal(user)" 
                  class="edit-button"
                  :title="`${user.name}を編集`"
                >
                  編集
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ページネーション -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="pagination-button"
        >
          前へ
        </button>
        
        <span class="pagination-info">
          {{ currentPage }} / {{ totalPages }} ページ
        </span>
        
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="pagination-button"
        >
          次へ
        </button>
      </div>
    </div>

    <!-- 編集モーダル -->
    <BaseModal 
      :is-open="showEditModal" 
      @close="closeEditModal"
    >
      <template #title>
        ユーザー編集
      </template>
      
      <template #content>
        <div class="form-group">
          <label>名前</label>
          <input 
            type="text" 
            v-model="editForm.name" 
            class="form-input"
            readonly
          />
        </div>
        
        <div class="form-group">
          <label>メール</label>
          <input 
            type="email" 
            v-model="editForm.email" 
            class="form-input"
            readonly
          />
        </div>
        
        <div class="form-group">
          <label>ロール</label>
          <select v-model="editForm.role" class="form-select">
            <option value="admin">管理者</option>
            <option value="caregiver">介護士</option>
            <option value="viewer">閲覧者</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>状態</label>
          <select v-model="editForm.status" class="form-select">
            <option value="active">アクティブ</option>
            <option value="inactive">非アクティブ</option>
            <option value="pending">承認待ち</option>
          </select>
        </div>
      </template>
      
      <template #footer>
        <button @click="closeEditModal" class="cancel-button">
          キャンセル
        </button>
        <button @click="saveUser" class="save-button">
          保存
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<script>
import { can, PERMISSIONS } from '@/utils/permissions';
import { createNamespacedHelpers } from 'vuex';
import BaseModal from '@/components/BaseModal.vue';

const { mapGetters: mapAuthGetters } = createNamespacedHelpers('auth');

export default {
  name: 'AdminView',
  components: {
    BaseModal
  },
  data() {
    return {
      // フィルタ条件
      searchKeyword: '',
      debouncedSearchKeyword: '', // debounce用の内部キーワード
      filterRole: '',
      filterStatus: '',
      
      // ページネーション
      currentPage: 1,
      itemsPerPage: 10,
      
      // debounce用
      searchDebounceTimer: null,
      
      // 編集モーダル
      showEditModal: false,
      editForm: {
        id: null,
        name: '',
        email: '',
        role: '',
        status: ''
      },
      
      // ダミーユーザーデータ（テスト用に追加データを含む）
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
        },
        {
          id: 6,
          name: '伊藤和子',
          email: 'ito@example.com',
          role: 'admin',
          status: 'active'
        },
        {
          id: 7,
          name: '渡辺直樹',
          email: 'watanabe@example.com',
          role: 'caregiver',
          status: 'inactive'
        },
        {
          id: 8,
          name: '小林真理',
          email: 'kobayashi@example.com',
          role: 'viewer',
          status: 'active'
        },
        {
          id: 9,
          name: '加藤雅彦',
          email: 'kato@example.com',
          role: 'caregiver',
          status: 'pending'
        },
        {
          id: 10,
          name: '吉田彩香',
          email: 'yoshida@example.com',
          role: 'admin',
          status: 'active'
        },
        {
          id: 11,
          name: '松本良一',
          email: 'matsumoto@example.com',
          role: 'viewer',
          status: 'active'
        },
        {
          id: 12,
          name: '中村さくら',
          email: 'nakamura@example.com',
          role: 'caregiver',
          status: 'active'
        }
      ]
    };
  },
  computed: {
    ...mapAuthGetters(['currentUser']),
    
    // 権限チェック
    canEditUsers() {
      return can(this.currentUser, PERMISSIONS.USER_EDIT);
    },
    
    // フィルタリングされたユーザー一覧
    filteredUsers() {
      let filtered = this.users;
      
      // キーワード検索（名前・メールの部分一致）- debounced keyword使用
      if (this.debouncedSearchKeyword) {
        const keyword = this.debouncedSearchKeyword.toLowerCase();
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(keyword) || 
          user.email.toLowerCase().includes(keyword)
        );
      }
      
      // ロールフィルタ
      if (this.filterRole) {
        filtered = filtered.filter(user => user.role === this.filterRole);
      }
      
      // 状態フィルタ
      if (this.filterStatus) {
        filtered = filtered.filter(user => user.status === this.filterStatus);
      }
      
      return filtered;
    },
    
    // ページネーション用の計算
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
    
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    
    // 現在のページに表示するユーザー
    paginatedUsers() {
      const start = this.startIndex;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    }
  },
  watch: {
    // searchKeywordの変更をdebounce処理
    searchKeyword(newValue) {
      // 既存のタイマーをクリア
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      
      // 新しいタイマーをセット（300ms後に実行）
      this.searchDebounceTimer = setTimeout(() => {
        this.debouncedSearchKeyword = newValue;
        this.currentPage = 1; // 検索時は1ページ目に戻る
      }, 300);
    },
    
    // その他のフィルタ条件が変更されたら1ページ目に戻る
    filterRole() {
      this.currentPage = 1;
    },
    filterStatus() {
      this.currentPage = 1;
    }
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
    },
    
    // フィルタクリア
    clearFilters() {
      // debounceタイマーをクリア
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
        this.searchDebounceTimer = null;
      }
      
      this.searchKeyword = '';
      this.debouncedSearchKeyword = '';
      this.filterRole = '';
      this.filterStatus = '';
      this.currentPage = 1;
    },
    
    // ページ移動
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    
    // 編集モーダルを開く
    openEditModal(user) {
      this.editForm = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      };
      this.showEditModal = true;
    },
    
    // 編集モーダルを閉じる
    closeEditModal() {
      this.showEditModal = false;
      this.editForm = {
        id: null,
        name: '',
        email: '',
        role: '',
        status: ''
      };
    },
    
    // ユーザー情報を保存
    saveUser() {
      try {
        // ダミー配列から対象ユーザーを見つけて更新
        const userIndex = this.users.findIndex(user => user.id === this.editForm.id);
        if (userIndex !== -1) {
          this.users[userIndex].role = this.editForm.role;
          this.users[userIndex].status = this.editForm.status;
          
          this.$toast.success(
            `${this.editForm.name}の情報を更新しました。`,
            { description: 'ロールと状態が正常に変更されました' }
          );
          this.closeEditModal();
        } else {
          throw new Error('ユーザーが見つかりません');
        }
      } catch (error) {
        this.$toast.error(
          'ユーザー情報の更新に失敗しました。',
          { description: 'もう一度お試しください' }
        );
      }
    }
  },
  
  // コンポーネント破棄時のクリーンアップ
  beforeDestroy() {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
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
  flex-wrap: wrap;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 250px;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.filter-select {
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #007bff;
}

.clear-button {
  padding: 10px 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.clear-button:hover {
  background-color: #545b62;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.results-info {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
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

/* 編集ボタン */
.edit-button {
  padding: 6px 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #218838;
}

/* フォームスタイル（BaseModal用） */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #007bff;
}

.form-input[readonly] {
  background-color: #f8f9fa;
  color: #6c757d;
}

.cancel-button {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #545b62;
}

.save-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #0056b3;
}

/* ページネーション */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  padding: 20px;
}

.pagination-button {
  padding: 8px 16px;
  border: 2px solid #007bff;
  background-color: white;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #007bff;
  color: white;
}

.pagination-button:disabled {
  border-color: #ccc;
  color: #ccc;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  min-width: 100px;
  text-align: center;
}

@media (max-width: 768px) {
  .admin-view {
    padding: 10px;
  }
  
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    min-width: auto;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .results-info {
    align-self: flex-end;
  }
  
  .users-table {
    font-size: 14px;
  }
  
  .users-table th,
  .users-table td {
    padding: 10px 8px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
  
  .pagination-info {
    order: -1;
  }
}
</style>