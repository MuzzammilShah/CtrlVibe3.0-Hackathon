# Ctrl+Vibe 3.0 Hackathon

### Category: Track 2

### Participants:

- Nandhini R
- Muhammed Shah
- Aditya S

----------

# PA Agent - Work Buddy

A conversational AI assistant that helps professionals manage emails, calendar events, documentation, and code review tasks.

![DEMO](demo.gif)

## Problem Statement:

Modern professionals are burdened with repetitive yet cognitively demanding tasks such as replying to emails, managing schedules, generating structured documents, and reviewing code. These tasks often interrupt deep work and reduce productivity. There is a growing need for an intelligent assistant that can operate as a reliable “work buddy” to offload and automate such responsibilities.

## Project Overview

PA Agent is designed to be a reliable "work buddy" that can help offload repetitive yet cognitively demanding tasks such as:
- Replying to emails
- Managing schedules
- Generating structured documents
- Reviewing code

The solution is built around a conversational agent interface where users can interact naturally through a chat UI. The system internally routes tasks to different tools powered by Gemini API.

## Tech Stack

- **Frontend**: React.js with Vercel AI SDK (`@ai-sdk/react`)
- **UI Components**: 21st Dev design system (Chat Message List component)
- **Backend**: Python (FastAPI)
- **LLM**: Gemini API
- **Authentication & API Access**:
  - Google OAuth 2.0
  - Gmail API (email read/send)
  - Google Calendar API (schedule creation)
- **Tool Invocation**: 
  - Agent orchestration using Vercel AI SDK's multi-step tool-calling system
  - Tools defined in TypeScript and executed via HTTP calls to Python backend

## Key Features

1. **Email Assistant**
   - Fetch and summarize unread emails
   - Draft intelligent responses using Gemini
   - Send emails via Gmail API

2. **Calendar Planner**
   - Create events from natural language descriptions
   - Manage Google Calendar events

3. **Project Documentation**
   - Generate project plans from brief prompts
   - Draft reports and presentation outlines

4. **Code Review**
   - Analyze code snippets and provide feedback
   - Suggest refactoring improvements
   - Explain code functionality

## Project Structure

```
/
├── frontend/               # React.js frontend application
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # React components
│       ├── services/       # API service clients
│       ├── tools/          # Tool definitions for Vercel AI SDK
│       ├── types/          # TypeScript type definitions
│       └── pages/          # Page components and API routes
├── backend/                # Python FastAPI backend
│   ├── main.py             # Main application entry point
│   ├── requirements.txt    # Python dependencies
│   └── routers/            # API route handlers
└── README.md               # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)
- Google Cloud Platform account with OAuth and API access

### Backend Setup

1. Create a Python virtual environment and activate it:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your environment variables by copying `.env.example` to `.env` and filling in your API keys and credentials.

4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Install the required dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file with the following contents:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## How to Get Google API Credentials for Your Project

Based on your codebase, you need to get Google OAuth credentials for Gmail and Calendar API access. Here's how to do it:

1. **Create a Google Cloud Project**:
    
    - Go to the [Google Cloud Console](vscode-file://vscode-app/Applications/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html)
    - Click "Create Project" in the top right
    - Enter a project name (e.g., "PA Agent") and click "Create"
2. **Enable the necessary APIs**:
    
    - In your project, go to "APIs & Services" > "Library"
    - Search for and enable these APIs:
        - Gmail API
        - Google Calendar API
        - People API (for user information)
3. **Configure OAuth Consent Screen**:
    
    - Go to "APIs & Services" > "OAuth consent screen"
    - Select "External" user type (unless you have a Google Workspace)
    - Fill in the required fields:
        - App name: "PA Agent"
        - User support email: Your email
        - Developer contact information: Your email
    - Click "Save and Continue"
    - Add the scopes your app needs:
        - `https://www.googleapis.com/auth/userinfo.email`
        - `https://www.googleapis.com/auth/gmail.modify`
        - `https://www.googleapis.com/auth/calendar.events`

4. - Click "Save and Continue"
    - Add test users (including your own email)
    - Click "Save and Continue"
5. **Create OAuth Credentials**:
    
    - Go to "APIs & Services" > "Credentials"
    - Click "Create Credentials" > "OAuth client ID"
    - Choose "Web application" as the application type
    - Name: "PA Agent Web Client"
    - Add authorized JavaScript origins:
        - `http://localhost:3000`
    - Add authorized redirect URIs:
        - `http://localhost:3000/auth/callback`
    - Click "Create"
    - You'll get a client ID and client secret - **save these!**
6. **Download Client Secret JSON**:
    
    - After creating the credentials, you'll see a download button
    - Download the JSON file and save it as [client_secret.json](vscode-file://vscode-app/Applications/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html) in your backend directory
7. **Update Your .env File**:
    
    - Open your `.env` file in the backend directory
    - Add your Google client ID and client secret:

8. **Get a Gemini API Key** (if you don't have one):

   - Go to [Google AI Studio](vscode-file://vscode-app/Applications/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html)
   - Create an API key
   - Add it to your `.env` file: