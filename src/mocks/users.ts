import type { User } from '@/graphql';

/** Sample users shaped like GraphQL User objects. */
export const mockUsers: User[] = [
  {
    id: 'user-1',
    avatar: 'https://i.pravatar.cc/150?img=2',
    name: 'Jane Smith',
    description:
      'Full-stack developer passionate about creating beautiful, user-friendly web applications. Love exploring new technologies and sharing knowledge with the community.',
    dateCreated: '2022-03-15',
    email: 'jane.smith@example.com',
  },
  {
    id: 'user-2',
    avatar: 'https://i.pravatar.cc/150?img=3',
    name: 'Alex Johnson',
    description:
      'Frontend engineer specializing in React and modern JavaScript. Always learning and experimenting with new frameworks and design patterns.',
    dateCreated: '2021-11-08',
    email: 'alex.johnson@example.com',
  },
  {
    id: 'user-3',
    avatar: 'https://i.pravatar.cc/150?img=4',
    name: 'Sophia Chen',
    description:
      'UX/UI designer and developer. Creating intuitive interfaces that users love to interact with. Passionate about accessibility and inclusive design.',
    dateCreated: '2022-01-22',
    email: 'sophia.chen@example.com',
  },
  {
    id: 'user-4',
    avatar: 'https://i.pravatar.cc/150?img=5',
    name: 'Marcus Williams',
    description:
      "Creative developer and designer. Building digital experiences that inspire and engage. Always pushing the boundaries of what's possible on the web.",
    dateCreated: '2021-08-14',
    email: 'marcus.williams@example.com',
  },
  {
    id: 'user-5',
    avatar: 'https://i.pravatar.cc/150?img=6',
    name: 'Mike Chen',
    description:
      'Backend developer with a passion for clean code and scalable architecture. Love solving complex problems and mentoring junior developers.',
    dateCreated: '2022-05-03',
    email: 'mike.chen@example.com',
  },
  {
    id: 'user-6',
    avatar: 'https://i.pravatar.cc/150?img=7',
    name: 'Sarah Wilson',
    description:
      'Product manager and developer advocate. Helping teams build better products through user research, data analysis, and technical expertise.',
    dateCreated: '2021-12-19',
    email: 'sarah.wilson@example.com',
  },
  {
    id: 'user-7',
    avatar: 'https://i.pravatar.cc/150?img=8',
    name: 'David Kim',
    description:
      'Full-stack developer focused on performance and optimization. Building fast, reliable applications that users love.',
    dateCreated: '2022-02-11',
    email: 'david.kim@example.com',
  },
  {
    id: 'user-8',
    avatar: 'https://i.pravatar.cc/150?img=9',
    name: 'Emma Rodriguez',
    description:
      'Frontend developer and accessibility advocate. Creating inclusive web experiences that work for everyone, regardless of ability.',
    dateCreated: '2021-09-28',
    email: 'emma.rodriguez@example.com',
  },
  {
    id: 'user-9',
    avatar: 'https://i.pravatar.cc/150?img=10',
    name: 'Tom Anderson',
    description:
      'Developer and tech enthusiast. Always exploring new tools and sharing discoveries with the community. Building the future, one line of code at a time.',
    dateCreated: '2022-04-17',
    email: 'tom.anderson@example.com',
  },
  {
    id: 'user-10',
    avatar: 'https://i.pravatar.cc/150?img=11',
    name: 'Lisa Park',
    description:
      'Creative developer and digital artist. Combining code and design to create unique, engaging web experiences that tell stories.',
    dateCreated: '2021-10-05',
    email: 'lisa.park@example.com',
  },
];

export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

/** Profile routes use the user's name as the URL segment. */
export function getUserByName(name: string): User | undefined {
  return mockUsers.find((user) => user.name === name);
}

export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email === email);
}
