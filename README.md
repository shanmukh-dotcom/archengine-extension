# ArchEngine: Project Architecture Engine 🚀

![ArchEngine Banner](https://img.shields.io/badge/ArchEngine-Architecture_Engine-blue?style=for-the-badge)
![VS Code Extension](https://img.shields.io/badge/VS_Code-Extension-007ACC?style=for-the-badge&logo=visualstudiocode)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

ArchEngine is not just another scaffolding tool—it is a **Project Architecture Engine** designed for VS Code. Instead of writing repetitive setup code, ArchEngine intelligently builds, expands, mentors, and tracks your software lifecycle from Day 1 to deployment.

## ✨ Features

### V1: The Architecture Scaffolder
Open a blank folder, prompt ArchEngine, and watch it generate an entire architecture. It uses a **Dual-Engine System**:
- **LLM Mode:** Uses the Google Gemini API to intelligently construct files and dependencies based on complex prompts.
- **Pure Logic Mode:** Lightning-fast, offline fallback using local, rigorously tested templates.

### V2: The Project Expansion Engine
Already have a project? ArchEngine scans your existing `package.json`, detects your framework (e.g., Next.js), and safely injects new components and dependencies *without* overwriting your existing code.

### V3: The Architecture Advisor
Every time you build a blueprint, ArchEngine mentors you. It generates a comprehensive `ARCHITECTURE.md` file explaining the specific design patterns chosen, scalability advice for up to 1M users, and critical security best practices for your tech stack.

### V4: The Developer Memory System
ArchEngine transforms into a background tracking system as you code.
- **Session Tracking:** Log your active development hours.
- **Developer Notes:** Quickly log blockers and breakthroughs.
- **Resume Generator:** At the end of the project, ArchEngine compiles your tech stack, time spent, and challenges into a stunning `PROJECT_CASE_STUDY.md` that is ready for your portfolio.

### V5: Zero-Friction GitHub Deployments
Paste your GitHub repository URL into the VS Code Settings, and run the Push command. ArchEngine automatically initializes Git, stages files, commits changes, and pushes to `main` instantly.

## 🛠 Installation

1. Download the `.vsix` installer from the releases or build it yourself.
2. Open VS Code and navigate to the **Extensions** tab.
3. Click the `...` menu in the top right corner.
4. Select **Install from VSIX...** and choose the `archengine-0.1.0.vsix` file.

## ⚙️ Configuration

Open VS Code Settings (`Ctrl+,`) and search for `archengine`:
- **ArchEngine: Gemini Api Key**: Add your Google Gemini key for intelligent LLM routing. Leave blank to use offline templates.
- **ArchEngine: Github Repo Url**: Add a blank GitHub URL (e.g., `https://github.com/your-username/repo.git`) to enable the instant push feature.

## 💻 Commands

Access these via the VS Code Command Palette (`Ctrl+Shift+P`):
- `ArchEngine: Generate Architecture Blueprint` - Scaffolds or expands projects.
- `ArchEngine: Start/Stop Coding Session` - Tracks your time.
- `ArchEngine: Log Developer Note` - Saves a project blocker.
- `ArchEngine: Generate Developer Resume` - Generates the Case Study markdown.
- `ArchEngine: Push to GitHub` - Automates the Git push pipeline.

### 💡 Example Prompts to Test
Not sure what to type when scaffolding or expanding? Try these exact phrases:

**For V1 Scaffolding (In an empty folder):**
- *"Build a Next.js application with a PostgreSQL database."*
- *"Create a simple Express backend with MongoDB."*

**For V2 Expansion (In an existing project folder):**
- *"Add a MongoDB database connection."*
- *"Add a PostgreSQL configuration file."*

---
*Built for Engineers, by Engineers. Build Software Faster.*
