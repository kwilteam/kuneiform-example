import { User, Comment, Post } from "./models";
import {NodeKwil, Utils, Types } from 'Kwil'
import { ethers } from "ethers";
require("dotenv").config()

// name of the database
const databaseName = "ecclesia"

// SocialClient takes a Kwil HTTP endpoint and a private key
export class SocialClient {
    private readonly wallet: ethers.Wallet;
    private readonly dbid: string;
    private kwil: NodeKwil;

    constructor(kwilEndpoint: string, ethEndpoint: string, privateKey: string) {
        this.wallet = new ethers.Wallet(privateKey, new ethers.JsonRpcProvider(ethEndpoint));
        this.dbid = Utils.generateDBID(databaseName, this.wallet.address);
        this.kwil = new NodeKwil({
            kwilProvider: kwilEndpoint,
        })
    }

    // for executing any action
    private async executeAction(actionName:string, inputs: Object): Promise<Types.TxReceipt> {
        const action = await this.kwil.getAction(this.dbid, actionName)
        const execution = action.newInstance()

        for (const [key, value] of Object.entries(inputs)) {
            execution.set(key, value)
        }

        if(!action.isComplete()) {
            console.log(execution)
            throw new Error("All inputs must be set!")
        }

        let tx = await action.prepareAction(this.wallet)
        
        const res = await this.kwil.broadcast(tx)

        if (res.data === undefined) {
            throw new Error("error executing action")
        }

        return res.data
    }

    // for executing any ad-hoc query
    // it returns objects type casted as "any"
    // the fields are the results of the query
    private async query(query:string): Promise<(any)[]> {
        const res = await this.kwil.selectQuery(this.dbid, query)

        // if undefined, something wrong with SQL
        if (res.data === undefined) {
            throw new Error("error querying database")
        }

        // if null, then it was a successful query but no results
        if (res.data === null) {
            return []
        }

        return res.data
    }

    // getting user by username with ad-hoc query
    public async getUser(username: string): Promise<User> {
        const res = await this.query(`SELECT id, address, age FROM users WHERE username = '${username}'`)

        if (res.length === 0) {
            throw new Error("User not found")
        }

        return {
            id: res[0].id,
            username: username,
            age: res[0].age,
            address: res[0].address
        }
    }

    // creating a new user tied to the wallet address
    // in the future, we can replace id with auto-incrementing primary keys
    public async createUser(id:number, username: string, age: number): Promise<Types.TxReceipt> {
        return await this.executeAction("create_user", {
            "$id": id,
            "$username": username,
            "$age": age,
        })
    }

    // creating a new post.  if the user executing this does not have a user, it will fail due to
    // the post table's not null constraint
    public async createPost(id: number, title: string, content: string): Promise<Types.TxReceipt> {
        return await this.executeAction("create_post", {
            "$id": id,
            "$title": title,
            "$content": content,
        })
    }

    // getting posts from a single user with an ad-hoc sql query
    // displaying subquery functionality here
    public async getUsersPosts(username: string): Promise<Post<string>[]> {
        const res = await this.query(`SELECT id, title, content FROM posts WHERE author_id = (SELECT id FROM users WHERE username = '${username}')`)
    
        let posts: Post<string>[] = []

        for (const post of res) {
            posts.push({
                id: post.id,
                title: post.title,
                content: post.content,
                author: username
            })
        }

        return posts
    }

    // getting a user's feed with an ad-hoc sql query
    // displaying join functionality here
    public async getFeed(username:string): Promise<Post<string>[]> {
        const res = await this.query(`SELECT posts.id, posts.title, posts.content, users.username
        FROM posts
        INNER JOIN followers ON posts.author_id = followers.followed_id
        INNER JOIN users ON users.id = followers.followed_id
        WHERE follower_id = (
            SELECT id
            FROM users
            WHERE username = '${username}'
        );`)

        let posts: Post<string>[] = []

        for (const post of res) {
            console.log(post)
            posts.push({
                id: post.id,
                title: post.title,
                content: post.content,
                author: post.username
            })
        }

        return posts
    }

    public async follow(username: string): Promise<Types.TxReceipt> {
        return await this.executeAction("follow", {
            "$username": username
        })
    }

    public async unfollow(username: string): Promise<Types.TxReceipt> {
        return await this.executeAction("unfollow", {
            "$username": username
        })
    }

    public async comment(postId: number, commentId: number, content: string): Promise<Types.TxReceipt> {
        return await this.executeAction("add_comment", {
            "$post_id": postId,
            "$content": content,
            "$comment_id": commentId,
        })
    }

    // getComments returns comments with the username who made the comment
    public async getComments(postId: number): Promise<Comment<string>[]> {
        const res =  await this.query(`SELECT comments.id, comments.content, users.username FROM comments LEFT JOIN users ON users.id = comments.commenter_id WHERE post_id = '${postId}' LIMIT 20`)
    
        let comments: Comment<string>[] = []

        for (const comment of res) {
            comments.push({
                id: comment.id,
                content: comment.content,
                commenter: comment.username,
                postId: postId
            })
        }

        return comments
    }

    public async like(postId: number): Promise<Types.TxReceipt> {
        return await this.executeAction("like_post", {
            "$post_id": postId
        })
    }

    public async unlike(postId: number): Promise<Types.TxReceipt> {
        return await this.executeAction("unlike_post", {
            "$post_id": postId
        })
    }

    public async getLikes(postId: number): Promise<number> {
        const res = await this.query(`SELECT count(user_id) FROM likes WHERE post_id = '${postId}'`)
        return res[0].get("count(user_id)")
    }
}