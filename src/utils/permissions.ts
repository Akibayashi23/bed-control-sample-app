import { Role, User } from '@/types';

/**
 * 権限定義
 */
export const PERMISSIONS = {
  // ベッド操作
  BED_CONTROL: 'bed:control',
  BED_VIEW: 'bed:view',
  
  // カスタムプリセット
  PRESET_CREATE: 'preset:create',
  PRESET_DELETE: 'preset:delete',
  PRESET_VIEW: 'preset:view',
  
  // 睡眠データ
  SLEEP_VIEW: 'sleep:view',
  SLEEP_HISTORY: 'sleep:history',
  SLEEP_EXPORT: 'sleep:export',
  
  // 管理機能
  ADMIN_VIEW: 'admin:view',
  USER_MANAGE: 'user:manage',
  USER_VIEW: 'user:view',
  USER_EDIT: 'user:edit',
  
  // 設定
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_MANAGE: 'settings:manage'
} as const;

/**
 * ロール別権限マッピング
 */
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: [
    // 全権限
    PERMISSIONS.BED_CONTROL,
    PERMISSIONS.BED_VIEW,
    PERMISSIONS.PRESET_CREATE,
    PERMISSIONS.PRESET_DELETE,
    PERMISSIONS.PRESET_VIEW,
    PERMISSIONS.SLEEP_VIEW,
    PERMISSIONS.SLEEP_HISTORY,
    PERMISSIONS.SLEEP_EXPORT,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_MANAGE
  ],
  
  caregiver: [
    // ベッド操作・睡眠分析可能
    PERMISSIONS.BED_CONTROL,
    PERMISSIONS.BED_VIEW,
    PERMISSIONS.PRESET_CREATE,
    PERMISSIONS.PRESET_DELETE,
    PERMISSIONS.PRESET_VIEW,
    PERMISSIONS.SLEEP_VIEW,
    PERMISSIONS.SLEEP_HISTORY,
    PERMISSIONS.SETTINGS_VIEW
  ],
  
  viewer: [
    // 閲覧のみ
    PERMISSIONS.BED_VIEW,
    PERMISSIONS.PRESET_VIEW,
    PERMISSIONS.SLEEP_VIEW,
    PERMISSIONS.SETTINGS_VIEW
  ]
};

/**
 * ロール階層定義（数値が大きいほど高権限）
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  viewer: 1,
  caregiver: 2,
  admin: 3
};

/**
 * 権限チェック関数
 */
export function can(user: User | null, permission: string): boolean {
  if (!user || !user.isActive) {
    return false;
  }
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

/**
 * 複数権限のいずれかを持つかチェック
 */
export function canAny(user: User | null, permissions: string[]): boolean {
  return permissions.some(permission => can(user, permission));
}

/**
 * 複数権限をすべて持つかチェック
 */
export function canAll(user: User | null, permissions: string[]): boolean {
  return permissions.every(permission => can(user, permission));
}

/**
 * ロール比較（指定ロール以上かチェック）
 */
export function hasRoleOrHigher(user: User | null, requiredRole: Role): boolean {
  if (!user || !user.isActive) {
    return false;
  }
  
  const userLevel = ROLE_HIERARCHY[user.role] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
}

/**
 * 権限エラーメッセージ生成
 */
export function getPermissionErrorMessage(permission: string): string {
  const messages: Record<string, string> = {
    [PERMISSIONS.BED_CONTROL]: 'ベッド操作の権限がありません',
    [PERMISSIONS.PRESET_CREATE]: 'カスタムプリセット作成の権限がありません',
    [PERMISSIONS.PRESET_DELETE]: 'カスタムプリセット削除の権限がありません',
    [PERMISSIONS.SLEEP_HISTORY]: '睡眠履歴の閲覧権限がありません',
    [PERMISSIONS.ADMIN_VIEW]: '管理画面の閲覧権限がありません',
    [PERMISSIONS.USER_MANAGE]: 'ユーザー管理の権限がありません',
    [PERMISSIONS.SETTINGS_MANAGE]: '設定変更の権限がありません'
  };
  
  return messages[permission] || 'この操作を行う権限がありません';
}

// より詳細な権限チェック
export function hasPermissionForRoute(user: User | null, route: any): boolean {
  if (!user || !user.isActive) return false;
  
  const requiredRole = route.meta?.requiresRole;
  if (!requiredRole) return true;
  
  return hasRoleOrHigher(user, requiredRole);
}

// 権限拒否のログ記録
export function logAccessDenied(user: User | null, route: any, reason: string) {
  console.warn('Access denied:', {
    user: user?.email,
    route: route.path,
    requiredRole: route.meta?.requiresRole,
    userRole: user?.role,
    reason,
    timestamp: new Date().toISOString()
  });
}