import { SampleScreenshot } from '../types';

// Helper to generate crisp SVG Data URLs that look like real smartphone screenshots
function createScreenshotSvgDataUrl(
  headerTitle: string,
  phone: string,
  dateTime: string,
  link: string,
  content: string,
  accentColor: string = '#25D366'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#1E293B"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>
    
    <!-- Phone Screen Background -->
    <rect width="400" height="600" rx="28" fill="url(#bg)"/>
    
    <!-- Status Bar -->
    <text x="24" y="32" fill="#94A3B8" font-family="sans-serif" font-size="12" font-weight="600">10:30</text>
    <path d="M 340 24 h 16 v 10 h -16 z" fill="#94A3B8" rx="2"/>
    <circle cx="320" cy="29" r="4" fill="#94A3B8"/>

    <!-- App Header -->
    <rect x="0" y="48" width="400" height="64" fill="#1E293B"/>
    <circle cx="40" cy="80" r="20" fill="${accentColor}"/>
    <text x="40" y="86" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">${headerTitle[0]}</text>
    
    <text x="72" y="75" fill="#F8FAFC" font-family="sans-serif" font-size="16" font-weight="bold">${headerTitle}</text>
    <text x="72" y="93" fill="#94A3B8" font-family="sans-serif" font-size="12">${phone}</text>
    
    <!-- Chat / Notification Container -->
    <g transform="translate(16, 130)" filter="url(#shadow)">
      <rect width="368" height="240" rx="16" fill="#334155"/>
      <rect x="0" y="0" width="368" height="6" fill="${accentColor}" rx="3"/>
      
      <!-- Sender & Date -->
      <text x="20" y="36" fill="#38BDF8" font-family="sans-serif" font-size="14" font-weight="bold">From: ${phone}</text>
      <text x="348" y="36" fill="#94A3B8" font-family="sans-serif" font-size="11" text-anchor="end">${dateTime}</text>
      
      <!-- Divider -->
      <line x1="20" y1="50" x2="348" y2="50" stroke="#475569" stroke-width="1"/>
      
      <!-- Content Body -->
      <foreignObject x="20" y="60" width="328" height="110">
        <div xmlns="http://www.w3.org/1999/xhtml" style="color: #F1F5F9; font-family: sans-serif; font-size: 13px; line-height: 1.5; word-wrap: break-word;">
          ${content}
        </div>
      </foreignObject>
      
      <!-- Link Banner -->
      <rect x="20" y="180" width="328" height="42" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1"/>
      <text x="32" y="206" fill="#60A5FA" font-family="sans-serif" font-size="12" font-weight="500">🔗 ${link}</text>
    </g>

    <!-- Additional Info Box -->
    <g transform="translate(16, 390)">
      <rect width="368" height="120" rx="12" fill="#1E293B" stroke="#334155" stroke-width="1"/>
      <text x="20" y="30" fill="#94A3B8" font-family="sans-serif" font-size="12" font-weight="600">SCREENSHOT METADATA</text>
      <text x="20" y="55" fill="#E2E8F0" font-family="sans-serif" font-size="12">📱 Contact Phone: ${phone}</text>
      <text x="20" y="78" fill="#E2E8F0" font-family="sans-serif" font-size="12">🕒 Date &amp; Time: ${dateTime}</text>
      <text x="20" y="101" fill="#E2E8F0" font-family="sans-serif" font-size="12">🌐 URL Link: ${link}</text>
    </g>

    <!-- Navigation Bar at Bottom -->
    <rect x="150" y="580" width="100" height="4" rx="2" fill="#64748B"/>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export const SAMPLE_SCREENSHOTS: SampleScreenshot[] = [
  {
    id: 'sample-whatsapp',
    title: 'WhatsApp Payment & Order Screenshot',
    description: 'WhatsApp chat screenshot containing phone number, transaction link, date and order note',
    category: 'WhatsApp',
    imageDataUrl: createScreenshotSvgDataUrl(
      'WhatsApp Business',
      '9876543210',
      '24-07-2026 10:30 AM',
      'https://pay.example.com/inv/8921',
      'Hi, please confirm payment for order #8921. Pl make this type webpage for client tracking.',
      '#25D366'
    ),
    expectedData: {
      phoneNumber: '9876543210',
      dateTime: '24-07-2026 10:30 AM',
      link: 'https://pay.example.com/inv/8921',
      content: 'Hi, please confirm payment for order #8921. Pl make this type webpage for client tracking.',
    },
  },
  {
    id: 'sample-sms',
    title: 'SMS Alert Notification',
    description: 'SMS notification with phone number, date-time stamp and portal link',
    category: 'SMS Notification',
    imageDataUrl: createScreenshotSvgDataUrl(
      'SMS Alert - Banking',
      '9811223344',
      '24-07-2026 02:45 PM',
      'https://secure.bankportal.com/verify/409',
      'Your request for account update is registered. Click link to verify details before deadline.',
      '#3B82F6'
    ),
    expectedData: {
      phoneNumber: '9811223344',
      dateTime: '24-07-2026 02:45 PM',
      link: 'https://secure.bankportal.com/verify/409',
      content: 'Your request for account update is registered. Click link to verify details before deadline.',
    },
  },
  {
    id: 'sample-support',
    title: 'Support Desk Ticket Screenshot',
    description: 'Support ticket screenshot with agent contact, date-time, portal link and query content',
    category: 'Support Desk',
    imageDataUrl: createScreenshotSvgDataUrl(
      'Customer Care Ticket',
      '9899001122',
      '24-07-2026 11:15 AM',
      'https://helpdesk.company.org/ticket/991',
      'Hello, we have processed your screenshot upload query. Please check status at link provided.',
      '#8B5CF6'
    ),
    expectedData: {
      phoneNumber: '9899001122',
      dateTime: '24-07-2026 11:15 AM',
      link: 'https://helpdesk.company.org/ticket/991',
      content: 'Hello, we have processed your screenshot upload query. Please check status at link provided.',
    },
  },
];
