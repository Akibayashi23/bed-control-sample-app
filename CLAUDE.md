# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**介護ベッド操作アプリ (Care Bed Control App)** - A Japanese nursing care bed control application built with Vue.js and TypeScript.

### Technology Stack

- **Frontend Framework**: Vue.js 2.7.14 with mixed TypeScript/JavaScript
- **State Management**: Vuex 3.6.2 with namespaced modules
- **Routing**: Vue Router 3.6.5 with authentication guards
- **Charts**: Chart.js 2.9.4 with vue-chartjs 3.5.1
- **Build Tool**: Webpack 5.88.2 + webpack-dev-server
- **Testing**: Vitest 3.2.4 with jsdom + Vue Testing Library
- **Code Quality**: ESLint with Vue and TypeScript plugins
- **CSS**: Scoped CSS with responsive design

### Key Features

#### 1. **Bed Control System**
- Preset positions: Sleep (就寝), Reading (読書), Eating (食事)
- Custom preset creation, editing, and deletion with confirmation dialogs
- Fine adjustment controls (±5%) for:
  - Back position (背上げ): 0-90%
  - Leg position (脚上げ): 0-45%  
  - Height (高さ): 20-80%
- Safety lock mechanism to prevent accidental operation
- Visual active state indicators for selected presets

#### 2. **Sleep Analysis System**
- Interactive sleep data visualization with Chart.js
- Daily (14-day) and weekly (7-week) view switching
- Stacked bar charts showing deep sleep, light sleep, and awake periods
- Sleep statistics: average sleep time, deep sleep percentage, average awake time
- Responsive chart design with custom legend and tooltips

#### 3. **User Interface**
- Four main views: Home (状態), Control (操作), Sleep (睡眠), Settings (設定)
- Modal system with BaseModal component for forms and confirmations
- Responsive design with mobile-first approach
- Accessibility features with proper focus states
- Large font size option for elderly users
- Japanese language interface with appropriate fonts

#### 4. **State Management**
- Modular Vuex store with namespaced modules:
  - `bed`: Position state, custom presets, active preset tracking, safety lock
  - `auth`: Authentication state with demo credentials
  - `settings`: User preferences (font size)
  - `sleep`: Chart data, loading states, period selection
- Type-safe localStorage wrapper service with error handling
- Persistent data: authentication, custom presets, font size preferences

#### 5. **Authentication & Security**
- Demo authentication with fixed credentials (demo@example.com / demo1234)
- Route guards protecting all main application routes
- Automatic redirection for authenticated/unauthenticated users
- Logout functionality with complete state cleanup
- Error handling with user-friendly Japanese messages

## Development Setup

### Prerequisites
- Node.js (any recent version)
- npm or yarn package manager

### Installation
```bash
npm install
```

