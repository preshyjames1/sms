# School Management System - Firebase Functions

This directory contains Firebase Cloud Functions for the School Management System that handle email notifications and other server-side operations.

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
cd functions
npm install
\`\`\`

### 2. Configure Email Settings
Set up your email configuration using Firebase Functions config:

\`\`\`bash
# For Gmail (recommended for development)
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.pass="your-app-password"

# For production, consider using SendGrid or other email services
firebase functions:config:set email.service="sendgrid"
firebase functions:config:set email.api_key="your-sendgrid-api-key"
\`\`\`

### 3. Gmail Setup (if using Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in the config above

### 4. Deploy Functions
\`\`\`bash
firebase deploy --only functions
\`\`\`

## Available Functions

### 1. sendWelcomeEmail (Firestore Trigger)
- **Trigger**: When a new user document is created in `/users/{userId}`
- **Purpose**: Sends welcome emails to new users based on their role
- **Email Types**:
  - School Admin: Account setup instructions and dashboard access
  - Teacher: Teacher portal access and features overview
  - Student: Student portal access and parent notification
  - Parent: Parent portal access and children information

### 2. sendPasswordResetEmail (HTTPS Callable)
- **Purpose**: Sends password reset emails with secure reset links
- **Usage**: Called from client-side when user requests password reset
- **Security**: Requires user authentication

### 3. sendAnnouncementEmail (Firestore Trigger)
- **Trigger**: When a new announcement is created in `/announcements/{announcementId}`
- **Purpose**: Sends announcement emails to targeted audience
- **Features**: 
  - Audience targeting (students, teachers, parents, all)
  - Attachment support
  - Email delivery tracking

### 4. sendBulkNotificationEmail (HTTPS Callable)
- **Purpose**: Send custom emails to multiple recipients
- **Usage**: For admin-initiated bulk communications
- **Security**: Requires admin permissions

### 5. cleanupEmailLogs (Scheduled)
- **Schedule**: Daily at 2:00 AM
- **Purpose**: Removes email logs older than 30 days
- **Benefits**: Keeps database clean and reduces storage costs

## Email Templates

All email templates are responsive and include:
- School branding and colors
- Professional styling
- Mobile-friendly design
- Consistent footer with contact information
- Security notices where appropriate

## Email Logging

All email activities are logged to the `emailLogs` collection with:
- Recipient information
- Email type and content
- Success/failure status
- Timestamps
- Error details (if any)

## Security Features

- User authentication required for callable functions
- Permission checks for admin functions
- Rate limiting (handled by Firebase)
- Secure email templates with XSS protection
- Audit trail for all email activities

## Monitoring

Monitor function performance and email delivery:
\`\`\`bash
# View function logs
firebase functions:log

# View specific function logs
firebase functions:log --only sendWelcomeEmail
\`\`\`

## Troubleshooting

### Common Issues:

1. **Email not sending**
   - Check email configuration: `firebase functions:config:get`
   - Verify Gmail app password or email service credentials
   - Check function logs for errors

2. **Permission errors**
   - Ensure user has proper authentication
   - Verify role-based permissions in Firestore rules

3. **Template rendering issues**
   - Check for missing user data fields
   - Verify school data exists in Firestore

### Testing Functions Locally:
\`\`\`bash
# Start Firebase emulators
firebase emulators:start --only functions,firestore

# Test functions in emulator environment
\`\`\`

## Production Considerations

1. **Email Service**: Consider upgrading to SendGrid, AWS SES, or similar for production
2. **Rate Limiting**: Implement additional rate limiting for bulk emails
3. **Monitoring**: Set up alerts for failed email deliveries
4. **Backup**: Regular backups of email logs and configurations
5. **Compliance**: Ensure GDPR/privacy compliance for email communications
