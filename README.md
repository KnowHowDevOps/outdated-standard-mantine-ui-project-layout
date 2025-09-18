> ## 🤔 What is this template all about?
>
> - This template can be used as a base layer for a ReactJS UI projects.
> - Make the project easy to maintain with **7 issue templates**.
> - Quick-start documentation with an extraordinary README structure.
> - Manage issues with **20 issue labels**.
> - Make _community healthier_ with all the guides like code of conduct, contributing, support, security...
> - Learn more with the [official GitHub guide on creating repositories from a template](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template).
> - To start using it, click **[Use this template](https://github.com/dimdnk/standard-mantine-ui-project-layout/generate)** to create your new repository.

---

# 🚀 Mantine UI Project Layout


## 📜 Description

React + TypeScript + Vite + TanStack Router + Mantine UI Template

> A modern, feature-rich template for building scalable React applications with the latest tools and best practices.


## 🔑 Key Features

### 🚀 **Core Technologies**
- ✨ **React 19** - Latest React with concurrent features and improved performance
- ⚡ **Vite 6** - Lightning-fast development with instant HMR and optimized builds
- 🎯 **TypeScript** - Type-safe development with latest language features
- �  **PNPM** - Fast, disk space efficient package manager with workspaces support

### 🎨 **UI & Styling**
- 🎨 **Mantine UI** - Modern React components library with comprehensive theming
- 🎪 **Mantine Extensions** - Carousel, Charts, Dates, Dropzone, Modals, Notifications
- �️ ***Tiptap Editor** - Rich text editor with extensions for images, links, and formatting
- 🎭 **Tabler Icons** - Beautiful SVG icons optimized for React
- 📊 **Mantine DataTable** - Advanced data table with sorting, filtering, and pagination

### 🔄 **State Management & Data**
- 🔄 **TanStack Router** - Type-safe routing with code splitting and search params
- 🔄 **TanStack Query** - Powerful data synchronization and caching
- � **Axiosb** - Promise-based HTTP client for API calls
- � **GDraphQL Request** - Lightweight GraphQL client
- ✅ **React Hook Form + Zod** - Type-safe form validation and management
- 🍪 **JS Cookie** - Simple cookie management
- 🔗 **nuqs** - Type-safe URL search params state management

### 🌐 **Internationalization & Accessibility**
- 🌍 **Lingui** - Modern i18n framework with macro support and pluralization
- ♿ **A11y Support** - Built-in accessibility features and Storybook a11y addon

### 🧪 **Testing & Quality**
- 🧪 **Vitest** - Fast unit testing with coverage reports and UI
- 🧪 **Playwright** - Reliable end-to-end testing with UI mode
- 🧪 **Mock Service Worker** - Client-agnostic API mocking for development and testing
- 🧪 **Testing Library** - Simple and complete testing utilities for React

### 🔍 **Code Quality & Development**
- 🔍 **ESLint 9** - Modern linting with flat config and React/TypeScript rules
- 💅 **Prettier** - Opinionated code formatting with package.json plugin
- 🎨 **Stylelint** - CSS/SCSS linting for consistent styling
- 🪝 **Husky + Lefthook** - Git hooks for pre-commit validation
- 📝 **Commitlint** - Conventional commit message validation
- 🔪 **Knip** - Dead code elimination and dependency analysis

### 🧱 **Development Tools**
- 📚 **Storybook 8** - Component development in isolation with dark mode support
- 🔧 **SWC** - Fast TypeScript/JavaScript compiler for React
- 📦 **Bundle Analyzer** - Visualize and optimize bundle size
- 🖼️ **Image Optimizer** - Automatic image optimization in builds
- 🧹 **Console Remover** - Remove console statements in production builds

### 🚀 **DevOps & Automation**
- 👷 **GitHub Actions** - CI/CD workflows for testing, building, and deployment
- 🔒 **Dependabot** - Automated dependency updates and security monitoring
- 📦 **Release-it** - Automated versioning and changelog generation
- 🐳 **Docker Compose** - Local development environment setup
- 📊 **SonarQube** - Code quality and security analysis

### 🏗️ **Architecture & Patterns**
- 🏗️ **Feature-Sliced Design** - Scalable frontend architecture methodology
- 🔌 **API Code Generation** - Kubb for OpenAPI/Swagger client generation
- 🎯 **TypeScript Strict Mode** - Enhanced type safety with strict configuration
- 🔄 **Hot Module Replacement** - Instant updates during development


## 📚 Documentation

> [!TIP]
>
> #### Install Prerequisites:
>
> - [Node LTS version](https://nodejs.org/en/blog/release/v22.15.0/)
> - [pnpm](https://pnpm.io/installation)
> - [Git](https://git-scm.com/)
> - [Docker](https://www.docker.com/get-started/)
> - [Docker Compose](https://docs.docker.com/compose/)

### 🔺 Local development

```shell script
# Clone the repository
git clone https://github.com/dimdnk/standard-mantine-ui-project-layout.git my-app

# Navigate to project directory
cd my-app

# Install dependencies
pnpm install

# Start local dev services in Docker using the command:
docker compose -f compose.yaml up -d

# Start development server
pnpm dev
```

### 📃 Available Scripts

| Command               | Description                                |
| --------------------- | ------------------------------------------ |
| `pnpm dev`            | Start development server                   |
| `pnpm build`          | Build for production                       |
| `pnpm preview`        | Preview production build                   |
| `pnpm test`           | Run tests                                  |
| `pnpm prettier:write` | Run Prettier over the code                 |
| `pnpm lint`           | Lint code                                  |
| `pnpm type-check`     | Check types                                |
| `pnpm release`        | Automate versioning and package publishing |

## 🏗️ **Feature-Sliced Design Architecture**

This project follows **Feature-Sliced Design (FSD)** methodology for scalable frontend architecture.

### 📁 **Project Structure**

```
src/
├── app/                    # Application layer
│   ├── app.tsx            # App component with providers
│   ├── router.ts          # Router configuration
│   └── index.ts           # Public API
├── processes/              # Cross-entity business processes
│   ├── auth-session/      # Authentication session management
│   └── user-onboarding/   # User registration workflow
├── pages/                  # Pages layer (owns routing)
│   ├── __root.tsx         # Root route with layout
│   ├── index.tsx          # Home route
│   ├── about.tsx          # About route
│   ├── home/              # Home page components
│   └── about/             # About page components
├── features/              # Business features
│   ├── auth/              # Authentication feature
│   │   ├── model/         # Validation & business logic
│   │   ├── ui/            # Feature UI components
│   │   └── index.ts       # Public API
│   └── user-management/   # User management feature
├── entities/              # Business entities (pure data)
│   ├── user/              # User entity
│   │   ├── model/         # Types & pure queries
│   │   ├── api/           # API methods
│   │   ├── ui/            # Data display components
│   │   └── index.ts       # Public API
│   └── auth/              # Auth entity
└── shared/                # Reusable utilities
    ├── api/               # Base API configuration
    ├── lib/               # Utilities & helpers
    ├── types/             # Common types
    └── ui/                # Reusable UI components
```

### 🎯 **Layer Responsibilities**

| Layer         | Purpose                                            | Can Import From                       |
| ------------- | -------------------------------------------------- | ------------------------------------- |
| **App**       | Application initialization, global providers       | All layers                            |
| **Processes** | Cross-entity workflows, complex business processes | Features, Entities, Shared            |
| **Pages**     | Route components, page composition                 | Processes, Features, Entities, Shared |
| **Features**  | Business logic, validation, feature UI             | Entities, Shared                      |
| **Entities**  | Pure data access, basic UI components              | Shared only                           |
| **Shared**    | Reusable utilities, no business logic              | External libraries only               |

### 🔒 **Public API Pattern**

Every slice exposes its functionality through barrel files (`index.ts`):

```typescript
// ✅ Correct: Use public APIs
import { useLogin, LoginForm } from "@/features/auth";
import { User, UserCard } from "@/entities/user";

// ❌ Wrong: Bypass public API
import { LoginForm } from "@/features/auth/ui/login-form";
```

### 📚 **Architecture Documentation**

- 📚 [**Documentation Index**](docs/index.md) - Complete documentation guide
- 📖 [**FSD Architecture Guide**](docs/fsd-architecture.md) - Complete architecture overview
- 🔒 [**Public API Enforcement**](docs/public-api-enforcement.md) - API patterns and rules
- ✅ [**Validation Guide**](docs/validation-guide.md) - Zod validation patterns
- 🛠️ [**Development Guide**](docs/development-guide.md) - Step-by-step development patterns
- 📋 [**Final FSD Summary**](docs/final-fsd-summary.md) - Implementation summary

### Environment Variables

| Variable   | Description                | Default       |
| ---------- | -------------------------- | ------------- |
| `TZ`       | Defines timezone           | `UTC`         |
| `NODE_ENV` | Defines nodejs environment | `development` |

### 🎯 Cursor AI IDE Support

This project includes Cursor AI IDE rules for enhanced development experience:

- **TypeScript React Query Best Practices** - Enforces best practices for using TanStack Query (React Query) in TypeScript React applications
- **Code organization and structure guidelines**
- **Performance optimization recommendations**
- **Security best practices enforcement**
- **Testing approaches and patterns**

The rules are located in `.cursor/rules/` directory and are automatically applied when using Cursor IDE.

---

<a name="changelog"></a>

## 📆 Changelog

Conventional changelog located [here](CHANGELOG.md).

<a name="contributing"></a>

## 🙏 Community & Contributions

Please follow [Contributing](.github/CONTRIBUTING.md) page.

<a name="codeofconduct"></a>

## 📙 Code of Conduct

Please follow [Code of Conduct](.github/CODE_OF_CONDUCT.md) page.

<a name="license"></a>

## 📑 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## _GitHub Project Tooling Overview_

### GitHub Actions

- **Build & Test** - Node.js project build validation
- **PR Title Check** - Ensures proper PR naming conventions
- **Commit Message Check** - Validates a commit message format
- **Template Setup** - Automated template configuration

### Git Hooks (Husky)

- **Pre-commit** - Runs linting and formatting on staged files
- **Commit-msg** - Validates commit message format

### Quality Gates

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting enforcement
- **Stylelint** - CSS/SCSS linting
