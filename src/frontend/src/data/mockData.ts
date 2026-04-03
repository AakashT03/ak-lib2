// Mock data for AK Lib - Library Management System
// Used for features not yet in backend API

export interface EntryLog {
  id: number;
  registerNumber: string;
  name: string;
  department: string;
  entryTime: string;
  exitTime: string | null;
  duration: string | null;
  date: string;
}

export interface Acquisition {
  id: number;
  title: string;
  author: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  purchaseDate: string;
  vendor: string;
  year: number;
}

export interface EResource {
  id: number;
  title: string;
  type: "E-Book" | "Journal" | "Magazine";
  subject: string;
  description: string;
  accessUrl: string;
  year: number;
  publisher: string;
  coverColor: string;
}

export interface Magazine {
  id: number;
  name: string;
  latestIssue: string;
  category: string;
  frequency: string;
  description: string;
  coverColor: string;
}

export interface UserProfile {
  id: number;
  registerNumber: string;
  name: string;
  role: string;
  department: string;
  status: "Active" | "Inactive";
  lastLogin: string;
  email: string;
}

export interface ActivityItem {
  id: number;
  type: "issue" | "return" | "entry" | "exit" | "acquisition" | "new_user";
  message: string;
  time: string;
  user: string;
}

export interface LearningResource {
  id: number;
  title: string;
  description: string;
  category: "Science" | "Mathematics" | "Programming" | "Videos" | "Reference";
  url: string;
  icon: string;
}

export const mockEntryLogs: EntryLog[] = [
  {
    id: 1,
    registerNumber: "21CS001",
    name: "Arjun Kumar",
    department: "Computer Science",
    entryTime: "09:12 AM",
    exitTime: "01:35 PM",
    duration: "4h 23m",
    date: "2026-04-02",
  },
  {
    id: 2,
    registerNumber: "21EC042",
    name: "Priya Sharma",
    department: "Electronics",
    entryTime: "09:45 AM",
    exitTime: "12:10 PM",
    duration: "2h 25m",
    date: "2026-04-02",
  },
  {
    id: 3,
    registerNumber: "21ME015",
    name: "Rahul Singh",
    department: "Mechanical",
    entryTime: "10:00 AM",
    exitTime: "02:00 PM",
    duration: "4h 00m",
    date: "2026-04-02",
  },
  {
    id: 4,
    registerNumber: "21CE028",
    name: "Anjali Verma",
    department: "Civil",
    entryTime: "10:30 AM",
    exitTime: null,
    duration: null,
    date: "2026-04-02",
  },
  {
    id: 5,
    registerNumber: "21CS067",
    name: "Vikram Patel",
    department: "Computer Science",
    entryTime: "11:00 AM",
    exitTime: "01:00 PM",
    duration: "2h 00m",
    date: "2026-04-02",
  },
  {
    id: 6,
    registerNumber: "21EE033",
    name: "Divya Nair",
    department: "Electrical",
    entryTime: "11:15 AM",
    exitTime: null,
    duration: null,
    date: "2026-04-02",
  },
  {
    id: 7,
    registerNumber: "21CS089",
    name: "Suresh Babu",
    department: "Computer Science",
    entryTime: "08:50 AM",
    exitTime: "11:30 AM",
    duration: "2h 40m",
    date: "2026-04-02",
  },
  {
    id: 8,
    registerNumber: "21BT012",
    name: "Kavitha Reddy",
    department: "Biotechnology",
    entryTime: "09:30 AM",
    exitTime: "12:45 PM",
    duration: "3h 15m",
    date: "2026-04-02",
  },
  {
    id: 9,
    registerNumber: "20CS055",
    name: "Mohan Das",
    department: "Computer Science",
    entryTime: "02:00 PM",
    exitTime: "05:00 PM",
    duration: "3h 00m",
    date: "2026-04-01",
  },
  {
    id: 10,
    registerNumber: "20ME022",
    name: "Lakshmi Priya",
    department: "Mechanical",
    entryTime: "09:00 AM",
    exitTime: "01:00 PM",
    duration: "4h 00m",
    date: "2026-04-01",
  },
  {
    id: 11,
    registerNumber: "21CH019",
    name: "Karthik Raj",
    department: "Chemical",
    entryTime: "10:45 AM",
    exitTime: "02:30 PM",
    duration: "3h 45m",
    date: "2026-04-01",
  },
  {
    id: 12,
    registerNumber: "21CS034",
    name: "Sneha Pillai",
    department: "Computer Science",
    entryTime: "03:00 PM",
    exitTime: "05:30 PM",
    duration: "2h 30m",
    date: "2026-04-01",
  },
];

