import { BarChart2, Download, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  mockCategoryDistribution,
  mockIssuedByMonth,
  mockTopBooks,
} from "../data/mockData";

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "#E8EEF6" }}>
            Reports & Analytics
          </h2>
          <p className="text-sm" style={{ color: "#7F93A8" }}>
            Library usage and book circulation insights
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="lib-btn-secondary flex items-center gap-2 text-sm"
            onClick={() => toast.info("PDF export coming soon")}
            data-ocid="reports.export_pdf.button"
          >
            <Download size={14} /> Export PDF
          </button>
          <button
            type="button"
            className="lib-btn-secondary flex items-center gap-2 text-sm"
            onClick={() => toast.info("Excel export coming soon")}
            data-ocid="reports.export_excel.button"
          >
            <Download size={14} /> Export Excel
          </button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Issued vs Returned by Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lib-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} style={{ color: "#22B7AD" }} />
            <h3
              className="text-base font-semibold"
              style={{ color: "#E8EEF6" }}
            >
              Books Issued vs Returned
            </h3>
          </div>
          <p className="text-xs mb-4" style={{ color: "#7F93A8" }}>
            Monthly circulation statistics
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={mockIssuedByMonth}
              margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
            >
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
              />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#A9B6C6" }} />
              <Bar
                dataKey="issued"
                name="Issued"
                fill="#22B7AD"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="returned"
                name="Returned"
                fill="#D18A4A"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lib-card p-5"
        >
          <h3
            className="text-base font-semibold mb-2"
            style={{ color: "#E8EEF6" }}
          >
            Category Distribution
          </h3>
          <p className="text-xs mb-2" style={{ color: "#7F93A8" }}>
            Books by subject category
          </p>
          <div className="flex items-center">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie
                  data={mockCategoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="count"
                  nameKey="category"
                >
                  {mockCategoryDistribution.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1A2D3E",
                    border: "1px solid #22384A",
                    borderRadius: "8px",
                    color: "#E8EEF6",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5 ml-2">
              {mockCategoryDistribution.slice(0, 6).map((item) => (
                <div key={item.category} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="text-xs" style={{ color: "#A9B6C6" }}>
                    {item.category}
                  </span>
                  <span
                    className="text-xs ml-auto"
                    style={{ color: "#7F93A8" }}
                  >
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top 10 Books */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lib-card overflow-hidden"
      >
        <div
          className="flex items-center gap-2 px-5 py-4 border-b"
          style={{ borderColor: "#22384A" }}
        >
          <TrendingUp size={16} style={{ color: "#2ECC9A" }} />
          <h3 className="text-base font-semibold" style={{ color: "#E8EEF6" }}>
            Top 10 Most Issued Books
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #22384A" }}>
                {["Rank", "Title", "Author", "Category", "Times Issued"].map(
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
              {mockTopBooks.map((book, i) => (
                <motion.tr
                  key={book.rank}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: "1px solid rgba(34,56,74,0.5)" }}
                  data-ocid={`reports.topbooks.item.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background:
                          book.rank <= 3
                            ? "rgba(34,183,173,0.2)"
                            : "rgba(34,56,74,0.5)",
                        color: book.rank <= 3 ? "#22B7AD" : "#7F93A8",
                      }}
                    >
                      {book.rank}
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-medium"
                    style={{ color: "#E8EEF6" }}
                  >
                    {book.title}
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "#A9B6C6" }}
                  >
                    {book.author}
                  </td>
                  <td className="px-4 py-3">
                    <span className="lib-badge-teal">{book.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex-1 h-1.5 rounded-full"
                        style={{ background: "#1E3142" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(book.timesIssued / 47) * 100}%`,
                            background: "#22B7AD",
                          }}
                        />
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#2ECC9A" }}
                      >
                        {book.timesIssued}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
