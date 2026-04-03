import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import libraryBooks from "../data/libraryBooks.json";

const PAGE_SIZE = 50;

const DEPARTMENTS = Array.from(
  new Set(libraryBooks.map((b) => b.department)),
).sort();

const DEPT_COLORS: Record<string, string> = {
  "Computer Science": "#22B7AD",
  Mathematics: "#7B5EA7",
  Physics: "#D18A4A",
  Chemistry: "#2ECC9A",
  Biology: "#E74C6F",
  Economics: "#a855f7",
  Law: "#f59e0b",
};

function getDeptColor(dept: string): string {
  if (DEPT_COLORS[dept]) return DEPT_COLORS[dept];
  // Deterministic color from dept name hash
  const palette = [
    "#22B7AD",
    "#7B5EA7",
    "#D18A4A",
    "#2ECC9A",
    "#E74C6F",
    "#a855f7",
    "#f59e0b",
    "#60a5fa",
  ];
  let hash = 0;
  for (let i = 0; i < dept.length; i++)
    hash = (hash * 31 + dept.charCodeAt(i)) % palette.length;
  return palette[hash];
}

export default function OpacPage() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState<"title" | "author" | "department">(
    "title",
  );
  const [deptFilter, setDeptFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return libraryBooks.filter((book) => {
      const matchSearch =
        !hasSearched ||
        !q ||
        (searchBy === "title" && book.bookName.toLowerCase().includes(q)) ||
        (searchBy === "author" && book.author.toLowerCase().includes(q)) ||
        (searchBy === "department" &&
          book.department.toLowerCase().includes(q));
      const matchDept = !deptFilter || book.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [query, searchBy, deptFilter, hasSearched]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageEnd);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setPage(1);
  };

  const handleDeptFilter = (val: string) => {
    setDeptFilter(val);
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      {/* OPAC Header */}
      <div
        className="py-10 md:py-14 px-4 md:px-6 text-center"
        style={{
          background:
            "linear-gradient(180deg, var(--lib-card) 0%, rgba(13,10,26,0) 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 lib-glow"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          >
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1
            className="text-3xl font-bold font-display mb-2"
            style={{ color: "var(--lib-text)" }}
          >
            Open Access Catalogue
          </h1>
          <p
            className="text-base mb-8"
            style={{ color: "var(--lib-text-muted)" }}
          >
            Search the complete collection of{" "}
            <span style={{ color: "var(--lib-teal)" }}>
              {libraryBooks.length.toLocaleString()}
            </span>{" "}
            books
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2 items-center">
              <select
                className="lib-input flex-shrink-0"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value as typeof searchBy)}
                data-ocid="opac.searchby.select"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="department">Department</option>
              </select>
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--lib-text-muted)" }}
                />
                <input
                  type="text"
                  className="lib-input w-full pl-12 py-3 text-base"
                  placeholder="Search books, authors, departments…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ fontSize: "15px" }}
                  data-ocid="opac.search_input"
                />
              </div>
              <button
                type="submit"
                className="lib-btn-primary py-3 px-6"
                data-ocid="opac.search.primary_button"
              >
                Search
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="px-4 md:px-6 pb-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
          <Filter size={16} style={{ color: "var(--lib-text-muted)" }} />
          <select
            className="lib-input text-sm"
            value={deptFilter}
            onChange={(e) => handleDeptFilter(e.target.value)}
            data-ocid="opac.dept.select"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {(hasSearched || deptFilter) && (
            <button
              type="button"
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: "rgba(168,85,247,0.12)",
                color: "#a855f7",
                border: "1px solid rgba(168,85,247,0.25)",
              }}
              onClick={() => {
                setQuery("");
                setDeptFilter("");
                setHasSearched(false);
                setPage(1);
              }}
              data-ocid="opac.clear.button"
            >
              Clear filters
            </button>
          )}
          <p
            className="text-sm ml-auto"
            style={{ color: "var(--lib-text-muted)" }}
          >
            {filtered.length.toLocaleString()} result
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Pagination top */}
      {totalPages > 1 && (
        <div className="px-4 md:px-6 pb-2">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <p className="text-sm" style={{ color: "#7F93A8" }}>
              Showing {pageStart + 1}–{Math.min(pageEnd, filtered.length)} of{" "}
              <span style={{ color: "#a855f7", fontWeight: 600 }}>
                {filtered.length.toLocaleString()}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg disabled:opacity-40"
                style={{ background: "rgba(46,37,80,0.5)", color: "#A9B6C6" }}
                data-ocid="opac.pagination_prev"
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
                data-ocid="opac.pagination_next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="px-4 md:px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16" data-ocid="opac.empty_state">
              <BookOpen
                size={48}
                className="mx-auto mb-4"
                style={{ color: "var(--lib-text-muted)", opacity: 0.4 }}
              />
              <p
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--lib-text-sec)" }}
              >
                No books found
              </p>
              <p style={{ color: "var(--lib-text-muted)" }}>
                Try a different search term or filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginated.map((book, i) => {
                const color = getDeptColor(book.department);
                return (
                  <motion.div
                    key={book.accessionNo}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.015 }}
                    className="lib-card p-4 hover:scale-[1.02] transition-transform"
                    data-ocid={`opac.item.${i + 1}`}
                  >
                    {/* Cover placeholder */}
                    <div
                      className="w-full h-24 rounded-lg mb-3 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                        border: `1px solid ${color}33`,
                      }}
                    >
                      <BookOpen size={28} style={{ color }} />
                    </div>
                    <h4
                      className="font-semibold text-sm leading-tight mb-1 line-clamp-2"
                      style={{ color: "var(--lib-text)" }}
                    >
                      {book.bookName}
                    </h4>
                    <p
                      className="text-xs mb-1"
                      style={{ color: "var(--lib-text-muted)" }}
                    >
                      {book.author}
                    </p>
                    <p
                      className="text-xs mb-2 truncate"
                      style={{ color: "#7F93A8" }}
                    >
                      {book.publisher}
                    </p>
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded truncate"
                        style={{
                          background: `${color}22`,
                          color,
                          maxWidth: "70%",
                        }}
                        title={book.department}
                      >
                        {book.department}
                      </span>
                      <span
                        className="text-xs font-mono flex-shrink-0"
                        style={{ color: "#7F93A8" }}
                        title="Accession No."
                      >
                        {book.accessionNo}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="pb-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm disabled:opacity-40 transition-colors"
            style={{ background: "rgba(46,37,80,0.5)", color: "#A9B6C6" }}
            data-ocid="opac.pagination_prev"
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
            data-ocid="opac.pagination_next"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
