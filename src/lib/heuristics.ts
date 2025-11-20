import type { GitHubContentNode, RepoProfile } from '../types/github'

interface HeuristicRule {
  signature: string
  stack: string
  install: string
  run: string
  detail: string
}

const HEURISTIC_RULES: HeuristicRule[] = [
  {
    signature: 'package.json',
    stack: 'Node.js',
    install: 'npm install',
    run: 'npm run dev',
    detail: 'Detected package.json at the repository root',
  },
  {
    signature: 'yarn.lock',
    stack: 'Node.js (Yarn)',
    install: 'yarn install',
    run: 'yarn dev',
    detail: 'Detected yarn.lock suggesting Yarn workflow',
  },
  {
    signature: 'pnpm-lock.yaml',
    stack: 'Node.js (pnpm)',
    install: 'pnpm install',
    run: 'pnpm dev',
    detail: 'Detected pnpm-lock.yaml for pnpm based projects',
  },
  {
    signature: 'requirements.txt',
    stack: 'Python',
    install: 'pip install -r requirements.txt',
    run: 'python main.py',
    detail: 'Python dependency lock file discovered',
  },
  {
    signature: 'Pipfile',
    stack: 'Python (Pipenv)',
    install: 'pipenv install',
    run: 'pipenv run python main.py',
    detail: 'Detected Pipfile typically used with Pipenv',
  },
  {
    signature: 'Cargo.toml',
    stack: 'Rust',
    install: 'cargo build',
    run: 'cargo run',
    detail: 'Cargo manifest reveals a Rust crate',
  },
  {
    signature: 'pom.xml',
    stack: 'Java (Maven)',
    install: 'mvn install',
    run: 'mvn spring-boot:run',
    detail: 'Maven pom.xml present at root',
  },
  {
    signature: 'build.gradle',
    stack: 'Java (Gradle)',
    install: './gradlew build',
    run: './gradlew bootRun',
    detail: 'Gradle build file detected',
  },
  {
    signature: 'go.mod',
    stack: 'Go',
    install: 'go mod download',
    run: 'go run main.go',
    detail: 'Go module definition found',
  },
  {
    signature: 'composer.json',
    stack: 'PHP',
    install: 'composer install',
    run: 'php artisan serve',
    detail: 'Composer manifest suggests PHP/Laravel style project',
  },
]

const FALLBACK_PROFILE: RepoProfile = {
  installCommand: 'Refer to the repository instructions',
  runCommand: 'See package scripts for available commands',
  detectedStack: ['General Project'],
  heuristics: [
    'No opinionated build files detected. Defaulting to generic installation guidance.',
  ],
}

export function inferProfile(files: GitHubContentNode[]): RepoProfile {
  const fileNames = new Set(files.map((file) => file.name.toLowerCase()))
  const matches = HEURISTIC_RULES.filter((rule) => fileNames.has(rule.signature.toLowerCase()))

  if (!matches.length) {
    return FALLBACK_PROFILE
  }

  const primary = matches[0]

  return {
    installCommand: primary.install,
    runCommand: primary.run,
    detectedStack: matches.map((match) => match.stack),
    heuristics: matches.map((match) => match.detail),
  }
}

export const languageColorMap: Record<string, string> = {
  JavaScript: 'facc15',
  TypeScript: '3178c6',
  Python: '3776AB',
  Go: '00ADD8',
  Rust: 'DEA584',
  Java: 'f89820',
  Kotlin: 'A855F7',
  C: '555555',
  'C++': '004482',
  'C#': '178600',
  PHP: '777BB4',
  Ruby: 'CC342D',
  Swift: 'FA7343',
  Dart: '00C4B3',
  HTML: 'E34F26',
  CSS: '1572B6',
  Shell: '4EAA25',
  Vue: '41B883',
  Svelte: 'FF3E00',
  Elixir: '4E2A8E',
  Scala: 'DC322F',
}