export const mockAcquisitions: Acquisition[] = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Cormen, Leiserson, Rivest",
    category: "Computer Science",
    quantity: 5,
    unitPrice: 2800,
    totalPrice: 14000,
    purchaseDate: "2026-03-15",
    vendor: "Academic Publishers Ltd",
    year: 2026,
  },
  {
    id: 2,
    title: "Organic Chemistry",
    author: "Paula Bruice",
    category: "Chemistry",
    quantity: 10,
    unitPrice: 1950,
    totalPrice: 19500,
    purchaseDate: "2026-03-10",
    vendor: "Science Books India",
    year: 2026,
  },
  {
    id: 3,
    title: "Engineering Mathematics Vol. II",
    author: "B.S. Grewal",
    category: "Mathematics",
    quantity: 20,
    unitPrice: 850,
    totalPrice: 17000,
    purchaseDate: "2026-02-28",
    vendor: "Khanna Publishers",
    year: 2026,
  },
  {
    id: 4,
    title: "Constitutional Law of India",
    author: "Dr. J.N. Pandey",
    category: "Law",
    quantity: 8,
    unitPrice: 1200,
    totalPrice: 9600,
    purchaseDate: "2026-02-20",
    vendor: "Central Law Publications",
    year: 2026,
  },
  {
    id: 5,
    title: "Cell Biology and Genetics",
    author: "U. Satyanarayana",
    category: "Biology",
    quantity: 15,
    unitPrice: 1100,
    totalPrice: 16500,
    purchaseDate: "2026-02-15",
    vendor: "Books India Distribution",
    year: 2026,
  },
  {
    id: 6,
    title: "Microeconomics Theory",
    author: "Hal Varian",
    category: "Economics",
    quantity: 6,
    unitPrice: 2200,
    totalPrice: 13200,
    purchaseDate: "2026-01-30",
    vendor: "Norton Academic India",
    year: 2026,
  },
  {
    id: 7,
    title: "Quantum Mechanics",
    author: "Griffiths",
    category: "Physics",
    quantity: 12,
    unitPrice: 1750,
    totalPrice: 21000,
    purchaseDate: "2026-01-20",
    vendor: "Pearson India",
    year: 2026,
  },
  {
    id: 8,
    title: "Data Structures Using C",
    author: "Reema Thareja",
    category: "Computer Science",
    quantity: 25,
    unitPrice: 650,
    totalPrice: 16250,
    purchaseDate: "2025-12-10",
    vendor: "Oxford University Press",
    year: 2025,
  },
  {
    id: 9,
    title: "Clinical Psychology",
    author: "Timothy Trull",
    category: "Psychology",
    quantity: 10,
    unitPrice: 1900,
    totalPrice: 19000,
    purchaseDate: "2025-12-05",
    vendor: "Cengage Learning",
    year: 2025,
  },
  {
    id: 10,
    title: "Theory of Literature",
    author: "Rene Wellek & Austin Warren",
    category: "Literature",
    quantity: 18,
    unitPrice: 750,
    totalPrice: 13500,
    purchaseDate: "2025-11-25",
    vendor: "Harcourt India",
    year: 2025,
  },
  {
    id: 11,
    title: "Digital Electronics",
    author: "Anand Kumar",
    category: "Computer Science",
    quantity: 30,
    unitPrice: 480,
    totalPrice: 14400,
    purchaseDate: "2025-11-10",
    vendor: "PHI Learning",
    year: 2025,
  },
  {
    id: 12,
    title: "General Knowledge Encyclopedia",
    author: "Manohar Pandey",
    category: "General Knowledge",
    quantity: 50,
    unitPrice: 350,
    totalPrice: 17500,
    purchaseDate: "2025-10-20",
    vendor: "Arihant Publications",
    year: 2025,
  },
  {
    id: 13,
    title: "Philosophy of Mind",
    author: "Jaegwon Kim",
    category: "Philosophy",
    quantity: 7,
    unitPrice: 1600,
    totalPrice: 11200,
    purchaseDate: "2025-10-05",
    vendor: "Blackwell Publishers",
    year: 2025,
  },
  {
    id: 14,
    title: "Financial Management",
    author: "Prasanna Chandra",
    category: "Economics",
    quantity: 20,
    unitPrice: 950,
    totalPrice: 19000,
    purchaseDate: "2025-09-15",
    vendor: "McGraw Hill India",
    year: 2025,
  },
  {
    id: 15,
    title: "Fiction Masterworks Anthology",
    author: "Various Authors",
    category: "Fiction",
    quantity: 15,
    unitPrice: 600,
    totalPrice: 9000,
    purchaseDate: "2025-09-01",
    vendor: "Penguin Books India",
    year: 2025,
  },
];

