const {SocialClient} = require("../dist/index.js")
require("dotenv").config()

async function run() {
    process.argv.shift()  // skip node.exe
    process.argv.shift()  // skip name of js file
    const userInput = process.argv.join(" ")

    const client = new SocialClient("https://provider.kwil.com", "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", process.env.PRIVATE_KEY)
    
    let res
    switch (userInput) {
        case "create user":
            res = await client.createUser(101, "satoshi", 42)
            break
        case "create post":
            res = await client.createPost(101, "my post", "my body")
            break
        case "get user":
            res = await client.getUser("satoshi") // part of the seeded data
            break
        case "get feed":
            res = await client.getFeed("Santa Claus") // peer-reviewed studies have found that Santa has the best feed of the seeded data
            break
        case "get users posts":
            res = await client.getUsersPosts("Satoshi Nakamoto")
            break
        case "follow":
            res = await client.follow("Santa Claus")
            break
        case "unfollow":
            res = await client.unfollow("Santa Claus")
            break
        case "comment":
            res = await client.comment(2, 69, "wow nice post man. real nice. grade a. new york times level. truly, it belongs in the louvre. biblical even. sign my chest bro. please. i will never wash it off. may your eloquence adorn my impure vassal, such that i may live my days in the awesome shadow of your prodigious wit. please bro.")
            break
        case "get comments":
            res = await client.getComments(2)
            break
        case "like":
            res = await client.like(2)
            break
        case "unlike":
            res = await client.unlike(2)
            break
    }

    console.log(res)
}

run()