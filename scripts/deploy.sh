#!/usr/bin/env sh
#
# Deploy a Kuneiform database to Kwil
#

set -eu

. ./scripts/.kwil_variables
. ./scripts/.kwil_functions

echo " Deploying ${DEPLOYMENT_TARGET} to Kwil at ${KWIL_PROVIDER} "

# Check that cli is installed
check_cli_installed

# Deploy the database
"$CLI_COMMAND" database deploy --path="$DEPLOYMENT_TARGET" --kwil-provider="$KWIL_PROVIDER"