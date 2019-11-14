import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Platform, Image, Button, TextField, TouchableHighlight, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import { createStackNavigator, createAppContainer, StackActions } from 'react-navigation';
import Textarea from 'react-native-textarea';
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
      };
    }

    componentDidMount() {
      const collectionId = this.props.navigation.getParam('collectionId', 'no');
      const replyReceiver = this.props.navigation.getParam('replyReceiver', 'no');
      console.log(replyReceiver);
      this._get();
    }

    _get() {
      const collectionId = this.props.navigation.getParam('collectionId', 'no');
      firebase.firestore().collection("messages").doc(collectionId).collection(collectionId).orderBy('dateTime', 'asc')
        .get()
        .then(querySnapshot => {
          const messages = querySnapshot.docs.map(doc => doc.data());
              this.setState({messages: messages});
              console.log(this.state.messages);
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
      });


    }


handleSubmit = () => {
const word = {
word: this.state.word,
weight: this.state.weight
}
this._post(word);
const pushAction = StackActions.push({
routeName: 'HomeTab',
  params: {
    myUserId: 9,
  },
});
this.props.navigation.dispatch(pushAction);
}



    render() {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollview}>
          <View>
            {Object.keys(this.state.messages).map(id => {
              const message = this.state.messages[id];
              return (
                <View style={styles.chatContainer} key={id}>
                    <Text style={styles.reply}>{message.message}</Text>
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
              underlayColor={'#4e4273'}
              onPress={() => this.onSendPress()}>
                <Text style={styles.sendLabel}>보내기</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      )
    }
}

var styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'center',
alignItems: 'stretch',
backgroundColor: '#ffffff'
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
justifyContent: 'center',
alignItems: 'stretch'
},
inputContainer: {
flex: 1,
flexDirection: 'row',

alignItems: 'center',
backgroundColor: 'black'
},
textContainer: {
flex: 1,
justifyContent: 'center'
},
message: {
alignItems: 'flex-end',
backgroundColor: 'gray'
},
reply: {
flex: 1,
justifyContent: 'center',
backgroundColor: 'white'
},
sendContainer: {
justifyContent: 'flex-end',
paddingRight: 10
},
sendLabel: {
color: '#ffffff',
fontSize: 15
},
input: {
  width: 300,
color: 'black',
paddingRight: 10,
paddingLeft: 10,
paddingTop: 5,
height: 32,
borderColor: 'black',
borderWidth: 1,
borderRadius: 2,
alignSelf: 'center',
backgroundColor: '#ffffff'
},
scrollview: {
  height: '80%'
}
});
