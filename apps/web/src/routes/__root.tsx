import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center gap-4 px-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">CRM</h1>
            </div>
            <nav className="flex gap-2">
              <Link to="/customers">
                <Button variant="ghost">Customers</Button>
              </Link>
            </nav>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      <Toaster richColors />
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  ),
});
