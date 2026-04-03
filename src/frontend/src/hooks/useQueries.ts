import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Book, Category, GateEntry, Issue } from "../backend.d";
import {
  type Category as CategoryEnum,
  type Classification,
  UserRole,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetAvailableBooks() {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["availableBooks"],
    queryFn: async () => {
      if (!actor) return [];
      // getAllBooks is the correct backend method
      return actor.getAllBooks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchBooksByTitle(title: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["searchTitle", title],
    queryFn: async () => {
      if (!actor || !title.trim()) return [];
      return actor.searchBooksByTitle(title);
    },
    enabled: !!actor && !isFetching && !!title.trim(),
  });
}

export function useSearchBooksByAuthor(author: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["searchAuthor", author],
    queryFn: async () => {
      if (!actor || !author.trim()) return [];
      return actor.searchBooksByAuthor(author);
    },
    enabled: !!actor && !isFetching && !!author.trim(),
  });
}

export function useSearchBooksByCategory(category: Category | "") {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["searchCategory", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.searchBooksByCategory(category as Category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetUserIssues(user: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Issue[]>({
    queryKey: ["userIssues", user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return [];
      // getUserIssuedBooks is the correct backend method
      return actor.getUserIssuedBooks(user);
    },
    enabled: !!actor && !isFetching && !!user,
  });
}

export function useGetCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (book: Book) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addBook(
        book.title,
        book.author,
        book.isbn,
        book.classification as Classification,
        book.category as CategoryEnum,
        book.totalCopies,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availableBooks"] });
    },
  });
}

export function useUpdateBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, book }: { id: bigint; book: Book }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateBook(
        id,
        book.title,
        book.author,
        book.isbn,
        book.classification as Classification,
        book.category as CategoryEnum,
        book.totalCopies,
        book.isActive,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availableBooks"] });
    },
  });
}

export function useRemoveBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeBook(bookId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availableBooks"] });
    },
  });
}

export function useIssueBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.issueBook(bookId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availableBooks"] });
      queryClient.invalidateQueries({ queryKey: ["userIssues"] });
    },
  });
}

export function useReturnBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (issueId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.returnBook(issueId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availableBooks"] });
      queryClient.invalidateQueries({ queryKey: ["userIssues"] });
    },
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerRole"] });
    },
  });
}

// Gate Entry/Exit hooks
export function useRecordGateEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (studentRegisterId: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.recordGateEntry(studentRegisterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayGateEntries"] });
    },
  });
}

export function useMarkGateExit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entryId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.markGateExit(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayGateEntries"] });
    },
  });
}

export function useGetTodayGateEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<GateEntry[]>({
    queryKey: ["todayGateEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTodayGateEntries();
    },
    enabled: !!actor && !isFetching,
  });
}
