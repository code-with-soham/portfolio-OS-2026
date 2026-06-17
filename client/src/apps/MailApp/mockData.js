export const FOLDERS = [
  { id: 'inbox', label: 'Inbox', icon: '📥', unread: 3 },
  { id: 'sent', label: 'Sent Items', icon: '📤', unread: 0 },
  { id: 'drafts', label: 'Drafts', icon: '📝', unread: 1 },
  { id: 'spam', label: 'Junk Email', icon: '🚫', unread: 12 },
];

export const MOCK_EMAILS = [
  {
    id: 1,
    folder: 'inbox',
    from: 'TCS Talent Acquisition',
    email: 'careers@tcs.com',
    subject: 'Interview Invitation: Systems Engineer Role',
    date: '10:30 AM',
    unread: true,
    content: `Dear Soham,

We are pleased to inform you that your profile has been shortlisted for the Systems Engineer role at Tata Consultancy Services (TCS).

Your technical interview is scheduled for next Tuesday at 10:00 AM IST. Please ensure you have a stable internet connection and a working webcam. The interview will focus on your web development skills and your recent projects.

Meeting Link: https://teams.microsoft.com/l/meetup-join/...

Best regards,
TCS Campus Hiring Team`
  },
  {
    id: 2,
    folder: 'inbox',
    from: 'Accenture Careers',
    email: 'recruitment@accenture.com',
    subject: 'Action Required: Accenture Assessment Link',
    date: 'Yesterday',
    unread: true,
    content: `Hello Soham,

Thank you for your interest in joining Accenture! 

As the next step in our recruitment process, we invite you to complete our online cognitive and technical assessment. The link will remain active for 48 hours from the receipt of this email.

Please make sure you complete this in a quiet environment without any interruptions.

Click here to start the assessment.

Regards,
Accenture Recruitment Team`
  },
  {
    id: 3,
    folder: 'inbox',
    from: 'Campus Placement Cell',
    email: 'placements@college.edu',
    subject: 'Notice: Upcoming Drive for Product Based Companies',
    date: 'Mon',
    unread: true,
    content: `Dear Students,

This is to inform you that several product-based companies will be visiting our campus for the placement drive starting next month. 

Please ensure your resumes are updated and submitted to the placement portal by the end of this week. Students interested in Frontend Development roles should highlight their React and modern web technologies experience.

All the best!

Placement Coordinator`
  },
  {
    id: 4,
    folder: 'inbox',
    from: 'GitHub Notifications',
    email: 'notifications@github.com',
    subject: '[GitHub] A new star on your portfolio-os repository!',
    date: 'Mon',
    unread: false,
    content: `Hey Soham!

Good news! Someone just starred your repository soham-portfolio-2026.
Keep up the great work. 

You are receiving this email because you are subscribed to repository notifications on GitHub.`
  },
  {
    id: 5,
    folder: 'sent',
    from: 'Soham Kundu',
    email: 'sohamkundu84@gmail.com',
    subject: 'Application for Frontend Developer',
    date: 'Last Week',
    unread: false,
    content: `Dear Hiring Manager,

Please find my resume attached for the Frontend Developer position. I have strong experience building complex React applications and mimicking OS environments in the browser.

Looking forward to hearing from you.

Best,
Soham Kundu`
  },
  {
    id: 6,
    folder: 'drafts',
    from: 'Soham Kundu',
    email: 'sohamkundu84@gmail.com',
    subject: 'Thank You - Interview Follow-up',
    date: 'Last Week',
    unread: false,
    content: `Hi [Name],

Thank you for taking the time to speak with me today about the...`
  }
];
