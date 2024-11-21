# Dark Chat App

A sleek, iOS-inspired real-time chat application built with React and Firebase. Features a modern dark theme and responsive design.

Created by Pedro Lisboa (c) 2024

## Features

- Real-time messaging with Firebase Firestore
- Dark theme inspired by iOS messaging
- Username-based authentication
- Real-time user presence tracking
- Random avatar icons for users
- Responsive design for all screen sizes
- Message timestamps
- Clean, minimalist interface

## Tech Stack

- Frontend: React
- Backend: Firebase Firestore
- Styling: CSS
- Icons: Font Awesome

## Setup

1. Clone the repository
```bash
git clone https://github.com/hach1mann/chat1test.git
```

2. Install dependencies
```bash
cd chat1test
npm install
```

3. Create a Firebase project and update the configuration in `src/firebase.js`

4. Start the development server
```bash
npm start
```

## Firebase Configuration

Create a new Firebase project and replace the configuration in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

---
 2024 Pedro Lisboa. All rights reserved.
