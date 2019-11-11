import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Button, TouchableOpacity } from 'react-native';
import Dialog from "react-native-dialog";
import {Icon} from 'native-base';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import Swipeout from 'react-native-swipeout';
import FAB from 'react-native-fab';
import Board from './Board';
import ChatTab from './ChatTab';
import HomeTab from './HomeTab';
import firebase from '../src/config'

const databaseURL = "https://biants-project.firebaseio.com/";

export default class MessageTab extends React.Component {

  static navigationOptions = {
      title: '',
        tabBarIcon: ({ tintColor }) => (
            <Icon name='chatboxes' style={{ color: '#BDBDBD' }} />
        )
    }

    _goToChat = () => {
      const pushAction = StackActions.push({
      routeName: 'ChatTab',
        params: {
          myUserId: 9,
        },
      });
      this.props.navigation.dispatch(pushAction);
    }

    constructor() {
    super();
    this.state = {
    messages: {},
    };
    }

    _get() {
    var emailad = firebase.auth().currentUser.email;
    firebase.firestore().collection("messages").where('receiver', '==', emailad).orderBy('dateTime', 'desc')
      .get()
      .then(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => doc.data());
            this.setState({messages: messages});
      });
    }

    _delete(id) {
    return fetch(`${databaseURL}/messages/${id}.json`, {
    method: 'DELETE'
    }).then(res => {
    if(res.status != 200) {
    throw new Error(res.statusText);
    }
    return res.json();
    }).then(() => {
    let nextState = this.state.messages;
    delete nextState[id];
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

    handleDelete = (id) => {
      this._delete(id);
      this.handleCancel();
    };

    render() {
      var swipeoutBtns = [
        {
          text: '삭제',
          onPress: () => this.showDialog()
        }
      ]
      return (
        <View style={style.container}>
          <View>
            {Object.keys(this.state.messages).map(id => {
              const message = this.state.messages[id];
              return (
                <Swipeout right={swipeoutBtns} onPress={() => this.showDialog()}>
                <View style={style.list} key={id}>
                  <TouchableOpacity onPress={() => this._goToChat()}>
                    <Text style={style.data}>{message.message}</Text>
                  </TouchableOpacity>
                  <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>쪽지 삭제하기</Dialog.Title>
                    <Dialog.Description>삭제하시겠습니까?</Dialog.Description>
                    <Dialog.Button label="네" onPress={() => this.handleDelete(id)}/>
                    <Dialog.Button label="아니오" onPress={this.handleCancel}/>
                  </Dialog.Container>
                </View>
                </Swipeout>
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

// const App = createStackNavigator({
//   MessageTab,
//   ChatTab
// }, {
//   initialRouteName: 'MessageTab',
//   title: ''
// }
// );

// export default createAppContainer(App);
