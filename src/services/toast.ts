import Vue, { VueConstructor } from 'vue';
import BaseToast from '@/components/BaseToast.vue';

/**
 * トースト通知の種類
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * トーストオプション（完全版）
 */
export interface ToastOptions {
  message: string;
  description?: string;
  type: ToastType;
  duration: number;
  closable: boolean;
}

/**
 * トーストオプション（部分指定可能）
 */
export type PartialToastOptions = Partial<Pick<ToastOptions, 'description' | 'duration' | 'closable'>>;

/**
 * 管理中のトースト情報
 */
interface ToastInstance {
  id: string;
  instance: Vue;
  element: HTMLDivElement;
}

/**
 * トースト通知サービス
 * アプリケーション全体でトースト通知を管理する
 */
class ToastService {
  private toasts: ToastInstance[] = [];
  private container: HTMLElement | null = null;
  private readonly maxToasts: number = 5;

  /**
   * トーストコンテナを初期化
   */
  public init(container?: HTMLElement): void {
    this.container = container || null;
    this.createToastContainer();
  }

  /**
   * トーストコンテナ要素を作成
   */
  private createToastContainer(): void {
    if (document.getElementById('toast-container')) {
      return;
    }

    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    `;

    document.body.appendChild(toastContainer);
  }

  /**
   * コンテナの存在を確認し、なければ作成
   */
  private ensureContainer(): void {
    if (!document.getElementById('toast-container')) {
      this.createToastContainer();
    }
  }

  /**
   * 成功トーストを表示
   */
  public success(message: string, options: PartialToastOptions = {}): string | null {
    return this.show({
      message,
      type: 'success',
      ...this.getDefaultOptions(),
      ...options
    });
  }

  /**
   * エラートーストを表示
   */
  public error(message: string, options: PartialToastOptions = {}): string | null {
    return this.show({
      message,
      type: 'error',
      ...this.getDefaultOptions(),
      duration: 5000, // エラーはデフォルトで少し長く表示
      ...options
    });
  }

  /**
   * 警告トーストを表示
   */
  public warning(message: string, options: PartialToastOptions = {}): string | null {
    return this.show({
      message,
      type: 'warning',
      ...this.getDefaultOptions(),
      duration: 4000,
      ...options
    });
  }

  /**
   * 情報トーストを表示
   */
  public info(message: string, options: PartialToastOptions = {}): string | null {
    return this.show({
      message,
      type: 'info',
      ...this.getDefaultOptions(),
      ...options
    });
  }

  /**
   * カスタムトーストを表示
   */
  public show(options: ToastOptions): string | null {
    // コンテナが存在しない場合は作成
    this.ensureContainer();
    
    // 最大表示数を超えた場合、古いトーストを削除
    if (this.toasts.length >= this.maxToasts) {
      this.removeOldestToast();
    }

    const toastId = this.generateId();
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
      console.error('Toast container not found');
      return null;
    }

    // トースト用のdiv要素を作成
    const toastElement = document.createElement('div') as HTMLDivElement;
    toastElement.id = `toast-${toastId}`;
    toastElement.style.pointerEvents = 'auto';
    toastContainer.appendChild(toastElement);

    // Vueコンポーネントとしてマウント
    const ToastConstructor = Vue.extend(BaseToast as any) as VueConstructor<Vue>;
    const toastInstance = new ToastConstructor({
      propsData: {
        message: options.message,
        description: options.description,
        type: options.type,
        duration: options.duration,
        closable: options.closable
      }
    });

    // closeイベントのハンドリング
    toastInstance.$on('close', () => {
      this.remove(toastId);
    });

    // DOMにマウント
    toastInstance.$mount(toastElement);

    // 管理配列に追加
    this.toasts.push({
      id: toastId,
      instance: toastInstance,
      element: toastElement
    });

    return toastId;
  }

  /**
   * 指定されたIDのトーストを削除
   */
  public remove(toastId: string): void {
    const index = this.toasts.findIndex(toast => toast.id === toastId);
    if (index === -1) return;

    const toast = this.toasts[index];
    
    // Vueインスタンスを破棄
    toast.instance.$destroy();
    
    // DOM要素を削除
    if (toast.element.parentNode) {
      toast.element.parentNode.removeChild(toast.element);
    }
    
    // 管理配列から削除
    this.toasts.splice(index, 1);
  }

  /**
   * 最も古いトーストを削除
   */
  private removeOldestToast(): void {
    if (this.toasts.length > 0) {
      const oldestToast = this.toasts[0];
      this.remove(oldestToast.id);
    }
  }

  /**
   * すべてのトーストを削除
   */
  public clear(): void {
    // 配列をコピーしてからループ（削除中に配列が変更されるため）
    const toastsToRemove = [...this.toasts];
    toastsToRemove.forEach(toast => {
      this.remove(toast.id);
    });
  }

  /**
   * ユニークなIDを生成
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
  }

  /**
   * 現在のトースト数を取得
   */
  public getCount(): number {
    return this.toasts.length;
  }

  /**
   * デフォルトオプションを取得
   */
  private getDefaultOptions(): Pick<ToastOptions, 'duration' | 'closable'> {
    return {
      duration: 3000,
      closable: true
    };
  }
}

// シングルトンインスタンスを作成
const toastService = new ToastService();

/**
 * Vue.jsのプロトタイプに$toastを追加するプラグイン
 */
export const ToastPlugin = {
  install(Vue: VueConstructor): void {
    Vue.prototype.$toast = toastService;
  }
};

// Vue.prototype拡張のための型定義
declare module 'vue/types/vue' {
  interface Vue {
    $toast: ToastService;
  }
}

export default toastService;
export type { ToastService };