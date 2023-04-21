#!/usr/bin/env sh
#
# Deploy a Kuneiform database to Kwil
#

set -eu

. ./scripts/.kwil_variables
. ./scripts/.kwil_functions

# Check that cli is installed
check_cli_installed

# Deploy
deploy() {
    echo " $PRIVATE_KEY $KWIL_PROVIDER "
    echo " Deploying ${DEPLOYMENT_TARGET} to Kwil at ${KWIL_PROVIDER} "

    # Deploy the database
    "$CLI_COMMAND" database deploy --path="$DEPLOYMENT_TARGET" --kwil-provider="$KWIL_PROVIDER" --private-key="$PRIVATE_KEY"
}

# Drop
drop() {
    echo " Dropping ${DATABASE_NAME} from ${KWIL_PROVIDER} "

    # Drop the database
    "$CLI_COMMAND" database drop "$DATABASE_NAME" --kwil-provider="$KWIL_PROVIDER" --private-key="$PRIVATE_KEY"
}

# Seed Data
seed_data() {
    echo " Seeding ${DATABASE_NAME} from ${KWIL_PROVIDER} "

    # Seed users
    "$CLI_COMMAND" database batch --kwil-provider="$KWIL_PROVIDER" --private-key="$PRIVATE_KEY" -n=$DATABASE_NAME -p=./seed_data/users.csv -a=seed_user -m=id:id -m=full_name:username -m=age:age -m=address:address

    # Seed posts
    "$CLI_COMMAND" database batch --kwil-provider="$KWIL_PROVIDER" --private-key="$PRIVATE_KEY" -n=$DATABASE_NAME -p=./seed_data/posts.csv -a=seed_post -m=id:id -m=author_id:author_id -m=content:content -m=title:title

    # Seed comments
    "$CLI_COMMAND" database batch --kwil-provider="$KWIL_PROVIDER" --private-key="$PRIVATE_KEY" -n=$DATABASE_NAME -p=./seed_data/comments.csv -a=seed_comment -m=id:id -m=commenter_id:commenter_id -m=content:content -m=post_id:post_id

    # Seed likes
    "$CLI_COMMAND" database batch --kwil-provider="$KWIL_PROVIDER" --private-key="$PRIVATE_KEY" -n=$DATABASE_NAME -p=./seed_data/likes.csv -a=seed_like -m=user_id:liker_id -m=post_id:post_id

    # Seed follows
    "$CLI_COMMAND" database batch --kwil-provider="$KWIL_PROVIDER" --private-key="$PRIVATE_KEY" -n=$DATABASE_NAME -p=./seed_data/followers.csv -a=seed_follower -m=follower_id:follower_id -m=followed_id:followee_id
}

# Reset
reset() {
    drop
    deploy
}

# approve tokens
approve_tokens() {
    TOKEN_AMOUNT=${TOKEN_AMOUNT:-"10000000000000000000"}

    echo " Approving ${TOKEN_AMOUNT} testnet tokens. "

    # Approve the tokens
    "$CLI_COMMAND" fund approve "$TOKEN_AMOUNT" --kwil-provider="$KWIL_PROVIDER" --private-key="$PRIVATE_KEY" --client-chain-rpc-url="$GOERLI_RPC_URL" -y
}

# depositing tokens
deposit_tokens() {
    TOKEN_AMOUNT=${TOKEN_AMOUNT:-"10000000000000000000"}

    echo " Depositing ${TOKEN_AMOUNT} testnet tokens.  This will take 12 block confirmations before the funds are available on Kwil. "

    # Approve the tokens
    "$CLI_COMMAND" fund deposit "$TOKEN_AMOUNT" --kwil-provider="$KWIL_PROVIDER" --private-key="$PRIVATE_KEY" --client-chain-rpc-url="$GOERLI_RPC_URL" -y
}

$@ # Run the function passed as the first argument