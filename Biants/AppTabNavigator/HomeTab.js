import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Button, TouchableHighlight, ScrollView, AsyncStorage, TouchableOpacity } from 'react-native';
import Dialog from "react-native-dialog";
import {Icon} from 'native-base';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import { Div } from 'react-native-div';
import Board from './Board';
import ChatTab from './ChatTab';
import MessageTab from './MessageTab';
import firebase from '../src/config';
import App from '../App';
import Modal from "react-native-modal";
import { AdMobBanner } from 'react-native-admob';

// const databaseURL = "https://biants-project.firebaseio.com/";

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
    dialogVisible: false,
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

    // _post(message) {
    // return fetch(`${databaseURL}/messages.json`, {
    // method: 'POST',
    // body: JSON.stringify(message)
    // }).then(res => {
    // if(res.status != 200) {
    // throw new Error(res.statusText);
    // }
    // return res.json();
    // }).then(data => {
    // let nextState = this.state.messages;
    // nextState[data.name] = message;
    // this.setState({messages: nextState});
    // });
    // }

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


    toggleModal(visible) {
     this.setState({ dialogVisible: visible });
  }

    showDialog() {
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
    } else if(this.state.message == null || ! this.state.message) {
       alert("내용을 입력해 주세요");
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

      firebase.firestore().collection('tokens').where('id', '==', this.state.receiver)
      .get()
      .then(querySnapshot => {
        const tokens = querySnapshot.docs.map(doc => doc.data());
        if(tokens[0].token) {
          firebase.firestore().collection('newmessages').add({
            message: this.state.message,
            receiver: this.state.receiver,
            sender: firebase.auth().currentUser.email,
            dateTime: dateTime,
            token:tokens[0].token,
          });
        }
       });


      firebase.firestore().collection('messages').doc(dateTime.toString()).collection(dateTime.toString()).add({
        message: this.state.message,
        receiver: this.state.receiver,
        sender: firebase.auth().currentUser.email,
        dateTime: dateTime,
        id: dateTime,
        talker: [this.state.receiver, firebase.auth().currentUser.email],
      });


      // firebase.auth().signOut();
      this.props.navigation.dispatch(StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'MainScreen' })],
      }));
  }



    }

    // delete word after 7days
    delete7days() {
      var when = new Date();
      var days6 = when.getDate() - 7;
      when.setDate(days6);

      var day = when.getDate(); //Current Date
      if(day < 10) {
        day = '0' + when.getDate(); //Current Minutes
      }
      var mon = when.getMonth() + 1; //Current Month
      if(mon < 10) {
        mon = '0' + when.getMonth() + 1;
      }
      var yr = when.getFullYear(); //Current Year
      var hr = when.getHours(); //Current Hours
      if(hr < 10) {
        hr = '0' + when.getHours();
      }
      var mn = when.getMinutes(); //Current Minutes
      if(mn < 10) {
        mn = '0' + when.getMinutes(); //Current Minutes
      }
      var sc = when.getSeconds(); //Current Seconds
      if(sc < 10) {
        sc = '0' + when.getSeconds();
      }

      var time = yr.toString() + mon + day + hr + mn + sc;

      var wordAfter7 = firebase.firestore().collection("words").where('dateTime', '<=', time)

      wordAfter7
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.delete();
        });
      });
    }

    doClear() {
       this.setState({message: ''});
    }

    render() {
      return (
        <View style={style.container}>
        <NavigationEvents onDidBlur={payload => this._get()}/>
        <NavigationEvents onWillBlur={() => this.delete7days()}/>
          <View style={style.ad}>
            <AdMobBanner
              adSize='fullBanner'
              adUnitID='ca-app-pub-3940256099942544/6300978111'/>
          </View>
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
                    <TouchableOpacity onPress={() => {this.setState({receiver: word.id, age: word.age, region: word.region, gender: word.gender}); this.toggleModal(true);}}>
                      <View style={style.send}>
                        <Image
                            source={require('./img/balloon.png') }
                            style={style.sendbtn}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <Modal visible={this.state.dialogVisible}>
                    <View style={{height: 350}}>
                      <View style={style.modal}>
                        <TouchableHighlight onPress={() => {this.doClear(); this.toggleModal(!this.state.dialogVisible)}} style={{position: 'absolute', top: 5, right: 8, width: '100%', alignItems:'flex-end'}}>

                            <Text style={style.x}>X</Text>

                        </TouchableHighlight>
                        <Image
                            source={require('./img/balloon2.png')}
                            style={style.balloonimg}
                        />
                        <Text style={style.sendMsg}>쪽지 보내기</Text>
                        <View style={style.area}>
                          <TextInput
                              name="message"
                              ref="textinput"
                              value={this.state.message}
                              style={style.message}
                              maxLength={70}
                              multiline
                              numberOfLines={4}
                              placeholder={'내용을 입력하세요'}
                              placeholderTextColor={'#c7c7c7'}
                              underlineColorAndroid={'transparent'}
                              onChangeText={(text) => this.setState({message: text})}
                          />
                        </View>
                        <View style={{position: 'absolute', top: 250, width: '90%'}}>
                        <TouchableHighlight onPress={this.handleSubmit}>
                          <View style={style.btnContainer}>
                            <Text style={style.register}>보내기</Text>
                          </View>
                        </TouchableHighlight>
                        </View>
                      </View>
                    </View>
                  </Modal>
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
  ad: {
    alignItems: 'center',
  },
  list: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderColor: '#efefef',
    borderBottomWidth: 1,
    padding: 3,
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
    fontSize: 16,
    fontFamily: 'PFStardust',
  },
  word: {
    marginLeft: 15,
    fontSize: 15,
    fontFamily: 'PFStardust',
    width: '100%',
    marginTop: 5,
  },
  area: {
    position: 'absolute',
    top: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2e0f5',
    width:'90%',
    height: 150,
    fontSize:15,
  },
  message: {
    width: '90%',
    height: 150,
    fontFamily: 'PFStardust',
    fontSize: 15,
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
    marginLeft: 18,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#8c378b',
    borderWidth: 1,
  },
  btnContainer: {
    backgroundColor: '#8c378b',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginTop: 25,
  },
  xContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderColor: '#8c378b',
    borderWidth: 11,
  },
  x: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  },
  balloonimg: {
    position: 'absolute',
    top: 20,
    width: 42,
    height: 44,
  },
  sendMsg: {
    position: 'absolute',
    top: 80,
    fontFamily:'PFStardust',
    alignItems: 'center',
    fontSize: 17,
    marginBottom: 14,
  },
  register: {
    color: '#FFFFFF',
    fontFamily: 'PFStardust',

  },
});
