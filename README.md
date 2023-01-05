# Shorts
### MERN SOCIAL MEDIA WEB APPLICATION

## Table of contents
---
+ Introduction

+ Demo

+ Run 

+ Technology

+ Features

---

## Introduction

Shorts is a Social media platform where users can like
comment and delete posts and update user Profiles.

## Demo

The application is deployed to AWS and can be accessed through the following link:


---

## Run

To run this application, you have to set your own environmental variables. For security reasons, 
some variables have been hidden from view and used as environmental variables with the help of dotenv package. 
Below are the variables that you need to set in order to run the application:

+ Server

PORT=5000

MONGO_DB='mongo db connection'

JWT_KEY="SECRET KEY"

+ Client

REACT_APP_PUBLIC_FOLDER="URL of the image folder"

After you've set these environmental variables in the .env file at the root of the project,
and intsall node modules using npm install

Now you can run npm start in the terminal and the application should work.

## Technology

This application is build using,

+ Node.js

+ Express

+ MongoDB

+ React

---

## Features

## Users

+ User can create an account.

+ Users can view and interact posts only after
authenticating with username and password.

+ User can comment,like and delete posts.

+ User can folllow and unfollow other users.

+ User can chat with other users.

+ User can view and edit user profile.

+ User will get notification when someone follows
