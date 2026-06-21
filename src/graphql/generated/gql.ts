/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation Login($name: String!, $password: String!) {\n  login(name: $name, password: $password)\n}\n\nquery CurrentUser {\n  currentUser {\n    id\n    name\n    avatar\n    email\n    description\n    dateCreated\n  }\n}": typeof types.LoginDocument,
    "query Comment($id: ID!) {\n  comment(id: $id) {\n    id\n    body\n    dateCreated\n    dateEdited\n    parent\n    user {\n      id\n      name\n      avatar\n    }\n    files {\n      id\n      filename\n      name\n      type\n      size\n    }\n    children {\n      id\n      body\n      dateCreated\n      parent\n      user {\n        id\n        name\n        avatar\n      }\n    }\n  }\n}": typeof types.CommentDocument,
    "query CommentFeed($filter: CommentFilter!, $cursor: Date) {\n  commentFeed(filter: $filter, cursor: $cursor) {\n    cursor\n    comments {\n      id\n      body\n      dateCreated\n      dateEdited\n      user {\n        id\n        name\n        avatar\n      }\n    }\n  }\n}": typeof types.CommentFeedDocument,
    "query Notes {\n  notes {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nquery Note($id: ID!) {\n  note(id: $id) {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nmutation AddNote($body: String!) {\n  addNote(body: $body) {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nmutation UpdateNote($id: ID!, $body: String!) {\n  updateNote(id: $id, body: $body) {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nmutation DeleteNote($id: ID!) {\n  deleteNote(id: $id)\n}": typeof types.NotesDocument,
    "query UserProfile($id: ID!) {\n  user(id: $id) {\n    id\n    name\n    avatar\n    description\n    dateCreated\n    lastAction\n    commentCount\n  }\n}\n\nquery UserDirectory {\n  users {\n    id\n    name\n  }\n}": typeof types.UserProfileDocument,
    "query UsersLastAction {\n  usersLastAction {\n    id\n    name\n    avatar\n    lastAction\n  }\n}": typeof types.UsersLastActionDocument,
};
const documents: Documents = {
    "mutation Login($name: String!, $password: String!) {\n  login(name: $name, password: $password)\n}\n\nquery CurrentUser {\n  currentUser {\n    id\n    name\n    avatar\n    email\n    description\n    dateCreated\n  }\n}": types.LoginDocument,
    "query Comment($id: ID!) {\n  comment(id: $id) {\n    id\n    body\n    dateCreated\n    dateEdited\n    parent\n    user {\n      id\n      name\n      avatar\n    }\n    files {\n      id\n      filename\n      name\n      type\n      size\n    }\n    children {\n      id\n      body\n      dateCreated\n      parent\n      user {\n        id\n        name\n        avatar\n      }\n    }\n  }\n}": types.CommentDocument,
    "query CommentFeed($filter: CommentFilter!, $cursor: Date) {\n  commentFeed(filter: $filter, cursor: $cursor) {\n    cursor\n    comments {\n      id\n      body\n      dateCreated\n      dateEdited\n      user {\n        id\n        name\n        avatar\n      }\n    }\n  }\n}": types.CommentFeedDocument,
    "query Notes {\n  notes {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nquery Note($id: ID!) {\n  note(id: $id) {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nmutation AddNote($body: String!) {\n  addNote(body: $body) {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nmutation UpdateNote($id: ID!, $body: String!) {\n  updateNote(id: $id, body: $body) {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nmutation DeleteNote($id: ID!) {\n  deleteNote(id: $id)\n}": types.NotesDocument,
    "query UserProfile($id: ID!) {\n  user(id: $id) {\n    id\n    name\n    avatar\n    description\n    dateCreated\n    lastAction\n    commentCount\n  }\n}\n\nquery UserDirectory {\n  users {\n    id\n    name\n  }\n}": types.UserProfileDocument,
    "query UsersLastAction {\n  usersLastAction {\n    id\n    name\n    avatar\n    lastAction\n  }\n}": types.UsersLastActionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($name: String!, $password: String!) {\n  login(name: $name, password: $password)\n}\n\nquery CurrentUser {\n  currentUser {\n    id\n    name\n    avatar\n    email\n    description\n    dateCreated\n  }\n}"): (typeof documents)["mutation Login($name: String!, $password: String!) {\n  login(name: $name, password: $password)\n}\n\nquery CurrentUser {\n  currentUser {\n    id\n    name\n    avatar\n    email\n    description\n    dateCreated\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Comment($id: ID!) {\n  comment(id: $id) {\n    id\n    body\n    dateCreated\n    dateEdited\n    parent\n    user {\n      id\n      name\n      avatar\n    }\n    files {\n      id\n      filename\n      name\n      type\n      size\n    }\n    children {\n      id\n      body\n      dateCreated\n      parent\n      user {\n        id\n        name\n        avatar\n      }\n    }\n  }\n}"): (typeof documents)["query Comment($id: ID!) {\n  comment(id: $id) {\n    id\n    body\n    dateCreated\n    dateEdited\n    parent\n    user {\n      id\n      name\n      avatar\n    }\n    files {\n      id\n      filename\n      name\n      type\n      size\n    }\n    children {\n      id\n      body\n      dateCreated\n      parent\n      user {\n        id\n        name\n        avatar\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CommentFeed($filter: CommentFilter!, $cursor: Date) {\n  commentFeed(filter: $filter, cursor: $cursor) {\n    cursor\n    comments {\n      id\n      body\n      dateCreated\n      dateEdited\n      user {\n        id\n        name\n        avatar\n      }\n    }\n  }\n}"): (typeof documents)["query CommentFeed($filter: CommentFilter!, $cursor: Date) {\n  commentFeed(filter: $filter, cursor: $cursor) {\n    cursor\n    comments {\n      id\n      body\n      dateCreated\n      dateEdited\n      user {\n        id\n        name\n        avatar\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Notes {\n  notes {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nquery Note($id: ID!) {\n  note(id: $id) {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nmutation AddNote($body: String!) {\n  addNote(body: $body) {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nmutation UpdateNote($id: ID!, $body: String!) {\n  updateNote(id: $id, body: $body) {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nmutation DeleteNote($id: ID!) {\n  deleteNote(id: $id)\n}"): (typeof documents)["query Notes {\n  notes {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nquery Note($id: ID!) {\n  note(id: $id) {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nmutation AddNote($body: String!) {\n  addNote(body: $body) {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nmutation UpdateNote($id: ID!, $body: String!) {\n  updateNote(id: $id, body: $body) {\n    id\n    body\n    dateCreated\n    dateEdited\n  }\n}\n\nmutation DeleteNote($id: ID!) {\n  deleteNote(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query UserProfile($id: ID!) {\n  user(id: $id) {\n    id\n    name\n    avatar\n    description\n    dateCreated\n    lastAction\n    commentCount\n  }\n}\n\nquery UserDirectory {\n  users {\n    id\n    name\n  }\n}"): (typeof documents)["query UserProfile($id: ID!) {\n  user(id: $id) {\n    id\n    name\n    avatar\n    description\n    dateCreated\n    lastAction\n    commentCount\n  }\n}\n\nquery UserDirectory {\n  users {\n    id\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query UsersLastAction {\n  usersLastAction {\n    id\n    name\n    avatar\n    lastAction\n  }\n}"): (typeof documents)["query UsersLastAction {\n  usersLastAction {\n    id\n    name\n    avatar\n    lastAction\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;