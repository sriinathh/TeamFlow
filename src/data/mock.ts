import type { User, Workspace, Project, Task, Channel, Message, Meeting, Note, NoteFile, Notification } from '../types'

export const users: User[] = [
  { id: 'u1', name: 'Alex Chen', email: 'alex@teamflow.io', avatar: 'AC', role: 'owner', online: true, title: 'Founder & CEO' },
  { id: 'u2', name: 'Sarah Johnson', email: 'sarah@teamflow.io', avatar: 'SJ', role: 'admin', online: true, title: 'Product Manager' },
  { id: 'u3', name: 'Marcus Williams', email: 'marcus@teamflow.io', avatar: 'MW', role: 'member', online: true, title: 'Senior Engineer' },
  { id: 'u4', name: 'Emily Davis', email: 'emily@teamflow.io', avatar: 'ED', role: 'member', online: false, title: 'UI/UX Designer' },
  { id: 'u5', name: 'James Rodriguez', email: 'james@teamflow.io', avatar: 'JR', role: 'member', online: true, title: 'Frontend Engineer' },
  { id: 'u6', name: 'Lisa Wang', email: 'lisa@teamflow.io', avatar: 'LW', role: 'member', online: false, title: 'Backend Engineer' },
  { id: 'u7', name: 'Tom Anderson', email: 'tom@teamflow.io', avatar: 'TA', role: 'member', online: true, title: 'DevOps Engineer' },
  { id: 'u8', name: 'Nina Patel', email: 'nina@teamflow.io', avatar: 'NP', role: 'guest', online: false, title: 'Client Reviewer' },
]

export const workspaces: Workspace[] = [
  {
    id: 'w1',
    name: 'TeamFlow HQ',
    logo: 'TF',
    banner: 'gradient-brand',
    description: 'The main workspace for TeamFlow product development.',
    members: [
      { userId: 'u1', role: 'owner', joinedAt: '2024-01-15' },
      { userId: 'u2', role: 'admin', joinedAt: '2024-01-16' },
      { userId: 'u3', role: 'member', joinedAt: '2024-01-20' },
      { userId: 'u4', role: 'member', joinedAt: '2024-02-01' },
      { userId: 'u5', role: 'member', joinedAt: '2024-02-10' },
      { userId: 'u6', role: 'member', joinedAt: '2024-03-01' },
      { userId: 'u7', role: 'member', joinedAt: '2024-03-15' },
    ],
    createdAt: '2024-01-15',
  },
  {
    id: 'w2',
    name: 'Design Studio',
    logo: 'DS',
    banner: 'gradient-accent',
    description: 'Creative workspace for design team projects.',
    members: [
      { userId: 'u4', role: 'owner', joinedAt: '2024-02-01' },
      { userId: 'u2', role: 'admin', joinedAt: '2024-02-05' },
      { userId: 'u8', role: 'guest', joinedAt: '2024-04-01' },
    ],
    createdAt: '2024-02-01',
  },
]

