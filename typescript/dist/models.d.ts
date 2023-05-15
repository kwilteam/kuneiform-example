export interface User {
    id: number;
    username: string;
    age: number;
    address: string;
}
export type UserIdentifier = User | string | number;
export interface Post<A extends UserIdentifier> {
    id: number;
    title: string;
    content: string;
    author: A;
}
export interface Comment<A extends UserIdentifier> {
    id: number;
    postId: number;
    content: string;
    commenter: A;
}
