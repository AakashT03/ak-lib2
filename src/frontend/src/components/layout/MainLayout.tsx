import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  BarChart2,
  Bell,
  Book,
  BookOpen,
  Bot,
  ChevronDown,
  ChevronRight,
  Database,
  DoorOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Search,
  Settings,
  ShoppingCart,
  Tablet,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { clearDemoSession, getDemoSession } from "../../utils/demoAuth";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path?: string;
  staffOnly?: boolean;
  studentAllowed?: boolean;
  children?: {
    label: string;
    path: string;
    icon?: React.ReactNode;
    studentAllowed?: boolean;
  }[];
}

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
    path: "/",
    studentAllowed: false,
  },
  {
    icon: <Book size={18} />,
    label: "Books",
    studentAllowed: false,
    children: [
      {
        label: "All Books",
        path: "/books",
        icon: <Book size={14} />,
        studentAllowed: false,
      },
      {
        label: "Issue / Return",
        path: "/books/issue-return",
        icon: <ArrowLeftRight size={14} />,
        studentAllowed: false,
      },
      {
        label: "OPAC Catalogue",
        path: "/opac",
        icon: <Search size={14} />,
        studentAllowed: false,
      },
      {
        label: "Library Catalog",
        path: "/catalog",
        icon: <Database size={14} />,
        studentAllowed: true,
      },
    ],
  },
  {
    icon: <Tablet size={18} />,
    label: "E-Books & Journals",
    path: "/ebooks",
    studentAllowed: false,
  },
  {
    icon: <Newspaper size={18} />,
    label: "Magazines",
    path: "/magazines",
    studentAllowed: false,
  },
  {
    icon: <DoorOpen size={18} />,
    label: "Entry / Exit",
    path: "/entry-exit",
    studentAllowed: true,
  },
  {
    icon: <ShoppingCart size={18} />,
    label: "Book Acquisitions",
    path: "/acquisitions",
    studentAllowed: false,
  },
  {
    icon: <GraduationCap size={18} />,
    label: "E-Learning",
    path: "/elearning",
    studentAllowed: true,
  },
  {
    icon: <Users size={18} />,
    label: "User Management",
    path: "/users",
    staffOnly: true,
    studentAllowed: false,
  },
  {
    icon: <BarChart2 size={18} />,
    label: "Reports",
    path: "/reports",
    studentAllowed: false,
  },
  {
    icon: <Bot size={18} />,
    label: "AI Assistant",
    path: "/ai-assistant",
    studentAllowed: false,
  },
  {
    icon: <Settings size={18} />,
    label: "Settings",
    path: "/settings",
    staffOnly: true,
    studentAllowed: false,
  },
];

// Paths students are allowed to visit
const STUDENT_ALLOWED_PATHS = [
  "/catalog",
  "/entry-exit",
  "/elearning",
  "/profile",
];

