# Kwil Example Application
This repo contains example code for building and deploying an application using Kwil.  The example application used is a Twitter-esq social network.
The app contains the following features:
- User Accounts with unique usernames
- Blog-style posts, containing a title and a body with up to 10,000 characters
- The ability to comment on posts
- Likes / Unlikes for posts
- Following other users
- Aggregating a user feed based on who they follow

The entire backend for this application is currently implemented in ~200 lines of Kuneiform code.  As Kwil adds more features, the repo will be updated to
show these features.

## Contents
The example repo is broken down into the following format:
- Kuneiform: The Kuneiform directory contains the file(s) that will be deployed to the Kwil network.
- Typescript: The Typescript directory contains a basic library for interacting with the deployed database.
- Python: The Python directory contains a Python library for interacting with the deployed database.

