import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Button, TouchableOpacity, ScrollView } from 'react-native';
import Dialog from "react-native-dialog";
import {Icon} from 'native-base';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import { Div } from 'react-native-div';
import ActionButton from 'react-native-action-button';
import Board from './Board';
import ChatTab from './ChatTab';
import MessageTab from './MessageTab';
import firebase from '../src/config';

const databaseURL = "https://biants-project.firebaseio.com/";

export default class HomeTab extends React.Component {

  static navigationOptions = {
      title: '',
        tabBarIcon: ({ tintColor }) => (
            <Icon name='ios-home' style={{ color: '#BDBDBD' }} />
            // //<Image source={require('../com.jpg')}/>
        )
    }

    constructor() {
    super();
    this.state = {
    words: {},
    messages: {},
    message: '',
    receiver: '',
    };
    }

    _get() {
    firebase.firestore().collection("words").orderBy('dateTime', 'desc')
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
            this.setState({words: data});
      });
    }

    _post(message) {
    return fetch(`${databaseURL}/messages.json`, {
    method: 'POST',
    body: JSON.stringify(message)
    }).then(res => {
    if(res.status != 200) {
    throw new Error(res.statusText);
    }
    return res.json();
    }).then(data => {
    let nextState = this.state.messages;
    nextState[data.name] = message;
    this.setState({messages: nextState});
    });
    }

    componentDidMount() {
    this._get();
    }

    state = {
      dialogVisible: false
    };

    showDialog = () => {
      this.setState({ dialogVisible: true });
    };

    handleCancel = () => {
      this.setState({ dialogVisible: false });
    };

    handleSubmit = () => {
      var date = new Date().getDate(); //Current Date
      if(date < 10) {
        date = '0' + new Date().getDate(); //Current Minutes
      }
      var month = new Date().getMonth() + 1; //Current Month
      if(month < 10) {
        month = '0' + new Date().getMonth() + 1;
      }
      var year = new Date().getFullYear(); //Current Year
      var hours = new Date().getHours(); //Current Hours
      if(hours < 10) {
        hours = '0' + new Date().getHours();
      }
      var min = new Date().getMinutes(); //Current Minutes
      if(min < 10) {
        min = '0' + new Date().getMinutes(); //Current Minutes
      }
      var sec = new Date().getSeconds(); //Current Seconds
      if(sec < 10) {
        sec = '0' + new Date().getSeconds();
      }
      var dateTime = year.toString() + month + date + hours + min + sec;

      if( (this.state.receiver) == (firebase.auth().currentUser.email) ) {
      alert("내가 보낸 쪽지입니다");

      } else {
      firebase.firestore().collection('messages').add({
        message: this.state.message,
        receiver: this.state.receiver,
        sender: firebase.auth().currentUser.email,
        dateTime: dateTime,
        })
      this.setState({ dialogVisible: false });
  }
    this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'MainScreen'})],
    }));

    }

    render() {
      return (
        <View style={style.container}>
          <ScrollView>
          <View>
            {Object.keys(this.state.words).map(id => {
              const word = this.state.words[id];
              return (
                <View style={style.list} key={id}>
                  <TouchableOpacity onPress={() => {this.setState({receiver: word.id}); this.showDialog();}}>
                    <Text style={style.data}>[{word.region}/{word.age}/{word.gender}]</Text>
                    <Text style={style.data}>{word.word}</Text>
                  </TouchableOpacity>
                  <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>쪽지 보내기</Dialog.Title>
                    <Dialog.Input style={style.message} name="message" value={this.state.message} onChangeText={(text) => this.setState({message: text})} placeholder="내용을 입력하세요" maxLength={120}></Dialog.Input>
                    <Dialog.Button label="보내기" onPress={this.handleSubmit}/>
                    <Dialog.Button label="닫기" onPress={this.handleCancel}/>
                  </Dialog.Container>
                </View>
              );
            })}
          </View>
          </ScrollView>
        </View>
      )
    }
}

const style = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
    },
    head: {
    flex:0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#D9E5FF',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor:'#eee',
    borderBottomWidth:0.3,
    padding: 5,
  },
  data: {
    fontSize: 20
  },
  message: {
    width: 350,
  }
});

const Test = createStackNavigator({
  HomeTab,
  Board,
}, {
  initialRouteName: 'HomeTab',
  title: ''
}
);

const Tt = createAppContainer(Test);
