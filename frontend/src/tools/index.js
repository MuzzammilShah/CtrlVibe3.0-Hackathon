import { 
  emailService, 
  calendarService, 
  documentationService, 
  codeReviewService 
} from '../services/api';

// Email Tools
export const emailTools = [
  {
    name: 'fetch_unread_emails',
    description: 'Fetch unread emails from the user\'s Gmail account',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
    execute: async () => {
      try {
        const data = await emailService.getUnreadEmails();
        return data;
      } catch (error) {
        console.error('Error fetching unread emails:', error);
        return { error: 'Failed to fetch unread emails' };
      }
    },
  },
  {
    name: 'draft_email_reply',
    description: 'Draft a reply to an email using AI',
    parameters: {
      type: 'object',
      properties: {
        messageId: { 
          type: 'string',
          description: 'The ID of the email to reply to' 
        },
        tone: { 
          type: 'string',
          description: 'The tone of the reply (professional, friendly, formal, etc.)',
          enum: ['professional', 'friendly', 'formal', 'casual', 'urgent'],
          default: 'professional'
        },
      },
      required: ['messageId'],
    },
    execute: async ({ messageId, tone }) => {
      try {
        const data = await emailService.draftReply(messageId, tone);
        return data;
      } catch (error) {
        console.error('Error drafting email reply:', error);
        return { error: 'Failed to draft email reply' };
      }
    },
  },
  {
    name: 'send_email',
    description: 'Send an email via Gmail',
    parameters: {
      type: 'object',
      properties: {
        to: { 
          type: 'string',
          description: 'Recipient email address' 
        },
        subject: { 
          type: 'string',
          description: 'Email subject' 
        },
        body: { 
          type: 'string',
          description: 'Email body content' 
        },
      },
      required: ['to', 'subject', 'body'],
    },
    execute: async ({ to, subject, body }) => {
      try {
        const data = await emailService.sendEmail(to, subject, body);
        return data;
      } catch (error) {
        console.error('Error sending email:', error);
        return { error: 'Failed to send email' };
      }
    },
  },
];

// Calendar Tools
export const calendarTools = [
  {
    name: 'fetch_calendar_events',
    description: 'Fetch upcoming calendar events from Google Calendar',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
    execute: async () => {
      try {
        const data = await calendarService.getEvents();
        return data;
      } catch (error) {
        console.error('Error fetching calendar events:', error);
        return { error: 'Failed to fetch calendar events' };
      }
    },
  },
  {
    name: 'create_calendar_event',
    description: 'Create a calendar event from natural language description',
    parameters: {
      type: 'object',
      properties: {
        description: { 
          type: 'string',
          description: 'Natural language description of the event (e.g., "Meeting with John about project tomorrow at 3pm")' 
        },
      },
      required: ['description'],
    },
    execute: async ({ description }) => {
      try {
        const data = await calendarService.createEvent(description);
        return data;
      } catch (error) {
        console.error('Error creating calendar event:', error);
        return { error: 'Failed to create calendar event' };
      }
    },
  },
];