function SidebarNavItem({
  item,
  currentPath,
  onNavigate,
}: {
  item: NavItem;
  currentPath: string;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(
    () => item.children?.some((c) => c.path === currentPath) ?? false,
  );

  const isActive = item.path === currentPath;
  const hasActiveChild = item.children?.some((c) => c.path === currentPath);

  if (item.children) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm"
          style={{
            color: hasActiveChild ? "var(--lib-teal)" : "var(--lib-text-sec)",
            background: hasActiveChild
              ? "rgba(168, 85, 247, 0.1)"
              : "transparent",
          }}
        >
          <span
            style={{
              color: hasActiveChild
                ? "var(--lib-teal)"
                : "var(--lib-text-muted)",
            }}
          >
            {item.icon}
          </span>
          <span className="flex-1 text-left font-medium">{item.label}</span>
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className="ml-6 mt-1 space-y-0.5 border-l"
                style={{ borderColor: "var(--lib-border)" }}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    onClick={onNavigate}
                    className="flex items-center gap-2 pl-4 pr-3 py-2 rounded-r-lg text-sm transition-all"
                    style={{
                      color:
                        currentPath === child.path
                          ? "var(--lib-teal)"
                          : "var(--lib-text-muted)",
                      background:
                        currentPath === child.path
                          ? "rgba(168, 85, 247, 0.1)"
                          : "transparent",
                      fontSize: "13px",
                    }}
                    data-ocid={`nav.${child.label.toLowerCase().replace(/\s+\//g, "-").replace(/\s/g, "-").replace(/\//g, "")}.link`}
                  >
                    {child.icon}
                    {child.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      to={item.path!}
      onClick={onNavigate}
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium"
      style={{
        color: isActive ? "var(--lib-teal)" : "var(--lib-text-sec)",
        background: isActive ? "rgba(168, 85, 247, 0.1)" : "transparent",
      }}
      data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "-")}.link`}
    >
      <span
        style={{
          color: isActive ? "var(--lib-teal)" : "var(--lib-text-muted)",
        }}
      >
        {item.icon}
      </span>
      {item.label}
      {isActive && (
        <span
          className="ml-auto w-1 h-5 rounded-full"
          style={{ background: "var(--lib-teal)" }}
        />
      )}
    </Link>
  );
}

// Mobile Bottom Navigation
interface MobileBottomNavProps {
  currentPath: string;
  isStudent: boolean;
  onNavigate: (path: string) => void;
  onOpenSidebar: () => void;
}

function MobileBottomNav({
  currentPath,
  isStudent,
  onNavigate,
  onOpenSidebar,
}: MobileBottomNavProps) {
  const navigate = useNavigate();

  const studentTabs = [
    { icon: <Database size={20} />, label: "Catalog", path: "/catalog" },
    { icon: <DoorOpen size={20} />, label: "Entry/Exit", path: "/entry-exit" },
    { icon: <GraduationCap size={20} />, label: "E-Learn", path: "/elearning" },
    { icon: <User size={20} />, label: "Profile", path: "/profile" },
  ];

  const staffTabs = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/" },
    { icon: <Book size={20} />, label: "Books", path: "/books" },
    { icon: <DoorOpen size={20} />, label: "Entry/Exit", path: "/entry-exit" },
    { icon: <BarChart2 size={20} />, label: "Reports", path: "/reports" },
    { icon: <Menu size={20} />, label: "More", path: "__more__" },
  ];

  const tabs = isStudent ? studentTabs : staffTabs;

  const handleTabPress = (path: string) => {
    if (path === "__more__") {
      onOpenSidebar();
      return;
    }
    navigate({ to: path });
    onNavigate(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden"
      style={{
        background: "var(--lib-sidebar)",
        borderTop: "1px solid var(--lib-border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      data-ocid="mobile.bottom_nav.panel"
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const isActive =
            tab.path !== "__more__" &&
            (tab.path === "/"
              ? currentPath === "/"
              : currentPath.startsWith(tab.path));

          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => handleTabPress(tab.path)}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 py-2 relative transition-colors"
              style={{
                minHeight: "56px",
                color: isActive ? "var(--lib-teal)" : "var(--lib-text-muted)",
              }}
              data-ocid={`mobile.${tab.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}.tab`}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                  style={{ background: "var(--lib-teal)" }}
                />
              )}
              <span
                className="transition-transform"
                style={{ transform: isActive ? "scale(1.1)" : "scale(1)" }}
              >
                {tab.icon}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  lineHeight: 1.2,
                  letterSpacing: "0.01em",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function MainLayout() {
  const navigate = useNavigate();
  const { clear, identity, isInitializing } = useInternetIdentity();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const demoSession = getDemoSession();
  const isAuthenticated = !!demoSession || (!!identity && !isInitializing);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isInitializing, isAuthenticated, navigate]);

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = demoSession
    ? demoSession.displayName
    : principal
      ? `${principal.slice(0, 6)}...${principal.slice(-4)}`
      : "";
  const userRoleLabel = demoSession ? demoSession.role : "Authenticated User";

  const isStudent = demoSession?.role === "Student";
  const isStaff = !isStudent;

  // Redirect students away from restricted paths
  useEffect(() => {
    if (isStudent) {
      const path = window.location.pathname;
      const isAllowed = STUDENT_ALLOWED_PATHS.some(
        (p) => path === p || path.startsWith(`${p}/`),
      );
      if (!isAllowed) {
        navigate({ to: "/catalog" });
      }
    }
  }, [isStudent, navigate]);

  const handleLogout = () => {
    clear();
    clearDemoSession();
    navigate({ to: "/login" });
  };

  const handleNavigate = () => {
    setCurrentPath(window.location.pathname);
    setSidebarOpen(false);
  };

  const handleMobileNavigate = (path: string) => {
    setCurrentPath(path);
  };

  // Show nothing while checking auth
  if (isInitializing || !isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--lib-bg)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center lib-glow"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          >
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: "var(--lib-teal)",
              borderTopColor: "transparent",
            }}
          />
        </div>
      </div>
    );
  }

  // Filter nav items based on role
  const visibleNavItems = navItems
    .filter((item) => {
      if (item.staffOnly && !isStaff) return false;
      if (isStudent) {
        if (item.children) {
          return item.children.some((c) => c.studentAllowed);
        }
        return item.studentAllowed === true;
      }
      return true;
    })
    .map((item) => {
      if (isStudent && item.children) {
        return {
          ...item,
          children: item.children.filter((c) => c.studentAllowed),
        };
      }
      return item;
    });

  const Sidebar = () => (
    <aside
      className="flex flex-col h-full"
      style={{
        background: "var(--lib-sidebar)",
        width: "260px",
        borderRight: "1px solid var(--lib-border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5 border-b"
        style={{ borderColor: "var(--lib-border)" }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg lib-glow"
          style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
        >
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <span
            className="text-lg font-bold font-display"
            style={{ color: "var(--lib-text)" }}
          >
            AK <span style={{ color: "var(--lib-teal)" }}>Lib</span>
          </span>
          <p className="text-xs" style={{ color: "var(--lib-text-muted)" }}>
            Library System
          </p>
        </div>
      </div>

      {/* User badge with profile link */}
      <Link
        to="/profile"
        onClick={handleNavigate}
        className="mx-3 mt-3 mb-1 px-3 py-2 rounded-lg flex items-center gap-2 transition-all"
        style={{
          background: isStaff
            ? "rgba(245,158,11,0.08)"
            : "rgba(168,85,247,0.08)",
          border: `1px solid ${isStaff ? "rgba(245,158,11,0.2)" : "rgba(168,85,247,0.2)"}`,
          textDecoration: "none",
        }}
        data-ocid="nav.profile.link"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: isStaff
              ? "linear-gradient(135deg, #f59e0b, #d97706)"
              : "linear-gradient(135deg, #a855f7, #7c3aed)",
            color: isStaff ? "#0d0a1a" : "#f0eeff",
          }}
        >
          {shortPrincipal.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-xs font-semibold truncate"
            style={{ color: "var(--lib-text)" }}
          >
            {shortPrincipal}
          </p>
          <p className="text-xs" style={{ color: "var(--lib-text-muted)" }}>
            {userRoleLabel}
          </p>
        </div>
        <ChevronRight
          size={12}
          style={{ color: "var(--lib-text-muted)", flexShrink: 0 }}
        />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {visibleNavItems.map((item) => (
          <SidebarNavItem
            key={item.label}
            item={item}
            currentPath={currentPath}
            onNavigate={handleNavigate}
          />
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-4 border-t"
        style={{ borderColor: "var(--lib-border)" }}
      >
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{ color: "var(--lib-text-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#E74C6F";
            e.currentTarget.style.background = "rgba(231,76,111,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--lib-text-muted)";
            e.currentTarget.style.background = "transparent";
          }}
          data-ocid="nav.logout.button"
        >
          <LogOut size={16} />
          Sign Out
        </button>
        <p
          className="text-xs mt-3 text-center"
          style={{ color: "var(--lib-text-muted)" }}
        >
          AK Lib v2.0 • 2026
        </p>
      </div>
    </aside>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--lib-bg)" }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 z-50 flex flex-col lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <header
          className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 flex-shrink-0 border-b"
          style={{
            background: "rgba(15, 12, 30, 0.97)",
            borderColor: "var(--lib-border)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg"
              style={{ color: "var(--lib-text-sec)" }}
              onClick={() => setSidebarOpen(true)}
              data-ocid="nav.menu.button"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1
                className="text-lg md:text-xl font-semibold"
                style={{ color: "var(--lib-text)" }}
              >
                AK <span style={{ color: "var(--lib-teal)" }}>Lib</span>
              </h1>
              <p
                className="text-xs hidden sm:block"
                style={{ color: "var(--lib-text-muted)" }}
              >
                Library Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              className="p-1.5 md:p-2 rounded-lg relative"
              style={{
                color: "var(--lib-text-sec)",
                background: "rgba(46, 37, 80, 0.5)",
              }}
              data-ocid="topbar.bell.button"
            >
              <Bell size={16} className="md:w-[18px] md:h-[18px]" />
              <span
                className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--lib-teal)" }}
              />
            </button>
            {isStaff && (
              <button
                type="button"
                className="hidden sm:flex p-2 rounded-lg"
                style={{
                  color: "var(--lib-text-sec)",
                  background: "rgba(46, 37, 80, 0.5)",
                }}
                onClick={() => navigate({ to: "/settings" })}
                data-ocid="topbar.settings.button"
              >
                <Settings size={18} />
              </button>
            )}
            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-2.5 pl-3 border-l"
              style={{
                borderColor: "var(--lib-border)",
                textDecoration: "none",
              }}
              data-ocid="topbar.profile.link"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{
                  background: isStaff
                    ? "linear-gradient(135deg, #f59e0b, #d97706)"
                    : "linear-gradient(135deg, #a855f7, #7c3aed)",
                  color: isStaff ? "#0d0a1a" : "#f0eeff",
                }}
              >
                {shortPrincipal.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--lib-text)" }}
                >
                  {shortPrincipal}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--lib-text-muted)" }}
                >
                  {userRoleLabel}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main
          className="flex-1 overflow-y-auto pb-nav-safe lg:pb-0"
          onFocus={() => setCurrentPath(window.location.pathname)}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentPath={currentPath}
        isStudent={isStudent}
        onNavigate={handleMobileNavigate}
        onOpenSidebar={() => setSidebarOpen(true)}
      />
    </div>
  );
}
