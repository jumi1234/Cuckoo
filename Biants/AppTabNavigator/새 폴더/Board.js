import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Platform, Image, Button, TextField } from 'react-native';
import { Icon } from 'native-base';
import { createStackNavigator, createAppContainer, StackActions } from 'react-navigation';
import Textarea from 'react-native-textarea';

const databaseURL = "https://biants-project.firebaseio.com/";

export default class Board extends React.Component {

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



render(){
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Textarea
          name="word"
          value={this.state.word}
          containerStyle={style.textareaContainer}
          style={style.textarea}
          maxLength={120}
          placeholder={'내용을 입력하세요'}
          placeholderTextColor={'#c7c7c7'}
          underlineColorAndroid={'transparent'}
          onChangeText={(text) => this.setState({word: text})}
          />
        <View style={{padding: 20}}>
          <Button title="등록" color="black" onPress={this.handleSubmit} style={{padding: 10}}/>
        </View>
      </View>
    )
  }

}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textareaContainer: {
        height: 180,
        padding: 0,
        backgroundColor: '#F5FCFF',
    },
    textarea: {
        alignItems: 'flex-start',  // hack android
        height: 180,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
});
