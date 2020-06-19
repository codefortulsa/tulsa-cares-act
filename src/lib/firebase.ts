import firebase from 'firebase/app';
import 'firebase/performance';
import 'firebase/analytics';

import { FIREBASE_CONFIG } from './config';

// Initialize firebase (if isn't already)
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

// Initialize Performance Monitoring through Firebase
export const perf = firebase.performance();

// Initialize Analytics through Firebase
export const analytics = firebase.analytics();

export default firebase;
