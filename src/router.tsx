import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AuthPage } from "./pages/AuthPage";
import { LibraryPage } from "./pages/LibraryPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminBooksPage } from "./pages/AdminBooksPage";
import { AdminIngestionPage } from "./pages/AdminIngestionPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AdminAuditPage } from "./pages/AdminAuditPage";
import { ReaderPage } from "./pages/ReaderPage";
import { ReaderIndexPage } from "./pages/ReaderIndexPage";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LibraryPage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

const readerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reader",
  component: ReaderIndexPage,
});

const readerBookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reader/$bookId",
  component: ReaderPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboardPage,
});

const adminBooksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/books",
  component: AdminBooksPage,
});

const adminIngestionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/ingestion",
  component: AdminIngestionPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/users",
  component: AdminUsersPage,
});

const adminAuditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/audit",
  component: AdminAuditPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  readerRoute,
  readerBookRoute,
  adminDashboardRoute,
  adminBooksRoute,
  adminIngestionRoute,
  adminUsersRoute,
  adminAuditRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