export const projects: Project[] = [
  {
    id: 'p1',
    workspaceId: 'w1',
    name: 'Mobile App Launch',
    description: 'Launch the TeamFlow mobile application for iOS and Android.',
    color: '#3b82f6',
    icon: 'rocket',
    status: 'active',
    priority: 'high',
    deadline: '2025-12-15',
    members: ['u2', 'u3', 'u5', 'u4'],
    progress: 68,
    labels: ['mobile', 'launch', 'q4'],
    milestones: [
      { id: 'm1', title: 'Beta Release', date: '2025-10-01', done: true },
      { id: 'm2', title: 'App Store Review', date: '2025-11-10', done: false },
      { id: 'm3', title: 'Public Launch', date: '2025-12-15', done: false },
    ],
    createdAt: '2025-06-01',
  },
  {
    id: 'p2',
    workspaceId: 'w1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the marketing website with new branding.',
    color: '#8b5cf6',
    icon: 'globe',
    status: 'active',
    priority: 'medium',
    deadline: '2025-11-30',
    members: ['u4', 'u5', 'u2'],
    progress: 45,
    labels: ['design', 'web', 'branding'],
    milestones: [
      { id: 'm4', title: 'Wireframes Approved', date: '2025-09-15', done: true },
      { id: 'm5', title: 'Design System', date: '2025-10-20', done: true },
      { id: 'm6', title: 'Development Complete', date: '2025-11-20', done: false },
    ],
    createdAt: '2025-07-10',
  },
  {
    id: 'p3',
    workspaceId: 'w1',
    name: 'API v2 Migration',
    description: 'Migrate the backend API to v2 with improved performance.',
    color: '#10b981',
    icon: 'server',
    status: 'planning',
    priority: 'urgent',
    deadline: '2026-01-30',
    members: ['u6', 'u3', 'u7'],
    progress: 12,
    labels: ['backend', 'api', 'infrastructure'],
    milestones: [
      { id: 'm7', title: 'Schema Design', date: '2025-11-01', done: false },
      { id: 'm8', title: 'Migration Scripts', date: '2025-12-15', done: false },
    ],
    createdAt: '2025-09-01',
  },
  {
    id: 'p4',
    workspaceId: 'w1',
    name: 'Customer Onboarding',
    description: 'Create a self-serve onboarding flow for new customers.',
    color: '#f59e0b',
    icon: 'user-plus',
    status: 'on-hold',
    priority: 'low',
    deadline: '2026-02-28',
    members: ['u2', 'u4'],
    progress: 30,
    labels: ['growth', 'onboarding'],
    milestones: [],
    createdAt: '2025-08-15',
  },
  {
    id: 'p5',
    workspaceId: 'w1',
    name: 'Q4 Analytics Report',
    description: 'Compile and present Q4 team productivity analytics.',
    color: '#ec4899',
    icon: 'bar-chart',
    status: 'completed',
    priority: 'medium',
    deadline: '2025-09-30',
    members: ['u2', 'u1'],
    progress: 100,
    labels: ['analytics', 'report'],
    milestones: [
      { id: 'm9', title: 'Data Collection', date: '2025-09-10', done: true },
      { id: 'm10', title: 'Report Published', date: '2025-09-30', done: true },
    ],
    createdAt: '2025-08-01',
  },
]

