import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  authenticateDemo,
  getDemoSession,
  saveDemoSession,
} from "../utils/demoAuth";

type LoginTab = "student" | "staff";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn, identity, isInitializing } =
    useInternetIdentity();

  const [activeTab, setActiveTab] = useState<LoginTab>("student");

  // Student login state
  const [studentId, setStudentId] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentError, setStudentError] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);

  // Staff login state
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffError, setStaffError] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);

  const handleStudentLogin = () => {
    setStudentError("");
    if (!studentId || !studentPassword) {
      setStudentError("Please enter your College Register ID and password.");
      return;
    }
    setStudentLoading(true);
    setTimeout(() => {
      const user = authenticateDemo(studentId, studentPassword);
      if (!user) {
        setStudentError("Invalid Register ID or password. Please try again.");
        setStudentLoading(false);
        return;
      }
      if (user.role !== "Student") {
        setStudentError(
          "This ID belongs to a staff account. Please use the Staff / Admin Login tab.",
        );
        setStudentLoading(false);
        return;
      }
      saveDemoSession(user);
      navigate({ to: "/" });
    }, 400);
  };

  const handleStaffLogin = () => {
    setStaffError("");
    if (!staffUsername || !staffPassword) {
      setStaffError("Please enter your Staff ID / Username and password.");
      return;
    }
    setStaffLoading(true);
    setTimeout(() => {
      const user = authenticateDemo(staffUsername, staffPassword);
      if (!user) {
        setStaffError("Invalid credentials. Please try again.");
        setStaffLoading(false);
        return;
      }
      if (user.role === "Student") {
        setStaffError(
          "This is a student account. Please use the Student Login tab.",
        );
        setStaffLoading(false);
        return;
      }
      saveDemoSession(user);
      navigate({ to: "/" });
    }, 400);
  };

  if ((identity && !isInitializing) || getDemoSession()) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--lib-bg)" }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #a855f7, transparent)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #f59e0b, transparent)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--lib-grid) 1px, transparent 1px), linear-gradient(90deg, var(--lib-grid) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.4,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 lib-glow"
            style={{
              background: "linear-gradient(135deg, #a855f7, #7c3aed)",
              boxShadow: "0 0 40px rgba(168,85,247,0.4)",
            }}
          >
            <BookOpen className="w-8 h-8 text-white" />
          </motion.div>
          <h1
            className="text-3xl font-bold font-display mb-1"
            style={{ color: "var(--lib-text)" }}
          >
            AK <span style={{ color: "var(--lib-teal)" }}>Lib</span>
          </h1>
          <p className="text-sm" style={{ color: "var(--lib-text-muted)" }}>
            AK College Library Management System
          </p>
        </div>

        {/* Login Card */}
        <div
          className="lib-card p-8"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
        >
          <h2
            className="text-xl font-semibold mb-5"
            style={{ color: "var(--lib-text)" }}
          >
            Sign In
          </h2>

          {/* ── Tab Switcher ── */}
          <div
            className="flex rounded-lg p-1 mb-6 gap-1"
            style={{ background: "var(--lib-bg)" }}
          >
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-semibold transition-all"
              style={{
                background:
                  activeTab === "student"
                    ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                    : "transparent",
                color:
                  activeTab === "student" ? "#f0eeff" : "var(--lib-text-muted)",
                boxShadow:
                  activeTab === "student"
                    ? "0 2px 12px rgba(168,85,247,0.35)"
                    : "none",
              }}
              onClick={() => {
                setActiveTab("student");
                setStudentError("");
              }}
              data-ocid="login.student.tab"
            >
              <GraduationCap size={15} />
              Student Login
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-semibold transition-all"
              style={{
                background:
                  activeTab === "staff"
                    ? "linear-gradient(135deg, #f59e0b, #d97706)"
                    : "transparent",
                color:
                  activeTab === "staff" ? "#0d0a1a" : "var(--lib-text-muted)",
                boxShadow:
                  activeTab === "staff"
                    ? "0 2px 12px rgba(245,158,11,0.35)"
                    : "none",
              }}
              onClick={() => {
                setActiveTab("staff");
                setStaffError("");
              }}
              data-ocid="login.staff.tab"
            >
              <ShieldCheck size={15} />
              Staff / Admin Login
            </button>
          </div>

          {/* ── Student Login Form ── */}
          {activeTab === "student" && (
            <motion.div
              key="student"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {/* Register ID */}
              <div>
                <label
                  htmlFor="student-id"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  College Register ID
                </label>
                <div className="relative">
                  <GraduationCap
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "var(--lib-text-muted)" }}
                  />
                  <input
                    id="student-id"
                    type="text"
                    className="lib-input w-full pl-9"
                    placeholder="Enter your Register ID"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      setStudentError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleStudentLogin()}
                    autoComplete="username"
                    data-ocid="login.student.input"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="student-password"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "var(--lib-text-muted)" }}
                  />
                  <input
                    id="student-password"
                    type="password"
                    className="lib-input w-full pl-9"
                    placeholder="Enter your password"
                    value={studentPassword}
                    onChange={(e) => {
                      setStudentPassword(e.target.value);
                      setStudentError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleStudentLogin()}
                    autoComplete="current-password"
                    data-ocid="login.student.textarea"
                  />
                </div>
              </div>

              {studentError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{
                    color: "#E74C6F",
                    background: "rgba(231,76,111,0.1)",
                    border: "1px solid rgba(231,76,111,0.2)",
                  }}
                  data-ocid="login.student.error_state"
                >
                  {studentError}
                </motion.p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleStudentLogin}
                disabled={studentLoading}
                className="lib-btn-primary w-full flex items-center justify-center gap-2 py-3"
                data-ocid="login.student.submit_button"
              >
                {studentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4" /> Sign In as Student
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* ── Staff / Admin Login Form ── */}
          {activeTab === "staff" && (
            <motion.div
              key="staff"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {/* Staff ID / Username */}
              <div>
                <label
                  htmlFor="staff-username"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  Staff ID / Username
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "var(--lib-text-muted)" }}
                  />
                  <input
                    id="staff-username"
                    type="text"
                    className="lib-input w-full pl-9"
                    placeholder="Enter Staff ID or Username"
                    value={staffUsername}
                    onChange={(e) => {
                      setStaffUsername(e.target.value);
                      setStaffError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleStaffLogin()}
                    autoComplete="username"
                    data-ocid="login.staff.input"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="staff-password"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "var(--lib-text-muted)" }}
                  />
                  <input
                    id="staff-password"
                    type="password"
                    className="lib-input w-full pl-9"
                    placeholder="Enter your password"
                    value={staffPassword}
                    onChange={(e) => {
                      setStaffPassword(e.target.value);
                      setStaffError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleStaffLogin()}
                    autoComplete="current-password"
                    data-ocid="login.staff.textarea"
                  />
                </div>
              </div>

              {staffError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{
                    color: "#E74C6F",
                    background: "rgba(231,76,111,0.1)",
                    border: "1px solid rgba(231,76,111,0.2)",
                  }}
                  data-ocid="login.staff.error_state"
                >
                  {staffError}
                </motion.p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleStaffLogin}
                disabled={staffLoading}
                className="w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-lg transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#0d0a1a",
                  fontSize: "14px",
                }}
                data-ocid="login.staff.submit_button"
              >
                {staffLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Sign In as Staff
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 my-5">
            <div
              className="flex-1 h-px"
              style={{ background: "var(--lib-border)" }}
            />
            <span
              className="text-xs font-medium px-1"
              style={{ color: "var(--lib-text-muted)" }}
            >
              OR
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--lib-border)" }}
            />
          </div>

          {/* ── Internet Identity Section ── */}
          <div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={login}
              disabled={isLoggingIn}
              className="lib-btn-secondary w-full flex items-center justify-center gap-2 py-3"
              style={{ fontSize: "14px", opacity: isLoggingIn ? 0.8 : 1 }}
              data-ocid="login.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Sign In with Internet Identity
                </>
              )}
            </motion.button>
            <p
              className="text-xs text-center mt-3"
              style={{ color: "var(--lib-text-muted)" }}
            >
              Secured by Internet Computer Protocol (ICP)
            </p>
          </div>
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "var(--lib-text-muted)" }}
        >
          For access issues, contact your librarian or administrator
        </p>

        {/* Footer */}
        <p
          className="text-center text-xs mt-3"
          style={{ color: "var(--lib-text-muted)", opacity: 0.6 }}
        >
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--lib-teal)" }}
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
