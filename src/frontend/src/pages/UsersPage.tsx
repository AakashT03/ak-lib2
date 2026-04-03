import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  User,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import studentRecords from "../data/studentRecords.json";

const PAGE_SIZE = 50;

type UserRole = "Admin" | "Librarian" | "LibraryStaff" | "Student";

interface UserRecord {
  registerId: string;
  name: string;
  department: string;
  year: string;
  role: UserRole;
}

const STAFF_RECORDS: UserRecord[] = [
  {
    registerId: "ADMIN",
    name: "Administrator",
    department: "Library Administration",
    year: "-",
    role: "Admin",
  },
  {
    registerId: "librarian",
    name: "Ms. Ranjitha Iyer",
    department: "Main Library",
    year: "-",
    role: "Librarian",
  },
  {
    registerId: "STF001",
    name: "Library Staff - Priya Nair",
    department: "Library",
    year: "-",
    role: "LibraryStaff",
  },
  {
    registerId: "STF002",
    name: "Library Staff - Ravi Kumar",
    department: "Library",
    year: "-",
    role: "LibraryStaff",
  },
];

const ALL_USERS: UserRecord[] = [
  ...STAFF_RECORDS,
  ...studentRecords.map((s) => ({
    registerId: s.registerId,
    name: s.name,
    department: s.department,
    year: s.year,
    role: "Student" as UserRole,
  })),
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_USERS.filter((u) => {
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.registerId.toLowerCase().includes(q);
      const matchRole = !roleFilter || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [search, roleFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageEnd);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleFilter = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

  const getRoleIcon = (role: UserRole) => {
    if (role === "Admin")
      return <Shield size={13} style={{ color: "#E74C6F" }} />;
    if (role === "Librarian")
      return <BookOpen size={13} style={{ color: "#22B7AD" }} />;
    if (role === "LibraryStaff")
      return <User size={13} style={{ color: "#f59e0b" }} />;
    return <User size={13} style={{ color: "#a855f7" }} />;
  };

  const getRoleBadge = (role: UserRole) => {
    if (role === "Admin")
      return { bg: "rgba(231,76,111,0.15)", color: "#E74C6F" };
    if (role === "Librarian")
      return { bg: "rgba(34,183,173,0.15)", color: "#22B7AD" };
    if (role === "LibraryStaff")
      return { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" };
    return { bg: "rgba(168,85,247,0.15)", color: "#a855f7" };
  };

  const studentCount = ALL_USERS.filter((u) => u.role === "Student").length;
  const staffCount = ALL_USERS.filter((u) => u.role !== "Student").length;

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-xl font-semibold font-display"
            style={{ color: "#E8EEF6" }}
          >
            User Management
          </h2>
          <p className="text-sm" style={{ color: "#7F93A8" }}>
            {ALL_USERS.length.toLocaleString()} registered users across all
            roles
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Users",
            value: ALL_USERS.length,
            icon: <Users size={18} />,
            color: "#22B7AD",
          },
          {
            label: "Students",
            value: studentCount,
            icon: <User size={18} />,
            color: "#a855f7",
          },
          {
            label: "Staff",
            value: staffCount,
            icon: <Shield size={18} />,
            color: "#f59e0b",
          },
        ].map((s) => (
          <div key={s.label} className="lib-card p-4 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: `${s.color}22`, color: s.color }}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: "#E8EEF6" }}>
                {s.value.toLocaleString()}
              </p>
              <p className="text-xs" style={{ color: "#7F93A8" }}>
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#7F93A8" }}
          />
          <input
            type="text"
            className="lib-input w-full pl-9"
            placeholder="Search by name or register ID..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            data-ocid="users.search_input"
          />
        </div>
        <select
          className="lib-input"
          value={roleFilter}
          onChange={(e) => handleRoleFilter(e.target.value)}
          data-ocid="users.role.select"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Librarian">Librarian</option>
          <option value="LibraryStaff">Library Staff</option>
          <option value="Student">Student</option>
        </select>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "#7F93A8" }}>
          Showing {filtered.length > 0 ? pageStart + 1 : 0}–
          {Math.min(pageEnd, filtered.length)} of{" "}
          <span style={{ color: "#22B7AD", fontWeight: 600 }}>
            {filtered.length.toLocaleString()}
          </span>{" "}
          users
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg disabled:opacity-40"
              style={{ background: "rgba(46,37,80,0.5)", color: "#A9B6C6" }}
              data-ocid="users.pagination_prev"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm px-2" style={{ color: "#A9B6C6" }}>
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg disabled:opacity-40"
              style={{ background: "rgba(46,37,80,0.5)", color: "#A9B6C6" }}
              data-ocid="users.pagination_next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="lib-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12" data-ocid="users.empty_state">
            <Users
              className="w-10 h-10 mx-auto mb-2"
              style={{ color: "#22384A" }}
            />
            <p style={{ color: "#7F93A8" }}>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #22384A" }}>
                  {["Name", "Register ID", "Department", "Year", "Role"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#7F93A8" }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {paginated.map((user, i) => {
                  const roleBadge = getRoleBadge(user.role);
                  return (
                    <motion.tr
                      key={user.registerId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(i * 0.01, 0.3) }}
                      style={{ borderBottom: "1px solid rgba(34,56,74,0.5)" }}
                      data-ocid={`users.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                              background: roleBadge.bg,
                              color: roleBadge.color,
                            }}
                          >
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#E8EEF6" }}
                          >
                            {user.name}
                          </p>
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 text-sm font-mono"
                        style={{ color: "#22B7AD" }}
                      >
                        {user.registerId}
                      </td>
                      <td
                        className="px-4 py-3 text-xs"
                        style={{ color: "#A9B6C6" }}
                      >
                        {user.department}
                      </td>
                      <td
                        className="px-4 py-3 text-xs"
                        style={{ color: "#A9B6C6" }}
                      >
                        {user.year}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded w-fit"
                          style={{
                            background: roleBadge.bg,
                            color: roleBadge.color,
                          }}
                        >
                          {getRoleIcon(user.role)}{" "}
                          {user.role === "LibraryStaff"
                            ? "Library Staff"
                            : user.role}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm disabled:opacity-40 transition-colors"
            style={{ background: "rgba(46,37,80,0.5)", color: "#A9B6C6" }}
            data-ocid="users.pagination_prev"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-sm" style={{ color: "#7F93A8" }}>
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm disabled:opacity-40 transition-colors"
            style={{ background: "rgba(46,37,80,0.5)", color: "#A9B6C6" }}
            data-ocid="users.pagination_next"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
