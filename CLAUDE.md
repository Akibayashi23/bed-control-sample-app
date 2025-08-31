# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**介護ベッド操作アプリ (Care Bed Control App)** - A Japanese nursing care bed control application built with Vue.js and TypeScript.

### Technology Stack

- **Frontend Framework**: Vue.js 2.7.14 with TypeScript
- **State Management**: Vuex 3.6.2
- **Routing**: Vue Router 3.6.5
- **Build Tool**: Webpack 5.88.2 + webpack-dev-server
- **Code Quality**: ESLint with Vue and TypeScript plugins
- **CSS**: Scoped CSS with responsive design

### Key Features

#### 1. **Bed Control System**
- Preset positions: Sleep (就寝), Reading (読書), Eating (食事)
- Fine adjustment controls (±5%) for:
  - Back position (背上げ): 0-90%
  - Leg position (脚上げ): 0-45%  
  - Height (高さ): 20-80%
- Safety lock mechanism to prevent accidental operation

#### 2. **User Interface**
- Three main views: Home (状態), Control (操作), Settings (設定)
- Responsive design with mobile-first approach
- Accessibility features with proper focus states
- Large font size option for elderly users
- Japanese language interface with appropriate fonts

#### 3. **State Management**
- Vuex store managing:
  - Bed position state with validation limits
  - Lock status for safety
  - Battery level simulation (85%)
  - User preferences (font size)
- LocalStorage persistence for settings

#### 4. **Safety Features**
- Operation lock to prevent accidental changes
- Visual lock indicators and overlay messages
- Position limits with automatic validation
- Battery level monitoring with color-coded display

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

### Project Structure
```
src/
├── main.ts              # App entry point
├── App.vue             # Root component with navigation
├── index.html          # HTML template
├── components/         # Vue components
│   ├── HomeView.vue    # Status display (current position, lock, battery)
│   ├── ControlView.vue # Bed control interface
│   └── SettingsView.vue # App settings and info
├── router/
│   └── index.ts        # Vue Router configuration
├── store/
│   └── index.ts        # Vuex store (state management)
└── types/
    └── index.ts        # TypeScript type definitions

dist/                   # Built application
webpack.config.js       # Build configuration
tsconfig.json          # TypeScript configuration
.eslintrc.js           # ESLint configuration
```

## Architecture

### Component Architecture
- **App.vue**: Main layout with header, navigation, and router-view
- **HomeView**: Real-time status display with position, lock, and battery info
- **ControlView**: Interactive controls for bed adjustment and safety lock
- **SettingsView**: User preferences and application information

### State Management
- Centralized Vuex store with mutations, actions, and getters
- Type-safe state management with TypeScript interfaces
- Persistent settings using localStorage
- Validation logic for position limits and safety constraints

### CSS Architecture
- Global styles in App.vue for consistent theming
- Scoped component styles for encapsulation
- CSS Grid and Flexbox for responsive layouts
- CSS custom properties for theming
- Mobile-first responsive design with breakpoints
- Accessibility considerations (focus states, reduced motion)

### Build Configuration
- Webpack with TypeScript and Vue loader
- Development server with hot reload
- Production optimization with terser
- CSS processing with style-loader and css-loader

## Testing

Currently no testing framework is set up. To add testing:
- Consider Vue Test Utils for component testing
- Jest for unit testing would be appropriate
- End-to-end testing could use Cypress or Playwright

## Deployment

The built application (`npm run build`) generates static files in the `dist/` directory that can be served by any web server. No server-side rendering or backend API required.