export const mockEResources: EResource[] = [
  {
    id: 1,
    title: "IEEE Transactions on Computer Science",
    type: "Journal",
    subject: "Computer Science",
    description:
      "Peer-reviewed journal covering algorithms, systems, and software engineering",
    accessUrl: "https://ieeexplore.ieee.org",
    year: 2026,
    publisher: "IEEE",
    coverColor: "from-blue-900 to-blue-700",
  },
  {
    id: 2,
    title: "Introduction to Machine Learning (E-Book)",
    type: "E-Book",
    subject: "Computer Science",
    description:
      "Comprehensive guide to machine learning algorithms and applications",
    accessUrl: "https://www.gutenberg.org",
    year: 2025,
    publisher: "MIT Press",
    coverColor: "from-teal-900 to-teal-700",
  },
  {
    id: 3,
    title: "Journal of Organic Chemistry",
    type: "Journal",
    subject: "Chemistry",
    description:
      "Covers synthesis, reaction mechanisms, and organic compound analysis",
    accessUrl: "https://pubs.acs.org/journal/joceah",
    year: 2026,
    publisher: "ACS Publications",
    coverColor: "from-green-900 to-green-700",
  },
  {
    id: 4,
    title: "Medical Sciences E-Library",
    type: "E-Book",
    subject: "Medicine",
    description:
      "Digital access to Gray's Anatomy, Harrison's Principles, and medical reference books",
    accessUrl: "https://www.ncbi.nlm.nih.gov",
    year: 2025,
    publisher: "NCBI NLM",
    coverColor: "from-red-900 to-red-700",
  },
  {
    id: 5,
    title: "Nature Research Journals",
    type: "Journal",
    subject: "Science",
    description:
      "Premium scientific research across biology, chemistry, physics, and earth sciences",
    accessUrl: "https://www.nature.com",
    year: 2026,
    publisher: "Springer Nature",
    coverColor: "from-purple-900 to-purple-700",
  },
  {
    id: 6,
    title: "Econometrica Digital",
    type: "Journal",
    subject: "Economics",
    description:
      "Mathematical economics and statistical methods in economic research",
    accessUrl: "https://www.econometricsociety.org",
    year: 2025,
    publisher: "Econometric Society",
    coverColor: "from-amber-900 to-amber-700",
  },
  {
    id: 7,
    title: "Elements of Statistical Learning",
    type: "E-Book",
    subject: "Mathematics",
    description:
      "Data mining, inference, and prediction using statistical methods",
    accessUrl: "https://hastie.su.domains/ElemStatLearn",
    year: 2024,
    publisher: "Stanford University",
    coverColor: "from-indigo-900 to-indigo-700",
  },
  {
    id: 8,
    title: "Physical Review Letters",
    type: "Journal",
    subject: "Physics",
    description:
      "Short reports on significant physical discoveries and observations",
    accessUrl: "https://journals.aps.org/prl",
    year: 2026,
    publisher: "American Physical Society",
    coverColor: "from-cyan-900 to-cyan-700",
  },
  {
    id: 9,
    title: "Contract Law Foundations",
    type: "E-Book",
    subject: "Law",
    description: "Principles and cases in Indian contract and commercial law",
    accessUrl: "https://www.epgpathshala.ac.in",
    year: 2024,
    publisher: "UGC e-PG Pathshala",
    coverColor: "from-orange-900 to-orange-700",
  },
  {
    id: 10,
    title: "Bioinformatics Algorithms",
    type: "E-Book",
    subject: "Biology",
    description: "Computational approaches to biological sequence analysis",
    accessUrl: "https://www.ncbi.nlm.nih.gov/books",
    year: 2025,
    publisher: "NCBI",
    coverColor: "from-lime-900 to-lime-700",
  },
];

