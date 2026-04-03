import studentRecords from "../data/studentRecords.json";

export interface DemoUser {
  username: string; // register number for students, staffId/username for staff
  role: "Admin" | "Librarian" | "LibraryStaff" | "Student";
  displayName: string;
}

// Build student users from JSON
const studentUsers: Array<DemoUser & { password: string }> = studentRecords.map(
  (s) => ({
    username: s.registerId,
    password: s.password,
    role: "Student" as const,
    displayName: `${s.name} (${s.department})`,
  }),
);

const DEMO_USERS: Array<DemoUser & { password: string }> = [
  {
    username: "admin",
    password: "AKLib@Admin2024",
    role: "Admin",
    displayName: "Administrator",
  },
  {
    username: "librarian",
    password: "AKLib@Lib2024",
    role: "Librarian",
    displayName: "Ms. Ranjitha Iyer",
  },
  {
    username: "STF001",
    password: "AKLib@Staff001",
    role: "LibraryStaff",
    displayName: "Library Staff - Priya Nair",
  },
  {
    username: "STF002",
    password: "AKLib@Staff002",
    role: "LibraryStaff",
    displayName: "Library Staff - Ravi Kumar",
  },
  ...studentUsers,
];

const SESSION_KEY = "aklib_demo_session";

export function authenticateDemo(
  username: string,
  password: string,
): DemoUser | null {
  const match = DEMO_USERS.find(
    (u) => u.username === username.trim() && u.password === password,
  );
  if (!match) return null;
  return {
    username: match.username,
    role: match.role,
    displayName: match.displayName,
  };
}

export function saveDemoSession(user: DemoUser): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getDemoSession(): DemoUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function clearDemoSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
