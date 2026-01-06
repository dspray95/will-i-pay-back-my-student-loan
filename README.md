# THE GREAT BRITISH WRITE-OFF

A UK student loan projection tool built with React 19, Vite, and Bun. This project helps users visualize long-term debt based on income projections and loan plans.

## Stack

- **Runtime:** [Bun](https://bun.sh/) (Package management & scripts)
- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 7](https://vitejs.dev/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Client-side calculation state)
- **Forms:** [Formik](https://formik.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)

## Getting Started

This project uses **Bun**. If you don't have it installed, run `curl -fsSL https://bun.sh/install | bash` (Linux/MacOS) or `powershell -c "irm bun.sh/install.ps1|iex"` (windows).

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

### Build

```bash
bun run build
```

## 📐 Project Architecture

- `src/sections/`: Single page divided into sections
- `src/layout`: Full page layout
- `src/domain/`: Pure business logic (loan plans, interest rate calculations etc.).
- `src/stores/`: Zustand stores managing the global calculation state.
- `src/shared/`: Reusable components, functions, types and constants.
