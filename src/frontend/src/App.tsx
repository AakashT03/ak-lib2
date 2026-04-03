import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import MainLayout from "./components/layout/MainLayout";
import AIAssistantPage from "./pages/AIAssistantPage";
import AcquisitionsPage from "./pages/AcquisitionsPage";
import BooksPage from "./pages/BooksPage";
import DashboardPage from "./pages/DashboardPage";
import EBooksPage from "./pages/EBooksPage";
import ELearningPage from "./pages/ELearningPage";
import EntryExitPage from "./pages/EntryExitPage";
import IssueReturnPage from "./pages/IssueReturnPage";
import LibraryCatalogPage from "./pages/LibraryCatalogPage";
import LoginPage from "./pages/LoginPage";
import MagazinesPage from "./pages/MagazinesPage";
import OpacPage from "./pages/OpacPage";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const protectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: MainLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/",
  component: DashboardPage,
});

const booksRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/books",
  component: BooksPage,
});

const issueReturnRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/books/issue-return",
  component: IssueReturnPage,
});

const opacRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/opac",
  component: OpacPage,
});

const catalogRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/catalog",
  component: LibraryCatalogPage,
});

const ebooksRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/ebooks",
  component: EBooksPage,
});

const magazinesRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/magazines",
  component: MagazinesPage,
});

const entryExitRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/entry-exit",
  component: EntryExitPage,
});

const acquisitionsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/acquisitions",
  component: AcquisitionsPage,
});

const eLearningRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/elearning",
  component: ELearningPage,
});

const usersRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/users",
  component: UsersPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/reports",
  component: ReportsPage,
});

const aiAssistantRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/ai-assistant",
  component: AIAssistantPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/settings",
  component: SettingsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedLayout.addChildren([
    dashboardRoute,
    booksRoute,
    issueReturnRoute,
    opacRoute,
    catalogRoute,
    ebooksRoute,
    magazinesRoute,
    entryExitRoute,
    acquisitionsRoute,
    eLearningRoute,
    usersRoute,
    reportsRoute,
    aiAssistantRoute,
    settingsRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
