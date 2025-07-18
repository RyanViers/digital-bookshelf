import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// Import the necessary AngularFire modules
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCL8Axl2BM4dCwLegUSRQ5yGlg3utnDxBY",
  authDomain: "digital-bookshelf-a3f32.firebaseapp.com",
  projectId: "digital-bookshelf-a3f32",
  storageBucket: "digital-bookshelf-a3f32.firebasestorage.app",
  messagingSenderId: "490461556056",
  appId: "1:490461556056:web:ddea6818b21f348f56492d",
  measurementId: "G-RQFZQWLF43"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
  ]
};