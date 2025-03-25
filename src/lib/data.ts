
import { Activity } from "@/components/dashboard/RecentActivity";
import { BookInfo } from "@/components/books/BookCard";
import { UserInfo } from "@/components/users/UserCard";
import { generateUniqueBarcode } from "./barcodeUtils";

// Mock book data
export const mockBooks: BookInfo[] = [
  {
    id: "1",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    isbn: "978-0465050659",
    genre: "Design",
    location: "A1-S2",
    barcode: generateUniqueBarcode("1"),
    isAvailable: true,
    coverImage: "https://m.media-amazon.com/images/I/71I6fIe3s2L._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "978-1847941831",
    genre: "Self-Help",
    location: "B2-S1",
    barcode: generateUniqueBarcode("2"),
    isAvailable: false,
  },
  {
    id: "3",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "978-0062316097",
    genre: "History",
    location: "C3-S3",
    barcode: generateUniqueBarcode("3"),
    isAvailable: true,
    coverImage: "https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: "4",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "978-0374533557",
    genre: "Psychology",
    location: "D4-S4",
    barcode: generateUniqueBarcode("4"),
    isAvailable: true,
  },
  {
    id: "5",
    title: "Dune",
    author: "Frank Herbert",
    isbn: "978-0441172719",
    genre: "Science Fiction",
    location: "E5-S5",
    barcode: generateUniqueBarcode("5"),
    isAvailable: false,
    coverImage: "https://m.media-amazon.com/images/I/A1u+2fY5yTL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: "6",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0060935467",
    genre: "Fiction",
    location: "F6-S6",
    barcode: generateUniqueBarcode("6"),
    isAvailable: true,
  }
];

// Mock user data
export const mockUsers: UserInfo[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    membershipStartDate: new Date(2021, 2, 15),
    booksCheckedOut: 2,
    status: "active",
  },
  {
    id: "2",
    name: "Sam Taylor",
    email: "sam.taylor@example.com",
    membershipStartDate: new Date(2020, 6, 3),
    booksCheckedOut: 0,
    status: "inactive",
  },
  {
    id: "3",
    name: "Jordan Smith",
    email: "jordan.smith@example.com",
    membershipStartDate: new Date(2022, 1, 20),
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    booksCheckedOut: 1,
    status: "active",
  },
  {
    id: "4",
    name: "Casey Williams",
    email: "casey.williams@example.com",
    membershipStartDate: new Date(2022, 11, 5),
    booksCheckedOut: 3,
    status: "suspended",
  }
];

// Mock recent activity
export const mockActivities: Activity[] = [
  {
    id: "1",
    type: "checkout",
    title: "Book Checkout",
    description: "'Atomic Habits' has been checked out",
    timestamp: new Date(2023, 6, 15, 14, 30),
    user: {
      name: "Alex Johnson"
    }
  },
  {
    id: "2",
    type: "return",
    title: "Book Return",
    description: "'The Alchemist' has been returned",
    timestamp: new Date(2023, 6, 15, 12, 15),
    user: {
      name: "Jordan Smith",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    }
  },
  {
    id: "3",
    type: "new-book",
    title: "New Book Added",
    description: "'Dune' has been added to the library",
    timestamp: new Date(2023, 6, 14, 9, 45),
  },
  {
    id: "4",
    type: "new-user",
    title: "New User Registered",
    description: "Casey Williams has registered as a member",
    timestamp: new Date(2023, 6, 13, 16, 20),
  },
  {
    id: "5",
    type: "checkout",
    title: "Book Checkout",
    description: "'Sapiens: A Brief History of Humankind' has been checked out",
    timestamp: new Date(2023, 6, 12, 11, 5),
    user: {
      name: "Casey Williams"
    }
  }
];

// Dashboard statistics
export const dashboardStats = {
  totalBooks: 153,
  booksCheckedOut: 42,
  totalMembers: 87,
  activeMembers: 65
};