export const mockMagazines: Magazine[] = [
  {
    id: 1,
    name: "Science Today",
    latestIssue: "March 2026",
    category: "Science",
    frequency: "Monthly",
    description:
      "Popular science news, discoveries, and technology breakthroughs",
    coverColor: "from-sky-800 to-sky-600",
  },
  {
    id: 2,
    name: "Digit Tech Magazine",
    latestIssue: "April 2026",
    category: "Technology",
    frequency: "Monthly",
    description:
      "India's leading technology magazine covering gadgets, software and IT trends",
    coverColor: "from-indigo-800 to-indigo-600",
  },
  {
    id: 3,
    name: "Competition Success Review",
    latestIssue: "April 2026",
    category: "Education",
    frequency: "Monthly",
    description:
      "Competitive exam preparation, current affairs, and career guidance",
    coverColor: "from-amber-800 to-amber-600",
  },
  {
    id: 4,
    name: "Down To Earth",
    latestIssue: "15 March 2026",
    category: "Environment",
    frequency: "Bi-weekly",
    description:
      "Environmental and science policy magazine by Centre for Science and Environment",
    coverColor: "from-green-800 to-green-600",
  },
  {
    id: 5,
    name: "Economic & Political Weekly",
    latestIssue: "30 March 2026",
    category: "Economics",
    frequency: "Weekly",
    description:
      "Critical economic, political and social issues of contemporary India",
    coverColor: "from-slate-800 to-slate-600",
  },
  {
    id: 6,
    name: "Frontline",
    latestIssue: "5 April 2026",
    category: "Current Affairs",
    frequency: "Bi-weekly",
    description:
      "In-depth reporting on national and international politics and society",
    coverColor: "from-red-800 to-red-600",
  },
  {
    id: 7,
    name: "Resonance Physics Journal",
    latestIssue: "February 2026",
    category: "Physics",
    frequency: "Monthly",
    description:
      "Advanced physics concepts, problems, and research for students",
    coverColor: "from-violet-800 to-violet-600",
  },
  {
    id: 8,
    name: "Current Science",
    latestIssue: "25 March 2026",
    category: "Science",
    frequency: "Bi-weekly",
    description: "Scientific journal published by Indian Academy of Sciences",
    coverColor: "from-teal-800 to-teal-600",
  },
  {
    id: 9,
    name: "Law Quarterly Review",
    latestIssue: "January 2026",
    category: "Law",
    frequency: "Quarterly",
    description: "Legal scholarship, case commentaries and jurisprudence",
    coverColor: "from-orange-800 to-orange-600",
  },
  {
    id: 10,
    name: "Psychology Today India",
    latestIssue: "March 2026",
    category: "Psychology",
    frequency: "Monthly",
    description:
      "Mental health, behaviour, relationships and wellness insights",
    coverColor: "from-pink-800 to-pink-600",
  },
];

export const mockUsers: UserProfile[] = [
  {
    id: 1,
    registerNumber: "ADMIN001",
    name: "Dr. Suresh Menon",
    role: "Admin",
    department: "Library Administration",
    status: "Active",
    lastLogin: "2026-04-02 09:00",
    email: "suresh.menon@aklib.edu",
  },
  {
    id: 2,
    registerNumber: "LIB001",
    name: "Ms. Ranjitha Iyer",
    role: "Librarian",
    department: "Main Library",
    status: "Active",
    lastLogin: "2026-04-02 08:45",
    email: "ranjitha.iyer@aklib.edu",
  },
  {
    id: 3,
    registerNumber: "LIB002",
    name: "Mr. Balaji Krishnan",
    role: "Librarian",
    department: "Digital Section",
    status: "Active",
    lastLogin: "2026-04-01 16:30",
    email: "balaji.k@aklib.edu",
  },
  {
    id: 4,
    registerNumber: "21CS001",
    name: "Arjun Kumar",
    role: "Student",
    department: "Computer Science",
    status: "Active",
    lastLogin: "2026-04-02 09:12",
    email: "arjun.kumar@student.aklib.edu",
  },
  {
    id: 5,
    registerNumber: "21EC042",
    name: "Priya Sharma",
    role: "Student",
    department: "Electronics",
    status: "Active",
    lastLogin: "2026-04-02 09:45",
    email: "priya.sharma@student.aklib.edu",
  },
  {
    id: 6,
    registerNumber: "21ME015",
    name: "Rahul Singh",
    role: "Student",
    department: "Mechanical",
    status: "Active",
    lastLogin: "2026-04-02 10:00",
    email: "rahul.singh@student.aklib.edu",
  },
  {
    id: 7,
    registerNumber: "21CS034",
    name: "Sneha Pillai",
    role: "Student",
    department: "Computer Science",
    status: "Active",
    lastLogin: "2026-04-01 15:00",
    email: "sneha.pillai@student.aklib.edu",
  },
  {
    id: 8,
    registerNumber: "20ME022",
    name: "Lakshmi Priya",
    role: "Student",
    department: "Mechanical",
    status: "Inactive",
    lastLogin: "2026-03-28 11:00",
    email: "lakshmi.p@student.aklib.edu",
  },
  {
    id: 9,
    registerNumber: "21BT012",
    name: "Kavitha Reddy",
    role: "Student",
    department: "Biotechnology",
    status: "Active",
    lastLogin: "2026-04-02 09:30",
    email: "kavitha.r@student.aklib.edu",
  },
  {
    id: 10,
    registerNumber: "21EE033",
    name: "Divya Nair",
    role: "Student",
    department: "Electrical",
    status: "Active",
    lastLogin: "2026-04-02 11:15",
    email: "divya.nair@student.aklib.edu",
  },
];

