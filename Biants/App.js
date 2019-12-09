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
  componentWillUnmount() {
    this.authSubscription();
    // this.notification();
  }
  render() {
    // The application is initialising
    if (this.state.loading) return null;
    // The user is an Object, so they're logged in
    if (this.state.user) return <StackNavigator user={this.state.user}/>;
    // The user is null, so they're logged out
    return <Stack user={this.state.user}/>;
  }
}