const now = new Date()
const inDays = (n: number) => {
  const d = new Date(now)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export const tasks: Task[] = [
  {
    id: 't1', projectId: 'p1', title: 'Implement push notifications', description: 'Set up FCM for iOS and Android push notifications.',
    assigneeId: 'u3', dueDate: inDays(5), priority: 'high', status: 'in-progress', labels: ['mobile', 'backend'],
    subtasks: [
      { id: 's1', title: 'Configure FCM project', done: true },
      { id: 's2', title: 'Implement iOS notification handler', done: true },
      { id: 's3', title: 'Implement Android notification handler', done: false },
    ],
    comments: [
      { id: 'c1', userId: 'u2', text: 'Make sure to handle background notifications too.', createdAt: inDays(-2), reactions: {} },
    ],
    attachments: [{ id: 'a1', name: 'notification-spec.pdf', type: 'pdf', url: '#', size: '1.2 MB' }],
    activity: [{ id: 'act1', userId: 'u2', action: 'assigned to', target: 'Marcus Williams', createdAt: inDays(-3) }],
    timeEstimate: 16, createdAt: inDays(-10), order: 0,
  },
  {
    id: 't2', projectId: 'p1', title: 'Design onboarding screens', description: 'Create 5 onboarding screens for first-time users.',
    assigneeId: 'u4', dueDate: inDays(3), priority: 'medium', status: 'review', labels: ['design', 'mobile'],
    subtasks: [
      { id: 's4', title: 'Welcome screen', done: true },
      { id: 's5', title: 'Feature highlights', done: true },
      { id: 's6', title: 'Account setup', done: true },
    ],
    comments: [], attachments: [], activity: [], timeEstimate: 8, createdAt: inDays(-7), order: 0,
  },
  {
    id: 't3', projectId: 'p1', title: 'App Store screenshots', description: 'Prepare all App Store screenshots in required sizes.',
    assigneeId: 'u4', dueDate: inDays(10), priority: 'low', status: 'todo', labels: ['design', 'mobile'],
    subtasks: [], comments: [], attachments: [], activity: [], timeEstimate: 4, createdAt: inDays(-1), order: 0,
  },
  {
    id: 't4', projectId: 'p1', title: 'Crash reporting setup', description: 'Integrate Sentry for crash reporting.',
    assigneeId: 'u5', dueDate: inDays(7), priority: 'high', status: 'todo', labels: ['mobile', 'infrastructure'],
    subtasks: [], comments: [], attachments: [], activity: [], timeEstimate: 6, createdAt: inDays(-2), order: 1,
  },
  {
    id: 't5', projectId: 'p1', title: 'Beta tester feedback collection', description: 'Set up in-app feedback form for beta testers.',
    assigneeId: 'u2', dueDate: inDays(-1), priority: 'medium', status: 'done', labels: ['mobile', 'feedback'],
    subtasks: [], comments: [], attachments: [], activity: [], timeEstimate: 4, createdAt: inDays(-15), order: 0,
  },
  {
    id: 't6', projectId: 'p1', title: 'Performance optimization', description: 'Reduce app startup time to under 2 seconds.',
    assigneeId: 'u3', dueDate: inDays(14), priority: 'urgent', status: 'backlog', labels: ['mobile', 'performance'],
    subtasks: [], comments: [], attachments: [], activity: [], timeEstimate: 20, createdAt: inDays(-1), order: 0,
  },
  {
    id: 't7', projectId: 'p2', title: 'Design new hero section', description: 'Create a modern hero section with animations.',
    assigneeId: 'u4', dueDate: inDays(2), priority: 'high', status: 'in-progress', labels: ['design', 'web'],
    subtasks: [
      { id: 's7', title: 'Desktop layout', done: true },
      { id: 's8', title: 'Mobile responsive', done: false },
    ],
    comments: [], attachments: [], activity: [], timeEstimate: 10, createdAt: inDays(-5), order: 0,
  },
  {
    id: 't8', projectId: 'p2', title: 'Build component library', description: 'Create reusable Vue components for the website.',
    assigneeId: 'u5', dueDate: inDays(8), priority: 'medium', status: 'in-progress', labels: ['frontend', 'web'],
    subtasks: [], comments: [], attachments: [], activity: [], timeEstimate: 24, createdAt: inDays(-3), order: 1,
  },
  {
    id: 't9', projectId: 'p2', title: 'SEO optimization', description: 'Optimize meta tags, sitemap, and structured data.',
    assigneeId: 'u5', dueDate: inDays(12), priority: 'low', status: 'todo', labels: ['web', 'seo'],
    subtasks: [], comments: [], attachments: [], activity: [], timeEstimate: 8, createdAt: inDays(-1), order: 0,
  },
  {
    id: 't10', projectId: 'p2', title: 'Write landing copy', description: 'Write compelling copy for all landing page sections.',
    assigneeId: 'u2', dueDate: inDays(-2), priority: 'medium', status: 'done', labels: ['content', 'web'],
    subtasks: [], comments: [], attachments: [], activity: [], timeEstimate: 6, createdAt: inDays(-10), order: 0,
  },
  {
    id: 't11', projectId: 'p3', title: 'Design API schema v2', description: 'Define the new REST API schema with OpenAPI spec.',
    assigneeId: 'u6', dueDate: inDays(20), priority: 'urgent', status: 'in-progress', labels: ['backend', 'api'],
    subtasks: [], comments: [], attachments: [], activity: [], timeEstimate: 16, createdAt: inDays(-2), order: 0,
  },
  {
    id: 't12', projectId: 'p3', title: 'Set up migration scripts', description: 'Write scripts to migrate data from v1 to v2.',
    assigneeId: 'u3', dueDate: inDays(30), priority: 'high', status: 'backlog', labels: ['backend', 'migration'],
    subtasks: [], comments: [], attachments: [], activity: [], timeEstimate: 32, createdAt: inDays(-1), order: 0,
  },
  {
    id: 't13', projectId: 'p4', title: 'User research interviews', description: 'Conduct 10 user interviews about onboarding pain points.',
    assigneeId: 'u2', dueDate: inDays(40), priority: 'medium', status: 'backlog', labels: ['research'],
    subtasks: [], comments: [], attachments: [], activity: [], timeEstimate: 12, createdAt: inDays(-5), order: 0,
  },
  {
    id: 't14', projectId: 'p5', title: 'Collect Q4 metrics', description: 'Gather all productivity and engagement metrics.',
    assigneeId: 'u2', dueDate: inDays(-10), priority: 'high', status: 'done', labels: ['analytics'],
    subtasks: [], comments: [], attachments: [], activity: [], timeEstimate: 8, createdAt: inDays(-30), order: 0,
  },
  {
    id: 't15', projectId: 'p5', title: 'Create executive summary', description: 'Write a 2-page executive summary of Q4 results.',
    assigneeId: 'u1', dueDate: inDays(-5), priority: 'urgent', status: 'done', labels: ['analytics', 'report'],
    subtasks: [], comments: [], attachments: [], activity: [], timeEstimate: 4, createdAt: inDays(-20), order: 0,
  },
]

export const channels: Channel[] = [
  { id: 'ch1', workspaceId: 'w1', name: 'general', description: 'General workspace discussion', isPrivate: false, members: ['u1','u2','u3','u4','u5','u6','u7'], unread: 2 },
  { id: 'ch2', workspaceId: 'w1', name: 'product', description: 'Product strategy and roadmap', isPrivate: false, members: ['u1','u2','u3','u4','u5'], unread: 0 },
  { id: 'ch3', workspaceId: 'w1', name: 'engineering', description: 'Engineering discussions', isPrivate: false, members: ['u3','u5','u6','u7'], unread: 5 },
  { id: 'ch4', workspaceId: 'w1', name: 'design', description: 'Design team chat', isPrivate: false, members: ['u4','u2','u5'], unread: 0 },
  { id: 'ch5', workspaceId: 'w1', name: 'random', description: 'Off-topic and fun', isPrivate: false, members: ['u1','u2','u3','u4','u5','u6','u7'], unread: 0 },
  { id: 'ch6', workspaceId: 'w1', name: 'leadership', description: 'Private leadership channel', isPrivate: true, members: ['u1','u2'], unread: 0 },
]

export const messages: Message[] = [
  { id: 'msg1', channelId: 'ch1', userId: 'u1', text: 'Welcome to TeamFlow everyone! This is our main channel.', createdAt: '2025-09-28T09:00:00', edited: false, reactions: { '👍': ['u2','u3','u4'], '🎉': ['u5','u6'] }, threadReplies: [] },
  { id: 'msg2', channelId: 'ch1', userId: 'u2', text: 'Excited to get started. The new sprint planning doc is in the Notes section.', createdAt: '2025-09-28T09:15:00', edited: false, reactions: { '👍': ['u1','u3'] }, threadReplies: [] },
  { id: 'msg3', channelId: 'ch1', userId: 'u3', text: 'Quick heads up — the build pipeline is green again. All tests passing.', createdAt: '2025-09-28T14:30:00', edited: false, reactions: { '🎉': ['u1','u2','u4','u5'] }, threadReplies: [] },
  { id: 'msg4', channelId: 'ch1', userId: 'u4', text: 'I just uploaded the new design mockups to the Files section. Check them out!', createdAt: '2025-09-29T10:00:00', edited: false, reactions: { '🔥': ['u2','u5'] }, threadReplies: [] },
  { id: 'msg5', channelId: 'ch1', userId: 'u5', text: 'Looks amazing! I will start implementing the hero section today.', createdAt: '2025-09-29T10:15:00', edited: false, reactions: { '👍': ['u4'] }, threadReplies: [] },
  { id: 'msg6', channelId: 'ch3', userId: 'u6', text: 'The API v2 schema draft is ready for review. Posted in the notes.', createdAt: '2025-09-29T11:00:00', edited: false, reactions: { '👀': ['u3'] }, threadReplies: [] },
  { id: 'msg7', channelId: 'ch3', userId: 'u7', text: 'I set up the staging environment for v2 testing. URL is in the channel topic.', createdAt: '2025-09-29T11:30:00', edited: false, reactions: { '👍': ['u3','u6'] }, threadReplies: [] },
  { id: 'msg8', channelId: 'ch3', userId: 'u3', text: 'Nice work! Let\'s sync at the engineering meeting tomorrow.', createdAt: '2025-09-29T11:45:00', edited: false, reactions: {}, threadReplies: [] },
  { id: 'msg9', channelId: 'ch2', userId: 'u2', text: 'Roadmap for Q1 2026 is drafted. Need feedback from the team by Friday.', createdAt: '2025-09-28T13:00:00', edited: false, reactions: { '📌': ['u1'] }, threadReplies: [] },
  { id: 'msg10', channelId: 'ch2', userId: 'u1', text: 'Great work Sarah. Let\'s prioritize the mobile launch first.', createdAt: '2025-09-28T13:20:00', edited: false, reactions: { '💯': ['u2','u3'] }, threadReplies: [] },
  { id: 'msg11', channelId: 'ch4', userId: 'u4', text: 'New color palette for the brand refresh is ready!', createdAt: '2025-09-29T09:00:00', edited: false, reactions: { '🎨': ['u2','u5'] }, threadReplies: [] },
  { id: 'msg12', channelId: 'ch5', userId: 'u5', text: 'Who is up for team lunch on Friday? 🍕', createdAt: '2025-09-29T12:00:00', edited: false, reactions: { '🍕': ['u1','u2','u3','u4','u6','u7'] }, threadReplies: [] },
]

export const meetings: Meeting[] = [
  { id: 'mt1', workspaceId: 'w1', title: 'Weekly Team Standup', description: 'Weekly sync to discuss progress and blockers.', date: inDays(1), time: '09:00', duration: 30, platform: 'google-meet', link: 'https://meet.google.com/abc-defg-hij', attendees: ['u1','u2','u3','u4','u5','u6','u7'], notes: '', status: 'upcoming' },
  { id: 'mt2', workspaceId: 'w1', title: 'Mobile Launch Review', description: 'Review the mobile app before App Store submission.', date: inDays(3), time: '14:00', duration: 60, platform: 'google-meet', link: 'https://meet.google.com/xyz-abcd-efg', attendees: ['u1','u2','u3','u4','u5'], notes: '', status: 'upcoming' },
  { id: 'mt3', workspaceId: 'w1', title: 'API v2 Architecture Sync', description: 'Discuss the API v2 migration architecture.', date: inDays(2), time: '11:00', duration: 45, platform: 'zoom', link: 'https://zoom.us/j/123456789', attendees: ['u3','u6','u7'], notes: '', status: 'upcoming' },
  { id: 'mt4', workspaceId: 'w1', title: 'Design Review', description: 'Review the new website design mockups.', date: inDays(-2), time: '15:00', duration: 60, platform: 'google-meet', link: 'https://meet.google.com/old-meeting', attendees: ['u2','u4','u5'], notes: 'Great progress on the hero section. Need to refine the pricing cards.', status: 'completed' },
  { id: 'mt5', workspaceId: 'w1', title: 'Sprint Planning', description: 'Plan tasks for the next sprint.', date: inDays(5), time: '10:00', duration: 90, platform: 'google-meet', link: 'https://meet.google.com/sprint-plan', attendees: ['u1','u2','u3','u4','u5','u6','u7'], notes: '', status: 'upcoming' },
]

export const notes: Note[] = [
  { id: 'n1', workspaceId: 'w1', title: 'Sprint Planning Document', content: '# Sprint Planning\n\n## Goals\n- Complete mobile app beta testing\n- Finalize website hero section\n- Begin API v2 schema design\n\n## Team Capacity\n- Frontend: 40h\n- Backend: 40h\n- Design: 32h\n\n## Priorities\n1. Push notifications implementation\n2. Onboarding screen designs\n3. API schema v2 draft', authorId: 'u2', lastEdited: inDays(-1), sharedWith: ['u1','u3','u4','u5'], versions: [] },
  { id: 'n2', workspaceId: 'w1', title: 'Engineering Guidelines', content: '# Engineering Guidelines\n\n## Code Style\n- Use TypeScript for all new code\n- Follow the established ESLint configuration\n- Write meaningful commit messages\n\n## Code Review\n- All PRs require at least one approval\n- Address all review comments before merging\n- Keep PRs under 400 lines when possible\n\n## Testing\n- Write unit tests for all new features\n- Maintain at least 80% code coverage', authorId: 'u3', lastEdited: inDays(-5), sharedWith: ['u5','u6','u7'], versions: [] },
  { id: 'n3', workspaceId: 'w1', title: 'Brand Guidelines', content: '# Brand Guidelines\n\n## Colors\n- Primary: #3b82f6\n- Accent: #6366f1\n- Success: #10b981\n- Warning: #f59e0b\n\n## Typography\n- Headings: Inter Bold\n- Body: Inter Regular\n- Code: JetBrains Mono\n\n## Voice\n- Professional but approachable\n- Clear and concise\n- Action-oriented', authorId: 'u4', lastEdited: inDays(-3), sharedWith: ['u1','u2','u5'], versions: [] },
  { id: 'n4', workspaceId: 'w1', title: 'Meeting Notes — Design Review', content: '# Design Review Notes\n\n## Attendees\nSarah, Emily, James\n\n## Discussion\n- Hero section animation needs to be smoother\n- Pricing cards should use more whitespace\n- Testimonials section looks great\n\n## Action Items\n- [ ] Emily: refine pricing cards\n- [ ] James: optimize hero animation\n- [ ] Sarah: review final designs by Thursday', authorId: 'u2', lastEdited: inDays(-2), sharedWith: ['u4','u5'], versions: [] },
]

export const files: NoteFile[] = [
  { id: 'f1', workspaceId: 'w1', name: 'mobile-mockups.png', type: 'image', url: '#', size: '2.4 MB', folder: 'Design', uploadedBy: 'u4', uploadedAt: inDays(-1) },
  { id: 'f2', workspaceId: 'w1', name: 'api-spec-v2.pdf', type: 'pdf', url: '#', size: '890 KB', folder: 'Engineering', uploadedBy: 'u6', uploadedAt: inDays(-2) },
  { id: 'f3', workspaceId: 'w1', name: 'brand-guidelines.pdf', type: 'pdf', url: '#', size: '3.1 MB', folder: 'Design', uploadedBy: 'u4', uploadedAt: inDays(-7) },
  { id: 'f4', workspaceId: 'w1', name: 'q4-report.xlsx', type: 'spreadsheet', url: '#', size: '1.5 MB', folder: 'Reports', uploadedBy: 'u2', uploadedAt: inDays(-10) },
  { id: 'f5', workspaceId: 'w1', name: 'sprint-plan.doc', type: 'doc', url: '#', size: '420 KB', folder: 'Product', uploadedBy: 'u2', uploadedAt: inDays(-3) },
  { id: 'f6', workspaceId: 'w1', name: 'architecture-diagram.png', type: 'image', url: '#', size: '1.8 MB', folder: 'Engineering', uploadedBy: 'u7', uploadedAt: inDays(-4) },
]

export const notifications: Notification[] = [
  { id: 'nt1', type: 'task-assigned', title: 'New task assigned', body: 'Sarah assigned you "Implement push notifications"', read: false, createdAt: inDays(0), link: '/app/projects/p1' },
  { id: 'nt2', type: 'new-message', title: 'New message in #engineering', body: 'Lisa: The API v2 schema draft is ready for review', read: false, createdAt: inDays(0), link: '/app/chat' },
  { id: 'nt3', type: 'deadline', title: 'Deadline approaching', body: 'Task "Design onboarding screens" is due in 3 days', read: false, createdAt: inDays(0), link: '/app/projects/p1' },
  { id: 'nt4', type: 'meeting-reminder', title: 'Meeting tomorrow', body: 'Weekly Team Standup at 09:00', read: false, createdAt: inDays(0), link: '/app/meetings' },
  { id: 'nt5', type: 'file-upload', title: 'New file uploaded', body: 'Emily uploaded "mobile-mockups.png" to Design folder', read: true, createdAt: inDays(-1), link: '/app/files' },
  { id: 'nt6', type: 'comment', title: 'New comment', body: 'Sarah commented on "Implement push notifications"', read: true, createdAt: inDays(-1), link: '/app/projects/p1' },
  { id: 'nt7', type: 'mention', title: 'You were mentioned', body: 'Marcus mentioned you in #engineering', read: true, createdAt: inDays(-2), link: '/app/chat' },
]
