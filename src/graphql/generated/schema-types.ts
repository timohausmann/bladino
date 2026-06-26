export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
};

export type Channel = {
  __typename?: 'Channel';
  comments?: Maybe<Array<Maybe<Comment>>>;
  dateCreated: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  lastView?: Maybe<Scalars['Date']['output']>;
  name: Scalars['String']['output'];
  unreadCount?: Maybe<Scalars['Int']['output']>;
};

export type Comment = Post & {
  __typename?: 'Comment';
  body?: Maybe<Scalars['String']['output']>;
  channel?: Maybe<Scalars['ID']['output']>;
  children?: Maybe<Array<Maybe<Comment>>>;
  dateCreated?: Maybe<Scalars['Date']['output']>;
  dateEdited?: Maybe<Scalars['Date']['output']>;
  files?: Maybe<Array<Maybe<File>>>;
  id: Scalars['ID']['output'];
  parent?: Maybe<Scalars['ID']['output']>;
  user: User;
  voteNum?: Maybe<Scalars['Int']['output']>;
  votes?: Maybe<Array<Maybe<Vote>>>;
  weblinks?: Maybe<Array<Maybe<Weblink>>>;
};

export type CommentFeed = {
  __typename?: 'CommentFeed';
  comments: Array<Maybe<Comment>>;
  cursor: Scalars['Date']['output'];
};

export type CommentFilter = {
  channel?: InputMaybe<Scalars['ID']['input']>;
  mediaOnly?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  user?: InputMaybe<Scalars['ID']['input']>;
};

export type File = Post & {
  __typename?: 'File';
  channel?: Maybe<Scalars['ID']['output']>;
  dateCreated?: Maybe<Scalars['Date']['output']>;
  dateEdited?: Maybe<Scalars['Date']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<Scalars['ID']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  user: User;
};

export type Mail = {
  __typename?: 'Mail';
  bcc?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  body?: Maybe<Scalars['String']['output']>;
  cc?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  dateReceived?: Maybe<Scalars['Date']['output']>;
  dateSent?: Maybe<Scalars['Date']['output']>;
  folder?: Maybe<Scalars['String']['output']>;
  from?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  subject?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  unread?: Maybe<Scalars['Boolean']['output']>;
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  addChannel: Channel;
  addComment: Comment;
  addNote: Note;
  addUser: User;
  addWeblink: Weblink;
  deleteAllMail?: Maybe<Scalars['Boolean']['output']>;
  deleteChannel?: Maybe<Scalars['Boolean']['output']>;
  deleteComment?: Maybe<Scalars['Boolean']['output']>;
  deleteFile?: Maybe<Scalars['Boolean']['output']>;
  deleteMail?: Maybe<Scalars['Boolean']['output']>;
  deleteNote?: Maybe<Scalars['Boolean']['output']>;
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  deleteWeblink?: Maybe<Scalars['Boolean']['output']>;
  login: Scalars['String']['output'];
  loginMagic?: Maybe<Scalars['String']['output']>;
  loginOld?: Maybe<Scalars['String']['output']>;
  migrateUser?: Maybe<Scalars['Boolean']['output']>;
  readMail?: Maybe<Scalars['Boolean']['output']>;
  requestMagic?: Maybe<Scalars['Boolean']['output']>;
  sendEmail?: Maybe<Scalars['Boolean']['output']>;
  toggleVote: Scalars['Int']['output'];
  updateChannel: Channel;
  updateChannelView?: Maybe<Scalars['Boolean']['output']>;
  updateComment: Comment;
  updateNote: Note;
  updatePassword?: Maybe<Scalars['Boolean']['output']>;
  updateUser: User;
  updateWeblink: Weblink;
};


export type MutationAddChannelArgs = {
  name: Scalars['String']['input'];
};


export type MutationAddCommentArgs = {
  body?: InputMaybe<Scalars['String']['input']>;
  channel?: InputMaybe<Scalars['ID']['input']>;
  files?: InputMaybe<Array<Scalars['ID']['input']>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationAddNoteArgs = {
  body: Scalars['String']['input'];
};


export type MutationAddUserArgs = {
  name: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationAddWeblinkArgs = {
  url: Scalars['String']['input'];
};


export type MutationDeleteChannelArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMailArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNoteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteWeblinkArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationLoginMagicArgs = {
  token: Scalars['String']['input'];
};


export type MutationLoginOldArgs = {
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationMigrateUserArgs = {
  birthday?: InputMaybe<Scalars['Date']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  token: Scalars['String']['input'];
};


export type MutationReadMailArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRequestMagicArgs = {
  handle: Scalars['String']['input'];
};


export type MutationSendEmailArgs = {
  bcc?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  body: Scalars['String']['input'];
  cc?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  subject: Scalars['String']['input'];
  to: Array<InputMaybe<Scalars['String']['input']>>;
};


export type MutationToggleVoteArgs = {
  post: Scalars['ID']['input'];
};


export type MutationUpdateChannelArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateChannelViewArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCommentArgs = {
  body?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<Array<Scalars['ID']['input']>>;
  id: Scalars['ID']['input'];
};


export type MutationUpdateNoteArgs = {
  body: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUpdatePasswordArgs = {
  id: Scalars['ID']['input'];
  newpass: Scalars['String']['input'];
  oldpass: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  birthday?: InputMaybe<Scalars['Date']['input']>;
  dateCreated?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  oldid?: InputMaybe<Scalars['Int']['input']>;
  oldpass?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateWeblinkArgs = {
  id: Scalars['ID']['input'];
  url: Scalars['String']['input'];
};

export type Note = Post & {
  __typename?: 'Note';
  body: Scalars['String']['output'];
  dateCreated?: Maybe<Scalars['Date']['output']>;
  dateEdited?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  user: User;
  voteNum?: Maybe<Scalars['Int']['output']>;
  votes?: Maybe<Array<Maybe<Vote>>>;
};

export type Post = {
  dateCreated?: Maybe<Scalars['Date']['output']>;
  dateEdited?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  channel?: Maybe<Channel>;
  channels: Array<Channel>;
  channelsUnread: Array<Channel>;
  comment?: Maybe<Comment>;
  commentFeed?: Maybe<CommentFeed>;
  comments: Array<Comment>;
  currentUser?: Maybe<User>;
  mail?: Maybe<Mail>;
  mails: Array<Maybe<Mail>>;
  note?: Maybe<Note>;
  notes: Array<Note>;
  user?: Maybe<User>;
  users: Array<User>;
  usersLastAction: Array<User>;
  votes: Array<Vote>;
  weblinks: Array<Weblink>;
};


export type QueryChannelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommentFeedArgs = {
  cursor?: InputMaybe<Scalars['Date']['input']>;
  filter: CommentFilter;
};


export type QueryCommentsArgs = {
  parent: Scalars['ID']['input'];
};


export type QueryMailArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMailsArgs = {
  folder?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNoteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVotesArgs = {
  post: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  birthday?: Maybe<Scalars['Date']['output']>;
  commentCount?: Maybe<Scalars['Int']['output']>;
  dateCreated?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastAction?: Maybe<Scalars['Date']['output']>;
  mailboxes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  name: Scalars['String']['output'];
  oldid?: Maybe<Scalars['Int']['output']>;
  oldpass?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type Vote = {
  __typename?: 'Vote';
  dateCreated?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  post?: Maybe<Post>;
  upvote: Scalars['Int']['output'];
  user?: Maybe<User>;
};

export type Weblink = {
  __typename?: 'Weblink';
  alias?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  dateCreated: Scalars['Date']['output'];
  descr?: Maybe<Scalars['String']['output']>;
  flags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  ogtype?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};
