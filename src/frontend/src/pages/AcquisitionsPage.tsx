import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Loader2, Plus, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { mockAcquisitions } from "../data/mockData";

export default function AcquisitionsPage() {
  const [yearFilter, setYearFilter] = useState<number | "">(2026);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredAcq = mockAcquisitions.filter((a) => {
    if (yearFilter && a.year !== yearFilter) return false;
    if (categoryFilter && a.category !== categoryFilter) return false;
    return true;
  });

  const totalSpend = filteredAcq.reduce((s, a) => s + a.totalPrice, 0);
  const totalBooks = filteredAcq.reduce((s, a) => s + a.quantity, 0);

  const categoryStats = mockAcquisitions.reduce<Record<string, number>>(
    (acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + a.quantity;
      return acc;
    },
    {},
  );
  const chartData = Object.entries(categoryStats)
    .map(([category, count]) => ({ category: category.slice(0, 10), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const categories = [...new Set(mockAcquisitions.map((a) => a.category))];

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "#E8EEF6" }}>
            Book Acquisitions
          </h2>
          <p className="text-sm" style={{ color: "#7F93A8" }}>
            Purchase tracking and inventory management
          </p>
        </div>
        <button
          type="button"
          className="lib-btn-primary flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
          data-ocid="acquisitions.add.open_modal_button"
        >
          <Plus size={16} /> Add Acquisition
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="lib-card p-4">
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "#7F93A8" }}
          >
            Total Books Purchased
          </p>
          <p className="text-3xl font-bold" style={{ color: "#E8EEF6" }}>
            {mockAcquisitions
              .reduce((s, a) => s + a.quantity, 0)
              .toLocaleString()}
          </p>
          <p className="text-xs mt-1" style={{ color: "#2ECC9A" }}>
            All time
          </p>
        </div>
        <div className="lib-card p-4">
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "#7F93A8" }}
          >
            This Year (2026)
          </p>
          <p className="text-3xl font-bold" style={{ color: "#E8EEF6" }}>
            {mockAcquisitions
              .filter((a) => a.year === 2026)
              .reduce((s, a) => s + a.quantity, 0)}
          </p>
          <p className="text-xs mt-1" style={{ color: "#22B7AD" }}>
            Books acquired
          </p>
        </div>
        <div className="lib-card p-4">
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "#7F93A8" }}
          >
            Total Spend
          </p>
          <p className="text-3xl font-bold" style={{ color: "#E8EEF6" }}>
            ₹
            {mockAcquisitions
              .reduce((s, a) => s + a.totalPrice, 0)
              .toLocaleString()}
          </p>
          <p className="text-xs mt-1" style={{ color: "#D18A4A" }}>
            All time
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="lib-card p-5">
        <h3
          className="text-base font-semibold mb-4"
          style={{ color: "#E8EEF6" }}
        >
          Category-wise Acquisitions
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1E3142"
              vertical={false}
            />
            <XAxis
              dataKey="category"
              tick={{ fill: "#7F93A8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#7F93A8", fontSize: 11 }}
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
            <Bar dataKey="count" fill="#22B7AD" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          className="lib-input text-sm"
          value={yearFilter}
          onChange={(e) =>
            setYearFilter(e.target.value ? Number.parseInt(e.target.value) : "")
          }
          data-ocid="acquisitions.year.select"
        >
          <option value="">All Years</option>
          <option value={2026}>2026</option>
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
        </select>
        <select
          className="lib-input text-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          data-ocid="acquisitions.category.select"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className="text-sm self-center ml-auto" style={{ color: "#7F93A8" }}>
          {filteredAcq.length} records • {totalBooks} books • ₹
          {totalSpend.toLocaleString()}
        </p>
      </div>

      {/* Table */}
      <div className="lib-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #22384A" }}>
                {[
                  "Title",
                  "Author",
                  "Category",
                  "Qty",
                  "Unit Price",
                  "Total",
                  "Date",
                  "Vendor",
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
              {filteredAcq.map((acq, i) => (
                <motion.tr
                  key={acq.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: "1px solid rgba(34,56,74,0.5)" }}
                  data-ocid={`acquisitions.item.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#E8EEF6" }}
                    >
                      {acq.title}
                    </p>
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "#A9B6C6" }}
                  >
                    {acq.author}
                  </td>
                  <td className="px-4 py-3">
                    <span className="lib-badge-teal">{acq.category}</span>
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: "#A9B6C6" }}
                  >
                    {acq.quantity}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: "#A9B6C6" }}
                  >
                    ₹{acq.unitPrice.toLocaleString()}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-medium"
                    style={{ color: "#2ECC9A" }}
                  >
                    ₹{acq.totalPrice.toLocaleString()}
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "#7F93A8" }}
                  >
                    {acq.purchaseDate}
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "#A9B6C6" }}
                  >
                    {acq.vendor}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Acquisition Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent
          className="max-w-lg border-0"
          style={{
            background: "#152534",
            borderColor: "#22384A",
            color: "#E8EEF6",
          }}
          data-ocid="acquisitions.add.dialog"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#E8EEF6" }}>
              Add New Acquisition
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input
              className="lib-input w-full"
              placeholder="Book Title *"
              data-ocid="acquisitions.add.title.input"
            />
            <input
              className="lib-input w-full"
              placeholder="Author"
              data-ocid="acquisitions.add.author.input"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="lib-input"
                placeholder="Quantity"
                type="number"
                min={1}
                data-ocid="acquisitions.add.qty.input"
              />
              <input
                className="lib-input"
                placeholder="Unit Price (₹)"
                type="number"
                data-ocid="acquisitions.add.price.input"
              />
            </div>
            <input
              className="lib-input w-full"
              placeholder="Vendor Name"
              data-ocid="acquisitions.add.vendor.input"
            />
            <select
              className="lib-input w-full"
              data-ocid="acquisitions.add.category.select"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="lib-btn-secondary"
              onClick={() => setShowAddModal(false)}
              data-ocid="acquisitions.add.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              className="lib-btn-primary"
              onClick={() => {
                toast.success("Acquisition recorded");
                setShowAddModal(false);
              }}
              data-ocid="acquisitions.add.submit_button"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
