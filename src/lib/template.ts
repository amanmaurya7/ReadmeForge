import { formatDate, formatNumber } from './format'
import { languageColorMap } from './heuristics'
import type { GitHubContributor, GitHubUser, RepoAnalysis } from '../types/github'

const badge = (label: string, message: string, color: string, logo?: string) => {
  const safeLabel = encodeURIComponent(label.replace(/-/g, '--'))
  const safeMessage = encodeURIComponent(message.replace(/-/g, '--'))
  const queryLogo = logo ? `&logo=${encodeURIComponent(logo)}` : ''
  return `![${label}](https://img.shields.io/badge/${safeLabel}-${safeMessage}-${color}?style=for-the-badge${queryLogo})`
}

const pickColor = (language: string) => languageColorMap[language] || '0f172a'

const contributorRow = (contributors: GitHubContributor[]) => {
  if (!contributors.length) {
    return '_No public contributors were returned by GitHub._'
  }

  return contributors
    .slice(0, 8)
    .map(
      (contributor) =>
        `<a href="${contributor.html_url}" target="_blank" rel="noreferrer noopener"><img src="${contributor.avatar_url}" width="64" height="64" alt="${contributor.login}" title="${contributor.login} • ${contributor.contributions} commits" style="border-radius:50%; margin: 0 8px;" loading="lazy" /></a>`,
    )
    .join('\n')
}

const fileTree = (files: RepoAnalysis['files']) => {
  if (!files.length) {
    return '_File listing unavailable — repository may be empty or private._'
  }
  return files
    .slice(0, 18)
    .map((file) => `- ${file.type === 'dir' ? '📁' : '📄'} \`${file.path}\``)
    .join('\n')
}

export function generateReadme(analysis: RepoAnalysis, user: GitHubUser) {
  const { repo, languages, contributors, profile, files } = analysis
  const languageBadges = languages.map((language) => badge(language, language, pickColor(language)))
  const statBadges = [
    badge('Stars', formatNumber(repo.stargazers_count), 'f97316', 'github'),
    badge('Forks', formatNumber(repo.forks_count), '0ea5e9', 'git'),
    badge('Watchers', formatNumber(repo.watchers_count), 'a855f7', 'github'),
  ]
  if (repo.license?.spdx_id && repo.license.spdx_id !== 'NOASSERTION') {
    statBadges.push(badge('License', repo.license.spdx_id, '22c55e', 'opensourceinitiative'))
  }

  const heuristicsList = profile.heuristics.map((hint) => `- ${hint}`).join('\n')
  const stackList = profile.detectedStack.map((stack) => `- ${stack}`).join('\n')

  const generatedOn = formatDate(new Date())

  return `<!-- Generated with ❤️ by ReadmeForge -->
<a id="readme-top"></a>
<div align="center">
  <h1>${repo.name}</h1>
  <p>${repo.description ?? 'This repository is missing a description but ReadmeForge still has your back.'}</p>
  <p>
    ${statBadges.join('\n    ')}
  </p>
</div>

<details>
  <summary><strong>Table of Contents</strong></summary>
  1. [Overview](#-overview) ·
  2. [Tech Stack](#-tech-stack) ·
  3. [Setup](#-setup) ·
  4. [Usage](#-usage) ·
  5. [Project Structure](#-project-structure) ·
  6. [Credits](#-credits) ·
  7. [License](#-license)
</details>

## 📦 Overview
**Default Branch:** ${repo.default_branch}

**Detected Profile:**
${stackList}

**Heuristic Notes:**
${heuristicsList}

[🔼 Back to top](#readme-top)

## 🧠 Tech Stack
<div align="center">
  ${languageBadges.join('\n  ')}
</div>

[🔼 Back to top](#readme-top)

## ⚙️ Setup
1. Clone the repository: 
   \`git clone ${repo.html_url}.git\`
2. Install dependencies: 
   \`${profile.installCommand}\`

[🔼 Back to top](#readme-top)

## 🚀 Usage
- Primary start command: \`${profile.runCommand}\`
- Adjust environment variables or secrets inside GitHub ➜ Settings ➜ Secrets and variables.
- Update the README by re-running ReadmeForge whenever the tech stack changes.

[🔼 Back to top](#readme-top)

## 🗂 Project Structure
<details open>
  <summary>Root level insight</summary>

${fileTree(files)}
</details>

[🔼 Back to top](#readme-top)

## 👥 Credits
<div align="center">
${contributorRow(contributors)}
</div>

[🔼 Back to top](#readme-top)

## 📄 License
${repo.license?.name ?? 'No explicit open-source license detected. Consider adding one to clarify usage terms.'}

---
_Generated ${generatedOn} by **${user.login}** using ReadmeForge._
`
}
