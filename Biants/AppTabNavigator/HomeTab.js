import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Button, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import Dialog from "react-native-dialog";
import {Icon} from 'native-base';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import { Div } from 'react-native-div';
import Board from './Board';
import ChatTab from './ChatTab';
import MessageTab from './MessageTab';
import firebase from '../src/config';
import App from '../App';

const databaseURL = "https://biants-project.firebaseio.com/";

export default class HomeTab extends React.Component {

  static navigationOptions = {
    title: '',
        tabBarIcon: ({ tintColor }) => (
          <Image
              source={require('./img/home.png')}
              style={{width:35, height:37, marginTop: 10,}}
          />
            // //<Image source={require('../com.jpg')}/>
        )
    }

    constructor(props) {
    super(props);
    this.state = {
    words: {},
    messages: {},
    message: '',
    receiver: '',
    collectionId: '',
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
    firebase.firestore().collection("users").where('email', '==', firebase.auth().currentUser.email)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
            this.setState({myage: data[0].age});
            this.setState({myregion: data[0].region});
            this.setState({mygender: data[0].gender});
      });
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
      alert("내가 작성한 글입니다");

      } else {
      firebase.firestore().collection('messages').doc(dateTime.toString()).set({
        message: this.state.message,
        receiver: this.state.receiver,
        sender: firebase.auth().currentUser.email,
        dateTime: dateTime,
        id: dateTime,
        talker: [this.state.receiver, firebase.auth().currentUser.email],
        check: firebase.auth().currentUser.email,
        yourInfo: [this.state.age, this.state.region, this.state.gender],
        myInfo: [this.state.myage, this.state.myregion, this.state.mygender],
      });

      firebase.firestore().collection('messages').doc(dateTime.toString()).collection(dateTime.toString()).add({
        message: this.state.message,
        receiver: this.state.receiver,
        sender: firebase.auth().currentUser.email,
        dateTime: dateTime,
        id: dateTime,
        talker: [this.state.receiver, firebase.auth().currentUser.email],
      });

  }

      // firebase.auth().signOut();

    this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'MainScreen' })],
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
                  <View style={style.line}>
                    <Image
                        source={ word.gender == '남자' ? require('./img/male.png') : require('./img/female.png') }
                        style={style.genderImg}
                    />
                    <View style={style.info}>
                      <Text style={style.data}>[{word.region}/{word.age}세]</Text>
                      <Text style={style.word}>{word.word}</Text>
                    </View>
                    <View style={style.heart}>
                      <Image
                          source={require('./img/pkheart.png') }
                          style={style.heartimg}
                      />
                    </View>
                    <TouchableOpacity onPress={() => {this.setState({receiver: word.id, age: word.age, region: word.region, gender: word.gender}); this.showDialog();}}>
                      <View style={style.send}>
                        <Image
                            source={require('./img/balloon.png') }
                            style={style.sendbtn}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>쪽지 보내기</Dialog.Title>
                    <Dialog.Input style={style.message} name="message" value={this.state.message} onChangeText={(text) => this.setState({message: text})} placeholder="내용을 입력하세요" maxLength={80}></Dialog.Input>
                    <Dialog.Button label="보내기" color='black' onPress={this.handleSubmit}/>
                    <Dialog.Button label="닫기" color='black' onPress={this.handleCancel}/>
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
    borderTopWidth: 10,
    borderColor: '#f2e0f5',
  },
  list: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderColor: '#efefef',
    borderBottomWidth: 1,
    padding: 5,
  },
  line: {
    flex: 1,
    flexDirection: 'row',
    margin: 15,
  },
  genderImg: {
    width: 52,
    height: 52,
    justifyContent: 'center',
  },
  info: {
    flex: 3,
    flexDirection: 'column',
  },
  data: {
    marginLeft: 15,
    fontSize: 19,
    fontFamily: 'PFStardust',
  },
  word: {
    marginLeft: 15,
    fontSize: 17,
    fontFamily: 'PFStardust',
    width: '100%',
  },
  message: {
    width: 350,
  },
  heart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderColor: '#f2e0f5',
    borderRightWidth: 1,
  },
  heartimg: {
    marginLeft: 18,
    width: 15,
    height: 13,
  },
  send: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 5,
  },
  sendbtn: {
    color: '#75575f',
    marginLeft: 18,
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
