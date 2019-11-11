import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Button, TouchableOpacity } from 'react-native';
import Dialog from "react-native-dialog";
import {Icon} from 'native-base';
import { createStackNavigator, createAppContainer, StackActions } from 'react-navigation';
import { Div } from 'react-native-div';
import FAB from 'react-native-fab';
import Board from './Board';
import ChatTab from './ChatTab';
import MessageTab from './MessageTab';

const databaseURL = "https://biants-project.firebaseio.com/";

class HomeTab extends React.Component {

  _goToProfile = () => {
      const pushAction = StackActions.push({
      routeName: 'Board',
        params: {
          myUserId: 9,
        },
      });
      this.props.navigation.dispatch(pushAction);
    }

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
    };
    }

    _get() {
    fetch(`${databaseURL}/words.json`).then(res => {
    if(res.status != 200) {
    throw new Error(res.statusText);
    }
    return res.json();
    }).then(words => this.setState({words: words}));
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
    const message = {
    message: this.state.message
    }
    this._post(message);
    this.setState({ dialogVisible: false });
    }

    render() {
      return (
        <View style={style.container}>
          <FAB buttonColor="black" iconTextColor="#FFFFFF" onClickAction={this._goToProfile} visible={true} iconTextComponent={<Icon name="ios-add"/>} />
          <View>
            {Object.keys(this.state.words).map(id => {
              const word = this.state.words[id];
              return (
                <View style={style.list} key={id}>
                  <TouchableOpacity onPress={() => this.showDialog()}>
                    <Text style={style.data}>{word.weight}{word.word}</Text>
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

const App = createStackNavigator({
  HomeTab,
  Board,
}, {
  initialRouteName: 'HomeTab',
  title: ''
}
);

export default createAppContainer(App);
