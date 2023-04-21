// An interface for our application User
export interface User {
    id: number;
    username: string;
    age: number;
    address: string;
}

// A user can be indentified by a User object, a wallet address, or an account ID
export type UserIdentifier = User | string | number;

// Post is a generic type that takes a type parameter
export interface Post<A extends UserIdentifier> {
    id: number;
    title: string;
    content: string;
    author: A;
}

// Comment is a generic type that takes a type parameter
export interface Comment<A extends UserIdentifier> {
    id: number;
    postId: number;
    content: string;
    commenter: A;
}