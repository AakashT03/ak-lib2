import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight, BookMarked, Loader2, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetUserIssues, useReturnBook } from "../hooks/useQueries";

export default function IssueReturnPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: issues, isLoading } = useGetUserIssues(principal);
  const returnBookMutation = useReturnBook();
  const [returningId, setReturningId] = useState<bigint | null>(null);

  const activeIssues = issues?.filter((i) => !i.isReturned) ?? [];
  const returnedIssues = issues?.filter((i) => i.isReturned) ?? [];

  const handleReturn = async (issueId: bigint) => {
    setReturningId(issueId);
    try {
      await returnBookMutation.mutateAsync(issueId);
      toast.success("Book returned successfully!");
    } catch {
      toast.error("Failed to return book");
    } finally {
      setReturningId(null);
    }
  };

  const formatDate = (time: bigint) => {
    const ms = Number(time) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: "#E8EEF6" }}>
          Issue / Return Books
        </h2>
        <p className="text-sm" style={{ color: "#7F93A8" }}>
          Manage book borrowing and returns
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList
          className="border-0 p-1 rounded-lg"
          style={{ background: "#152534" }}
        >
          <TabsTrigger
            value="active"
            className="text-sm"
            style={{ color: "#A9B6C6" }}
            data-ocid="issue.active.tab"
          >
            Currently Issued ({activeIssues.length})
          </TabsTrigger>
          <TabsTrigger
            value="returned"
            className="text-sm"
            style={{ color: "#A9B6C6" }}
            data-ocid="issue.returned.tab"
          >
            Return History ({returnedIssues.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {isLoading ? (
            <div
              className="flex items-center justify-center py-16"
              data-ocid="issue.loading_state"
            >
              <Loader2
                className="w-6 h-6 animate-spin"
                style={{ color: "#22B7AD" }}
              />
            </div>
          ) : activeIssues.length === 0 ? (
            <div
              className="lib-card p-12 text-center"
              data-ocid="issue.empty_state"
            >
              <BookMarked
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: "#22384A" }}
              />
              <p className="font-medium" style={{ color: "#A9B6C6" }}>
                No books currently issued
              </p>
              <p className="text-sm mt-1" style={{ color: "#7F93A8" }}>
                Visit the Books section to borrow a book
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeIssues.map((issue, i) => (
                <motion.div
                  key={issue.id.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="lib-card p-4 flex items-center justify-between"
                  data-ocid={`issue.item.${i + 1}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-12 rounded flex items-center justify-center text-xs font-bold"
                      style={{
                        background: "rgba(34,183,173,0.15)",
                        color: "#22B7AD",
                      }}
                    >
                      BK
                    </div>
                    <div>
                      <p
                        className="font-medium text-sm"
                        style={{ color: "#E8EEF6" }}
                      >
                        Book #{issue.bookId.toString()}
                      </p>
                      <p className="text-xs" style={{ color: "#7F93A8" }}>
                        Issued: {formatDate(issue.issueDate)}
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color: issue.returnDate ? "#7F93A8" : "#D18A4A",
                        }}
                      >
                        Due:{" "}
                        {issue.returnDate
                          ? formatDate(issue.returnDate)
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="lib-btn-primary flex items-center gap-2 text-sm"
                    onClick={() => handleReturn(issue.id)}
                    disabled={returningId === issue.id}
                    data-ocid={`issue.return.button.${i + 1}`}
                  >
                    {returningId === issue.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RotateCcw size={14} />
                    )}
                    Return
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="returned" className="mt-4">
          {returnedIssues.length === 0 ? (
            <div
              className="lib-card p-12 text-center"
              data-ocid="issue.history.empty_state"
            >
              <ArrowLeftRight
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: "#22384A" }}
              />
              <p style={{ color: "#7F93A8" }}>No return history yet</p>
            </div>
          ) : (
            <div className="lib-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #22384A" }}>
                    {["Book ID", "Issue Date", "Return Date", "Status"].map(
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
                  {returnedIssues.map((issue, i) => (
                    <tr
                      key={issue.id.toString()}
                      style={{ borderBottom: "1px solid rgba(34,56,74,0.5)" }}
                      data-ocid={`issue.history.item.${i + 1}`}
                    >
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: "#A9B6C6" }}
                      >
                        #{issue.bookId.toString()}
                      </td>
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: "#A9B6C6" }}
                      >
                        {formatDate(issue.issueDate)}
                      </td>
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: "#A9B6C6" }}
                      >
                        {issue.returnDate ? formatDate(issue.returnDate) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="lib-badge-available">Returned</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
