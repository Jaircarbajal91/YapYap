# `YapYap`

YapYap aims to mimic the look and functionality of Discord.

Our goals for this project were the following:

1. Work with WebSockets and Socket.IO
2. Refresh and refine our knowledge of React and Node.js

## Technologies

#### Front-End
- React
- Redux
- CSS

#### Back-End

- Express.js
- Node.js
- Sequelize
- Socket.io

## Instructions

1. Clone the repository to your local machine
2. Run `npm i` in the root, `backend`, and `frontend` directories to install necessary dependencies
3. Create a `.env` file in the root directory following the `.envExample` file
4. In your `backend` directory, run `sh migrate.sh` and `sh seed.sh` to create and seed the database
5. Run `npm start` in first the `backend`, then `frontend` directories. The app will be available at `localhost:3000`

### AWS S3 Setup

- Create a `.env` file inside `backend/` based on `backend/.envExample`.
- Ensure the following variables are set with your bucket's credentials:
  - `S3_BUCKET`
  - `S3_REGION`
  - `S3_KEY`
  - `S3_SECRET`
- The user whose keys are used must have `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` permissions on the bucket.