### Development Commands
- **Start dev server**: `npm run dev` (http://localhost:8080)
- **Build for production**: `npm run build`
- **Run linting**: `npm run lint`
- **Run tests**: `npm test` (single run)
- **Watch tests**: `npm run test:watch` (continuous)
- **Test coverage**: `npm run test:coverage`
- **Test UI**: `npm run test:ui` (Vitest UI interface)

### Project Structure
```
src/
├── main.ts              # App entry point
├── App.vue             # Root component with conditional auth navigation
├── index.html          # HTML template
├── components/         # Vue components (mixed TS/JS)
│   ├── BaseModal.vue   # Reusable modal component (TS)
│   ├── HomeView.vue    # Status display (JS)
│   ├── ControlView.vue # Bed control + custom presets (JS)
│   ├── SleepView.vue   # Sleep analysis charts (JS)  
│   ├── SleepChart.vue  # Chart.js wrapper (JS)
│   ├── SettingsView.vue # App settings + modal test (TS)
│   └── LoginView.vue   # Authentication interface (TS)
├── router/
│   └── index.ts        # Vue Router with auth guards
├── store/
│   ├── index.ts        # Main store with module imports
│   └── modules/        # Namespaced Vuex modules
│       ├── bed.ts      # Bed state, presets, safety lock
│       ├── auth.ts     # Authentication state
│       ├── settings.ts # User preferences  
│       └── sleep.ts    # Chart data and periods
├── services/
│   ├── storage.ts      # Type-safe localStorage wrapper
│   └── sleep.ts        # Mock sleep data generation
├── types/
│   └── index.ts        # TypeScript interfaces for all modules
└── test/
    └── setup.js        # Vitest test setup configuration

dist/                   # Built application
webpack.config.js       # Build configuration
vitest.config.js       # Vitest test configuration
tsconfig.json          # TypeScript configuration
.eslintrc.js           # ESLint configuration
```

## Architecture

### Component Architecture
- **App.vue**: Main layout with conditional header/navigation based on auth state
- **BaseModal.vue**: Reusable modal with slots for title, content, and footer
- **LoginView**: Authentication form with demo credentials and error handling
- **HomeView**: Real-time status display with position, lock, and battery info
- **ControlView**: Interactive controls, custom presets with delete confirmation
- **SleepView**: Sleep analysis with Chart.js integration and statistics
- **SleepChart.vue**: Chart.js wrapper component for reusable charts
- **SettingsView**: User preferences, app info, and modal testing

### State Management Architecture
**Modular Vuex Store with Namespaced Modules:**
- All modules use `namespaced: true` for proper scoping
- Components use `createNamespacedHelpers` or direct `$store.getters['module/getter']` access
- Mixed TypeScript/JavaScript approach for Vue components due to type inference limitations

**Module Structure:**
- **bed module**: Position state, custom presets, active preset tracking, safety validation
- **auth module**: Authentication state with localStorage cleanup on logout
- **settings module**: Font size preferences with persistence
- **sleep module**: Chart data fetching, period selection, loading states

**Data Persistence:**
- `StorageService` class provides type-safe localStorage operations
- Keys: `bed-control-auth`, `bed-control-custom-presets`, `bed-control-font-size`
- Automatic cleanup on logout (auth + custom presets, font size preserved)

### CSS Architecture
- Global styles in App.vue for consistent theming
- Scoped component styles for encapsulation
- CSS Grid and Flexbox for responsive layouts
- CSS custom properties for theming
- Mobile-first responsive design with breakpoints
- Accessibility considerations (focus states, reduced motion)

### Routing & Authentication
- Hash mode routing for GitHub Pages compatibility
- Navigation guards protecting authenticated routes (/home, /control, /settings)
- Guest-only route for login page (/login)
- Automatic redirection based on authentication state
- Base path configured for production deployment

### Build Configuration
- Webpack with TypeScript and Vue loader
- Development server with hot reload on port 8080
- Production optimization with terser
- CSS processing with style-loader and css-loader

## Development Patterns

### TypeScript vs JavaScript Usage
**TypeScript files:**
- Store modules (`store/modules/*.ts`)
- Services (`services/*.ts`) 
- Type definitions (`types/index.ts`)
- Router configuration
- Components requiring complex type safety (BaseModal, LoginView, SettingsView)

**JavaScript files:**
- Vue components using `createNamespacedHelpers` (HomeView, ControlView, SleepView, SleepChart)
- Components with Chart.js integration to avoid type inference issues

### Vuex Access Patterns
```javascript
// Preferred: createNamespacedHelpers for JavaScript components
const { mapGetters: mapBedGetters, mapActions: mapBedActions } = createNamespacedHelpers('bed');

// Alternative: Direct store access for specific needs
this.$store.getters['bed/activeCustomPresetId']
this.$store.commit('bed/TOGGLE_LOCK')
this.$store.dispatch('auth/login', credentials)
```

### Custom Preset Management
- Unique ID generation: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
- Active state tracking with visual indicators
- Automatic cleanup on manual position adjustments
- Confirmation dialogs for deletion using BaseModal

## Testing

### Test Framework
- **Testing Library**: Vitest with jsdom environment
- **Component Testing**: Vue Testing Library + @vue/test-utils
- **Coverage**: v8 provider with HTML/text reports
- **Coverage Thresholds**: 60% for lines/functions/branches/statements

### Test Structure
```
src/
├── components/__tests__/
│   └── BaseModal.test.js     # BaseModal component tests
└── store/modules/__tests__/
    └── bed.test.ts           # bed store module tests
```

### Running Tests
- Single run: `npm test`
- Watch mode: `npm run test:watch`
- Coverage report: `npm run test:coverage`
- UI interface: `npm run test:ui`

### Test Configuration
- Global setup in `src/test/setup.js`
- Vitest config in `vitest.config.js`
- Path alias `@` points to `src/`
- Console warnings filtered for Vue

## Authentication Usage

The application starts with a login screen requiring demo credentials:
- **Email**: demo@example.com
- **Password**: demo1234

After successful authentication, users can access all bed control features. The logout button in the header returns users to the login screen.

## Deployment

The built application (`npm run build`) generates static files in the `dist/` directory that can be served by any web server. No server-side rendering or backend API required. GitHub Actions automatically deploys to GitHub Pages on push to main branch.