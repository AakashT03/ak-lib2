import { Save, Settings, Shield, User2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { getDemoSession } from "../utils/demoAuth";

type SettingsTab = "library" | "system" | "account";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("library");
  const demoSession = getDemoSession();

  // Library Profile state
  const [libraryName, setLibraryName] = useState("AK Library");
  const [institution, setInstitution] = useState("AK College of Engineering");
  const [address, setAddress] = useState(
    "AK College Campus, Erode - 638052, Tamil Nadu, India",
  );
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("library@akcollege.edu.in");

  // System Preferences state
  const [classification, setClassification] = useState<"DDC" | "Colon">("DDC");
  const [booksPerPage, setBooksPerPage] = useState(20);
  const [finePerDay, setFinePerDay] = useState(2);
  const [lateAlertDays, setLateAlertDays] = useState(3);

  // Account / Change Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveLibrary = () => {
    toast.success("Library profile saved successfully.");
  };

  const handleSaveSystem = () => {
    toast.success("System preferences updated.");
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    toast.success("Password changed successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "library", label: "Library Profile", icon: <Settings size={15} /> },
    { id: "system", label: "System Preferences", icon: <Shield size={15} /> },
    { id: "account", label: "Account", icon: <User2 size={15} /> },
  ];

  return (
    <div className="p-4 md:p-6" style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          >
            <Settings size={18} className="text-white" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold font-display"
              style={{ color: "var(--lib-text)" }}
            >
              Settings
            </h1>
            <p className="text-sm" style={{ color: "var(--lib-text-muted)" }}>
              Manage library configuration and preferences
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tab Bar */}
      <div
        className="flex gap-1 rounded-xl p-1 mb-6"
        style={{ background: "var(--lib-card)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all"
            style={{
              background:
                activeTab === tab.id
                  ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                  : "transparent",
              color: activeTab === tab.id ? "#f0eeff" : "var(--lib-text-muted)",
              boxShadow:
                activeTab === tab.id
                  ? "0 2px 10px rgba(168,85,247,0.3)"
                  : "none",
            }}
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`settings.${tab.id}.tab`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Library Profile ── */}
      {activeTab === "library" && (
        <motion.div
          key="library"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          data-ocid="settings.library.panel"
        >
          <div className="lib-card p-6 space-y-5">
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--lib-text)" }}
            >
              Library Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="lib-name"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  Library Name
                </label>
                <input
                  id="lib-name"
                  type="text"
                  className="lib-input w-full"
                  value={libraryName}
                  onChange={(e) => setLibraryName(e.target.value)}
                  data-ocid="settings.library_name.input"
                />
              </div>
              <div>
                <label
                  htmlFor="lib-institution"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  Institution
                </label>
                <input
                  id="lib-institution"
                  type="text"
                  className="lib-input w-full"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  data-ocid="settings.institution.input"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="lib-address"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  Address
                </label>
                <textarea
                  id="lib-address"
                  className="lib-input w-full resize-none"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  data-ocid="settings.address.textarea"
                />
              </div>
              <div>
                <label
                  htmlFor="lib-phone"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  Phone Number
                </label>
                <input
                  id="lib-phone"
                  type="tel"
                  className="lib-input w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-ocid="settings.phone.input"
                />
              </div>
              <div>
                <label
                  htmlFor="lib-email"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  Email Address
                </label>
                <input
                  id="lib-email"
                  type="email"
                  className="lib-input w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-ocid="settings.email.input"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="lib-btn-primary flex items-center gap-2 px-6 py-2.5"
                onClick={handleSaveLibrary}
                data-ocid="settings.library.save_button"
              >
                <Save size={15} /> Save Library Profile
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Tab: System Preferences ── */}
      {activeTab === "system" && (
        <motion.div
          key="system"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          data-ocid="settings.system.panel"
        >
          <div className="lib-card p-6 space-y-5">
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--lib-text)" }}
            >
              System Preferences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="sys-classification"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  Default Classification System
                </label>
                <select
                  id="sys-classification"
                  className="lib-input w-full"
                  value={classification}
                  onChange={(e) =>
                    setClassification(e.target.value as "DDC" | "Colon")
                  }
                  data-ocid="settings.classification.select"
                >
                  <option value="DDC">
                    DDC (Dewey Decimal Classification)
                  </option>
                  <option value="Colon">Colon Classification</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="sys-books-per-page"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  Books Per Page
                </label>
                <input
                  id="sys-books-per-page"
                  type="number"
                  className="lib-input w-full"
                  min={5}
                  max={100}
                  value={booksPerPage}
                  onChange={(e) => setBooksPerPage(Number(e.target.value))}
                  data-ocid="settings.books_per_page.input"
                />
              </div>
              <div>
                <label
                  htmlFor="sys-fine-per-day"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  Fine Per Day (₹)
                </label>
                <input
                  id="sys-fine-per-day"
                  type="number"
                  className="lib-input w-full"
                  min={0}
                  max={100}
                  value={finePerDay}
                  onChange={(e) => setFinePerDay(Number(e.target.value))}
                  data-ocid="settings.fine_per_day.input"
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--lib-text-muted)" }}
                >
                  Amount charged per day after due date
                </p>
              </div>
              <div>
                <label
                  htmlFor="sys-late-alert"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--lib-text-sec)" }}
                >
                  Late Return Alert Days
                </label>
                <input
                  id="sys-late-alert"
                  type="number"
                  className="lib-input w-full"
                  min={1}
                  max={30}
                  value={lateAlertDays}
                  onChange={(e) => setLateAlertDays(Number(e.target.value))}
                  data-ocid="settings.late_alert_days.input"
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--lib-text-muted)" }}
                >
                  Days before due date to show reminder
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="lib-btn-primary flex items-center gap-2 px-6 py-2.5"
                onClick={handleSaveSystem}
                data-ocid="settings.system.save_button"
              >
                <Save size={15} /> Save Preferences
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Tab: Account ── */}
      {activeTab === "account" && (
        <motion.div
          key="account"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          data-ocid="settings.account.panel"
        >
          <div className="space-y-4">
            {/* Current User Info */}
            <div className="lib-card p-6">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--lib-text)" }}
              >
                Logged In As
              </h2>
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                    color: "#f0eeff",
                  }}
                >
                  {demoSession?.displayName?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: "var(--lib-text)" }}
                  >
                    {demoSession?.displayName ?? "Authenticated User"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        background: "rgba(168,85,247,0.15)",
                        color: "var(--lib-teal)",
                        border: "1px solid rgba(168,85,247,0.3)",
                      }}
                    >
                      {demoSession?.role ?? "Staff"}
                    </span>
                    {demoSession?.username && (
                      <span
                        className="text-sm"
                        style={{ color: "var(--lib-text-muted)" }}
                      >
                        ID: {demoSession.username}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="lib-card p-6 space-y-4">
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--lib-text)" }}
              >
                Change Password
              </h2>
              <p className="text-sm" style={{ color: "var(--lib-text-muted)" }}>
                Update your account password. Changes apply to your demo
                session.
              </p>

              <div className="space-y-4 max-w-md">
                <div>
                  <label
                    htmlFor="acc-current-pw"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--lib-text-sec)" }}
                  >
                    Current Password
                  </label>
                  <input
                    id="acc-current-pw"
                    type="password"
                    className="lib-input w-full"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    data-ocid="settings.current_password.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="acc-new-pw"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--lib-text-sec)" }}
                  >
                    New Password
                  </label>
                  <input
                    id="acc-new-pw"
                    type="password"
                    className="lib-input w-full"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    data-ocid="settings.new_password.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="acc-confirm-pw"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--lib-text-sec)" }}
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="acc-confirm-pw"
                    type="password"
                    className="lib-input w-full"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    data-ocid="settings.confirm_password.input"
                  />
                </div>
              </div>

              <button
                type="button"
                className="lib-btn-primary flex items-center gap-2 px-6 py-2.5"
                onClick={handleChangePassword}
                data-ocid="settings.change_password.submit_button"
              >
                <Save size={15} /> Update Password
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <p
        className="text-center text-xs mt-8"
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
    </div>
  );
}