// Documentation Tools
export const documentationTools = [
  {
    name: 'generate_project_plan',
    description: 'Generate a project plan from a brief description',
    parameters: {
      type: 'object',
      properties: {
        title: { 
          type: 'string',
          description: 'Project title' 
        },
        description: { 
          type: 'string',
          description: 'Brief project description' 
        },
        timelineWeeks: { 
          type: 'number',
          description: 'Project timeline in weeks',
          default: 4
        },
        teamSize: { 
          type: 'number',
          description: 'Team size (number of people)',
          default: 3
        },
      },
      required: ['title', 'description'],
    },
    execute: async ({ title, description, timelineWeeks = 4, teamSize = 3 }) => {
      try {
        const data = await documentationService.generateProjectPlan(
          title, 
          description, 
          timelineWeeks, 
          teamSize
        );
        return data;
      } catch (error) {
        console.error('Error generating project plan:', error);
        return { error: 'Failed to generate project plan' };
      }
    },
  },
  {
    name: 'generate_report_template',
    description: 'Generate a report template with structure and placeholders',
    parameters: {
      type: 'object',
      properties: {
        reportType: { 
          type: 'string',
          description: 'Type of report (e.g., technical, business, research)' 
        },
        topic: { 
          type: 'string',
          description: 'Report topic or subject' 
        },
        sections: { 
          type: 'array',
          items: { type: 'string' },
          description: 'Custom sections to include in the report (optional)'
        },
      },
      required: ['reportType', 'topic'],
    },
    execute: async ({ reportType, topic, sections = null }) => {
      try {
        const data = await documentationService.generateReportTemplate(
          reportType, 
          topic, 
          sections
        );
        return data;
      } catch (error) {
        console.error('Error generating report template:', error);
        return { error: 'Failed to generate report template' };
      }
    },
  },
  {
    name: 'generate_presentation_outline',
    description: 'Generate a presentation outline with slide suggestions',
    parameters: {
      type: 'object',
      properties: {
        title: { 
          type: 'string',
          description: 'Presentation title' 
        },
        audience: { 
          type: 'string',
          description: 'Target audience (e.g., executives, technical team, customers)' 
        },
        durationMinutes: { 
          type: 'number',
          description: 'Presentation duration in minutes',
          default: 15
        },
      },
      required: ['title', 'audience'],
    },
    execute: async ({ title, audience, durationMinutes = 15 }) => {
      try {
        const data = await documentationService.generatePresentationOutline(
          title, 
          audience, 
          durationMinutes
        );
        return data;
      } catch (error) {
        console.error('Error generating presentation outline:', error);
        return { error: 'Failed to generate presentation outline' };
      }
    },
  },
];

// Code Review Tools
export const codeReviewTools = [
  {
    name: 'review_code',
    description: 'Review code and provide feedback',
    parameters: {
      type: 'object',
      properties: {
        code: { 
          type: 'string',
          description: 'Code to review' 
        },
        language: { 
          type: 'string',
          description: 'Programming language of the code' 
        },
        focus: { 
          type: 'string',
          description: 'Focus area for the review',
          enum: ['general', 'security', 'performance', 'readability'],
          default: 'general'
        },
      },
      required: ['code', 'language'],
    },
    execute: async ({ code, language, focus = 'general' }) => {
      try {
        const data = await codeReviewService.reviewCode(code, language, focus);
        return data;
      } catch (error) {
        console.error('Error reviewing code:', error);
        return { error: 'Failed to review code' };
      }
    },
  },
  {
    name: 'suggest_refactoring',
    description: 'Suggest refactoring for given code based on a specific goal',
    parameters: {
      type: 'object',
      properties: {
        code: { 
          type: 'string',
          description: 'Code to refactor' 
        },
        language: { 
          type: 'string',
          description: 'Programming language of the code' 
        },
        goal: { 
          type: 'string',
          description: 'Refactoring goal (e.g., improve performance, readability, maintainability)' 
        },
      },
      required: ['code', 'language', 'goal'],
    },
    execute: async ({ code, language, goal }) => {
      try {
        const data = await codeReviewService.suggestRefactoring(code, language, goal);
        return data;
      } catch (error) {
        console.error('Error suggesting refactoring:', error);
        return { error: 'Failed to suggest refactoring' };
      }
    },
  },
  {
    name: 'explain_code',
    description: 'Explain code functionality in natural language',
    parameters: {
      type: 'object',
      properties: {
        code: { 
          type: 'string',
          description: 'Code to explain' 
        },
        language: { 
          type: 'string',
          description: 'Programming language of the code' 
        },
        detailLevel: { 
          type: 'string',
          description: 'Level of detail for the explanation',
          enum: ['basic', 'medium', 'detailed'],
          default: 'medium'
        },
      },
      required: ['code', 'language'],
    },
    execute: async ({ code, language, detailLevel = 'medium' }) => {
      try {
        const data = await codeReviewService.explainCode(code, language, detailLevel);
        return data;
      } catch (error) {
        console.error('Error explaining code:', error);
        return { error: 'Failed to explain code' };
      }
    },
  },
];

// Combine all tools
export const allTools = [
  ...emailTools,
  ...calendarTools,
  ...documentationTools,
  ...codeReviewTools,
];
