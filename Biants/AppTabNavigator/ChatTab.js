import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Platform, Image, Button, TextField, TouchableHighlight, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import Textarea from 'react-native-textarea';
import Hr from "react-native-hr-component";
import firebase from '../src/config';

const databaseURL = "https://biants-project.firebaseio.com/";

export default class ChatTab extends React.Component {

  static navigationOptions = {
      headerStyle: {
        backgroundColor: '#E6C0EB',
        borderBottomWidth: 1,
        borderColor: '#8c378b',
      }
    }

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
      const today = this.props.navigation.getParam('today', 'no');
      const yesterday = this.props.navigation.getParam('yesterday', 'no');
      const chatDate = this.props.navigation.getParam('chatDate', 'no');

      this._get();

      var emailad = firebase.auth().currentUser.email;

      firebase.firestore().collection("messages").doc(collectionId)
        .get()
        .then(querySnapshot => {
          if(! querySnapshot.empty) {
            const data = querySnapshot.data();
            if(data.sender == emailad) {7
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

      firebase.firestore().collection("messages").doc(collectionId).collection(collectionId).orderBy('dateTime', 'asc')
        .get()
        .then(querySnapshot => {
          const messages = querySnapshot.docs.map(doc => doc.data());
              this.setState({messages: messages});
          });
      this.setState({isSender: 1});
    }

  //   shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   return this.props.done !== nextProps.done;
  // }

  // shouldComponentUpdate(nextState) {
  //   return nextState.messages !== this.state.messages;
  // }

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
// this.props.navigation.goBack();
}


    render() {
      var age = this.props.navigation.getParam('age', 'no');
      var region = this.props.navigation.getParam('region', 'no');
      var email = firebase.auth().currentUser.email;
      if(this.state.isSender != 1) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollview} ref="scrollView"
             onContentSizeChange={(width, height) => this.refs.scrollView.scrollTo({y: height})}>
          <View style={styles.scrollContainer}>
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
              maxLength={50}
              onChangeText={(text) => this.setState({reply: text})}/>
            </View>
            <View style={styles.sendContainer}>
              <TouchableHighlight
              underlayColor={'#8c378b'}
              onPress={() => {this.onSendPress()}}>
                <Text style={styles.sendLabel}>전송</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      )
    } else if(this.state.isSender == 1) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollview} ref="scrollView"
             onContentSizeChange={(width, height) => this.refs.scrollView.scrollTo({y: height})}>
          <View style={styles.scrollContainer}>
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
    backgroundColor: '#f2e0f5'
  },
  scrollview: {
    flex: 1,
  },
  scrollContainer: {
    flex: 0.7,
  },
  chatContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 8,
  },
  chatofme: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 0,
    marginLeft: 170,
  },
  chat: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 5,
    marginRight: 170,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#8c378b',
    width: '100%',
    height: 58,
  },
  textContainer: {
    flex: 0.9,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%'
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
    fontFamily: 'PFStardust',
  },
  time: {
    marginTop: 18,
    marginLeft: 5,
    color: 'gray',
    fontFamily: 'PFStardust',
  },
  timeofme: {
    marginTop: 4,
    marginRight: 5,
    color: 'gray',
    fontFamily: 'PFStardust',
  },
  none: {
    display: 'none',
  },
  info: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'PFStardust'
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
    backgroundColor: '#E6C0EB',
    borderColor: '#E6C0EB',
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'solid',
    fontSize: 15,
    padding: 10,
    fontFamily: 'PFStardust',
  },
  reply: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'solid',
    fontSize: 15,
    padding: 10,
    fontFamily: 'PFStardust',
  },
  sendContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 10,
    backgroundColor: '#8c378b',
    borderColor: '#8c378b',
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
    marginBottom: 15,
    marginRight: 2,
    fontFamily: 'PFStardust',
  },
  input: {
    color: 'black',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    height: 32,
    borderColor: '#8c378b',
    borderWidth: 1,
    borderRadius: 22,
    borderStyle: 'solid',
    width:'95%',
    height: '70%',
    fontSize:15,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    fontFamily: 'PFStardust',
  },
  scrollview: {
    flex: 0.7,

  },
  text: {
    flex: 1,
    justifyContent: 'center',
    color: 'white'
  },
  inputin: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 8,
    height: 32,
    borderColor: '#efefef',
    borderWidth: 1,
    borderRadius: 22,
    borderStyle: 'solid',
    width:'95%',
    height: '70%',
    fontSize:15,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    fontFamily: 'PFStardust',
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
    marginBottom: 15,
    marginRight: 2,
    fontFamily: 'PFStardust'
  },
});
