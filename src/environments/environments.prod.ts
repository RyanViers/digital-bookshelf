export const environment = {
  production: true,
  googleBooksApiKey: '', // This will be set by your deployment service
  firebaseConfig: {
    apiKey: "YOUR_PRODUCTION_API_KEY", // Will be set by deployment service
    authDomain: "YOUR_PRODUCTION_AUTH_DOMAIN",
    projectId: "YOUR_PRODUCTION_PROJECT_ID",
    storageBucket: "YOUR_PRODUCTION_STORAGE_BUCKET",
    messagingSenderId: "YOUR_PRODUCTION_SENDER_ID",
    appId: "YOUR_PRODUCTION_APP_ID",
    measurementId: "YOUR_PRODUCTION_MEASUREMENT_ID"
  }
};