export const mockActivity: ActivityItem[] = [
  {
    id: 1,
    type: "issue",
    message: "'Introduction to Algorithms' issued to Arjun Kumar",
    time: "2 min ago",
    user: "21CS001",
  },
  {
    id: 2,
    type: "entry",
    message: "Priya Sharma entered library (21EC042)",
    time: "8 min ago",
    user: "21EC042",
  },
  {
    id: 3,
    type: "return",
    message: "'Quantum Mechanics' returned by Rahul Singh",
    time: "15 min ago",
    user: "21ME015",
  },
  {
    id: 4,
    type: "acquisition",
    message: "25 copies of 'Data Structures Using C' added",
    time: "1 hr ago",
    user: "LIB001",
  },
  {
    id: 5,
    type: "new_user",
    message: "New student registered: Karthik Raj (21CH019)",
    time: "2 hr ago",
    user: "ADMIN001",
  },
  {
    id: 6,
    type: "issue",
    message: "'Cell Biology and Genetics' issued to Kavitha Reddy",
    time: "3 hr ago",
    user: "21BT012",
  },
  {
    id: 7,
    type: "exit",
    message: "Suresh Babu exited library (21CS089)",
    time: "4 hr ago",
    user: "21CS089",
  },
  {
    id: 8,
    type: "return",
    message: "'Constitutional Law' returned by Divya Nair",
    time: "5 hr ago",
    user: "21EE033",
  },
];

export const mockLearningResources: LearningResource[] = [
  {
    id: 1,
    title: "PhET Interactive Simulations",
    description:
      "Free interactive science and math simulations from University of Colorado Boulder",
    category: "Science",
    url: "https://phet.colorado.edu",
    icon: "🔬",
  },
  {
    id: 2,
    title: "NPTEL Online Courses",
    description:
      "IIT & IISc faculty delivered courses on engineering, science, humanities and management",
    category: "Science",
    url: "https://nptel.ac.in",
    icon: "🎓",
  },
  {
    id: 3,
    title: "Desmos Graphing Calculator",
    description:
      "Free online graphing calculator for functions, geometry, 3D, and statistics",
    category: "Mathematics",
    url: "https://www.desmos.com",
    icon: "📊",
  },
  {
    id: 4,
    title: "Wolfram Alpha",
    description:
      "Computational intelligence for math, science, engineering, and data analysis",
    category: "Mathematics",
    url: "https://www.wolframalpha.com",
    icon: "∑",
  },
  {
    id: 5,
    title: "Khan Academy",
    description:
      "Free world-class education in math, science, computing, humanities and more",
    category: "Mathematics",
    url: "https://www.khanacademy.org",
    icon: "📚",
  },
  {
    id: 6,
    title: "freeCodeCamp",
    description:
      "Learn web development, data science, and software engineering for free",
    category: "Programming",
    url: "https://www.freecodecamp.org",
    icon: "💻",
  },
  {
    id: 7,
    title: "CS50 Harvard OpenCourseWare",
    description:
      "Harvard University's introduction to computer science and programming",
    category: "Programming",
    url: "https://cs50.harvard.edu",
    icon: "🖥️",
  },
  {
    id: 8,
    title: "The Odin Project",
    description:
      "Full-stack curriculum for learning web development with hands-on projects",
    category: "Programming",
    url: "https://www.theodinproject.com",
    icon: "⚡",
  },
  {
    id: 9,
    title: "MIT OpenCourseWare",
    description:
      "Free lecture notes, exams, and videos from MIT across all disciplines",
    category: "Videos",
    url: "https://ocw.mit.edu",
    icon: "🎬",
  },
  {
    id: 10,
    title: "3Blue1Brown",
    description:
      "Animated math explanations covering linear algebra, calculus, and neural networks",
    category: "Videos",
    url: "https://www.3blue1brown.com",
    icon: "🔵",
  },
  {
    id: 11,
    title: "Crash Course",
    description:
      "Educational video series covering science, history, literature, and more",
    category: "Videos",
    url: "https://www.youtube.com/@crashcourse",
    icon: "📹",
  },
  {
    id: 12,
    title: "NCERT Digital Textbooks",
    description:
      "Official NCERT e-textbooks for classes 6-12 across all subjects",
    category: "Reference",
    url: "https://ncert.nic.in/textbook.php",
    icon: "📖",
  },
  {
    id: 13,
    title: "e-PG Pathshala",
    description:
      "UGC's postgraduate e-learning portal for 70+ subjects with rich content",
    category: "Reference",
    url: "https://epgp.inflibnet.ac.in",
    icon: "🏛️",
  },
  {
    id: 14,
    title: "Shodhganga",
    description:
      "Reservoir of Indian theses and dissertations from universities across India",
    category: "Reference",
    url: "https://shodhganga.inflibnet.ac.in",
    icon: "🔎",
  },
];

