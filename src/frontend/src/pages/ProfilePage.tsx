import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Book,
  BookOpen,
  Building2,
  Calendar,
  DoorOpen,
  GraduationCap,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Issue } from "../backend.d";
import libraryBooks from "../data/libraryBooks.json";
import studentRecords from "../data/studentRecords.json";
import { useActor } from "../hooks/useActor";
import { getDemoSession } from "../utils/demoAuth";

const TOTAL_BOOKS = libraryBooks.length;
const TOTAL_STUDENTS = studentRecords.length;

interface StaffDetail {
  displayName: string;
  role: string;
  department: string;
  initials: string;
  color: string;
}

const STAFF_DETAILS: Record<string, StaffDetail> = {
  admin: {
    displayName: "Administrator",
    role: "System Administrator",
    department: "Library Administration",
    initials: "AD",
    color: "#E74C6F",
  },
  librarian: {
    displayName: "Ms. Ranjitha Iyer",
    role: "Chief Librarian",
    department: "Main Library",
    initials: "RI",
    color: "#f59e0b",
  },
  STF001: {
    displayName: "Library Staff - Priya Nair",
    role: "Library Staff",
    department: "Circulation Desk",
    initials: "PN",
    color: "#22B7AD",
  },
  STF002: {
    displayName: "Library Staff - Ravi Kumar",
    role: "Library Staff",
    department: "Acquisitions & Cataloguing",
    initials: "RK",
    color: "#7B5EA7",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const session = getDemoSession();
  const { actor } = useActor();
  const [issuedBooks, setIssuedBooks] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);

  const isStudent = session?.role === "Student";

  // Look up student record
  const studentRecord = isStudent
    ? (studentRecords.find((s) => s.registerId === session?.username) ?? null)
    : null;

  const staffDetail = session
    ? (STAFF_DETAILS[session.username] ?? null)
    : null;

  // Fetch issued books for students
  useEffect(() => {
    if (!isStudent || !actor) return;
    setLoadingIssues(true);
    actor
      .getCallerIssuedBooks()
      .then((books) => setIssuedBooks(books))
      .catch(() => setIssuedBooks([]))
      .finally(() => setLoadingIssues(false));
  }, [isStudent, actor]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "#7F93A8" }}>Please log in to view your profile.</p>
      </div>
    );
  }

  const displayName =
    studentRecord?.name ?? staffDetail?.displayName ?? session.displayName;
  const initials = getInitials(displayName);
  const avatarColor = isStudent ? "#a855f7" : (staffDetail?.color ?? "#f59e0b");
  const avatarGradient = isStudent
    ? "linear-gradient(135deg, #a855f7, #7c3aed)"
    : `linear-gradient(135deg, ${avatarColor}, ${avatarColor}cc)`;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lib-card p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 lib-glow"
            style={{
              background: avatarGradient,
              color: isStudent ? "#f0eeff" : "#0d0a1a",
            }}
          >
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2
                className="text-xl font-bold font-display"
                style={{ color: "#E8EEF6" }}
              >
                {displayName}
              </h2>
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                style={{
                  background: isStudent
                    ? "rgba(168,85,247,0.15)"
                    : "rgba(245,158,11,0.15)",
                  color: isStudent ? "#a855f7" : "#f59e0b",
                  border: `1px solid ${isStudent ? "rgba(168,85,247,0.3)" : "rgba(245,158,11,0.3)"}`,
                }}
              >
                {session.role}
              </span>
            </div>

            {isStudent && studentRecord && (
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <GraduationCap size={14} style={{ color: "#22B7AD" }} />
                  <span className="text-sm" style={{ color: "#A9B6C6" }}>
                    {studentRecord.department}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} style={{ color: "#D18A4A" }} />
                  <span className="text-sm" style={{ color: "#A9B6C6" }}>
                    {studentRecord.year}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} style={{ color: "#2ECC9A" }} />
                  <span className="text-sm" style={{ color: "#A9B6C6" }}>
                    ID: {session.username}
                  </span>
                </div>
              </div>
            )}

            {!isStudent && staffDetail && (
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} style={{ color: "#22B7AD" }} />
                  <span className="text-sm" style={{ color: "#A9B6C6" }}>
                    {staffDetail.department}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} style={{ color: "#2ECC9A" }} />
                  <span className="text-sm" style={{ color: "#A9B6C6" }}>
                    {staffDetail.role}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {isStudent ? (
          <>
            <div className="lib-card p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: "#a855f7" }}>
                {loadingIssues
                  ? "…"
                  : issuedBooks.filter((b) => !b.isReturned).length}
              </p>
              <p className="text-xs mt-1" style={{ color: "#7F93A8" }}>
                Books Issued
              </p>
            </div>
            <div className="lib-card p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: "#22B7AD" }}>
                0
              </p>
              <p className="text-xs mt-1" style={{ color: "#7F93A8" }}>
                Library Visits
              </p>
            </div>
            <div className="lib-card p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: "#2ECC9A" }}>
                Active
              </p>
              <p className="text-xs mt-1" style={{ color: "#7F93A8" }}>
                Account Status
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="lib-card p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: "#22B7AD" }}>
                {TOTAL_BOOKS.toLocaleString()}
              </p>
              <p className="text-xs mt-1" style={{ color: "#7F93A8" }}>
                Books in Catalog
              </p>
            </div>
            <div className="lib-card p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: "#D18A4A" }}>
                {TOTAL_STUDENTS.toLocaleString()}
              </p>
              <p className="text-xs mt-1" style={{ color: "#7F93A8" }}>
                Total Students
              </p>
            </div>
            <div className="lib-card p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: "#2ECC9A" }}>
                Active
              </p>
              <p className="text-xs mt-1" style={{ color: "#7F93A8" }}>
                System Status
              </p>
            </div>
          </>
        )}
      </motion.div>

      {/* Student: Currently Issued Books */}
      {isStudent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lib-card overflow-hidden"
        >
          <div
            className="flex items-center gap-3 px-5 py-4 border-b"
            style={{ borderColor: "#22384A" }}
          >
            <BookOpen size={16} style={{ color: "#a855f7" }} />
            <h3
              className="text-base font-semibold"
              style={{ color: "#E8EEF6" }}
            >
              Currently Issued Books
            </h3>
          </div>
          {loadingIssues ? (
            <div className="p-6 text-center" data-ocid="profile.loading_state">
              <div
                className="w-6 h-6 border-2 rounded-full animate-spin mx-auto mb-2"
                style={{
                  borderColor: "#a855f7",
                  borderTopColor: "transparent",
                }}
              />
              <p className="text-sm" style={{ color: "#7F93A8" }}>
                Loading issued books…
              </p>
            </div>
          ) : issuedBooks.filter((b) => !b.isReturned).length === 0 ? (
            <div className="p-8 text-center" data-ocid="profile.empty_state">
              <Book
                size={36}
                className="mx-auto mb-3"
                style={{ color: "#22384A" }}
              />
              <p className="font-medium" style={{ color: "#A9B6C6" }}>
                No books currently issued
              </p>
              <p className="text-sm mt-1" style={{ color: "#7F93A8" }}>
                Visit the Library Catalog to browse available books
              </p>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: "rgba(168,85,247,0.15)",
                  color: "#a855f7",
                  border: "1px solid rgba(168,85,247,0.3)",
                }}
                data-ocid="profile.catalog.link"
              >
                Browse Catalog <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div
              className="divide-y"
              style={{ borderColor: "rgba(34,56,74,0.5)" }}
            >
              {issuedBooks
                .filter((b) => !b.isReturned)
                .map((issue, i) => (
                  <div
                    key={issue.id.toString()}
                    className="px-5 py-3 flex items-center justify-between"
                    data-ocid={`profile.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: "rgba(168,85,247,0.15)",
                          color: "#a855f7",
                        }}
                      >
                        <Book size={14} />
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#E8EEF6" }}
                        >
                          Book #{issue.bookId.toString()}
                        </p>
                        <p className="text-xs" style={{ color: "#7F93A8" }}>
                          Issued:{" "}
                          {new Date(
                            Number(issue.issueDate) / 1_000_000,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="lib-badge-teal text-xs">Active</span>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Staff: Quick Links */}
      {!isStudent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lib-card p-5"
        >
          <h3
            className="text-base font-semibold mb-4"
            style={{ color: "#E8EEF6" }}
          >
            Quick Access
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(session.role === "Admin"
              ? [
                  {
                    label: "User Management",
                    path: "/users",
                    icon: <Users size={18} />,
                    color: "#a855f7",
                  },
                  {
                    label: "Dashboard",
                    path: "/",
                    icon: <LayoutDashboard size={18} />,
                    color: "#22B7AD",
                  },
                  {
                    label: "Reports",
                    path: "/reports",
                    icon: <Book size={18} />,
                    color: "#D18A4A",
                  },
                  {
                    label: "Settings",
                    path: "/settings",
                    icon: <Settings size={18} />,
                    color: "#f59e0b",
                  },
                ]
              : session.role === "Librarian"
                ? [
                    {
                      label: "Books",
                      path: "/books",
                      icon: <Book size={18} />,
                      color: "#22B7AD",
                    },
                    {
                      label: "Issue / Return",
                      path: "/books/issue-return",
                      icon: <BookOpen size={18} />,
                      color: "#2ECC9A",
                    },
                    {
                      label: "User Management",
                      path: "/users",
                      icon: <Users size={18} />,
                      color: "#a855f7",
                    },
                    {
                      label: "Reports",
                      path: "/reports",
                      icon: <LayoutDashboard size={18} />,
                      color: "#D18A4A",
                    },
                  ]
                : [
                    {
                      label: "Entry / Exit",
                      path: "/entry-exit",
                      icon: <DoorOpen size={18} />,
                      color: "#22B7AD",
                    },
                    {
                      label: "Books",
                      path: "/books",
                      icon: <Book size={18} />,
                      color: "#a855f7",
                    },
                    {
                      label: "Dashboard",
                      path: "/",
                      icon: <LayoutDashboard size={18} />,
                      color: "#2ECC9A",
                    },
                    {
                      label: "Settings",
                      path: "/settings",
                      icon: <Settings size={18} />,
                      color: "#D18A4A",
                    },
                  ]
            ).map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-center"
                style={{
                  background: `${link.color}12`,
                  border: `1px solid ${link.color}28`,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${link.color}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${link.color}12`;
                }}
                data-ocid={`profile.quicklink.${i + 1}`}
              >
                <span style={{ color: link.color }}>{link.icon}</span>
                <span
                  className="text-xs font-medium"
                  style={{ color: "#A9B6C6" }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="text-center py-2">
        <p className="text-xs" style={{ color: "#7F93A8" }}>
          &copy; {new Date().getFullYear()}. Built with ❤ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#22B7AD" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
