import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API
export const authService = {
  getLoginUrl: async () => {
    const response = await api.get('/auth/login');
    return response.data.auth_url;
  },
  handleCallback: async (code) => {
    const response = await api.get(`/auth/callback?code=${code}`);
    return response.data;
  },
};

// Email API
export const emailService = {
  getUnreadEmails: async () => {
    const response = await api.get('/email/unread');
    return response.data;
  },
  draftReply: async (messageId, tone = 'professional') => {
    const response = await api.post('/email/draft-reply', { message_id: messageId, tone });
    return response.data;
  },
  sendEmail: async (to, subject, body) => {
    const response = await api.post('/email/send', { to, subject, body });
    return response.data;
  },
};

// Calendar API
export const calendarService = {
  getEvents: async () => {
    const response = await api.get('/calendar/events');
    return response.data;
  },
  createEvent: async (naturalLanguageRequest) => {
    const response = await api.post('/calendar/create-event', { 
      description: naturalLanguageRequest 
    });
    return response.data;
  },
};

// Documentation API
export const documentationService = {
  generateProjectPlan: async (projectTitle, projectDescription, timelineWeeks = 4, teamSize = 3) => {
    const response = await api.post('/docs/project-plan', {
      project_title: projectTitle,
      project_description: projectDescription,
      timeline_weeks: timelineWeeks,
      team_size: teamSize,
    });
    return response.data;
  },
  generateReportTemplate: async (reportType, reportTopic, sections = null) => {
    const response = await api.post('/docs/report-template', {
      report_type: reportType,
      report_topic: reportTopic,
      sections,
    });
    return response.data;
  },
  generatePresentationOutline: async (presentationTitle, audience, durationMinutes = 15) => {
    const response = await api.post('/docs/presentation-outline', {
      presentation_title: presentationTitle,
      audience,
      duration_minutes: durationMinutes,
    });
    return response.data;
  },
};

// Code Review API
export const codeReviewService = {
  reviewCode: async (code, language, reviewFocus = 'general') => {
    const response = await api.post('/code/review', {
      code,
      language,
      review_focus: reviewFocus,
    });
    return response.data;
  },
  suggestRefactoring: async (code, language, refactoringGoal) => {
    const response = await api.post('/code/suggest-refactoring', {
      code,
      language,
      refactoring_goal: refactoringGoal,
    });
    return response.data;
  },
  explainCode: async (code, language, detailLevel = 'medium') => {
    const response = await api.post('/code/explain', {
      code,
      language,
      detail_level: detailLevel,
    });
    return response.data;
  },
};
