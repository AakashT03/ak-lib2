import { BookOpen, ExternalLink, FileText } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { mockEResources } from "../data/mockData";

const TYPES = ["All", "E-Book", "Journal"];
const SUBJECTS = [
  "All",
  "Computer Science",
  "Chemistry",
  "Mathematics",
  "Medicine",
  "Science",
  "Economics",
  "Physics",
  "Law",
  "Biology",
];

export default function EBooksPage() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");

  const filtered = mockEResources.filter((r) => {
    if (typeFilter !== "All" && r.type !== typeFilter) return false;
    if (subjectFilter !== "All" && r.subject !== subjectFilter) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "#E8EEF6" }}>
            E-Books & Journals
          </h2>
          <p className="text-sm" style={{ color: "#7F93A8" }}>
            Digital resources and research publications
          </p>
        </div>
        <div className="flex gap-3">
          <div
            className="flex gap-1 p-1 rounded-lg"
            style={{ background: "#152534" }}
          >
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                className="px-3 py-1.5 text-xs rounded transition-all"
                style={{
                  background: typeFilter === t ? "#22B7AD" : "transparent",
                  color: typeFilter === t ? "#0B141D" : "#A9B6C6",
                  fontWeight: typeFilter === t ? 600 : 400,
                }}
                onClick={() => setTypeFilter(t)}
                data-ocid={`ebooks.${t.toLowerCase().replace(/[^a-z]/g, "")}.tab`}
              >
                {t}
              </button>
            ))}
          </div>
          <select
            className="lib-input text-sm"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            data-ocid="ebooks.subject.select"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="lib-card p-12 text-center"
          data-ocid="ebooks.empty_state"
        >
          <BookOpen
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: "#22384A" }}
          />
          <p style={{ color: "#7F93A8" }}>No resources found for this filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((res, i) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="lib-card overflow-hidden"
              data-ocid={`ebooks.item.${i + 1}`}
            >
              <div
                className={`h-24 bg-gradient-to-br ${res.coverColor} flex items-center justify-center`}
              >
                {res.type === "Journal" ? (
                  <FileText size={32} className="text-white/60" />
                ) : (
                  <BookOpen size={32} className="text-white/60" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4
                    className="font-semibold text-sm leading-tight"
                    style={{ color: "#E8EEF6" }}
                  >
                    {res.title}
                  </h4>
                  <span
                    className="text-xs px-2 py-0.5 rounded flex-shrink-0"
                    style={{
                      background:
                        res.type === "Journal"
                          ? "rgba(209,138,74,0.15)"
                          : "rgba(34,183,173,0.15)",
                      color: res.type === "Journal" ? "#D18A4A" : "#22B7AD",
                    }}
                  >
                    {res.type}
                  </span>
                </div>
                <p className="text-xs mb-1" style={{ color: "#7F93A8" }}>
                  {res.subject} • {res.publisher} • {res.year}
                </p>
                <p
                  className="text-xs mb-4 line-clamp-2"
                  style={{ color: "#A9B6C6" }}
                >
                  {res.description}
                </p>
                <a
                  href={res.accessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lib-btn-primary flex items-center justify-center gap-2 text-xs w-full py-2"
                  data-ocid={`ebooks.access.button.${i + 1}`}
                >
                  <ExternalLink size={12} /> Access Resource
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <p className="text-xs text-center" style={{ color: "#7F93A8" }}>
        * E-resources link to external databases. Institutional access may be
        required.
      </p>
    </div>
  );
}
