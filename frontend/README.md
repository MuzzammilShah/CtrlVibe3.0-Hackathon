# PA Agent - Frontend

This is the frontend application for PA Agent - Work Buddy, built with React and the Vercel AI SDK.

## Overview

The frontend provides a conversational interface that allows users to:
- Chat with the AI assistant
- Connect to Google services (Email, Calendar)
- Generate documentation and get code reviews

## Tech Stack

- React.js
- Vercel AI SDK (`@ai-sdk/react`)
- React Router for navigation
- Axios for API requests

## Project Structure

```
/frontend
├── public/             # Static files
└── src/
    ├── components/     # React components
    │   ├── ChatInterface.js  # Main chat UI
    │   └── Login.js          # Authentication UI
    ├── services/       # API service clients
    │   └── api.js            # Backend API integration
    ├── tools/          # Tool definitions for Vercel AI SDK
    │   └── index.js          # Tool implementations
    ├── types/          # Type definitions
    │   └── index.js          # JSDoc type definitions
    └── pages/          # Page components and API routes
        └── api/        # API route handlers
            └── chat.js        # Chat endpoint
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
REACT_APP_API_URL=http://localhost:8000
```

## Dependencies

- `@ai-sdk/react`: Provides the chat interface and AI integration
- `vercel`: Required for Vercel AI SDK
- `ai`: Core AI utilities
- `react-router-dom`: For application routing
- `axios`: For making API requests to the backend

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
