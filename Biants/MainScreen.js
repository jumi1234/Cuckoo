import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, Image, Button } from 'react-native';
import { Icon } from 'native-base';
import { createBottomTabNavigator, createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import HomeTab from './AppTabNavigator/HomeTab';
import MessageTab from './AppTabNavigator/MessageTab';
import ProfileTab from './AppTabNavigator/ProfileTab';
import Board from './AppTabNavigator/Board';
import ChatTab from './AppTabNavigator/ChatTab';
import Login from './AppTabNavigator/Login';

const AppTabNavigator = createBottomTabNavigator({
  HomeTab: {
    screen: HomeTab,
  },
  Board: {
    screen: Board
  },
  MessageTab: {
    screen: MessageTab,
   },
  ProfileTab: {
     screen: ProfileTab }
});

export default createAppContainer(AppTabNavigator);

class MainScreen extends Component {

  static navigationOptions = {
    headerTitle: (
        <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
            <Image
                source={require('./AppTabNavigator/img/cukcoo_logo.png')}
                style={{width:170, height:45}}
            />
        </View>
    )
    //headerLeft: <Image source={require('./MainLogo.png')} style={{width:200, height:40}}/>
    //headerRight: <Text style={{ paddingRight:10, fontFamily: Fonts.koverwatch }}>테스트</Text>,
  }

  render() {
    return  (
      <View style={style.container}>
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
