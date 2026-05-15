import { Resend } from "resend";

let resend: Resend | null = null;
function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendNotificationEmail(
  to: string,
  subject: string,
  html: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("No RESEND_API_KEY found, skipping email notification:", subject);
    return { error: "No API key" };
  }

  try {
    const client = getResend();
    if (!client) return { error: "No API key" };
    const data = await client.emails.send({
      from: "AtomQuest Portal <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
    });
    return { data };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { error };
  }
}

export const emailTemplates = {
  goalSubmitted: (employeeName: string) => `
    <h2>Goal Sheet Submitted</h2>
    <p><strong>${employeeName}</strong> has submitted their goal sheet for approval.</p>
    <p>Please log in to the AtomQuest Portal to review and approve their goals.</p>
    <br/>
    <a href="https://atomsync-platform.vercel.app/dashboard/team-goals">Review Goals</a>
  `,
  
  goalApproved: (managerName: string) => `
    <h2>Goal Sheet Approved</h2>
    <p>Your manager, <strong>${managerName}</strong>, has approved your goal sheet.</p>
    <p>Your goals are now locked. Good luck with your targets!</p>
    <br/>
    <a href="https://atomsync-platform.vercel.app/dashboard/goals">View Goals</a>
  `,
  
  goalReturned: (managerName: string, reason: string) => `
    <h2>Goal Sheet Returned for Rework</h2>
    <p>Your manager, <strong>${managerName}</strong>, has returned your goal sheet with the following feedback:</p>
    <blockquote style="border-left: 4px solid #f59e0b; padding-left: 12px; color: #4b5563;">
      ${reason}
    </blockquote>
    <p>Please log in to update your goals and resubmit them.</p>
    <br/>
    <a href="https://atomsync-platform.vercel.app/dashboard/goals">Update Goals</a>
  `,
  
  escalationWarning: (userName: string, ruleName: string, daysThreshold: number) => `
    <h2>⚠️ Action Required: Goal Setting Escalation</h2>
    <p>Hi ${userName},</p>
    <p>This is an automated reminder regarding: <strong>${ruleName}</strong>.</p>
    <p>It has been over ${daysThreshold} days since the cycle phase started and action is still pending.</p>
    <p>Please log in to the portal and resolve this immediately to avoid further escalation to HR/Leadership.</p>
    <br/>
    <a href="https://atomsync-platform.vercel.app/dashboard">Open Portal</a>
  `
};
