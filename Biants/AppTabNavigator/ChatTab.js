import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Platform, Image, Button, TextField, TouchableHighlight, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import Textarea from 'react-native-textarea';
import Hr from "react-native-hr-component";
import firebase from '../src/config';

const databaseURL = "https://biants-project.firebaseio.com/";

export default class ChatTab extends React.Component {

  _goHome = () => {
    const popAction = StackActions.pop({
      n: 1,
    });
    this.props.navigation.dispatch(popAction);
  }

  _goToProfile = () => {
      const pushAction = StackActions.push({
      routeName: 'Board',
        params: {
          myUserId: 9,
        },
      });
      this.props.navigation.dispatch(pushAction);
    }

    constructor(props) {
    super(props);
    this.state = {
      messages: {},
      reply: '',
      isSender: '',
      };
    }

    componentDidMount() {
      const collectionId = this.props.navigation.getParam('collectionId', 'no');
      const replyReceiver = this.props.navigation.getParam('replyReceiver', 'no');

      this._get();

      var emailad = firebase.auth().currentUser.email;

      firebase.firestore().collection("messages").doc(collectionId)
        .get()
        .then(querySnapshot => {
          if(! querySnapshot.empty) {
            const data = querySnapshot.data();
            if(data.sender == emailad) {
              this.setState({isSender: 1});
            }
         }
      });
    }

    _get() {
      const collectionId = this.props.navigation.getParam('collectionId', 'no');
      firebase.firestore().collection("messages").doc(collectionId).collection(collectionId).orderBy('dateTime', 'asc')
        .get()
        .then(querySnapshot => {
          const messages = querySnapshot.docs.map(doc => doc.data());
              this.setState({messages: messages});
          });
    }

    onSendPress() {
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

      const collectionId = this.props.navigation.getParam('collectionId', 'no');
      const replyReceiver = this.props.navigation.getParam('replyReceiver', 'no');

      firebase.firestore().collection('messages').doc(collectionId).collection(collectionId).add({
        message: this.state.reply,
        receiver: replyReceiver,
        sender: firebase.auth().currentUser.email,
        dateTime: dateTime,
      });

      firebase.firestore().collection('messages').doc(collectionId).set({
        message: this.state.reply,
        receiver: replyReceiver,
        sender: firebase.auth().currentUser.email,
        dateTime: dateTime,
        id: collectionId,
        talker: [firebase.auth().currentUser.email, replyReceiver],
        check: this.props.navigation.getParam('check', 'no'),
        myInfo: this.props.navigation.getParam('myInfo', 'no'),
        yourInfo: this.props.navigation.getParam('yourInfo', 'no'),
      });

      this.props.navigation.dispatch(StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'MainScreen'})],
      }));

    }

