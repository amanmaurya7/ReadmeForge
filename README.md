# ReadmeForge

**Automate README generation with intelligent heuristic analysis**

ReadmeForge is a client-side React application that generates professional README.md files for GitHub repositories. Connect your GitHub account, select a repository, and let the app analyze your codebase structure to produce industry-standard documentation automatically.

## ✨ Features

- **🔐 Secure Token Authentication** – No OAuth server needed; paste a classic GitHub PAT and get started
- **🧠 Heuristic Analysis Engine** – Infers your tech stack by scanning file signatures (`package.json`, `requirements.txt`, `Cargo.toml`, etc.)
- **📊 Dynamic Shields.io Badges** – Auto-generate badges for languages, stars, forks, watchers, and license
- **⚡ Real-Time Preview** – Split-pane Markdown editor with live HTML preview
- **🎨 Modern Glassmorphism UI** – Built with Tailwind CSS for a sleek, responsive design
- **🔄 Terminal Log UX** – Visual feedback showing each API call as it completes (no boring spinners!)
- **📁 File Tree Generation** – Collapsible project structure using GitHub's contents API
- **👥 Contributor Credits** – Display avatars of top contributors with commit counts

## 🏗 Architecture

### Frontend Stack

- **React.js** (Vite SPA)
- **TypeScript** (Type-safe development)
- **Tailwind CSS** (Utility-first styling)
- **Lucide React** (Icon library)
- **react-markdown** (Markdown preview)

### Data Layer

- **GitHub REST API v3** (Direct browser communication)
- **Personal Access Token (PAT)** authentication flow

### Core Philosophy

ReadmeForge operates on a **Heuristic Analysis** model. It does not parse code content; instead, it looks for specific structural signatures (file names, extensions, metadata) to infer:

- Technology stack
- Installation commands
- Run commands
- Dependencies

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm or pnpm
- A GitHub account

### Installation

```bash
# Clone the repository
git clone https://github.com/amanmaurya7/ReadmeForge.git
cd ReadmeForge

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Creating a GitHub Token

1. Go to [GitHub Settings → Personal Access Tokens](https://github.com/settings/personal-access-tokens/new?scopes=repo,user&description=ReadmeForge)
2. Select scopes: `repo` and `user`
3. Generate the token and copy it
4. Paste into ReadmeForge's authentication screen

## 📖 Usage Flow

### Phase 1: Authentication

Paste your GitHub Personal Access Token. The app will validate it and fetch your user profile.

### Phase 2: Repository Selection

Browse your repositories in a searchable grid. Click "Generate README" on any project.

### Phase 3: Analysis

Watch the terminal log as ReadmeForge:

- Fetches repository metadata
- Lists contributors
- Analyzes languages
- Scans root directory files
- Runs heuristic inference

### Phase 4: Edit & Export

Review the generated Markdown in a split-pane editor. Make edits and copy the final README to paste into your repository.

## 🧠 Heuristic Rules

ReadmeForge uses the following file signatures to infer project type:

| File               | Stack           | Install                           | Run                         |
| ------------------ | --------------- | --------------------------------- | --------------------------- |
| `package.json`     | Node.js         | `npm install`                     | `npm run dev`               |
| `yarn.lock`        | Node.js (Yarn)  | `yarn install`                    | `yarn dev`                  |
| `pnpm-lock.yaml`   | Node.js (pnpm)  | `pnpm install`                    | `pnpm dev`                  |
| `requirements.txt` | Python          | `pip install -r requirements.txt` | `python main.py`            |
| `Pipfile`          | Python (Pipenv) | `pipenv install`                  | `pipenv run python main.py` |
| `Cargo.toml`       | Rust            | `cargo build`                     | `cargo run`                 |
| `pom.xml`          | Java (Maven)    | `mvn install`                     | `mvn spring-boot:run`       |
| `build.gradle`     | Java (Gradle)   | `./gradlew build`                 | `./gradlew bootRun`         |
| `go.mod`           | Go              | `go mod download`                 | `go run main.go`            |
| `composer.json`    | PHP             | `composer install`                | `php artisan serve`         |

## 🗺 Roadmap

Future enhancements under consideration:

- **OAuth Integration** – True "Log in with GitHub" flow via a lightweight backend
- **LLM-Powered Summaries** – Use OpenAI/Gemini to generate semantic descriptions from code
- **PDF Export** – Export documentation as a formatted PDF
- **Custom Templates** – User-defined Markdown templates
- **Multi-Language Support** – Localized README generation
- **Dark/Light Mode** – Theme toggle for preview pane

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- GitHub REST API for seamless integration
- Shields.io for beautiful, customizable badges
- Vite for lightning-fast builds
- Tailwind CSS for rapid UI development

---

**Built with ❤️ using React + TypeScript + Tailwind CSS**

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
