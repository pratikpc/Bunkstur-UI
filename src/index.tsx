import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import firebase from "firebase/app";
import 'firebase/auth';
import firebaseConfig from './firebase.config';

async function FirebaseSetup() {
   // eslint-disable-next-line
   // await CreateAppointments();
   // Wait till Firebase Load Complete before Firing
   function getCurrentUser(auth: firebase.auth.Auth) {
      return new Promise<firebase.User | null>((resolve, reject) => {
         const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
         }, reject);
      });
   }
   // If you want your app to work offline and load faster, you can change
   // unregister() to register() below. Note this comes with some pitfalls.
   // Learn more about service workers: https://bit.ly/CRA-PWA
  //  serviceWorker.register();

   firebase.initializeApp(firebaseConfig);
   await getCurrentUser(firebase.auth());
}

FirebaseSetup().then(async () => {
   ReactDOM.render(
      <React.StrictMode>
         <App />
      </React.StrictMode>,
      document.getElementById('root')
   );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
