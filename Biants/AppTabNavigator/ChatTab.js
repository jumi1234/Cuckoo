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
      this._get();
    }

    _get() {
      const collectionId = this.props.navigation.getParam('collectionId', 'no');
      var emailad = firebase.auth().currentUser.email;
      firebase.firestore().collection("messages").doc(collectionId).collection(collectionId)
        .get()
        .then(querySnapshot => {
          const messages = querySnapshot.docs.map(doc => doc.data());
              this.setState({messages: messages});
              console.log(this.state.messages);
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
                    <Text style={styles.textContainer}>{message.message}</Text>
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
