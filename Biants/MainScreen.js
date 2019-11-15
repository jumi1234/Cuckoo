import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, Image, Button } from 'react-native';
import { Icon } from 'native-base';
import { createBottomTabNavigator, createAppContainer, createStackNavigator, StackActions } from 'react-navigation';
import HomeTab from './AppTabNavigator/HomeTab';
import MessageTab from './AppTabNavigator/MessageTab';
import ProfileTab from './AppTabNavigator/ProfileTab';
import Board from './AppTabNavigator/Board';
import ChatTab from './AppTabNavigator/ChatTab';
import Login from './AppTabNavigator/Login';

const AppTabNavigator = createBottomTabNavigator({
  HomeTab: { screen: HomeTab,
    navigationOptions: {
        title: '',
        tabBarIcon: ({ tintColor }) => (
            <Icon name='ios-home' style={{ color: '#BDBDBD' }} />
            // //<Image source={require('../com.jpg')}/>
        )
    }
 },
  MessageTab: { screen: MessageTab,
    navigationOptions: {
        title: '',
          tabBarIcon: ({ tintColor }) => (
              <Icon name='ios-paper' style={{ color: '#BDBDBD' }} />
          )
      }
   },
  ProfileTab: {
     screen: Platform.OS === 'android' ? Login : ProfileTab }
});

const AppTabContainet = createAppContainer(AppTabNavigator);

export default class MainScreen extends Component {

  static navigationOptions = {
    title: 'CUCKOO',
    //headerLeft: <Image source={require('./MainLogo.png')} style={{width:200, height:40}}/>
    //headerRight: <Text style={{ paddingRight:10, fontFamily: Fonts.koverwatch }}>테스트</Text>,
  }

  render() {
    return <AppTabContainet/>; (
      <View style={styles.container}>
        <Text>main</Text>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
