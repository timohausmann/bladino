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
}
