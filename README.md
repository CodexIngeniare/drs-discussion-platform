# Discussion Platform
A full-stack discussion board web app where users can post and engage in topic-based conversations. Built with React, Flask, and MySQL.

## Features
- **User Authentication** – Secure login system using tokens.
- **User Account Registration** – Users can request account registration. Admins must approve these requests. Results are sent via email.
- **User Account Settings** – Users can update their account data.
- **Role-Based Access** – Two roles: **Admin** and **Regular User**. Admins have access to an additional **Administration** page.
- **Discussion Posts** – Users can create, edit, and delete their own discussions. Admins can delete any discussion.
- **Upvoting/Downvoting** – Votes influence a discussion's popularity and its ranking in search results.
- **Commenting** – Comment authors can delete their own comments. Discussion authors can delete any comments under their post. Admins can delete all comments.
- **Tagging Users** – Users can mention others in posts or comments. Tagged users receive email notifications.
- **Discussion Topics** – Admins manage topics: create, update, and delete them.
- **Advanced Search** – Discussions can be filtered by topic, title, author's username, or email.
- **Pending Users Page** – Admins can view and handle pending registration requests in real time (via WebSockets).
- **Registered Users Page** – Admins can view all registered accounts.

## Tech Stack
- **Frontend**: React
- **Backend**: Flask
- **Database**: MySQL

## Requirements
### Make sure you have the following installed:
<details>
  <summary>Frontend Requirements</summary>

  - [nvm](https://github.com/coreybutler/nvm-windows) &ge; 1.2.2
  - Node.js 23.11.0
</details>
<details>
  <summary>Backend Requirements</summary>

  - python 3.9.0
  - pip &ge; 25.0.1
  - pipenv &ge; 2024.4.1
</details>

## Getting Started
### Clone the repository:
```bash
git clone https://github.com/CodexIngeniare/drs-discussion-platform.git
```
<details>
  <summary>Frontend Setup</summary>
  
  ### Navigate to the frontend directory:
  ```bash
  cd frontend
  ```
  ### Install dependencies:
  ```bash
  npm install
  ```
  ### How to run:
  ```bash
  npm start
  ```
</details>
<details>
  <summary>Backend Setup</summary>

  ### Navigate to the backend directory:
  ```bash
  cd backend
  ```
  ### Install dependencies:
  ```bash
  pipenv shell
  pipenv install
  ```
  ### How to run:
  ```bash
  flask run
  ```
</details>
