# Kwil Example Application

This repo contains example code for building and deploying an application using Kwil.  The example application used is a Twitter-esq social network.  This repo is meant to be used as a general guide on Kwil usage, and does not contain many of the aspects requisite of a production application.

The app contains the following features:

- User Accounts with unique usernames
- Blog-style posts, containing a title and a body with up to 10,000 characters
- The ability to comment on posts
- Likes / Unlikes for posts
- Following other users
- Aggregating a user feed based on who they follow

The entire backend for this application is currently implemented in ~200 lines of Kuneiform code.  As Kwil adds more features, the repo will be updated to
show these features.

## Getting Started

To start using Kwil, you will need:

- The CLI installed (<https://github.com/kwilteam/kwil-cli/releases/latest>)
- An Ethereum compatible private key
- Some Kwil testnet tokens from the faucet (on the Goerli chain) (<https://faucet.kwil.com/>)
- An SDK installed

If you need Goerli tokens, please [tweet](<https://twitter.com/KwilTeam>) at our team, or ask in our [Discord](<https://discord.com/invite/HzRPZ59Kay>).

This example contains support for the JS SDK, which can be downloaded by running:

```bash
npm i kwil
```

Python SDK examples will be included in the near future.

**You will need to export your private key as an ENV variable**.  To do this, run:

```bash
export PRIVATE_KEY=<your_private_key>
```

## Depositing Tokens

Once you have some testnet tokens, and your private key exported, you can use the script to approve and deposit the tokens.  Approvals should be relatively fast, but deposits will take 12 block confirmations before the Kwil network picks them up.

To do this, run:

```bash
./scripts/kwil.sh approve_tokens
```

and after waiting a few seconds:

```bash
./scripts/kwil.sh deposit_tokens
```

**If you are getting a connection error / this freezes**, it likely means the public RPC endpoint is being overwhelmed.  You can provide any Goerli RPC endpoint (from Infura, Alchemy, etc.).  To set this, run:

```bash
export GOERLI_RPC_URL=<your_rpc_url>
```

## Deploying the Database

Once you have deposited funds and waited 12 block confirmations, you should be able to deploy the example database.  To do this, run:

```bash
./scripts/kwil.sh deploy
```

You can also drop this by running:

```bash
./scripts/kwil.sh drop
```

### Seeding Data

This example also includes some seed data.  To store this in your database, run:

```bash
./scripts/kwil.sh seed_data
```

## Testing Typescript

A basic command line application has been built to dislay how you can use the TS SDK.  The example code can be found in [./typescript/src](./typescript/src) and the application can be found in [./typescript/test](./typescript/test).  **You need to export your private key to use TS the command line tool, as well as seed the database**.  See the "Getting Started" at the top of the README to see how to do that

To run the tool, run:

```bash
./typescript/test/test.js <command name>
```

Below is a list of command names:

- create user
- create post
- get user
- get feed
- get users posts
- follow
- unfollow
- comment
- get comments
- like
- unlike

None of the commands take arguments; this is merely meant to show as an example, as well as to test if you have your configuration set up correctly. For example, to create a user with an exported wallet, you would run:

```bash
./typescript/test/test.js create user
```

Some of the commands can only be run once, due to Primary Key or Unique constraints on the underlying database.  Furthermore, it is expected that you run 'create user' before other commands, as the application requires you have a user for most functionality.
