import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { type Book, Category, Classification, UserRole } from "../backend.d";
import {
  useAddBook,
  useGetAvailableBooks,
  useGetCallerRole,
  useIssueBook,
  useRemoveBook,
  useSearchBooksByAuthor,
  useSearchBooksByCategory,
  useSearchBooksByTitle,
} from "../hooks/useQueries";
import {
  CATEGORY_LABELS,
  COLON_NUMBERS,
  DDC_LABELS,
} from "../lib/classification";

const EMPTY_BOOK: Omit<Book, "id"> = {
  title: "",
  author: "",
  isbn: "",
  category: Category.computerscience,
  classification: Classification.ddc,
  totalCopies: BigInt(1),
  availableCopies: BigInt(1),
  isActive: true,
};

function getBookClassLabel(b: Book): string {
  const cat = b.category.toString();
  const cls = b.classification.toString();
  if (cls === "ddc") return DDC_LABELS[cat] || "000";
  return COLON_NUMBERS[cat] || "A:1";
}

function BookStatusBadge({ copies }: { copies: bigint }) {
  const n = Number(copies);
  if (n === 0) return <span className="lib-badge-borrowed">Borrowed</span>;
  if (n < 3) return <span className="lib-badge-teal">Low ({n})</span>;
  return <span className="lib-badge-available">Available ({n})</span>;
}

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"title" | "author" | "category">(
    "title",
  );
  const [categoryFilter, setCategoryFilter] = useState<Category | "">(
    "" as Category | "",
  );
  const [classificationFilter, setClassificationFilter] = useState<
    "" | "ddc" | "col"
  >("" as "" | "ddc" | "col");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState<Omit<Book, "id">>(EMPTY_BOOK);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data: allBooks, isLoading } = useGetAvailableBooks();
  const { data: titleResults } = useSearchBooksByTitle(
    searchType === "title" ? searchQuery : "",
  );
  const { data: authorResults } = useSearchBooksByAuthor(
    searchType === "author" ? searchQuery : "",
  );
  const { data: categoryResults } = useSearchBooksByCategory(
    searchType === "category" ? categoryFilter : "",
  );
  const { data: callerRole } = useGetCallerRole();
  const addBookMutation = useAddBook();
  const removeBookMutation = useRemoveBook();
  const issueBookMutation = useIssueBook();

  const isAdminOrLibrarian =
    callerRole === UserRole.admin || callerRole === UserRole.user;

  const displayBooks = useMemo(() => {
    let books = allBooks || [];
    if (searchQuery.trim() && searchType === "title" && titleResults)
      books = titleResults;
    else if (searchQuery.trim() && searchType === "author" && authorResults)
      books = authorResults;
    else if (searchType === "category" && categoryFilter && categoryResults)
      books = categoryResults;

    if (classificationFilter) {
      books = books.filter(
        (b) => b.classification.toString() === classificationFilter,
      );
    }
    return books;
  }, [
    allBooks,
    searchQuery,
    searchType,
    titleResults,
    authorResults,
    categoryResults,
    categoryFilter,
    classificationFilter,
  ]);

  const paginatedBooks = displayBooks.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const totalPages = Math.ceil(displayBooks.length / PAGE_SIZE);

  const handleAddBook = async () => {
    try {
      const book: Book = { ...newBook, id: BigInt(0) };
      await addBookMutation.mutateAsync(book);
      toast.success("Book added successfully");
      setShowAddModal(false);
      setNewBook(EMPTY_BOOK);
    } catch {
      toast.error("Failed to add book");
    }
  };

  const handleRemoveBook = async (bookId: bigint) => {
    try {
      await removeBookMutation.mutateAsync(bookId);
      toast.success("Book removed");
      setSelectedBook(null);
    } catch {
      toast.error("Failed to remove book");
    }
  };

  const handleIssueBook = async (bookId: bigint) => {
    try {
      await issueBookMutation.mutateAsync(bookId);
      toast.success("Book issued successfully!");
      setSelectedBook(null);
    } catch {
      toast.error("Failed to issue book");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "#E8EEF6" }}>
            Book Catalog
          </h2>
          <p className="text-sm" style={{ color: "#7F93A8" }}>
            {displayBooks.length} books found
          </p>
        </div>
        {isAdminOrLibrarian && (
          <button
            type="button"
            className="lib-btn-primary flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
            data-ocid="books.add.open_modal_button"
          >
            <Plus size={16} /> Add Book
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="lib-card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex gap-2 flex-1">
            <Select
              value={searchType}
              onValueChange={(v) => setSearchType(v as typeof searchType)}
            >
              <SelectTrigger
                className="w-32 border-0"
                style={{
                  background: "#152534",
                  color: "#A9B6C6",
                  borderColor: "#22384A",
                }}
                data-ocid="books.searchtype.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                style={{ background: "#1A2D3E", borderColor: "#22384A" }}
              >
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "#7F93A8" }}
              />
              <input
                type="text"
                className="lib-input w-full pl-9"
                placeholder={`Search by ${searchType}...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                data-ocid="books.search_input"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {searchType === "category" && (
              <select
                className="lib-input"
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as Category | "")
                }
                data-ocid="books.category.select"
              >
                <option value="">All Categories</option>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            )}
            <select
              className="lib-input"
              value={classificationFilter}
              onChange={(e) =>
                setClassificationFilter(e.target.value as "" | "ddc" | "col")
              }
              data-ocid="books.classification.select"
            >
              <option value="">All Classifications</option>
              <option value="ddc">DDC</option>
              <option value="col">Colon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="lib-card overflow-hidden">
        {isLoading ? (
          <div
            className="flex items-center justify-center py-16"
            data-ocid="books.loading_state"
          >
            <Loader2
              className="w-6 h-6 animate-spin"
              style={{ color: "#22B7AD" }}
            />
            <span className="ml-3" style={{ color: "#7F93A8" }}>
              Loading books...
            </span>
          </div>
        ) : paginatedBooks.length === 0 ? (
          <div className="text-center py-16" data-ocid="books.empty_state">
            <BookOpen
              className="w-12 h-12 mx-auto mb-3"
              style={{ color: "#22384A" }}
            />
            <p style={{ color: "#7F93A8" }}>No books found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #22384A" }}>
                  {[
                    "Book",
                    "ISBN",
                    "Classification",
                    "Copies",
                    "Status",
                    "",
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
                {paginatedBooks.map((book, i) => (
                  <motion.tr
                    key={book.id.toString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: "1px solid rgba(34,56,74,0.5)" }}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedBook(book)}
                    data-ocid={`books.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-10 rounded flex items-center justify-center font-bold flex-shrink-0"
                          style={{
                            background: "rgba(34,183,173,0.15)",
                            color: "#22B7AD",
                            fontSize: "10px",
                          }}
                        >
                          {book.category.toString().slice(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#E8EEF6" }}
                          >
                            {book.title}
                          </p>
                          <p className="text-xs" style={{ color: "#7F93A8" }}>
                            {book.author}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "#A9B6C6" }}
                    >
                      {book.isbn}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="lib-badge-teal text-xs">
                          {book.classification.toString().toUpperCase()}
                        </span>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "#7F93A8" }}
                        >
                          {getBookClassLabel(book)}
                        </p>
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 text-sm"
                      style={{ color: "#A9B6C6" }}
                    >
                      {Number(book.availableCopies)} /{" "}
                      {Number(book.totalCopies)}
                    </td>
                    <td className="px-4 py-3">
                      <BookStatusBadge copies={book.availableCopies} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-xs px-3 py-1 rounded"
                        style={{
                          background: "rgba(34,183,173,0.1)",
                          color: "#22B7AD",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBook(book);
                        }}
                        data-ocid={`books.view.button.${i + 1}`}
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: "#22384A" }}
          >
            <p className="text-xs" style={{ color: "#7F93A8" }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, displayBooks.length)} of{" "}
              {displayBooks.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="lib-btn-secondary px-3 py-1 text-xs"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                data-ocid="books.pagination_prev"
              >
                Prev
              </button>
              <button
                type="button"
                className="lib-btn-secondary px-3 py-1 text-xs"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                data-ocid="books.pagination_next"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Book Detail Modal */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent
          className="max-w-lg border-0"
          style={{
            background: "#152534",
            borderColor: "#22384A",
            color: "#E8EEF6",
          }}
          data-ocid="books.detail.dialog"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#E8EEF6" }}>
              {selectedBook?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs" style={{ color: "#7F93A8" }}>
                    Author
                  </p>
                  <p style={{ color: "#A9B6C6" }}>{selectedBook.author}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#7F93A8" }}>
                    ISBN
                  </p>
                  <p style={{ color: "#A9B6C6" }}>{selectedBook.isbn}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#7F93A8" }}>
                    Category
                  </p>
                  <p style={{ color: "#A9B6C6" }}>
                    {CATEGORY_LABELS[selectedBook.category.toString()]}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#7F93A8" }}>
                    Classification
                  </p>
                  <p style={{ color: "#A9B6C6" }}>
                    {selectedBook.classification.toString().toUpperCase()}:{" "}
                    {getBookClassLabel(selectedBook)}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#7F93A8" }}>
                    Available
                  </p>
                  <p style={{ color: "#2ECC9A" }}>
                    {Number(selectedBook.availableCopies)}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#7F93A8" }}>
                    Total Copies
                  </p>
                  <p style={{ color: "#A9B6C6" }}>
                    {Number(selectedBook.totalCopies)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {isAdminOrLibrarian && selectedBook && (
              <button
                type="button"
                className="lib-btn-secondary flex items-center gap-2 text-xs"
                style={{
                  color: "#E74C6F",
                  borderColor: "rgba(231,76,111,0.3)",
                }}
                onClick={() => handleRemoveBook(selectedBook.id)}
                data-ocid="books.delete_button"
              >
                <Trash2 size={14} /> Remove
              </button>
            )}
            <button
              type="button"
              className="lib-btn-primary text-xs px-4"
              onClick={() => selectedBook && handleIssueBook(selectedBook.id)}
              disabled={
                !selectedBook ||
                Number(selectedBook.availableCopies) === 0 ||
                issueBookMutation.isPending
              }
              data-ocid="books.issue.primary_button"
            >
              {issueBookMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : null}
              Issue Book
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Book Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent
          className="max-w-lg border-0"
          style={{
            background: "#152534",
            borderColor: "#22384A",
            color: "#E8EEF6",
          }}
          data-ocid="books.add.dialog"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#E8EEF6" }}>Add New Book</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label
                  htmlFor="add-title"
                  className="text-xs"
                  style={{ color: "#7F93A8" }}
                >
                  Title *
                </label>
                <input
                  id="add-title"
                  className="lib-input w-full mt-1"
                  value={newBook.title}
                  onChange={(e) =>
                    setNewBook((b) => ({ ...b, title: e.target.value }))
                  }
                  placeholder="Book title"
                  data-ocid="books.add.title.input"
                />
              </div>
              <div>
                <label
                  htmlFor="add-author"
                  className="text-xs"
                  style={{ color: "#7F93A8" }}
                >
                  Author *
                </label>
                <input
                  id="add-author"
                  className="lib-input w-full mt-1"
                  value={newBook.author}
                  onChange={(e) =>
                    setNewBook((b) => ({ ...b, author: e.target.value }))
                  }
                  placeholder="Author name"
                  data-ocid="books.add.author.input"
                />
              </div>
              <div>
                <label
                  htmlFor="add-isbn"
                  className="text-xs"
                  style={{ color: "#7F93A8" }}
                >
                  ISBN
                </label>
                <input
                  id="add-isbn"
                  className="lib-input w-full mt-1"
                  value={newBook.isbn}
                  onChange={(e) =>
                    setNewBook((b) => ({ ...b, isbn: e.target.value }))
                  }
                  placeholder="978-xxx"
                  data-ocid="books.add.isbn.input"
                />
              </div>
              <div>
                <label
                  htmlFor="add-category"
                  className="text-xs"
                  style={{ color: "#7F93A8" }}
                >
                  Category
                </label>
                <select
                  id="add-category"
                  className="lib-input w-full mt-1"
                  value={newBook.category.toString()}
                  onChange={(e) =>
                    setNewBook((b) => ({
                      ...b,
                      category: e.target.value as Category,
                    }))
                  }
                  data-ocid="books.add.category.select"
                >
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="add-class"
                  className="text-xs"
                  style={{ color: "#7F93A8" }}
                >
                  Classification
                </label>
                <select
                  id="add-class"
                  className="lib-input w-full mt-1"
                  value={newBook.classification.toString()}
                  onChange={(e) =>
                    setNewBook((b) => ({
                      ...b,
                      classification: e.target.value as Classification,
                    }))
                  }
                  data-ocid="books.add.classification.select"
                >
                  <option value="ddc">DDC (Dewey Decimal)</option>
                  <option value="col">Colon Classification</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="add-copies"
                  className="text-xs"
                  style={{ color: "#7F93A8" }}
                >
                  Total Copies
                </label>
                <input
                  id="add-copies"
                  type="number"
                  className="lib-input w-full mt-1"
                  value={Number(newBook.totalCopies)}
                  onChange={(e) =>
                    setNewBook((b) => ({
                      ...b,
                      totalCopies: BigInt(e.target.value || 1),
                      availableCopies: BigInt(e.target.value || 1),
                    }))
                  }
                  min={1}
                  data-ocid="books.add.copies.input"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="lib-btn-secondary"
              onClick={() => setShowAddModal(false)}
              data-ocid="books.add.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              className="lib-btn-primary flex items-center gap-2"
              onClick={handleAddBook}
              disabled={
                !newBook.title || !newBook.author || addBookMutation.isPending
              }
              data-ocid="books.add.submit_button"
            >
              {addBookMutation.isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Add Book
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
