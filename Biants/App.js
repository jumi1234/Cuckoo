import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, AsyncStorage } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import MainScreen from './MainScreen';
import HomeTab from './AppTabNavigator/HomeTab';
import Board from './AppTabNavigator/Board';
import MessageTab from './AppTabNavigator/MessageTab';
import ChatTab from './AppTabNavigator/ChatTab';
import ProfileTab from './AppTabNavigator/ProfileTab';
import Login from './AppTabNavigator/Login';
import Register from './AppTabNavigator/Register';

// let loginState = '';
// const getLoggedIn = async () => {
//
//   try {
//     loginState = await AsyncStorage.getItem('loggedIn') || 'none';
//   } catch (error) {
//     // Error retrieving data
//     console.log(error.message);
//   }
//   return loginState;
// }

const loginState =
AsyncStorage.getAllKeys((err, keys) => {
  AsyncStorage.multiGet(keys, (err, stores) => {
    stores.map((result, i, store) => {
      // get at each store's key/value so you can work with it
      let key = store[i][0];
      let value = store[i][1];
      return value;
    });
  });
});

const AppStackNavigator = createStackNavigator({

  Main:{
     screen: loginState ? Login : Login,
     navigationOptions: {

headerTitle: (
    <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
        <Image
            source={require('./AppTabNavigator/img/cukcoo_logo.png')}
            style={{width:170, height:45}}
        />
    </View>
)

       }
  },
  MainScreen: {
    screen: MainScreen,
    navigationOptions: {
        title: 'CUCKOO',
      }
  },
  HomeTab: {
    screen: HomeTab
  },
  Board: {
    screen: Board
  },
  MessageTab: {
    screen: MessageTab
  },
  ChatTab: {
    screen: ChatTab
  },
  ProfileTab: {
    screen: ProfileTab
  },
  Login: {
    screen: Login
  },
  Register: {
    screen: Register
  },
});

export default createAppContainer(AppStackNavigator);
