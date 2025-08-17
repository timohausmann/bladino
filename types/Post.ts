/**
 * PostFile interface for file uploads and management
 */
export interface PostFile {
  id: string;
  url: string;
  filename: string;
  type?: string; // mime type, e.g. "image/jpeg", "application/pdf"
  size?: number; // bytes
}

/**
 * PostComment interface for post comments
 */
export interface PostComment {
  id: string;
  userId: string; // Reference to user ID
  content: string;
  timestamp: string;
  reactions: { [emoji: string]: number };
}

/**
 * Post interface that references users by ID
 */
export interface Post {
  id: string;
  userId: string; // Reference to user ID
  content: string;
  timestamp: string;
  reactions: { [emoji: string]: number };
  comments?: PostComment[]; // Optional comments array using PostComment interface
  files?: PostFile[]; // Optional files array using PostFile interface
}
