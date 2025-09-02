# 介護ベッド操作アプリ

Vue 2 + TypeScript + Vuexで作成された介護ベッドの操作・分析アプリケーションです。

## 機能概要

### 🔐 認証機能
- ログイン画面（デモ用認証情報あり）
- ルートガードによる認証後のみアクセス制御
- ログアウト時のデータクリーンアップ

### 🏠 ホーム画面
- 現在のベッドの姿勢（背上げ・脚上げ・高さ）をリアルタイム表示
- 安全ロック状態の確認
- バッテリー残量の表示（色分けあり）

### 🎮 操作画面
- **プリセット機能**：就寝・読書・食事の定型ポジション
- **カスタムプリセット**：ユーザー独自の姿勢を作成・保存・削除
- **アクティブ状態表示**：現在選択中のプリセットが一目でわかる
- **安全ロック機能**：誤操作防止のロック/アンロック切替
- **微調整操作**：±5%単位での細かい調整（背上げ・脚上げ・高さ）

### 😴 睡眠分析画面
- **インタラクティブグラフ**：Chart.jsによる睡眠データの可視化
- **期間切替**：日別（14日間）/ 週別（7週間）表示
- **睡眠段階表示**：深い眠り・浅い眠り・覚醒の積み上げ棒グラフ
- **統計情報**：平均睡眠時間・深い眠り割合・平均覚醒時間
- **ローディング・エラー状態**：適切なUXフィードバック

### ⚙️ 設定画面
- **フォントサイズ切替**：標準・大（高齢者向け配慮）
- **アプリ情報表示**：バージョン・対応機種など
- **使い方ガイド**：各画面の説明
- **モーダルテスト**：BaseModalコンポーネントのデモ

## セットアップ

### 依存関係のインストール
```bash
npm install
```

### 開発サーバーの起動
```bash
npm run dev
```
ブラウザで `http://localhost:8080` を開きます。

### ログイン方法
アプリ起動時にログイン画面が表示されます。以下のデモ認証情報を使用してください：
- **メールアドレス**: demo@example.com
- **パスワード**: demo1234

### ビルド
```bash
npm run build
```

### リント
```bash
npm run lint
```

## 技術仕様

### フロントエンド
- **フレームワーク**: Vue 2.7.14
- **言語**: TypeScript + JavaScript（混在）
- **状態管理**: Vuex 3.6.2（名前空間付きモジュール）
- **ルーティング**: Vue Router 3.6.5（認証ガード付き）
- **グラフライブラリ**: Chart.js 2.9.4 + vue-chartjs 3.5.1
- **バンドラー**: Webpack 5.88.2
- **開発サーバー**: webpack-dev-server + ホットリロード

### アーキテクチャ
- **モジュラーVuexストア**: bed / auth / settings / sleep の4モジュール
- **型安全なlocalStorage**: カスタムStorageServiceクラス
- **レスポンシブデザイン**: モバイルファースト + アクセシビリティ対応
- **コンポーネント設計**: 再利用可能なBaseModalシステム

## プロジェクト構造

```
src/
├── components/            # Vueコンポーネント（TS/JS混在）
│   ├── BaseModal.vue      # 再利用可能モーダル（TS）
│   ├── HomeView.vue       # ホーム画面（JS）
│   ├── ControlView.vue    # 操作画面（JS）
│   ├── SleepView.vue      # 睡眠分析画面（JS）
│   ├── SleepChart.vue     # グラフコンポーネント（JS）
│   ├── SettingsView.vue   # 設定画面（TS）
│   └── LoginView.vue      # ログイン画面（TS）
├── store/                 # Vuexストア
│   ├── index.ts           # メインストア
│   └── modules/           # 名前空間付きモジュール
│       ├── bed.ts         # ベッド状態・プリセット管理
│       ├── auth.ts        # 認証状態管理
│       ├── settings.ts    # ユーザー設定
│       └── sleep.ts       # 睡眠データ管理
├── services/              # ビジネスロジック層
│   ├── storage.ts         # localStorage ラッパー
│   └── sleep.ts           # 睡眠データ生成
├── router/                # Vue Routerの設定
├── types/                 # TypeScript型定義
├── App.vue                # メインアプリコンポーネント
└── main.ts                # エントリーポイント
```

## データ永続化

### localStorage使用データ
- **認証状態**: `bed-control-auth`（ログアウト時削除）
- **カスタムプリセット**: `bed-control-custom-presets`（保持される）
- **フォントサイズ設定**: `bed-control-font-size`（保持される）

### データクリーンアップ
ログアウト時は認証状態のみが削除され、カスタムプリセットとフォントサイズ設定は保持されます。

## 開発パターン

### Vuexアクセス方法
```javascript
// JavaScript コンポーネントでの推奨パターン
const { mapGetters: mapBedGetters, mapActions: mapBedActions } = createNamespacedHelpers('bed');

// 直接アクセスが必要な場合
this.$store.getters['bed/activeCustomPresetId']
this.$store.commit('bed/TOGGLE_LOCK')
```

### TypeScript vs JavaScript の使い分け
- **TypeScript**: Store モジュール、サービス層、型定義、複雑な型安全性が必要なコンポーネント
- **JavaScript**: `createNamespacedHelpers` 使用コンポーネント、Chart.js 統合コンポーネント

## デプロイメント

### GitHub Pages
- 自動デプロイ設定済み（main ブランチへのプッシュ時）
- ビルド成果物は `dist/` ディレクトリに生成
- 静的ファイルのみでサーバーサイド不要

### 本番環境
```bash
npm run build
# dist/ ディレクトリの内容を任意のWebサーバーにデプロイ
```

## 注意事項

- このアプリは実際のベッド制御装置と接続されていません
- バッテリー残量・睡眠データなどはすべてダミーデータです
- 実際の介護ベッドシステムと統合する場合は、適切なAPIとの連携が必要です
- 睡眠データは毎回ランダム生成されるため、リロードすると変更されます

## ライセンス

このプロジェクトはデモ・学習目的で作成されています。