import React from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

// eslint-disable-next-line
import * as firebaseui from 'firebaseui';
import { Typography } from '@material-ui/core';

// Configure FirebaseUI.
const uiConfig = {
   signInFlow: 'redirect',
   // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
   signInSuccessUrl: `${process.env.PUBLIC_URL}/`,
   // We will display Google and Facebook as auth providers.
   signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID] //,
   // tosUrl: '<your-tos-url>',
   // Privacy policy url/callback.
   // privacyPolicyUrl: ''
};

export default function Login() {
   return (
      <div
         className="center"
         style={{ textAlign: 'center', paddingTop: '100px' }}
      >
         <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="Logo" />
         <div
            className="center"
            style={{
               textAlign: 'center',
               padding: '30px',
               color: '#808080',
               fontSize: '20px'
            }}
         >
            <Typography variant="h1">Bunkstur</Typography>
            <Typography variant="subtitle1">Count the Number of lectures attended</Typography>
         </div>
         <div style={{ display: 'inline-block', height: '50%', width: '70%' }}>
            <StyledFirebaseAuth
               uiConfig={uiConfig}
               firebaseAuth={firebase.auth()}
            />
         </div>
      </div>
   );
}
