import { User, Comment, Post } from "./models";
import { Types } from 'luke-dev';
export declare class SocialClient {
    private readonly wallet;
    private readonly dbid;
    private kwil;
    constructor(kwilEndpoint: string, ethEndpoint: string, privateKey: string);
    private executeAction;
    private query;
    getUser(username: string): Promise<User>;
    createUser(id: number, username: string, age: number): Promise<Types.TxReceipt>;
    createPost(id: number, title: string, content: string): Promise<Types.TxReceipt>;
    getUsersPosts(username: string): Promise<Post<string>[]>;
    getFeed(username: string): Promise<Post<string>[]>;
    follow(username: string): Promise<Types.TxReceipt>;
    unfollow(username: string): Promise<Types.TxReceipt>;
    comment(postId: number, commentId: number, content: string): Promise<Types.TxReceipt>;
    getComments(postId: number): Promise<Comment<string>[]>;
    like(postId: number): Promise<Types.TxReceipt>;
    unlike(postId: number): Promise<Types.TxReceipt>;
    getLikes(postId: number): Promise<number>;
}
