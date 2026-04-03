import { ExternalLink, Newspaper } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { mockMagazines } from "../data/mockData";

const CATEGORIES = [
  "All",
  "Science",
  "Technology",
  "Education",
  "Environment",
  "Economics",
  "Current Affairs",
  "Physics",
  "Law",
  "Psychology",
];

export default function MagazinesPage() {
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filtered = mockMagazines.filter(
    (m) => categoryFilter === "All" || m.category === categoryFilter,
  );

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "#E8EEF6" }}>
            Magazines
          </h2>
          <p className="text-sm" style={{ color: "#7F93A8" }}>
            Periodicals and current affairs publications
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className="px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all flex-shrink-0"
              style={{
                background:
                  categoryFilter === c ? "#22B7AD" : "rgba(34,56,74,0.5)",
                color: categoryFilter === c ? "#0B141D" : "#A9B6C6",
                border:
                  categoryFilter === c
                    ? "1px solid #22B7AD"
                    : "1px solid #22384A",
                fontWeight: categoryFilter === c ? 600 : 400,
              }}
              onClick={() => setCategoryFilter(c)}
              data-ocid={`magazines.${c.toLowerCase().replace(/\s+/g, "-")}.tab`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="lib-card p-12 text-center"
          data-ocid="magazines.empty_state"
        >
          <Newspaper
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: "#22384A" }}
          />
          <p style={{ color: "#7F93A8" }}>No magazines in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((mag, i) => (
            <motion.div
              key={mag.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="lib-card overflow-hidden hover:scale-[1.02] transition-transform"
              data-ocid={`magazines.item.${i + 1}`}
            >
              {/* Magazine Cover */}
              <div
                className={`h-36 bg-gradient-to-br ${mag.coverColor} relative flex flex-col items-center justify-center p-4`}
              >
                <Newspaper size={28} className="text-white/40 mb-2" />
                <h4 className="text-center font-bold text-sm text-white/90 leading-tight">
                  {mag.name}
                </h4>
                <div className="absolute top-2 right-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {mag.frequency}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(34,183,173,0.15)",
                      color: "#22B7AD",
                    }}
                  >
                    {mag.category}
                  </span>
                  <span className="text-xs" style={{ color: "#7F93A8" }}>
                    {mag.latestIssue}
                  </span>
                </div>
                <p
                  className="text-xs mt-2 mb-3 line-clamp-2"
                  style={{ color: "#A9B6C6" }}
                >
                  {mag.description}
                </p>
                <button
                  type="button"
                  className="lib-btn-primary flex items-center justify-center gap-2 text-xs w-full py-2"
                  onClick={() => window.open("#", "_blank")}
                  data-ocid={`magazines.read.button.${i + 1}`}
                >
                  <ExternalLink size={12} /> Read Latest Issue
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
