import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Button, TouchableOpacity, ScrollView } from 'react-native';
import Dialog from "react-native-dialog";
import {Icon} from 'native-base';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import Swipeout from 'react-native-swipeout';
import FAB from 'react-native-fab';
import Board from './Board';
import ChatTab from './ChatTab';
import HomeTab from './HomeTab';
import firebase from '../src/config';

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
          myUserId: 9
        },
      });
      this.props.navigation.dispatch(pushAction);
    }

    constructor() {
    super();
    this.state = {
    messages: {},
    keys: {},
    info: {},
    };
    }

    _get() {
    var emailad = firebase.auth().currentUser.email;
    firebase.firestore().collection("messages").where('talker', 'array-contains', emailad).orderBy('dateTime', 'desc')
      .get()
      .then(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => doc.data());
            this.setState({messages: messages});
            querySnapshot.forEach(doc => {
                const data = doc.data();
                //console.log(doc.id);
            this.setState({keys:doc.id});
            //console.log(this.state.keys);
            });
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

    handleDelete(id) {
      firebase.firestore().collection("messages").doc(id)
      .delete().then(function() {
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
      this.handleCancel();
      this.props.navigation.dispatch(StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'MainScreen'})],
      }));
    };

    render() {
      return (
        <View style={style.container}>
          <ScrollView>
            {Object.keys(this.state.messages).map(id => {
              const message = this.state.messages[id];
              const key = this.state.keys;
              var age;
              var region;
              var gender;

              if(message.check == firebase.auth().currentUser.email) {
                age = message.yourInfo[0];
                region = message.yourInfo[1];
                gender = message.yourInfo[2];
              } else {
                age = message.myInfo[0];
                region = message.myInfo[1];
                gender = message.myInfo[2];
              }

              var swipeoutBtns = [
                {
                  text: '삭제',
                  onPress: () => [id = message.id, this.handleDelete(id)]
                }
              ]
              return (
                <Swipeout right={swipeoutBtns} style={style.swipeout} key={id}>

                <View style={style.list}>
                  <View style={style.line}>
                  <Image
                      source={ gender == '남자' ? require('./img/male.png') : require('./img/female.png') }
                      style={style.genderImg}
                  />
                  <TouchableOpacity onPress={() => {this.props.navigation.dispatch(StackActions.push({
                    routeName: 'ChatTab',
                      params: {
                        collectionId: message.id,
                        replyReceiver: message.sender != firebase.auth().currentUser.email ? message.sender : message.receiver
                      },
                    }))} }>
                    <View style={style.info}>
                      <Text style={style.data}>[{region}/{age}세]</Text>
                      <Text style={style.message}>{message.message}</Text>
                    </View>
                  </TouchableOpacity>
                  </View>
                  <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>쪽지 삭제하기</Dialog.Title>
                    <Dialog.Description>삭제하시겠습니까?</Dialog.Description>
                    <Dialog.Button label="네" onPress={() => this.handleDelete(key)}/>
                    <Dialog.Button label="아니오" onPress={this.handleCancel}/>
                  </Dialog.Container>
                  <Text style={style.time}>{message.dateTime[8]}{message.dateTime[9]}:{message.dateTime[10]}{message.dateTime[11]}</Text>
                </View>

                </Swipeout>
              );
              this.setState({info: ''});
            })}

          </ScrollView>
        </View>
      )
    }
}

const style = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
      backgroundColor: '#efefef',
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
    borderColor:'#FFFFFF',
    borderBottomWidth:1,
    padding: 10,
  },
  line: {
    flex: 10,
    flexDirection: 'row',
    margin: 15,
  },
  genderImg: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    backgroundColor: '#efefef',
  },
  info: {
    flex: 2,
    flexDirection: 'column',
  },
  data: {
    marginLeft: 15,
    fontSize: 19,
  },
  message: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    width: 350,
  },
  time: {
    flex: 1,
    flexDirection: 'row',
    fontSize: 12,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  swipeout: {
    backgroundColor: '#efefef',
  }
});