export const mockUsageTrends = [
  { month: "Oct", entries: 420, issued: 310 },
  { month: "Nov", entries: 380, issued: 275 },
  { month: "Dec", entries: 280, issued: 190 },
  { month: "Jan", entries: 450, issued: 320 },
  { month: "Feb", entries: 510, issued: 380 },
  { month: "Mar", entries: 490, issued: 360 },
  { month: "Apr", entries: 215, issued: 142 },
];

export const mockCategoryDistribution = [
  { category: "Computer Science", count: 850, color: "#22B7AD" },
  { category: "Mathematics", count: 620, color: "#D18A4A" },
  { category: "Physics", count: 480, color: "#2ECC9A" },
  { category: "Chemistry", count: 390, color: "#7B5EA7" },
  { category: "Biology", count: 310, color: "#E74C6F" },
  { category: "Economics", count: 280, color: "#4ECDC4" },
  { category: "Literature", count: 260, color: "#45B7D1" },
  { category: "Law", count: 220, color: "#FFA47A" },
  { category: "Other", count: 290, color: "#7F93A8" },
];

export const mockIssuedByMonth = [
  { month: "Oct", issued: 310, returned: 290 },
  { month: "Nov", issued: 275, returned: 260 },
  { month: "Dec", issued: 190, returned: 195 },
  { month: "Jan", issued: 320, returned: 300 },
  { month: "Feb", issued: 380, returned: 355 },
  { month: "Mar", issued: 360, returned: 340 },
  { month: "Apr", issued: 142, returned: 98 },
];

export const mockTopBooks = [
  {
    rank: 1,
    title: "Introduction to Algorithms",
    author: "Cormen et al.",
    category: "Computer Science",
    timesIssued: 47,
  },
  {
    rank: 2,
    title: "Engineering Mathematics",
    author: "B.S. Grewal",
    category: "Mathematics",
    timesIssued: 42,
  },
  {
    rank: 3,
    title: "Quantum Mechanics",
    author: "Griffiths",
    category: "Physics",
    timesIssued: 38,
  },
  {
    rank: 4,
    title: "Organic Chemistry",
    author: "Paula Bruice",
    category: "Chemistry",
    timesIssued: 35,
  },
  {
    rank: 5,
    title: "Cell Biology and Genetics",
    author: "U. Satyanarayana",
    category: "Biology",
    timesIssued: 32,
  },
  {
    rank: 6,
    title: "Data Structures Using C",
    author: "Reema Thareja",
    category: "Computer Science",
    timesIssued: 29,
  },
  {
    rank: 7,
    title: "Constitutional Law of India",
    author: "Dr. J.N. Pandey",
    category: "Law",
    timesIssued: 27,
  },
  {
    rank: 8,
    title: "Microeconomics Theory",
    author: "Hal Varian",
    category: "Economics",
    timesIssued: 24,
  },
  {
    rank: 9,
    title: "Theory of Literature",
    author: "Wellek & Warren",
    category: "Literature",
    timesIssued: 22,
  },
  {
    rank: 10,
    title: "Clinical Psychology",
    author: "Timothy Trull",
    category: "Psychology",
    timesIssued: 20,
  },
];
