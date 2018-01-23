
import firebase from "firebase"
const config = {
    apiKey: process.env.GRP_CALC_APIKEY,
    authDomain: "group-calculator.firebaseapp.com",
    databaseURL: "https://group-calculator.firebaseio.com",
    projectId: "group-calculator",
    storageBucket: "group-calculator.appspot.com",
    messagingSenderId: "152406077023"
  };
  firebase.initializeApp(config);

  export default firebase;