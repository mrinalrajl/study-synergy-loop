
// Firebase configuration for analytics and messaging
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key", 
  authDomain: "learning-platform-demo.firebaseapp.com",
  projectId: "learning-platform-demo",
  storageBucket: "learning-platform-demo.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890",
  measurementId: "G-ABCDEFGHIJ"
};

// Initialize Firebase
let app;
let analytics;
let messaging;

export const initFirebase = async () => {
  try {
    app = initializeApp(firebaseConfig);
    
    // Initialize Analytics if supported
    const analyticsSupported = await isSupported();
    if (analyticsSupported) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized');
    }
    
    // Initialize Firebase Cloud Messaging if supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      messaging = getMessaging(app);
      console.log('Firebase Messaging initialized');
      
      // Request permission for notifications
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Get FCM token for this device
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || 'demo-vapid-key'
          });
          console.log('FCM Token:', token);
          
          // Save the token to localStorage for now
          localStorage.setItem('fcm_token', token);
          
          // Handle foreground messages
          onMessage(messaging, (payload) => {
            console.log('Message received in foreground:', payload);
            
            // Display notification using the Notification API
            const { title, body, icon } = payload.notification || { 
              title: "New Notification", 
              body: "You have a new notification", 
              icon: "/favicon.ico" 
            };
            
            new Notification(title, { body, icon });
          });
        }
      } catch (error) {
        console.error('Failed to initialize push notifications:', error);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
};

export { app, analytics, messaging };
