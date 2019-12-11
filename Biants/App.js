import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, AsyncStorage, TouchableOpacity } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import MainScreen from './MainScreen';
import HomeTab from './AppTabNavigator/HomeTab';
import Board from './AppTabNavigator/Board';
import MessageTab from './AppTabNavigator/MessageTab';
import ChatTab from './AppTabNavigator/ChatTab';
import ProfileTab from './AppTabNavigator/ProfileTab';
import Login from './AppTabNavigator/Login';
import Register from './AppTabNavigator/Register';
import SplashScreen from 'react-native-splash-screen';
import firebase from './src/config';
import StackNavigator from './StackNavigator';
import Stack from './Stack';
import PushNotification from 'react-native-push-notification';
import fb from 'react-native-firebase';



export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      user: '',
      aa: false,
    };
  }
  /**
   * When the App component mounts, we listen for any authentication
   * state changes in Firebase.
   * Once subscribed, the 'user' parameter will either be null
   * (logged out) or an Object (logged in)
   */

  notification() {
      PushNotification.localNotification({
        message: '메시지가 도착했습니다',
        largeIcon:  'ic_push',
      });
  }


  componentDidMount() {
    setTimeout(() => {
     SplashScreen.hide();
    }, 1000);
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loading: false,
        user,
      });
    });

    this._updateTokenToServer();
    this._listenForNotifications();



//    this.deleteNewmsg();
    // firebase.firestore().collection('tokens').doc(firebase.auth().currentUser.email).set({
    //   id: firebase.auth().currentUser.email,
    //   token: this.state.fcmToken,
    // });
  }

  // pushCondition() {
  //     if(firebase.auth().currentUser) {
  //     firebase.firestore().collection('notification').where('id', '==', firebase.auth().currentUser.email)
  //       .get()
  //       .then(querySnapshot => {
  //         const pushPermision = querySnapshot.docs.map(doc => doc.data());
  //         if(pushPermision[0].push) {
  //           this.setState({push: pushPermision[0].push});
  //         }
  //     });
  //
  //     firebase.firestore().collection('lastAccess').where('id', '==', firebase.auth().currentUser.email)
  //       .get()
  //       .then(querySnapshot => {
  //         const access = querySnapshot.docs.map(doc => doc.data());
  //         if(access[0].accessTime) {
  //           this.setState({accessTime: access[0].accessTime});
  //         }
  //     });
  //
  //     const push = this.state.push;
  //     const time = this.state.accessTime;
  //
  //     if(push && time) {
  //       firebase.firestore().collection('newmessage').where('receiver', '==', firebase.auth().currentUser.email)
  //         .get()
  //         .then(querySnapshot => {
  //   //         const newMsg = querySnapshot.data();
  //          const newMsg = querySnapshot.docs.map(doc => doc.data());
  //
  //           if(newMsg.length > 0) {
  //
  //             PushNotification.localNotification({
  //               message: '메시지가 도착했습니다',
  //               largeIcon:  'ic_push',
  //             });
  //
  //             // querySnapshot.forEach(function(doc) {
  //             //   doc.ref.delete();
  //             // });
  //           }
  //       });
  //     }
  //   }
  // }
  /**
   * Don't forget to stop listening for authentication state changes
   * when the component unmounts.
   */

   deleteNewmsg() {
     if(firebase.auth().currentUser) {
       var newMsg = firebase.firestore().collection("newmessages").where('receiver', '==', firebase.auth().currentUser.email);

       newMsg
       .get()
       .then(function(querySnapshot) {
         querySnapshot.forEach(function(doc) {
           //console.log(doc.data());
           doc.ref.delete();
         });
       });
     }
   }

    async _requestPermission(){
      try {
        // User has authorised
        await fb.messaging().requestPermission();
        await this._updateTokenToServer();
      } catch (error) {
          // User has rejected permissions
          alert("you can't handle push notification");
      }
    }

    async _updateTokenToServer(){
      const fcmToken = await fb.messaging().getToken();
      console.log(fcmToken);

      this.setState({fcmToken: fcmToken});

      // const url = "https://biants-project.firebaseio.com/";

      // if you want to notification using server,
      // do registry current user token

      // await fetch(url, header);
    }

    async _listenForNotifications(){
    // onNotificationDisplayed - ios only

    this.notificationListener = fb.notifications().onNotification((notification) => {
      console.log('onNotification', notification);
      this.notification();
      this.deleteNewmsg();

        //   dd() {
        //   if(firebase.auth().currentUser) {
        //     var newMsg = firebase.firestore().collection("newmessages").where('receiver', '==', firebase.auth().currentUser.email);
        //
        //     newMsg
        //     .get()
        //     .then(function(querySnapshot) {
        //       querySnapshot.forEach(function(doc) {
        //         console.log(doc.data());
        //         // doc.ref.delete();
        //       });
        //     });
        //   }
        // }

    });

    // this.notificationOpenedListener = fb.notifications().onNotificationOpened((notificationOpen) => {
    //     console.log('onNotificationOpened', notificationOpen);
    // });
    //
    // const notificationOpen = await fb.notifications().getInitialNotification();
    // if (notificationOpen) {
    //     console.log('getInitialNotification', notificationOpen);
    // }
  }



  componentWillUnmount() {
    this.authSubscription();
    this.notificationListener();
    // this.notification();
  }
  render() {

    if(firebase.auth().currentUser) {
      firebase.firestore().collection('tokens').doc(firebase.auth().currentUser.email).set({
        id: firebase.auth().currentUser.email,
        token: this.state.fcmToken,
      });
    }
    // The application is initialising
    if (this.state.loading) return null;
    // The user is an Object, so they're logged in
    if (this.state.user) return <StackNavigator user={this.state.user}/>;
    // The user is null, so they're logged out
    return <Stack user={this.state.user}/>;
  }
}
