# Memory Lane

Memory Lane is a diary web application. It allows users to create accounts, log in, create diaries called "lanes", set them as public or private, and read public lanes created by other users. The app also features account management functionalities such as changing passwords, names, and deleting accounts. 

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Tiptap (for rich text editing)
  
- Backend:
  - Node.js
  - Express.js
  - MySQL
  - Sequelize (ORM for interacting with MySQL)
  
## Features

- Account creation and authentication
- Creating, viewing, and deleting diaries (lanes)
- Setting lanes as public or private
- Rich text editing capabilities for creating diaries
- Mobile-friendly design
- Account management (password change, name change, account deletion)

## Locally Running for Development

To run the Memory Lane web application locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/emredumaan/memory-lane.git
```

2. Navigate to the project directory:

```bash
cd memory-lane
```

3. Install dependencies for the client (frontend) and server (backend):

```bash
cd client
npm install
cd ../server
npm install
```

4. Update the config file:
   - Update the database configuration in `server/config.json` with your credentials.

6. Start the backend server:

```bash
cd server
npm run dev
```

7. Start the frontend server:

```bash
cd client
npm run dev
```

8. Access the Memory Lane web app in your browser at `http://localhost:5173`.

## Screenshots

![Screenshot 1](screenshots/sc1.png)
*Home page*

![Screenshot 2](screenshots/sc2.png)
*Public lanes page*

![Screenshot 3](screenshots/sc3.png)
*Sign in page*

![Screenshot 4](screenshots/sc4.png)
*Create lane page*

![Screenshot 5](screenshots/sc5.png)
*My lanes page*

![Screenshot 6](screenshots/sc6.png)
*Account settings page*

## Credits

Memory Lane is created by Emre DUMAN. Feel free to contribute by submitting issues or pull requests.
