import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Option "mo:core/Option";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Category = {
    #math;
    #literature;
    #computerscience;
    #economics;
    #psychology;
    #law;
    #biology;
    #chemistry;
    #philosophy;
    #physics;
    #generalKnowledge;
    #fiction;
    #nonFiction;
  };

  type Classification = {
    #ddc;
    #col;
  };

  type Book = {
    id : Nat;
    title : Text;
    author : Text;
    isbn : Text;
    classification : Classification;
    category : Category;
    totalCopies : Nat;
    availableCopies : Nat;
    isActive : Bool;
  };

  type Issue = {
    id : Nat;
    bookId : Nat;
    borrower : Principal;
    issueDate : Time.Time;
    returnDate : ?Time.Time;
    isReturned : Bool;
  };

  type GateEntry = {
    id : Nat;
    studentRegisterId : Text;
    entryTime : Time.Time;
    exitTime : ?Time.Time;
  };

  type UserProfile = {
    name : Text;
  };

  type DashboardStats = {
    totalBooks : Nat;
    totalStudents : Nat;
  };

  // State variables
  var nextBookId : Nat = 1;
  var nextIssueId : Nat = 1;
  var nextGateEntryId : Nat = 1;
  var dashboardStats : DashboardStats = {
    totalBooks = 0;
    totalStudents = 0;
  };

  let books = Map.empty<Nat, Book>();
  let issues = Map.empty<Nat, Issue>();
  let gateEntries = Map.empty<Nat, GateEntry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Book Catalog Management
  public shared ({ caller }) func addBook(
    title : Text,
    author : Text,
    isbn : Text,
    classification : Classification,
    category : Category,
    totalCopies : Nat
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add books");
    };

    let bookId = nextBookId;
    nextBookId += 1;

    let book : Book = {
      id = bookId;
      title = title;
      author = author;
      isbn = isbn;
      classification = classification;
      category = category;
      totalCopies = totalCopies;
      availableCopies = totalCopies;
      isActive = true;
    };

    books.add(bookId, book);
    bookId;
  };

  public shared ({ caller }) func updateBook(
    bookId : Nat,
    title : Text,
    author : Text,
    isbn : Text,
    classification : Classification,
    category : Category,
    totalCopies : Nat,
    isActive : Bool
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update books");
    };

    switch (books.get(bookId)) {
      case null { false };
      case (?existingBook) {
        let availableDiff = if (totalCopies >= existingBook.totalCopies) {
          totalCopies - existingBook.totalCopies;
        } else {
          0;
        };

        let updatedBook : Book = {
          id = bookId;
          title = title;
          author = author;
          isbn = isbn;
          classification = classification;
          category = category;
          totalCopies = totalCopies;
          availableCopies = existingBook.availableCopies + availableDiff;
          isActive = isActive;
        };

        books.add(bookId, updatedBook);
        true;
      };
    };
  };

  public shared ({ caller }) func removeBook(bookId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove books");
    };

    switch (books.get(bookId)) {
      case null { false };
      case (?book) {
        let updatedBook : Book = {
          id = book.id;
          title = book.title;
          author = book.author;
          isbn = book.isbn;
          classification = book.classification;
          category = book.category;
          totalCopies = book.totalCopies;
          availableCopies = book.availableCopies;
          isActive = false;
        };
        books.add(bookId, updatedBook);
        true;
      };
    };
  };

  public query func searchBooksByTitle(searchTerm : Text) : async [Book] {
    // Anyone can search books - no authorization check needed
    books.values().toArray().filter(
      func(book : Book) : Bool {
        book.title.contains(#text searchTerm) and book.isActive;
      }
    );
  };

  public query func searchBooksByAuthor(searchTerm : Text) : async [Book] {
    // Anyone can search books - no authorization check needed
    books.values().toArray().filter(
      func(book : Book) : Bool {
        book.author.contains(#text searchTerm) and book.isActive;
      }
    );
  };

  public query func searchBooksByCategory(category : Category) : async [Book] {
    // Anyone can search books - no authorization check needed
    books.values().toArray().filter(
      func(book : Book) : Bool {
        book.category == category and book.isActive;
      }
    );
  };

  public query func getAllBooks() : async [Book] {
    // Anyone can view all books - no authorization check needed
    books.values().toArray();
  };

  public query func getBook(bookId : Nat) : async ?Book {
    // Anyone can view a book - no authorization check needed
    books.get(bookId);
  };

  // Book Issue/Return Tracking
  public shared ({ caller }) func issueBook(bookId : Nat) : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can issue books");
    };

    switch (books.get(bookId)) {
      case null { null };
      case (?book) {
        if (book.availableCopies == 0 or not book.isActive) {
          return null;
        };

        let issueId = nextIssueId;
        nextIssueId += 1;

        let issue : Issue = {
          id = issueId;
          bookId = bookId;
          borrower = caller;
          issueDate = Time.now();
          returnDate = null;
          isReturned = false;
        };

        issues.add(issueId, issue);

        let updatedBook : Book = {
          id = book.id;
          title = book.title;
          author = book.author;
          isbn = book.isbn;
          classification = book.classification;
          category = book.category;
          totalCopies = book.totalCopies;
          availableCopies = book.availableCopies - 1;
          isActive = book.isActive;
        };
        books.add(bookId, updatedBook);

        ?issueId;
      };
    };
  };

  public shared ({ caller }) func returnBook(issueId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can return books");
    };

    switch (issues.get(issueId)) {
      case null { false };
      case (?issue) {
        if (issue.borrower != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only return your own books");
        };

        if (issue.isReturned) {
          return false;
        };

        let updatedIssue : Issue = {
          id = issue.id;
          bookId = issue.bookId;
          borrower = issue.borrower;
          issueDate = issue.issueDate;
          returnDate = ?Time.now();
          isReturned = true;
        };
        issues.add(issueId, updatedIssue);

        switch (books.get(issue.bookId)) {
          case null { };
          case (?book) {
            let updatedBook : Book = {
              id = book.id;
              title = book.title;
              author = book.author;
              isbn = book.isbn;
              classification = book.classification;
              category = book.category;
              totalCopies = book.totalCopies;
              availableCopies = book.availableCopies + 1;
              isActive = book.isActive;
            };
            books.add(issue.bookId, updatedBook);
          };
        };

        true;
      };
    };
  };

  public query ({ caller }) func getUserIssuedBooks(user : Principal) : async [Issue] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own issued books");
    };

    issues.values().toArray().filter(
      func(issue : Issue) : Bool {
        issue.borrower == user and not issue.isReturned;
      }
    );
  };

  public query ({ caller }) func getCallerIssuedBooks() : async [Issue] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view issued books");
    };

    issues.values().toArray().filter(
      func(issue : Issue) : Bool {
        issue.borrower == caller and not issue.isReturned;
      }
    );
  };

  // Gate Entry/Exit Tracking
  public shared ({ caller }) func recordGateEntry(studentRegisterId : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record gate entries");
    };

    let entryId = nextGateEntryId;
    nextGateEntryId += 1;

    let entry : GateEntry = {
      id = entryId;
      studentRegisterId = studentRegisterId;
      entryTime = Time.now();
      exitTime = null;
    };

    gateEntries.add(entryId, entry);
    entryId;
  };

  public shared ({ caller }) func markGateExit(entryId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark gate exits");
    };

    switch (gateEntries.get(entryId)) {
      case null { false };
      case (?entry) {
        if (entry.exitTime.isSome()) {
          return false;
        };

        let updatedEntry : GateEntry = {
          id = entry.id;
          studentRegisterId = entry.studentRegisterId;
          entryTime = entry.entryTime;
          exitTime = ?Time.now();
        };
        gateEntries.add(entryId, updatedEntry);
        true;
      };
    };
  };

  public query ({ caller }) func getTodayGateEntries() : async [GateEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view gate entries");
    };

    let now = Time.now();
    let oneDayNanos : Int = 24 * 60 * 60 * 1_000_000_000;
    let todayStart = now - oneDayNanos;

    gateEntries.values().toArray().filter(
      func(entry : GateEntry) : Bool {
        entry.entryTime >= todayStart;
      }
    );
  };

  public query ({ caller }) func getGateEntriesByStudent(studentRegisterId : Text) : async [GateEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view gate entries");
    };

    gateEntries.values().toArray().filter(
      func(entry : GateEntry) : Bool {
        entry.studentRegisterId == studentRegisterId;
      }
    );
  };

  // Dashboard Statistics
  public query func getDashboardStats() : async DashboardStats {
    // Anyone can view dashboard stats - no authorization check needed
    dashboardStats;
  };

  public shared ({ caller }) func updateDashboardStats(totalBooks : Nat, totalStudents : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update dashboard stats");
    };

    dashboardStats := {
      totalBooks = totalBooks;
      totalStudents = totalStudents;
    };
  };

  // Student Profile Data
  public query ({ caller }) func getIssuedBooksCount(user : Principal) : async Nat {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own statistics");
    };

    let userIssues = issues.values().toArray().filter(
      func(issue : Issue) : Bool {
        issue.borrower == user and not issue.isReturned;
      }
    );
    userIssues.size();
  };

  public query ({ caller }) func getGateVisitCount(studentRegisterId : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view gate visit counts");
    };

    let visits = gateEntries.values().toArray().filter(
      func(entry : GateEntry) : Bool {
        entry.studentRegisterId == studentRegisterId;
      }
    );
    visits.size();
  };
};
