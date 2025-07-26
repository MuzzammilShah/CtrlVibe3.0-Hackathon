// Define types for the application (JSDoc format for JavaScript)

/**
 * @typedef {Object} User
 * @property {string} email - User's email address
 * @property {string} name - User's name
 * @property {string} [picture] - Optional URL to user's profile picture
 */

/**
 * @typedef {Object} AuthState
 * @property {boolean} isAuthenticated - Whether the user is authenticated
 * @property {User|null} user - The user object if authenticated
 * @property {string|null} accessToken - The access token if authenticated
 */

/**
 * @typedef {Object} Email
 * @property {string} id - Email ID
 * @property {string} sender - Sender's email address
 * @property {string} subject - Email subject
 * @property {string} summary - Generated summary of the email
 */

/**
 * @typedef {Object} EmailList
 * @property {Email[]} emails - List of emails
 * @property {string} [message] - Optional message about the emails
 */

/**
 * @typedef {Object} EmailReply
 * @property {string} reply - Generated reply text
 * @property {string} subject - Reply subject
 * @property {string} to - Recipient email
 */

/**
 * @typedef {Object} CalendarEvent
 * @property {string} id - Event ID
 * @property {string} summary - Event title
 * @property {string} start - Event start time
 * @property {string} end - Event end time
 * @property {string} location - Event location
 * @property {string} description - Event description
 */

/**
 * @typedef {Object} CalendarEventList
 * @property {CalendarEvent[]} events - List of calendar events
 * @property {string} [message] - Optional message about the events
 */

/**
 * @typedef {Object} EventCreationResponse
 * @property {string} id - Created event ID
 * @property {string} htmlLink - Link to view the event
 * @property {string} status - Creation status
 * @property {string} parsed_request - Parsed natural language request
 */

/**
 * @typedef {Object} ProjectPlan
 * @property {string} project_plan - Generated project plan text
 */

/**
 * @typedef {Object} ReportTemplate
 * @property {string} report_template - Generated report template
 */

/**
 * @typedef {Object} PresentationOutline
 * @property {string} presentation_outline - Generated presentation outline
 */

/**
 * @typedef {Object} CodeReview
 * @property {string} code_review - Generated code review
 */

/**
 * @typedef {Object} RefactoringSuggestion
 * @property {string} refactoring_suggestions - Generated refactoring suggestions
 */

/**
 * @typedef {Object} CodeExplanation
 * @property {string} code_explanation - Generated code explanation
 */

/**
 * @typedef {Object} Tool
 * @property {string} name - Tool name
 * @property {string} description - Tool description
 * @property {Object} parameters - Tool parameters schema
 */

/**
 * @typedef {Object} Message
 * @property {string} id - Message ID
 * @property {'user'|'assistant'|'system'} role - Message role
 * @property {string} content - Message content
 * @property {Date} [createdAt] - Message creation timestamp
 */
