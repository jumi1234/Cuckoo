import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Platform, Image, Button, TextField, TouchableHighlight } from 'react-native';
import { Icon } from 'native-base';
import { createStackNavigator, createAppContainer, StackActions } from 'react-navigation';
import Textarea from 'react-native-textarea';

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

  constructor() {
  super();
  this.state = {
  words: {},
  word: '',
  weight: ''
  };
  }

  _post(word) {
return fetch(`${databaseURL}/words.json`, {
method: 'POST',
body: JSON.stringify(word)
}).then(res => {
if(res.status != 200) {
throw new Error(res.statusText);
}
return res.json();
}).then(data => {
let nextState = this.state.words;
nextState[data.name] = word;
this.setState({words: nextState});
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
  <View style={styles.chatContainer}>
  <Text style={{color: '#000'}}>Chat</Text>
  </View>
  <View style={styles.inputContainer}>
  <View style={styles.textContainer}>
  <TextInput
  style={styles.input}
  value={this.state.message}
  onChangeText={(text) => this.setState({message: text})}
  />
  </View>
  <View style={styles.sendContainer}>
  <TouchableHighlight
  underlayColor={'#4e4273'}
  onPress={() => this.onSendPress()}
  >
  <Text style={styles.sendLabel}>SEND</Text>
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
justifyContent: 'space-around',
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
});
