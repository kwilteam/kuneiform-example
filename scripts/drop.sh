#!/usr/bin/env sh
#
# Deploy a Kuneiform database to Kwil
#

set -eu

. ./scripts/.kwil_variables
. ./scripts/.kwil_functions

DATABASE_NAME=${2:-"ecclesia"}

echo " Dropping ${DATABASE_NAME} from ${KWIL_PROVIDER} "

# Check that cli is installed
check_cli_installed

# Deploy the database
"$CLI_COMMAND" database drop "$DATABASE_NAME" --kwil-provider="$KWIL_PROVIDER"