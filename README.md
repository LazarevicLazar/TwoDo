# TwoDo - Shared Accountability Desktop App 🎯

A beautiful desktop app for couples and partners to stay accountable together by sharing and tracking daily tasks.

## Features ✨

- 🔐 **Firebase Authentication** - Secure email/password login
- 🔄 **Real-time Sync** - Tasks sync instantly between partners
- 💑 **Partner Linking** - Connect with your partner using unique codes
- 📊 **Statistics** - Track individual and team performance
- ⚡ **Desktop Notifications** - Get notified when tasks are added/completed
- ⌨️ **Keyboard Shortcuts** - Quick access to common actions
- 🎨 **Beautiful UI** - Modern, gradient-based design with smooth animations
- 📱 **Cross-platform** - Works on Windows, Mac, and Linux

## Quick Start 🚀

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase Console

**IMPORTANT:** Before running the app, you must configure Firebase!

Follow the step-by-step guide in [`FIREBASE_CONSOLE_SETUP.md`](FIREBASE_CONSOLE_SETUP.md):

- Enable Email/Password Authentication
- Create Firestore Database
- Set up Security Rules
- Create required Indexes

### 3. Run the App

```bash
npm start
```

## How to Use 📖

### First Time Setup

1. **Create Account**

   - Launch the app
   - Click "Sign Up"
   - Enter your name, email, and password (min 6 characters)
   - Your unique partner code will be generated automatically

2. **Link with Partner**

   - Click the Settings icon (⚙️)
   - Share your partner code with your partner
   - Enter your partner's code in the "Link Partner" section
   - Click "Link"
   - You're now connected! ❤️

3. **Start Adding Tasks**
   - Click "Add Task" or press `Cmd/Ctrl + N`
   - Enter task title
   - Select category and priority
   - Hit Enter or click "Add"

### Daily Use

- **View Today's Tasks** - See your tasks and your partner's tasks
- **Complete Tasks** - Click the circle to mark as done
- **Add Reactions** - Send emoji reactions to completed tasks
- **Check Stats** - View completion percentages and team performance
- **Filter Tasks** - Click category buttons to filter view

## Keyboard Shortcuts ⌨️

- `Cmd/Ctrl + N` - New Task
- `Cmd/Ctrl + ,` - Settings
- `Escape` - Close modals/dialogs
- `Enter` - Submit forms

## Project Structure 📁

```
TwoDo/
├── main.js                    # Electron main process
├── renderer.html              # HTML template
├── renderer-firebase.js       # React app with Firebase
├── firebase-config.js         # Firebase configuration
├── package.json               # Dependencies and build config
├── FIREBASE_CONSOLE_SETUP.md  # Firebase setup guide
└── README.md                  # This file
```

## Build for Production 🔨

### Build for All Platforms

```bash
npm run build
```

### Platform-Specific Builds

```bash
npm run build-win    # Windows
npm run build-mac    # macOS
npm run build-linux  # Linux
```

Built apps will be in the `dist` folder.

## Firebase Configuration 🔥

The app uses Firebase for:

- **Authentication** - Email/password sign in
- **Firestore** - Real-time database for tasks and user data

Your Firebase config is in [`firebase-config.js`](firebase-config.js) and [`renderer.html`](renderer.html).

**Security:** API keys in the code are safe for client-side apps. Security is enforced through Firestore Security Rules.

## Data Structure 📊

### Users Collection

```javascript
{
  name: "John",
  email: "john@example.com",
  avatar: "👨",
  color: "#60a5fa",
  partnerCode: "JOH123ABC",
  partnerId: "user_id_of_partner",
  createdAt: timestamp
}
```

### Tasks Collection

```javascript
{
  title: "Morning workout",
  category: "health",
  priority: "high",
  completed: false,
  dueDate: "2025-12-05",
  reactions: ["❤️", "🔥"],
  userId: "user_id",
  createdAt: timestamp
}
```

## Troubleshooting 🔧

### App won't start

- Make sure dependencies are installed: `npm install`
- Check that you're using Node.js 16 or later

### Can't create account

- Verify Firebase Authentication is enabled in console
- Check internet connection
- Ensure password is at least 6 characters

### Tasks not syncing

- Verify Firestore database is created
- Check that Security Rules are published
- Ensure required indexes are built (green status in console)
- Check internet connection

### "Missing or insufficient permissions" error

- Double-check Firestore Security Rules are correctly set
- Make sure you're logged in

## Tech Stack 💻

- **Electron** - Desktop app framework
- **React** - UI library
- **Firebase** - Backend services (Auth + Firestore)
- **Tailwind CSS** - Styling (via CDN)
- **Babel** - JSX transpilation (via CDN)

## Development 🛠️

### Local Development

```bash
npm start
```

### Debug Mode

Uncomment this line in `main.js` to enable DevTools:

```javascript
mainWindow.webContents.openDevTools();
```

### Switch Between Local and Firebase

- **Firebase version** (current): Uses `renderer-firebase.js`
- **Local-only version**: Change `renderer.html` to use `renderer.js` instead

## Contributing 🤝

Feel free to fork, modify, and customize for your needs!

## License 📄

MIT License - Feel free to use this project however you'd like!

---

Built with ❤️ for couples who want to stay accountable together
