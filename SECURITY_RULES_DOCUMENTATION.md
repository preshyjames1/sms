# Firestore Security Rules Documentation

## Overview
This document outlines the comprehensive security rules implemented for the School Management System, ensuring multi-tenant isolation, role-based access control, and data protection.

## Key Security Principles

### 1. Multi-Tenant Isolation
- All data is isolated by `schoolId`
- Users can only access data from their own school
- Cross-school data access is strictly prohibited

### 2. Role-Based Access Control
- **School Admin**: Full access to their school's data
- **Principal**: Administrative access with some restrictions
- **Admin Assistant**: User management and administrative tasks
- **Teacher**: Access to classes, students, and academic data
- **Student**: Access to their own data and class materials
- **Parent**: Access to their children's data only
- **Staff**: Limited access based on role (librarian, nurse, etc.)

### 3. Data Protection
- Sensitive data (grades, personal info) has restricted access
- File uploads are validated for type and size
- Audit logs track all administrative actions

## Collection Rules

### Users Collection
- Users can read their own profile
- School admins can manage all users in their school
- Teachers can view student/parent profiles for their classes
- Parents can only see their children's data

### Classes Collection
- All school members can read class information
- Teachers can create/update classes they're assigned to
- Admins can manage all classes

### Attendance Collection
- Teachers can mark and view attendance
- Students can view their own attendance
- Parents can view their children's attendance
- Admins have full access

### Messages Collection
- Users can read messages they sent or received
- Admins can moderate all messages
- School isolation is enforced

### Grades Collection
- Teachers can create/update grades for their students
- Students can view their own grades
- Parents can view their children's grades
- Admins have full access

## Storage Rules

### File Organization
\`\`\`
/schools/{schoolId}/
  ├── users/{userId}/profile/          # Profile pictures
  ├── students/{studentId}/documents/  # Student documents
  ├── teachers/{teacherId}/resources/  # Teaching materials
  ├── classes/{classId}/materials/     # Class resources
  ├── announcements/{id}/attachments/  # Announcement files
  ├── messages/{id}/attachments/       # Message attachments
  ├── branding/                        # School logos/branding
  ├── imports/                         # Bulk import files
  ├── reports/                         # Generated reports
  └── backups/                         # System backups
\`\`\`

### File Restrictions
- **Images**: Max 5MB, common formats (jpg, png, gif, webp)
- **Documents**: Max 10MB, PDF, Word, text files
- **CSV/Excel**: For bulk imports only
- **Backups**: Admin access only

## Security Best Practices

### 1. Authentication Required
- All operations require valid authentication
- Anonymous access is prohibited

### 2. Input Validation
- File types and sizes are validated
- Data structure validation on writes
- Sanitization of user inputs

### 3. Audit Trail
- All administrative actions are logged
- User access patterns are tracked
- Security events are recorded

### 4. Principle of Least Privilege
- Users have minimum necessary permissions
- Role-based restrictions are enforced
- Sensitive operations require elevated privileges

## Deployment Instructions

1. **Firestore Rules**: Deploy to Firebase Console > Firestore > Rules
2. **Storage Rules**: Deploy to Firebase Console > Storage > Rules
3. **Testing**: Use Firebase Emulator for rule testing
4. **Monitoring**: Enable audit logs and security monitoring

## Rule Testing

\`\`\`javascript
// Example test cases
describe('Security Rules', () => {
  test('Users can only access their school data', async () => {
    // Test cross-school access prevention
  });
  
  test('Role-based permissions work correctly', async () => {
    // Test different role permissions
  });
  
  test('File upload restrictions are enforced', async () => {
    // Test file type and size limits
  });
});
\`\`\`

## Maintenance

- Review rules quarterly for security updates
- Monitor Firebase Console for rule violations
- Update rules when adding new features
- Test rules in staging before production deployment

## Emergency Procedures

1. **Security Breach**: Immediately disable affected rules
2. **Data Leak**: Audit logs to identify scope
3. **Rule Errors**: Rollback to previous working version
4. **Performance Issues**: Optimize rule complexity

For questions or security concerns, contact the development team.
