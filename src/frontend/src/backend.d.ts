import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Issue {
    id: bigint;
    issueDate: Time;
    bookId: bigint;
    isReturned: boolean;
    borrower: Principal;
    returnDate?: Time;
}
export interface GateEntry {
    id: bigint;
    exitTime?: Time;
    entryTime: Time;
    studentRegisterId: string;
}
export interface Book {
    id: bigint;
    title: string;
    availableCopies: bigint;
    isbn: string;
    isActive: boolean;
    author: string;
    totalCopies: bigint;
    category: Category;
    classification: Classification;
}
export interface DashboardStats {
    totalStudents: bigint;
    totalBooks: bigint;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    law = "law",
    biology = "biology",
    computerscience = "computerscience",
    math = "math",
    nonFiction = "nonFiction",
    economics = "economics",
    chemistry = "chemistry",
    literature = "literature",
    philosophy = "philosophy",
    physics = "physics",
    generalKnowledge = "generalKnowledge",
    psychology = "psychology",
    fiction = "fiction"
}
export enum Classification {
    col = "col",
    ddc = "ddc"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBook(title: string, author: string, isbn: string, classification: Classification, category: Category, totalCopies: bigint): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllBooks(): Promise<Array<Book>>;
    getBook(bookId: bigint): Promise<Book | null>;
    getCallerIssuedBooks(): Promise<Array<Issue>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<DashboardStats>;
    getGateEntriesByStudent(studentRegisterId: string): Promise<Array<GateEntry>>;
    getGateVisitCount(studentRegisterId: string): Promise<bigint>;
    getIssuedBooksCount(user: Principal): Promise<bigint>;
    getTodayGateEntries(): Promise<Array<GateEntry>>;
    getUserIssuedBooks(user: Principal): Promise<Array<Issue>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    issueBook(bookId: bigint): Promise<bigint | null>;
    markGateExit(entryId: bigint): Promise<boolean>;
    recordGateEntry(studentRegisterId: string): Promise<bigint>;
    removeBook(bookId: bigint): Promise<boolean>;
    returnBook(issueId: bigint): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchBooksByAuthor(searchTerm: string): Promise<Array<Book>>;
    searchBooksByCategory(category: Category): Promise<Array<Book>>;
    searchBooksByTitle(searchTerm: string): Promise<Array<Book>>;
    updateBook(bookId: bigint, title: string, author: string, isbn: string, classification: Classification, category: Category, totalCopies: bigint, isActive: boolean): Promise<boolean>;
    updateDashboardStats(totalBooks: bigint, totalStudents: bigint): Promise<void>;
}
