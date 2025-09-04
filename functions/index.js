const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Email templates (no changes needed)
const emailTemplates = {
  welcomeSchoolAdmin: (userData, schoolData, tempPassword) => ({
    subject: `Welcome to ${schoolData.name} - School Management System`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">Welcome to School Management System</h1>
          <p style="color: #666; font-size: 16px;">Your school account has been created successfully!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Account Details</h2>
          <p><strong>Name:</strong> ${userData.profile.firstName} ${userData.profile.lastName}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Role:</strong> School Administrator</p>
          <p><strong>School:</strong> ${schoolData.name}</p>
          ${tempPassword ? `<p><strong>Temporary Password:</strong> ${tempPassword}</p>` : ""}
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333;">Getting Started</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>Sign in to your dashboard using the credentials above</li>
            <li>Complete your school profile setup</li>
            <li>Add your first students and teachers</li>
            <li>Explore all the features available in your plan</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://schoolmanagementsystem.com/auth/login" 
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Sign In to Dashboard
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>Need help? Contact our support team at support@schoolmanagementsystem.com</p>
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  welcomeTeacher: (userData, schoolData, tempPassword) => ({
    subject: `Welcome to ${schoolData.name} - Teacher Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">Welcome to ${schoolData.name}</h1>
          <p style="color: #666; font-size: 16px;">Your teacher account has been created!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Account Details</h2>
          <p><strong>Name:</strong> ${userData.profile.firstName} ${userData.profile.lastName}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Role:</strong> Teacher</p>
          <p><strong>School:</strong> ${schoolData.name}</p>
          <p><strong>Employee ID:</strong> ${userData.employeeId || "Will be assigned"}</p>
          ${tempPassword ? `<p><strong>Temporary Password:</strong> ${tempPassword}</p>` : ""}
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333;">What You Can Do</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>Manage your classes and students</li>
            <li>Take attendance and track student progress</li>
            <li>Create and grade assignments</li>
            <li>Communicate with students and parents</li>
            <li>Access teaching resources and materials</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://schoolmanagementsystem.com/auth/login" 
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Access Teacher Portal
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>Questions? Contact your school administrator or our support team.</p>
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  welcomeStudent: (userData, schoolData, parentEmails, tempPassword) => ({
    subject: `Welcome to ${schoolData.name} - Student Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">Welcome to ${schoolData.name}</h1>
          <p style="color: #666; font-size: 16px;">Your student account has been created!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Student Details</h2>
          <p><strong>Name:</strong> ${userData.profile.firstName} ${userData.profile.lastName}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Student ID:</strong> ${userData.admissionNumber || "Will be assigned"}</p>
          <p><strong>School:</strong> ${schoolData.name}</p>
          ${tempPassword ? `<p><strong>Temporary Password:</strong> ${tempPassword}</p>` : ""}
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333;">Student Portal Features</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>View your class schedule and timetable</li>
            <li>Check attendance records</li>
            <li>Access assignments and homework</li>
            <li>View grades and report cards</li>
            <li>Communicate with teachers</li>
            <li>Access learning resources</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://schoolmanagementsystem.com/auth/login" 
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Access Student Portal
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>Parents/Guardians: ${parentEmails.join(", ")}</p>
          <p>Questions? Contact your teachers or school administration.</p>
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  welcomeParent: (userData, schoolData, childrenNames, tempPassword) => ({
    subject: `Welcome to ${schoolData.name} - Parent Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">Welcome to ${schoolData.name}</h1>
          <p style="color: #666; font-size: 16px;">Your parent account has been created!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Account Details</h2>
          <p><strong>Name:</strong> ${userData.profile.firstName} ${userData.profile.lastName}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Role:</strong> Parent/Guardian</p>
          <p><strong>School:</strong> ${schoolData.name}</p>
          <p><strong>Children:</strong> ${childrenNames.join(", ")}</p>
          ${tempPassword ? `<p><strong>Temporary Password:</strong> ${tempPassword}</p>` : ""}
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333;">Parent Portal Features</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>Monitor your child's attendance and academic progress</li>
            <li>View grades, assignments, and report cards</li>
            <li>Communicate with teachers and parentEmails staff</li>
            <li>Receive important school announcements</li>
            <li>Track fee payments and financial information</li>
            <li>Schedule parent-teacher conferences</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://schoolmanagementsystem.com/auth/login" 
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Access Parent Portal
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>Stay connected with your child's education journey!</p>
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (userData, resetLink) => ({
    subject: "Password Reset Request - School Management System",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">Password Reset Request</h1>
          <p style="color: #666; font-size: 16px;">We received a request to reset your password</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p>Hello ${userData.profile.firstName},</p>
          <p>You requested to reset your password for your School Management System account. Click the button below to create a new password:</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0; color: #856404;"><strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all;">${resetLink}</p>
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  announcement: (announcementData, schoolData, recipientName) => ({
    subject: `${schoolData.name} - ${announcementData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">${schoolData.name}</h1>
          <p style="color: #666; font-size: 16px;">School Announcement</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">${announcementData.title}</h2>
          <p style="color: #666; margin-bottom: 15px;">
            <strong>Date:</strong> ${new Date(announcementData.createdAt).toLocaleDateString()}<br>
            <strong>Priority:</strong> ${announcementData.priority || "Normal"}
          </p>
          <div style="color: #333; line-height: 1.6;">
            ${announcementData.content.replace(/\n/g, "<br>")}
          </div>
        </div>
        
        ${
          announcementData.attachments && announcementData.attachments.length > 0 ?
            `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">Attachments</h3>
            <ul style="color: #666;">
              ${announcementData.attachments.map((att) => `<li><a href="${att.url}" style="color: #16a34a;">${att.name}</a></li>`).join("")}
            </ul>
          </div>
        ` :
            ""
    }
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>This announcement was sent to: ${recipientName}</p>
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    `,
  }),
};

/**
 * Sends an email using the configured MailerSend transporter.
 * @param {string} to - The recipient's email address.
 * @param {Object} template - The email template containing subject and HTML content.
 * @return {Promise<Object>} An object indicating success or failure of the email sending operation.
 */
async function sendEmail(to, template) {
  try {
    // Transporter is now defined here, inside the function, to make sure environment variables are available
    // NOTE: This will not impact performance negatively as Cloud Functions re-use the same execution environment
    const transporter = nodemailer.createTransport({
      host: "smtp.mailersend.net",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.MAILERSEND_SMTP_USER,
        pass: process.env.MAILERSEND_SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"School Management System" <${process.env.MAILERSEND_SMTP_USER}>`,
      to: to,
      subject: template.subject,
      html: template.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return {success: true, messageId: result.messageId};
  } catch (error) {
    console.error("Error sending email:", error);
    return {success: false, error: error.message};
  }
}

// NOTE: All functions that require access to the secrets must be explicitly granted access via runWith
exports.sendWelcomeEmail = functions
    .runWith({secrets: ["MAILERSEND_SMTP_USER", "MAILERSEND_SMTP_PASS"]})
    .firestore.document("users/{userId}").onCreate(async (snap, context) => {
      const userData = snap.data();
      const userId = context.params.userId;

      try {
        // Get school data
        const schoolDoc = await admin.firestore().doc(`schools/${userData.schoolId}`).get();
        if (!schoolDoc.exists) {
          console.error("School not found for user:", userId);
          return null;
        }
        const schoolData = schoolDoc.data();

        let template;
        const parentEmails = [];
        const childrenNames = [];

        // Generate temporary password if needed
        const tempPassword = userData.tempPassword || null;

        switch (userData.role) {
          case "school_admin":
            template = emailTemplates.welcomeSchoolAdmin(userData, schoolData, tempPassword);
            break;

          case "teacher":
            template = emailTemplates.welcomeTeacher(userData, schoolData, tempPassword);
            break;

          case "student":
            // Get parent emails
            if (userData.parentIds && userData.parentIds.length > 0) {
              const parentDocs = await Promise.all(
                  userData.parentIds.map((id) => admin.firestore().doc(`users/${id}`).get()),
              );
              parentDocs.forEach((doc) => {
                if (doc.exists) {
                  parentEmails.push(doc.data().email);
                }
              });
            }
            template = emailTemplates.welcomeStudent(userData, schoolData, parentEmails, tempPassword);
            break;

          case "parent":
            // Get children names
            if (userData.childrenIds && userData.childrenIds.length > 0) {
              const childrenDocs = await Promise.all(
                  userData.childrenIds.map((id) => admin.firestore().doc(`users/${id}`).get()),
              );
              childrenDocs.forEach((doc) => {
                if (doc.exists) {
                  const child = doc.data();
                  childrenNames.push(`${child.profile.firstName} ${child.profile.lastName}`);
                }
              });
            }
            template = emailTemplates.welcomeParent(userData, schoolData, childrenNames, tempPassword);
            break;

          default:
            // For other roles (staff, etc.), use a generic welcome template
            template = emailTemplates.welcomeTeacher(userData, schoolData, tempPassword);
            break;
        }

        // Send the email
        const result = await sendEmail(userData.email, template);

        // Log the result
        await admin
            .firestore()
            .collection("emailLogs")
            .add({
              userId: userId,
              email: userData.email,
              type: "welcome",
              role: userData.role,
              success: result.success,
              messageId: result.messageId || null,
              error: result.error || null,
              sentAt: admin.firestore.FieldValue.serverTimestamp(),
            });

        return result;
      } catch (error) {
        console.error("Error in sendWelcomeEmail function:", error);
        return null;
      }
    });

exports.sendPasswordResetEmail = functions
    .runWith({secrets: ["MAILERSEND_SMTP_USER", "MAILERSEND_SMTP_PASS"]})
    .https.onCall(async (data, context) => {
      // Verify the user is authenticated
      if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
      }

      const {email, resetLink} = data;

      try {
        // Get user data
        const userQuery = await admin.firestore().collection("users").where("email", "==", email).limit(1).get();

        if (userQuery.empty) {
          throw new functions.https.HttpsError("not-found", "User not found");
        }

        const userData = userQuery.docs[0].data();
        const template = emailTemplates.passwordReset(userData, resetLink);

        // Send the email
        const result = await sendEmail(email, template);

        // Log the result
        await admin
            .firestore()
            .collection("emailLogs")
            .add({
              userId: userQuery.docs[0].id,
              email: email,
              type: "password_reset",
              success: result.success,
              messageId: result.messageId || null,
              error: result.error || null,
              sentAt: admin.firestore.FieldValue.serverTimestamp(),
            });

        return {success: result.success};
      } catch (error) {
        console.error("Error in sendPasswordResetEmail function:", error);
        throw new functions.https.HttpsError("internal", "Failed to send password reset email");
      }
    });

exports.sendAnnouncementEmail = functions
    .runWith({secrets: ["MAILERSEND_SMTP_USER", "MAILERSEND_SMTP_PASS"]})
    .firestore
    .document("announcements/{announcementId}")
    .onCreate(async (snap, context) => {
      const announcementData = snap.data();
      const announcementId = context.params.announcementId;

      try {
        // Get school data
        const schoolDoc = await admin.firestore().doc(`schools/${announcementData.schoolId}`).get();
        if (!schoolDoc.exists) {
          console.error("School not found for announcement:", announcementId);
          return null;
        }
        const schoolData = schoolDoc.data();

        // Get recipients based on target audience
        let recipientQuery = admin
            .firestore()
            .collection("users")
            .where("schoolId", "==", announcementData.schoolId)
            .where("isActive", "==", true);

        // Filter by target audience
        if (announcementData.targetAudience && announcementData.targetAudience !== "all") {
          if (Array.isArray(announcementData.targetAudience)) {
            recipientQuery = recipientQuery.where("role", "in", announcementData.targetAudience);
          } else {
            recipientQuery = recipientQuery.where("role", "==", announcementData.targetAudience);
          }
        }

        const recipientsSnapshot = await recipientQuery.get();

        // Send emails to all recipients
        const emailPromises = recipientsSnapshot.docs.map(async (doc) => {
          const recipient = doc.data();
          const recipientName = `${recipient.profile.firstName} ${recipient.profile.lastName}`;
          const template = emailTemplates.announcement(announcementData, schoolData, recipientName);

          const result = await sendEmail(recipient.email, template);

          // Log each email
          await admin
              .firestore()
              .collection("emailLogs")
              .add({
                userId: doc.id,
                email: recipient.email,
                type: "announcement",
                announcementId: announcementId,
                success: result.success,
                messageId: result.messageId || null,
                error: result.error || null,
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
              });

          return result;
        });

        const results = await Promise.all(emailPromises);
        const successCount = results.filter((r) => r.success).length;
        const failureCount = results.length - successCount;

        console.log(`Announcement emails sent: ${successCount} successful, ${failureCount} failed`);

        // Update announcement with email stats
        await snap.ref.update({
          emailStats: {
            totalSent: results.length,
            successful: successCount,
            failed: failureCount,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
          },
        });

        return {totalSent: results.length, successful: successCount, failed: failureCount};
      } catch (error) {
        console.error("Error in sendAnnouncementEmail function:", error);
        return null;
      }
    });

exports.sendBulkNotificationEmail = functions
    .runWith({secrets: ["MAILERSEND_SMTP_USER", "MAILERSEND_SMTP_PASS"]})
    .https.onCall(async (data, context) => {
      // Verify the user is authenticated and has permission
      if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
      }

      const {recipients, subject, content, schoolId} = data;

      try {
        // Verify user has permission to send bulk emails
        const userDoc = await admin.firestore().doc(`users/${context.auth.uid}`).get();
        if (!userDoc.exists) {
          throw new functions.https.HttpsError("not-found", "User not found");
        }

        const userData = userDoc.data();
        if (!["school_admin", "sub_admin"].includes(userData.role)) {
          throw new functions.https.HttpsError("permission-denied", "Insufficient permissions");
        }

        // Get school data
        const schoolDoc = await admin.firestore().doc(`schools/${schoolId}`).get();
        if (!schoolDoc.exists) {
          throw new functions.https.HttpsError("not-found", "School not found");
        }
        const schoolData = schoolDoc.data();

        // Send emails to all recipients
        const emailPromises = recipients.map(async (recipient) => {
          const customTemplate = {
            subject: subject,
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #16a34a; margin-bottom: 10px;">${schoolData.name}</h1>
              <p style="color: #666; font-size: 16px;">Important Notification</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">${subject}</h2>
              <div style="color: #333; line-height: 1.6;">
                ${content.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
              <p>This message was sent to: ${recipient.name}</p>
              <p>© 2024 School Management System. All rights reserved.</p>
            </div>
          </div>
        `,
          };

          const result = await sendEmail(recipient.email, customTemplate);

          // Log each email
          await admin
              .firestore()
              .collection("emailLogs")
              .add({
                userId: recipient.userId || null,
                email: recipient.email,
                type: "bulk_notification",
                subject: subject,
                success: result.success,
                messageId: result.messageId || null,
                error: result.error || null,
                sentBy: context.auth.uid,
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
              });

          return result;
        });

        const results = await Promise.all(emailPromises);
        const successCount = results.filter((r) => r.success).length;
        const failureCount = results.length - successCount;

        return {totalSent: results.length, successful: successCount, failed: failureCount};
      } catch (error) {
        console.error("Error in sendBulkNotificationEmail function:", error);
        throw new functions.https.HttpsError("internal", "Failed to send bulk notification emails");
      }
    });

exports.cleanupEmailLogs = functions.pubsub.schedule("0 2 * * *").onRun(async (context) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const oldLogsQuery = admin.firestore().collection("emailLogs").where("sentAt", "<", thirtyDaysAgo).limit(500); // Process in batches

    const snapshot = await oldLogsQuery.get();

    if (snapshot.empty) {
      console.log("No old email logs to clean up");
      return null;
    }

    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Cleaned up ${snapshot.docs.length} old email logs`);

    return null;
  } catch (error) {
    console.error("Error cleaning up email logs:", error);
    return null;
  }
});
