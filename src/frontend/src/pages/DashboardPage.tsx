import {
  ArrowUpRight,
  BookMarked,
  DoorOpen,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import libraryBooks from "../data/libraryBooks.json";
import { mockActivity, mockUsageTrends } from "../data/mockData";
import studentRecords from "../data/studentRecords.json";

// Real stats computed from loaded data
const TOTAL_BOOKS = libraryBooks.length;
const TOTAL_STUDENTS = studentRecords.length;

const DEPT_COLORS = [
  "#22B7AD",
  "#7B5EA7",
  "#D18A4A",
  "#2ECC9A",
  "#E74C6F",
  "#a855f7",
  "#f59e0b",
  "#60a5fa",
];

const KPICard = ({
  icon,
  label,
  value,
  delta,
  deltaLabel,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delta?: string;
  deltaLabel?: string;
  color: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="lib-card p-5"
    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <p
          className="text-xs font-medium uppercase tracking-wider mb-1"
          style={{ color: "#7F93A8" }}
        >
          {label}
        </p>
      </div>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}22`, color }}
      >
        {icon}
      </div>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-3xl font-bold" style={{ color: "#E8EEF6" }}>
          {value}
        </p>
        {delta && (
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight size={12} style={{ color: "#2ECC9A" }} />
            <span className="text-xs" style={{ color: "#2ECC9A" }}>
              {delta}
            </span>
            <span className="text-xs" style={{ color: "#7F93A8" }}>
              {deltaLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const ActivityIcon = ({ type }: { type: string }) => {
  const configs: Record<string, { bg: string; icon: string }> = {
    issue: { bg: "#22B7AD", icon: "📤" },
    return: { bg: "#2ECC9A", icon: "📥" },
    entry: { bg: "#D18A4A", icon: "🚪" },
    exit: { bg: "#7F93A8", icon: "🚶" },
    acquisition: { bg: "#7B5EA7", icon: "📦" },
    new_user: { bg: "#E74C6F", icon: "👤" },
  };
  const config = configs[type] || configs.issue;
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
      style={{
        background: `${config.bg}22`,
        border: `1px solid ${config.bg}44`,
      }}
    >
      {config.icon}
    </div>
  );
};

export default function DashboardPage() {
  // Compute department distribution from real book data
  const deptDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const book of libraryBooks) {
      counts[book.department] = (counts[book.department] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([dept, count], i) => ({
        dept: dept.length > 18 ? `${dept.slice(0, 16)}…` : dept,
        fullDept: dept,
        count,
        pct: Math.round((count / TOTAL_BOOKS) * 100 * 10) / 10,
        color: DEPT_COLORS[i % DEPT_COLORS.length],
      }));
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          icon={<BookMarked size={20} />}
          label="Total Books"
          value={TOTAL_BOOKS.toLocaleString()}
          delta="+127"
          deltaLabel="this month"
          color="#22B7AD"
          delay={0}
        />
        <KPICard
          icon={<Users size={20} />}
          label="Registered Students"
          value={TOTAL_STUDENTS.toLocaleString()}
          delta="+38"
          deltaLabel="this week"
          color="#D18A4A"
          delay={0.1}
        />
        <KPICard
          icon={<BookMarked size={20} />}
          label="Books Issued Today"
          value="47"
          delta="+12"
          deltaLabel="vs yesterday"
          color="#2ECC9A"
          delay={0.2}
        />
        <KPICard
          icon={<DoorOpen size={20} />}
          label="Library Entries Today"
          value="213"
          delta="+34"
          deltaLabel="vs yesterday"
          color="#7B5EA7"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Usage Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lib-card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className="text-base font-semibold"
                style={{ color: "#E8EEF6" }}
              >
                Usage Trends
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "#7F93A8" }}>
                Monthly library entries vs books issued
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-0.5 rounded"
                  style={{ background: "#22B7AD" }}
                />
                <span style={{ color: "#A9B6C6" }}>Entries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-0.5 rounded"
                  style={{ background: "#D18A4A" }}
                />
                <span style={{ color: "#A9B6C6" }}>Issued</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={mockUsageTrends}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22B7AD" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22B7AD" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D18A4A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D18A4A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1E3142"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#7F93A8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#7F93A8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1A2D3E",
                  border: "1px solid #22384A",
                  borderRadius: "8px",
                  color: "#E8EEF6",
                }}
                itemStyle={{ color: "#A9B6C6" }}
              />
              <Area
                type="monotone"
                dataKey="entries"
                stroke="#22B7AD"
                strokeWidth={2}
                fill="url(#tealGrad)"
                dot={{ fill: "#22B7AD", strokeWidth: 0, r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="issued"
                stroke="#D18A4A"
                strokeWidth={2}
                fill="url(#orangeGrad)"
                dot={{ fill: "#D18A4A", strokeWidth: 0, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lib-card p-5"
        >
          <h3
            className="text-base font-semibold mb-4"
            style={{ color: "#E8EEF6" }}
          >
            Recent Activity
          </h3>
          <div className="space-y-3 overflow-y-auto max-h-72">
            {mockActivity.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-start gap-3"
                data-ocid={`activity.item.${i + 1}`}
              >
                <ActivityIcon type={item.type} />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs leading-snug"
                    style={{ color: "#A9B6C6" }}
                  >
                    {item.message}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#7F93A8" }}>
                    {item.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Department Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="lib-card p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3
              className="text-base font-semibold"
              style={{ color: "#E8EEF6" }}
            >
              Department Distribution
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#7F93A8" }}>
              Top 8 departments by book count (from{" "}
              {TOTAL_BOOKS.toLocaleString()} total)
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} style={{ color: "#22B7AD" }} />
            <span className="text-xs" style={{ color: "#22B7AD" }}>
              {libraryBooks.length > 0
                ? new Set(libraryBooks.map((b) => b.department)).size
                : 0}{" "}
              departments
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart */}
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={deptDistribution}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1E3142"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#7F93A8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="dept"
                tick={{ fill: "#A9B6C6", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  background: "#1A2D3E",
                  border: "1px solid #22384A",
                  borderRadius: "8px",
                  color: "#E8EEF6",
                  fontSize: 12,
                }}
                formatter={(
                  value: number,
                  _name: string,
                  props: { payload?: { fullDept?: string } },
                ) => [
                  `${value.toLocaleString()} books`,
                  props.payload?.fullDept || "",
                ]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {deptDistribution.map((entry, i) => (
                  <Cell
                    key={entry.dept}
                    fill={DEPT_COLORS[i % DEPT_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Progress bars list */}
          <div className="space-y-3">
            {deptDistribution.map((d, i) => (
              <div key={d.dept} data-ocid={`dashboard.dept.item.${i + 1}`}>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs font-medium truncate pr-2"
                    style={{ color: "#A9B6C6" }}
                    title={d.fullDept}
                  >
                    {d.dept}
                  </span>
                  <span
                    className="text-xs font-mono flex-shrink-0"
                    style={{ color: d.color }}
                  >
                    {d.count.toLocaleString()}
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-1.5"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${d.pct}%`,
                      background: d.color,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Available Books",
            value: Math.round(TOTAL_BOOKS * 0.77).toLocaleString(),
            color: "#2ECC9A",
          },
          { label: "Books Overdue", value: "23", color: "#E74C6F" },
          { label: "New Acquisitions", value: "127", color: "#D18A4A" },
          { label: "E-Resources", value: "10", color: "#22B7AD" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="lib-card p-4 text-center"
            data-ocid={`dashboard.stats.item.${i + 1}`}
          >
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs mt-1" style={{ color: "#7F93A8" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Footer */}
      <footer className="text-center py-4">
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
