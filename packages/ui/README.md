# @crm/ui

Shared UI components built with shadcn/ui for the CRM application.

## Installation

This package is part of the monorepo and is automatically linked via pnpm workspace.

## Adding shadcn/ui Components

From the packages/ui directory:

```bash
cd packages/ui
pnpx shadcn@latest add button
```

Or from the project root:

```bash
pnpx shadcn@latest add button --cwd packages/ui
```

## Usage in Apps

Import components in your app:

```tsx
import { Button } from "@crm/ui";
// or
import { Button } from "@crm/ui/components/ui/button";

function App() {
  return <Button>Click me</Button>;
}
```

## Tech Stack

- React 19.2.0
- TypeScript 5.7.2
- Tailwind CSS (via consuming apps)
- shadcn/ui components
- class-variance-authority (CVA)
- clsx + tailwind-merge

## Configuration

- Style: `new-york`
- Base color: `zinc`
- CSS variables: `enabled`
- Icon library: `lucide-react`

