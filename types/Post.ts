export interface Post {
  id: string;
  userId: string; // Reference to user ID
  content: string;
  timestamp: string;
  editTimestamp?: string;
  reactions: { [emoji: string]: number };
  comments?: PostComment[];
  files?: PostFile[];
}

export interface PostComment {
  id: string;
  parentPostId: string;
  parentCommentId?: string;
  userId: string; // Reference to user ID
  content: string;
  timestamp: string;
  editTimestamp?: string;
  reactions: { [emoji: string]: number };
}

export interface PostFile {
  id: string;
  url: string;
  filename: string;
  type?: string; // mime type, e.g. "image/jpeg", "application/pdf"
  size?: number; // bytes
}
