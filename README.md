# College Event Tracker

A comprehensive React-based system for managing college event requests (OD/Leave) with multi-level approval workflow, notifications, and AI-powered summaries.

## 🎯 Live Deployment

**🌐 Access the live app here:** https://college-event-tracker.vercel.app

**GitHub Repository:** https://github.com/Sambavi-06/college-event-tracker

---

## 📋 Features

### ✅ Student Module
- **Registration & Login** - Secure student registration with roll number and password
- **Request Submission** - Submit OD (On-Duty) or Leave requests with:
  - Request type selection (OD/Leave)
  - Date, time, and place information
  - Duration (days)
  - Reason/description
  - Optional file upload
- **AI-Generated Summaries** - Automatic request summaries and priority labels
- **Request Tracking** - View all personal requests with real-time status updates
- **Notifications** - Bell icon with unread count and notification dropdown
- **Advanced Filtering** - Filter requests by status, type, and date range
- **Data Persistence** - All data saved to browser localStorage

### ✅ Staff Approval Workflow
- **Role-Based Access** - 3 approval levels:
  - **Advisor** - Reviews and approves student requests
  - **HOD** - Secondary approval authority
  - **Principal** - Final approval for long leave (>2 days) marked for escalation
- **Request Visibility Rules**:
  - Advisor & HOD: See all student requests
  - Principal: Only sees forwarded long-leave requests
- **Action Controls**:
  - Approve requests with automatic approval tracking
  - Reject with confirmation dialog
  - View AI summaries and priorities
- **Status Management**:
  - Pending (awaiting approval)
  - Approved (with approver name)
  - Rejected (with reason)
  - Final Decision (Principal's decision)

### ✅ Notifications System
- **Unread Badge** - Shows count of unread notifications
- **Per-Role Filtering** - Each user sees only relevant notifications
- **Actions**:
  - Mark as read
  - Mark all as read
  - Delete notifications
- **Real-Time Updates** - Notifications appear immediately on actions

### ✅ Filtering & Search
- Filter by **Status** (Pending/Approved/Rejected)
- Filter by **Request Type** (OD/Leave)
- Filter by **Date Range** (custom date picker)
- Combined filtering for precise searches

### ✅ User Interface
- **Responsive Design** - Mobile-first, works on all devices
- **Color-Coded Badges** - Visual status indicators (green/orange/red)
- **Role Indicators** - Shows current user's role on dashboard
- **Confirmation Dialogs** - Prevents accidental actions
- **Intuitive Navigation** - Clear role-based routing

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19.2.4** | UI Framework |
| **React Router DOM 7.13.0** | Client-side routing |
| **Context API** | State management |
| **localStorage** | Data persistence |
| **CSS3** | Styling (responsive design) |
| **Create React App** | Build tool |

---

## 📁 Project Structure

```
college-event-tracker/
├── src/
│   ├── context/
│   │   ├── StudentContext.js       # Student registration, login, logout
│   │   ├── RequestsContext.js      # Request CRUD, role-based filtering
│   │   ├── StaffContext.js         # Staff login, role selection
│   │   └── NotificationsContext.js # Notification management
│   ├── pages/
│   │   ├── LoginSelection.js       # Role selection page
│   │   ├── StudentLogin.js         # Student login form
│   │   ├── StudentRegister.js      # Student registration form
│   │   ├── StudentRequest.js       # Request submission form
│   │   ├── StudentDashboard.js     # Student request view with filtering
│   │   ├── StaffLogin.js           # Staff login with role param
│   │   ├── StaffDashboard.js       # Staff request approval view
│   │   └── AdminLogin.js           # Admin placeholder
│   ├── components/
│   │   └── NotificationBell.js     # Notification UI component
│   ├── App.js                      # Main router & routes
│   ├── App.css                     # All styling
│   ├── index.js                    # App bootstrap with context providers
│   └── index.css                   # Global styles
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── package.json                    # Dependencies & scripts
├── vercel.json                     # Vercel deployment config
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sambavi-06/college-event-tracker.git
   cd college-event-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
```

---

## 📖 How to Use

### For Students

1. **Register**
   - Click "Student" on home page
   - Fill registration form (Roll, Name, Password)
   - Submit to create account

2. **Login**
   - Use registered credentials
   - Access student dashboard

3. **Submit Request**
   - Click "Submit Request"
   - Fill form:
     - Type: OD or Leave
     - Date, Time, Place
     - Duration (days)
     - Reason
     - Optional: Upload file
   - Submit (auto-generates AI summary)

4. **Track Requests**
   - View all requests on dashboard
   - Use filters to find specific requests
   - Check status updates in real-time
   - View notifications for approvals/rejections

### For Staff (Advisor/HOD/Principal)

1. **Login**
   - Click role (Advisor/HOD/Principal)
   - Password: `admin`

2. **Review Requests**
   - See assigned requests based on role
   - Click request to view details
   - Read AI summary and priority

3. **Approve/Reject**
   - Click "Approve" button to approve
   - Click "Reject" to decline (confirmation required)
   - View approval tracking

4. **For Principal**
   - Only sees long-leave requests (>2 days)
   - Makes final decision
   - Status shows as "Final Decision"

---

## 🔐 Test Credentials

### Student Test Account
- **Roll:** CSE001
- **Name:** John Doe
- **Password:** test123

### Staff Login
- **Password:** `admin` (all staff)
- Select role (Advisor/HOD/Principal)

---

## 💾 Data Storage

All data is stored in browser's **localStorage**:
- `students` - Student accounts
- `currentStudent` - Logged-in student
- `requests` - All submitted requests
- `currentStaff` - Logged-in staff member
- `notifications` - System notifications

**Note:** Data persists across browser sessions but is lost if localStorage is cleared.

---

## 🎨 Request Object Structure

```javascript
{
  id: "uuid",
  studentRoll: "CSE001",
  studentName: "John Doe",
  type: "Leave",           // OD or Leave
  description: "Family visit",
  date: "2024-02-15",
  time: "09:00",
  place: "Home",
  duration: 3,             // Days
  fileName: null,          // Optional
  forwardedToPrincipal: true,
  status: "Pending",       // Pending, Approved, Rejected
  approvedBy: null,        // Advisor/HOD/Principal
  isFinal: false,          // True for Principal decision
  aiSummary: "3-day leave request...",
  aiPriority: "High",      // High, Medium, Low
  submittedAt: "2024-02-10T10:30:00"
}
```

---

## 🌐 Deployment

Deployed on **Vercel** with auto-deploy from GitHub:
- Push to `main` branch → Auto-deploy
- Live URL: https://college-event-tracker.vercel.app

---

## 📝 Available Scripts

```bash
npm start       # Run dev server (localhost:3000)
npm run build   # Create optimized production build
npm test        # Run test suite
npm run eject   # Eject from CRA (one-way operation)
```

---

## 🐛 Known Issues & Future Improvements

### Current Limitations
- All data in browser localStorage (not persisted to backend)
- No email notifications
- AI summaries are client-side only (not ML-based)

### Planned Features
- Backend API integration (Node.js/Express)
- Database (MongoDB/PostgreSQL)
- Email notifications
- Real AI/ML for summaries
- File attachment storage
- Admin dashboard for analytics
- User roles management
- Two-factor authentication

---

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Sambavi A**
- GitHub: https://github.com/Sambavi-06
- Project: https://github.com/Sambavi-06/college-event-tracker

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a pull request

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review project features above

---

**Last Updated:** January 29, 2026  
**Status:** ✅ Live & Ready to Use  
**Live URL:** https://college-event-tracker.vercel.app

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
