"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialClient = void 0;
const Kwil_1 = require("Kwil");
const ethers_1 = require("ethers");
require("dotenv").config();
// name of the database
const databaseName = "ecclesia";
// SocialClient takes a Kwil HTTP endpoint and a private key
class SocialClient {
    constructor(kwilEndpoint, ethEndpoint, privateKey) {
        this.wallet = new ethers_1.ethers.Wallet(privateKey, new ethers_1.ethers.JsonRpcProvider(ethEndpoint));
        this.dbid = Kwil_1.Utils.generateDBID(databaseName, this.wallet.address);
        this.kwil = new Kwil_1.NodeKwil({
            kwilProvider: kwilEndpoint,
        });
    }
    // for executing any action
    executeAction(actionName, inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const action = yield this.kwil.getAction(this.dbid, actionName);
            const execution = action.newInstance();
            for (const [key, value] of Object.entries(inputs)) {
                execution.set(key, value);
            }
            if (!action.isComplete()) {
                console.log(execution);
                throw new Error("All inputs must be set!");
            }
            let tx = yield action.prepareAction(this.wallet);
            const res = yield this.kwil.broadcast(tx);
            if (res.data === undefined) {
                throw new Error("error executing action");
            }
            return res.data;
        });
    }
    // for executing any ad-hoc query
    // it returns objects type casted as "any"
    // the fields are the results of the query
    query(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.kwil.selectQuery(this.dbid, query);
            // if undefined, something wrong with SQL
            if (res.data === undefined) {
                throw new Error("error querying database");
            }
            // if null, then it was a successful query but no results
            if (res.data === null) {
                return [];
            }
            return res.data;
        });
    }
    // getting user by username with ad-hoc query
    getUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.query(`SELECT id, address, age FROM users WHERE username = '${username}'`);
            if (res.length === 0) {
                throw new Error("User not found");
            }
            return {
                id: res[0].id,
                username: username,
                age: res[0].age,
                address: res[0].address
            };
        });
    }
    // creating a new user tied to the wallet address
    // in the future, we can replace id with auto-incrementing primary keys
    createUser(id, username, age) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeAction("create_user", {
                "$id": id,
                "$username": username,
                "$age": age,
            });
        });
    }
    // creating a new post.  if the user executing this does not have a user, it will fail due to
    // the post table's not null constraint
    createPost(id, title, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeAction("create_post", {
                "$id": id,
                "$title": title,
                "$content": content,
            });
        });
    }
    // getting posts from a single user with an ad-hoc sql query
    // displaying subquery functionality here
    getUsersPosts(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.query(`SELECT id, title, content FROM posts WHERE author_id = (SELECT id FROM users WHERE username = '${username}')`);
            let posts = [];
            for (const post of res) {
                posts.push({
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    author: username
                });
            }
            return posts;
        });
    }
    // getting a user's feed with an ad-hoc sql query
    // displaying join functionality here
    getFeed(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.query(`SELECT posts.id, posts.title, posts.content, users.username
        FROM posts
        INNER JOIN followers ON posts.author_id = followers.followed_id
        INNER JOIN users ON users.id = followers.followed_id
        WHERE follower_id = (
            SELECT id
            FROM users
            WHERE username = '${username}'
        );`);
            let posts = [];
            for (const post of res) {
                console.log(post);
                posts.push({
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    author: post.username
                });
            }
            return posts;
        });
    }
    follow(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeAction("follow", {
                "$username": username
            });
        });
    }
    unfollow(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeAction("unfollow", {
                "$username": username
            });
        });
    }
    comment(postId, commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeAction("add_comment", {
                "$post_id": postId,
                "$content": content,
                "$comment_id": commentId,
            });
        });
    }
    // getComments returns comments with the username who made the comment
    getComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.query(`SELECT comments.id, comments.content, users.username FROM comments LEFT JOIN users ON users.id = comments.commenter_id WHERE post_id = '${postId}' LIMIT 20`);
            let comments = [];
            for (const comment of res) {
                comments.push({
                    id: comment.id,
                    content: comment.content,
                    commenter: comment.username,
                    postId: postId
                });
            }
            return comments;
        });
    }
    like(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeAction("like_post", {
                "$post_id": postId
            });
        });
    }
    unlike(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeAction("unlike_post", {
                "$post_id": postId
            });
        });
    }
    getLikes(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.query(`SELECT count(user_id) FROM likes WHERE post_id = '${postId}'`);
            return res[0].get("count(user_id)");
        });
    }
}
exports.SocialClient = SocialClient;
