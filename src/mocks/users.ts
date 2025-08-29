import { User } from "@/types";

/**
 * Sample users data for demonstration purposes
 */
export const mockUsers: User[] = [
  {
    id: "user-1",
    avatar: "https://i.pravatar.cc/150?img=2",
    name: "Jane Smith",
    handle: "janesmith",
    bio: "Full-stack developer passionate about creating beautiful, user-friendly web applications. Love exploring new technologies and sharing knowledge with the community.",
    joinDate: new Date("2022-03-15"),
    email: "jane.smith@example.com",
  },
  {
    id: "user-2",
    avatar: "https://i.pravatar.cc/150?img=3",
    name: "Alex Johnson",
    handle: "alexj",
    bio: "Frontend engineer specializing in React and modern JavaScript. Always learning and experimenting with new frameworks and design patterns.",
    joinDate: new Date("2021-11-08"),
    email: "alex.johnson@example.com",
  },
  {
    id: "user-3",
    avatar: "https://i.pravatar.cc/150?img=4",
    name: "Sophia Chen",
    handle: "sophiac",
    bio: "UX/UI designer and developer. Creating intuitive interfaces that users love to interact with. Passionate about accessibility and inclusive design.",
    joinDate: new Date("2022-01-22"),
    email: "sophia.chen@example.com",
  },
  {
    id: "user-4",
    avatar: "https://i.pravatar.cc/150?img=5",
    name: "Marcus Williams",
    handle: "marcusw",
    bio: "Creative developer and designer. Building digital experiences that inspire and engage. Always pushing the boundaries of what's possible on the web.",
    joinDate: new Date("2021-08-14"),
    email: "marcus.williams@example.com",
  },
  {
    id: "user-5",
    avatar: "https://i.pravatar.cc/150?img=6",
    name: "Mike Chen",
    handle: "mikechen",
    bio: "Backend developer with a passion for clean code and scalable architecture. Love solving complex problems and mentoring junior developers.",
    joinDate: new Date("2022-05-03"),
    email: "mike.chen@example.com",
  },
  {
    id: "user-6",
    avatar: "https://i.pravatar.cc/150?img=7",
    name: "Sarah Wilson",
    handle: "sarahw",
    bio: "Product manager and developer advocate. Helping teams build better products through user research, data analysis, and technical expertise.",
    joinDate: new Date("2021-12-19"),
    email: "sarah.wilson@example.com",
  },
  {
    id: "user-7",
    avatar: "https://i.pravatar.cc/150?img=8",
    name: "David Kim",
    handle: "davidk",
    bio: "Full-stack developer focused on performance and optimization. Building fast, reliable applications that users love.",
    joinDate: new Date("2022-02-11"),
    email: "david.kim@example.com",
  },
  {
    id: "user-8",
    avatar: "https://i.pravatar.cc/150?img=9",
    name: "Emma Rodriguez",
    handle: "emmar",
    bio: "Frontend developer and accessibility advocate. Creating inclusive web experiences that work for everyone, regardless of ability.",
    joinDate: new Date("2021-09-28"),
    email: "emma.rodriguez@example.com",
  },
  {
    id: "user-9",
    avatar: "https://i.pravatar.cc/150?img=10",
    name: "Tom Anderson",
    handle: "tomand",
    bio: "Developer and tech enthusiast. Always exploring new tools and sharing discoveries with the community. Building the future, one line of code at a time.",
    joinDate: new Date("2022-04-17"),
    email: "tom.anderson@example.com",
  },
  {
    id: "user-10",
    avatar: "https://i.pravatar.cc/150?img=11",
    name: "Lisa Park",
    handle: "lisap",
    bio: "Creative developer and digital artist. Combining code and design to create unique, engaging web experiences that tell stories.",
    joinDate: new Date("2021-10-05"),
    email: "lisa.park@example.com",
  },
];

/**
 * Helper function to get user by ID
 */
export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

/**
 * Helper function to get user by handle
 */
export function getUserByHandle(handle: string): User | undefined {
  return mockUsers.find((user) => user.handle === handle);
}

/**
 * Helper function to get user by email
 */
export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email === email);
}
