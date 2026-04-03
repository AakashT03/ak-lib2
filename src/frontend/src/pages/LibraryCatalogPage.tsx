import {
  ChevronLeft,
  ChevronRight,
  Database,
  Download,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import libraryBooks from "../data/libraryBooks.json";

const PAGE_SIZE = 50;

const DEPARTMENTS = [
  "All Departments",
  ...Array.from(new Set(libraryBooks.map((b) => b.department))).sort(),
];

export default function LibraryCatalogPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return libraryBooks.filter((b) => {
      const matchSearch =
        !q ||
        b.bookName.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);
      const matchDept = !deptFilter || b.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [search, deptFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageEnd);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleDeptFilter = (val: string) => {
    setDeptFilter(val === "All Departments" ? "" : val);
    setPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      "Accession No",
      "Book Name",
      "Author",
      "Publisher",
      "Department",
    ];
    const rows = filtered.map((b) => [
      b.accessionNo,
      `"${b.bookName.replace(/"/g, '""')}"`,
      `"${b.author.replace(/"/g, '""')}"`,
      `"${b.publisher.replace(/"/g, '""')}"`,
      b.department,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `library_catalog_${deptFilter || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}
            >
              <Database size={18} />
            </div>
            <h2
              className="text-xl font-semibold font-display"
              style={{ color: "#E8EEF6" }}
            >
              Library Catalog
            </h2>
          </div>
          <p className="text-sm" style={{ color: "#7F93A8" }}>
            {libraryBooks.length.toLocaleString()} books across{" "}
            {DEPARTMENTS.length - 1} departments
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "rgba(168,85,247,0.15)",
            color: "#a855f7",
            border: "1px solid rgba(168,85,247,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(168,85,247,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(168,85,247,0.15)";
          }}
          data-ocid="catalog.export.button"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Stats strip */}
      <div
        className="grid grid-cols-3 gap-4 p-4 rounded-xl"
        style={{
          background: "rgba(46,37,80,0.3)",
          border: "1px solid rgba(168,85,247,0.15)",
        }}
      >
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: "#a855f7" }}>
            {libraryBooks.length.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "#7F93A8" }}>
            Total Books
          </p>
        </div>
        <div
          className="text-center"
          style={{
            borderLeft: "1px solid rgba(168,85,247,0.2)",
            borderRight: "1px solid rgba(168,85,247,0.2)",
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#f59e0b" }}>
            {DEPARTMENTS.length - 1}
          </p>
          <p className="text-xs" style={{ color: "#7F93A8" }}>
            Departments
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: "#22B7AD" }}>
            {filtered.length.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "#7F93A8" }}>
            Filtered Results
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#7F93A8" }}
          />
          <input
            type="text"
            className="lib-input w-full pl-9"
            placeholder="Search by book name or author..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            data-ocid="catalog.search_input"
          />
        </div>
        <select
          className="lib-input sm:w-56"
          value={deptFilter || "All Departments"}
          onChange={(e) => handleDeptFilter(e.target.value)}
          data-ocid="catalog.dept.select"
        >
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination info */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "#7F93A8" }}>
          Showing {filtered.length > 0 ? pageStart + 1 : 0}–
          {Math.min(pageEnd, filtered.length)} of{" "}
          <span style={{ color: "#a855f7", fontWeight: 600 }}>
            {filtered.length.toLocaleString()}
          </span>{" "}
          books
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg disabled:opacity-40"
              style={{ background: "rgba(46,37,80,0.5)", color: "#A9B6C6" }}
              data-ocid="catalog.pagination_prev"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm px-2" style={{ color: "#A9B6C6" }}>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg disabled:opacity-40"
              style={{ background: "rgba(46,37,80,0.5)", color: "#A9B6C6" }}
              data-ocid="catalog.pagination_next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Books Table */}
      <div className="lib-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16" data-ocid="catalog.empty_state">
            <Database
              className="w-12 h-12 mx-auto mb-3"
              style={{ color: "#22384A" }}
            />
            <p className="font-medium" style={{ color: "#A9B6C6" }}>
              No books found
            </p>
            <p className="text-sm mt-1" style={{ color: "#7F93A8" }}>
              Try adjusting your search or department filter
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #22384A" }}>
                  {[
                    "Accession No",
                    "Book Name",
                    "Author",
                    "Publisher",
                    "Department",
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
                {paginated.map((book, i) => (
                  <tr
                    key={book.accessionNo}
                    style={{ borderBottom: "1px solid rgba(34,56,74,0.5)" }}
                    data-ocid={`catalog.item.${i + 1}`}
                  >
                    <td
                      className="px-4 py-3 text-xs font-mono"
                      style={{ color: "#22B7AD" }}
                    >
                      {book.accessionNo}
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#E8EEF6" }}
                      >
                        {book.bookName}
                      </p>
                    </td>
                    <td
                      className="px-4 py-3 text-sm"
                      style={{ color: "#A9B6C6" }}
                    >
                      {book.author}
                    </td>
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "#7F93A8" }}
                    >
                      {book.publisher}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          background: "rgba(168,85,247,0.12)",
                          color: "#a855f7",
                        }}
                      >
                        {book.department}
                      </span>
                    </td>
                  </tr>
                ))}
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
            data-ocid="catalog.pagination_prev"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-sm" style={{ color: "#7F93A8" }}>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm disabled:opacity-40 transition-colors"
            style={{ background: "rgba(46,37,80,0.5)", color: "#A9B6C6" }}
            data-ocid="catalog.pagination_next"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
