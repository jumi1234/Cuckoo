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
      message: 'aa',
      ongoing: false,
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
    // candel previous localNotification
    PushNotification.cancelAllLocalNotifications();
  }
  /**
   * Don't forget to stop listening for authentication state changes
   * when the component unmounts.
   */
  componentWillUnmount() {
    this.authSubscription();
    PushNotification.cancelLocalNotifications();
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