handleSubmit = () => {
const word = {
word: this.state.word,
weight: this.state.weight
}
this._post(word);
// const pushAction = StackActions.push({
// routeName: 'HomeTab',
//   params: {
//     myUserId: 9,
//   },
// });
// this.props.navigation.dispatch(pushAction);
this.props.navigation.goBack();
}


    render() {
      var age = this.props.navigation.getParam('age', 'no');
      var region = this.props.navigation.getParam('region', 'no');
      var email = firebase.auth().currentUser.email;
      if(this.state.isSender != 1) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollview}>
          <View>
            {Object.keys(this.state.messages).map(id => {
              const message = this.state.messages[id];
              return (
                <View style={styles.chatContainer} key={id}>
                    <Text style={message.sender == email ? styles.infoofme : styles.info}>[{region}/{age}세]</Text>
                    <View style={message.sender == email ? styles.chatofme : styles.chat}>
                      <Text style={message.sender == email ? styles.timeofme : styles.none}>{message.dateTime[8]}{message.dateTime[9]}:{message.dateTime[10]}{message.dateTime[11]}</Text>
                    <View style={message.sender == email ? styles.ballonofme : styles.ballon}>
                      <Text style={message.sender == email ? styles.replyofme : styles.reply}>{message.message}</Text>
                    </View>
                    <Text style={message.sender == email ? styles.none : styles.time}>{message.dateTime[8]}{message.dateTime[9]}:{message.dateTime[10]}{message.dateTime[11]}</Text>
                  </View>
                </View>
              );
            })}
          </View>
          </ScrollView>
          <View style={styles.inputContainer}>
            <View style={styles.textContainer}>
              <TextInput
              style={styles.input}
              value={this.state.reply}
              onChangeText={(text) => this.setState({reply: text})}/>
            </View>
            <View style={styles.sendContainer}>
              <TouchableHighlight
              underlayColor={'#cda8d2'}
              onPress={() => this.onSendPress()}>
                <Text style={styles.sendLabel}>전송</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      )
    } else if(this.state.isSender == 1) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollview}>
          <View>
            {Object.keys(this.state.messages).map(id => {
              const message = this.state.messages[id];
              return (
                <View style={styles.chatContainer} key={id}>
                    <Text style={message.sender == email ? styles.infoofme : styles.info}>[{region}/{age}세]</Text>
                    <View style={message.sender == email ? styles.chatofme : styles.chat}>
                      <Text style={message.sender == email ? styles.timeofme : styles.none}>{message.dateTime[8]}{message.dateTime[9]}:{message.dateTime[10]}{message.dateTime[11]}</Text>
                    <View style={message.sender == email ? styles.ballonofme : styles.ballon}>
                      <Text style={message.sender == email ? styles.replyofme : styles.reply}>{message.message}</Text>
                    </View>
                    <Text style={message.sender == email ? styles.none : styles.time}>{message.dateTime[8]}{message.dateTime[9]}:{message.dateTime[10]}{message.dateTime[11]}</Text>
                  </View>
                </View>
              );
            })}
          </View>
          </ScrollView>
          <View style={styles.inputContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.inputin}>이미 쪽지를 보냈습니다</Text>
            </View>
            <View style={styles.sendContainerin}>
                <Text style={styles.sendinactive}>전송</Text>
            </View>
          </View>
        </View>
      )
    }
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#efefef'
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingTop: 20,
  },
  chatContainer: {
    flex: 11,
    flexDirection: 'column',
    margin: 10,
  },
  chatofme: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 5,
  },
  chat: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 5,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  textContainer: {
    flex: 0.9,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '90%'
  },
  alreadytextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  message: {
    alignItems: 'flex-end',
    backgroundColor: 'gray'
  },
  infoofme: {
    display: 'none',
  },
  time: {
    marginTop: 18,
    marginLeft: 5,
  },
  timeofme: {
    marginTop: 4,
    marginRight: 5,
  },
  none: {
    display: 'none',
  },
  info: {
    color: 'black',
    fontSize: 13,
  },
  balloonofme: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 15,
  },
  balloon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 5,
  },
  replyofme: {
    justifyContent: 'center',
    backgroundColor: '#e7c1ec',
    borderColor: '#e7c1ec',
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: 'solid',
    fontSize: 14,
    padding: 10,
  },
  reply: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: 'solid',
    fontSize: 14,
    padding: 10,
  },
  sendContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 10,
    backgroundColor: '#cda8d2',
    borderColor: '#cda8d2',
    borderWidth: 1,
    borderRadius: 21,
    borderStyle: 'solid',
    height: '70%',
    width: '10%'
  },
  sendLabel: {
    color: '#ffffff',
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 5,
  },
  input: {
    color: '#a8a8a8',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    height: 32,
    borderColor: '#cda8d2',
    borderWidth: 1,
    borderRadius: 22,
    borderStyle: 'solid',

    width:'95%',
    height: '70%',
    fontSize:15,

    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  scrollview: {
    height: '80%'
  },
  text: {
    flex: 1,
    justifyContent: 'center',
    color: 'white'
  },
  inputin: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    height: 32,
    borderColor: '#efefef',
    borderWidth: 1,
    borderRadius: 22,
    borderStyle: 'solid',
    width:'95%',
    height: '70%',
    fontSize:15,

    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  sendContainerin: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 10,
    backgroundColor: '#a8a8a8',
    borderColor: '#a8a8a8',
    borderWidth: 1,
    borderRadius: 21,
    borderStyle: 'solid',
    height: '70%',
    width: '10%'
  },
  sendinactive: {
    color: '#ffffff',
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 5,
  },
});
