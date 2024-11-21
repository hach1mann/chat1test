import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

/* 
 * Dark Chat App
 * Created by: Pedro Lisboa
 * Copyright (c) 2024
 */

// Avatar icons by PedroLisboa2024
const avatarIcons = [
  'fas fa-user-astronaut',
  'fas fa-user-ninja',
  'fas fa-user-secret',
  'fas fa-user-graduate',
  'fas fa-user-doctor',
  'fas fa-user-tie',
  'fas fa-robot',
  'fas fa-ghost',
  'fas fa-cat',
  'fas fa-dog'
];

// Bot responses
const botResponses = [
  "Hey there! How's it going?",
  "That's interesting! Tell me more.",
  "I love chatting with new people!",
  "What do you like to do for fun?",
  "Have you tried the new features?",
  "The weather is nice today, isn't it?",
  "I'm enjoying our conversation!",
  "What's your favorite programming language?",
  "AI and chat apps are fascinating!",
  "Do you prefer dark mode or light mode?"
];

function App() {
  const [username, setUsername] = useState('');
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const botRef = useRef({
    username: 'ChatBot',
    icon: 'fas fa-robot',
    lastResponse: Date.now()
  });

  // Clear all messages on component mount
  useEffect(() => {
    const clearMessages = async () => {
      const messagesRef = collection(db, "messages");
      const snapshot = await getDocs(messagesRef);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    };
    clearMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize user and set up listeners
  useEffect(() => {
    if (username && usernameSubmitted) {
      const initializeUser = async () => {
        // Generate a random icon only once when user first joins
        const userIcon = avatarIcons[Math.floor(Math.random() * avatarIcons.length)];
        
        // Set user in active users with their permanent icon
        const userRef = doc(db, "activeUsers", username);
        await setDoc(userRef, {
          username,
          timestamp: serverTimestamp(),
          userIcon
        });

        // Add bot to active users
        const botRef = doc(db, "activeUsers", "ChatBot");
        await setDoc(botRef, {
          username: "ChatBot",
          timestamp: serverTimestamp(),
          userIcon: "fas fa-robot"
        });

        // Send welcome message from bot
        await addDoc(collection(db, "messages"), {
          text: "👋 Hi! I'm ChatBot. Nice to meet you! Feel free to start chatting.",
          username: "ChatBot",
          timestamp: serverTimestamp(),
          userIcon: "fas fa-robot"
        });
      };

      const q = query(collection(db, "messages"), orderBy("timestamp"));
      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        const newMessages = [];
        snapshot.forEach((doc) => {
          newMessages.push({ id: doc.id, ...doc.data() });
        });
        setMessages(newMessages);

        // Bot response logic
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && 
            lastMessage.username !== 'ChatBot' && 
            Date.now() - botRef.current.lastResponse > 2000) {
          setTimeout(async () => {
            const response = botResponses[Math.floor(Math.random() * botResponses.length)];
            await addDoc(collection(db, "messages"), {
              text: response,
              username: "ChatBot",
              timestamp: serverTimestamp(),
              userIcon: "fas fa-robot"
            });
            botRef.current.lastResponse = Date.now();
          }, 1000 + Math.random() * 2000);
        }
      });

      const unsubscribeUsers = onSnapshot(collection(db, "activeUsers"), (snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setActiveUsers(users);
      });

      initializeUser();

      return () => {
        unsubscribeMessages();
        unsubscribeUsers();
        const userRef = doc(db, "activeUsers", username);
        const botUserRef = doc(db, "activeUsers", "ChatBot");
        deleteDoc(userRef);
        deleteDoc(botUserRef);
      };
    }
  }, [username, usernameSubmitted]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = currentMessage.trim();
    
    if (!trimmedMessage) return;

    try {
      // Get the user's stored icon from active users
      const userIcon = activeUsers.find(user => user.username === username)?.userIcon || 'fas fa-user';
      
      await addDoc(collection(db, "messages"), {
        text: trimmedMessage,
        username,
        timestamp: serverTimestamp(),
        userIcon
      });
      
      // Clear input immediately
      setCurrentMessage('');
      
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!usernameSubmitted) {
    return (
      <div className="username-container">
        <form 
          className="username-form"
          onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.username.value.trim();
            if (name) {
              setUsername(name);
              setUsernameSubmitted(true);
            }
          }}
        >
          <h2>Enter Chat</h2>
          <input
            type="text"
            name="username"
            placeholder="Your username..."
            required
          />
          <button type="submit">
            <i className="fas fa-right-to-bracket"></i> Join Chat
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="users-list">
          {activeUsers.map((user) => (
            <div key={user.id} className="user-item">
              <div className="user-status"></div>
              <i className={user.userIcon || 'fas fa-user'}></i>
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-main">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`message ${msg.username === username ? 'sent' : 'received'}`}
            >
              <div className="message-header">
                <i className={msg.userIcon || 'fas fa-user'}></i>
                <strong>{msg.username}</strong>
              </div>
              <div className="message-content">{msg.text}</div>
              <div className="timestamp">
                {msg.timestamp?.toDate().toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="message-form" onSubmit={handleMessageSubmit}>
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
