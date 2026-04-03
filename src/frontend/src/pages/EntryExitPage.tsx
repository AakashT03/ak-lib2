import {
  Calendar,
  CheckCircle2,
  Clock,
  DoorOpen,
  Download,
  LogIn,
  LogOut,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { mockEntryLogs } from "../data/mockData";
import { useMarkGateExit, useRecordGateEntry } from "../hooks/useQueries";
import { getDemoSession } from "../utils/demoAuth";

export default function EntryExitPage() {
  const [dateFilter, setDateFilter] = useState("2026-04-02");
  const [markedEntry, setMarkedEntry] = useState(false);
  const [markedExit, setMarkedExit] = useState(false);
  const [recordStudentId, setRecordStudentId] = useState("");
  const [exitEntryId, setExitEntryId] = useState("");

  const session = getDemoSession();
  const isStaff = session ? session.role !== "Student" : true;

  const recordEntryMutation = useRecordGateEntry();
  const markExitMutation = useMarkGateExit();

  const todayLogs = mockEntryLogs.filter((l) => l.date === dateFilter);
  const presentCount = todayLogs.filter((l) => !l.exitTime).length;
  const exitedCount = todayLogs.filter((l) => l.exitTime).length;

  const handleMarkEntry = () => {
    setMarkedEntry(true);
    toast.success("Entry marked successfully! Welcome to AK Lib.");
  };

  const handleMarkExit = () => {
    setMarkedExit(true);
    toast.success("Exit marked. Thank you for visiting!");
  };

  const handleRecordEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordStudentId.trim()) return;
    try {
      const entryId = await recordEntryMutation.mutateAsync(
        recordStudentId.trim(),
      );
      toast.success(`Entry recorded! Entry ID: ${entryId.toString()}`);
      setRecordStudentId("");
    } catch {
      toast.error("Failed to record entry. Please check the student ID.");
    }
  };

  const handleMarkExitById = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitEntryId.trim()) return;
    try {
      const success = await markExitMutation.mutateAsync(
        BigInt(exitEntryId.trim()),
      );
      if (success) {
        toast.success("Exit recorded successfully.");
        setExitEntryId("");
      } else {
        toast.error("Could not record exit. Entry ID may be invalid.");
      }
    } catch {
      toast.error("Failed to record exit. Please try again.");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "#E8EEF6" }}>
            Entry / Exit Tracking
          </h2>
          <p className="text-sm" style={{ color: "#7F93A8" }}>
            Gate management and visitor logs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            className="lib-input text-sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            data-ocid="entryexit.date.input"
          />
          <button
            type="button"
            className="lib-btn-secondary flex items-center gap-2 text-sm"
            onClick={() => toast.info("Export feature coming soon")}
            data-ocid="entryexit.export.button"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="lib-card p-4 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(34,183,173,0.15)" }}
          >
            <Users size={20} style={{ color: "#22B7AD" }} />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#E8EEF6" }}>
              {todayLogs.length}
            </p>
            <p className="text-xs" style={{ color: "#7F93A8" }}>
              Total Visitors
            </p>
          </div>
        </div>
        <div className="lib-card p-4 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(46,204,154,0.15)" }}
          >
            <LogIn size={20} style={{ color: "#2ECC9A" }} />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#E8EEF6" }}>
              {presentCount}
            </p>
            <p className="text-xs" style={{ color: "#7F93A8" }}>
              Currently Present
            </p>
          </div>
        </div>
        <div className="lib-card p-4 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(209,138,74,0.15)" }}
          >
            <LogOut size={20} style={{ color: "#D18A4A" }} />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#E8EEF6" }}>
              {exitedCount}
            </p>
            <p className="text-xs" style={{ color: "#7F93A8" }}>
              Exited
            </p>
          </div>
        </div>
      </div>

      {/* Staff: Record Gate Entry/Exit Form */}
      {isStaff && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Record Entry */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lib-card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <LogIn size={16} style={{ color: "#22B7AD" }} />
              <h3
                className="text-base font-semibold"
                style={{ color: "#E8EEF6" }}
              >
                Record Gate Entry
              </h3>
            </div>
            <form onSubmit={handleRecordEntry} className="flex gap-2">
              <input
                type="text"
                className="lib-input flex-1"
                placeholder="Student Register ID…"
                value={recordStudentId}
                onChange={(e) => setRecordStudentId(e.target.value)}
                data-ocid="entryexit.studentid.input"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                style={{
                  background: recordEntryMutation.isPending
                    ? "rgba(34,183,173,0.1)"
                    : "rgba(34,183,173,0.2)",
                  color: "#22B7AD",
                  border: "1px solid rgba(34,183,173,0.35)",
                }}
                disabled={
                  recordEntryMutation.isPending || !recordStudentId.trim()
                }
                data-ocid="entryexit.record_entry.primary_button"
              >
                {recordEntryMutation.isPending ? (
                  <div
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{
                      borderColor: "#22B7AD",
                      borderTopColor: "transparent",
                    }}
                  />
                ) : (
                  <CheckCircle2 size={15} />
                )}
                Record
              </button>
            </form>
          </motion.div>

          {/* Mark Exit */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lib-card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <LogOut size={16} style={{ color: "#D18A4A" }} />
              <h3
                className="text-base font-semibold"
                style={{ color: "#E8EEF6" }}
              >
                Mark Gate Exit
              </h3>
            </div>
            <form onSubmit={handleMarkExitById} className="flex gap-2">
              <input
                type="text"
                className="lib-input flex-1"
                placeholder="Entry ID (number)…"
                value={exitEntryId}
                onChange={(e) => setExitEntryId(e.target.value)}
                data-ocid="entryexit.entryid.input"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                style={{
                  background: markExitMutation.isPending
                    ? "rgba(209,138,74,0.1)"
                    : "rgba(209,138,74,0.2)",
                  color: "#D18A4A",
                  border: "1px solid rgba(209,138,74,0.35)",
                }}
                disabled={markExitMutation.isPending || !exitEntryId.trim()}
                data-ocid="entryexit.mark_exit.primary_button"
              >
                {markExitMutation.isPending ? (
                  <div
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{
                      borderColor: "#D18A4A",
                      borderTopColor: "transparent",
                    }}
                  />
                ) : (
                  <LogOut size={15} />
                )}
                Exit
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Student: Mark Entry / Exit */}
      {!isStaff && (
        <div className="lib-card p-5">
          <h3
            className="text-base font-semibold mb-4"
            style={{ color: "#E8EEF6" }}
          >
            My Visit
          </h3>
          <div className="flex gap-4">
            <button
              type="button"
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all ${markedEntry ? "opacity-60" : ""}`}
              style={{
                background: markedEntry
                  ? "rgba(46,204,154,0.1)"
                  : "rgba(34,183,173,0.15)",
                color: markedEntry ? "#2ECC9A" : "#22B7AD",
                border: `1px solid ${markedEntry ? "#2ECC9A44" : "#22B7AD44"}`,
              }}
              onClick={handleMarkEntry}
              disabled={markedEntry}
              data-ocid="entryexit.entry.primary_button"
            >
              <LogIn size={18} />{" "}
              {markedEntry ? "Entry Marked ✓" : "Mark Entry"}
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all ${markedExit ? "opacity-60" : ""}`}
              style={{
                background: "rgba(209,138,74,0.15)",
                color: "#D18A4A",
                border: "1px solid #D18A4A44",
              }}
              onClick={handleMarkExit}
              disabled={!markedEntry || markedExit}
              data-ocid="entryexit.exit.primary_button"
            >
              <LogOut size={18} /> {markedExit ? "Exit Marked ✓" : "Mark Exit"}
            </button>
          </div>
        </div>
      )}

      {/* Entry Log Table */}
      <div className="lib-card overflow-hidden">
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "#22384A" }}
        >
          <h3 className="text-base font-semibold" style={{ color: "#E8EEF6" }}>
            Entry Log
          </h3>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "#7F93A8" }}
          >
            <Calendar size={13} /> {dateFilter}
          </div>
        </div>
        {todayLogs.length === 0 ? (
          <div className="text-center py-12" data-ocid="entryexit.empty_state">
            <DoorOpen
              className="w-10 h-10 mx-auto mb-2"
              style={{ color: "#22384A" }}
            />
            <p style={{ color: "#7F93A8" }}>No entries for this date</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #22384A" }}>
                  {[
                    "Register No.",
                    "Name",
                    "Department",
                    "Entry Time",
                    "Exit Time",
                    "Duration",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#7F93A8" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayLogs.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: "1px solid rgba(34,56,74,0.5)" }}
                    data-ocid={`entryexit.item.${i + 1}`}
                  >
                    <td
                      className="px-4 py-3 text-sm font-medium"
                      style={{ color: "#22B7AD" }}
                    >
                      {log.registerNumber}
                    </td>
                    <td
                      className="px-4 py-3 text-sm"
                      style={{ color: "#E8EEF6" }}
                    >
                      {log.name}
                    </td>
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "#A9B6C6" }}
                    >
                      {log.department}
                    </td>
                    <td
                      className="px-4 py-3 text-sm"
                      style={{ color: "#A9B6C6" }}
                    >
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {log.entryTime}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 text-sm"
                      style={{ color: "#A9B6C6" }}
                    >
                      {log.exitTime || (
                        <span style={{ color: "#D18A4A" }}>Present</span>
                      )}
                    </td>
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "#7F93A8" }}
                    >
                      {log.duration || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {log.exitTime ? (
                        <span className="lib-badge-available">Exited</span>
                      ) : (
                        <span className="lib-badge-teal">Present</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
