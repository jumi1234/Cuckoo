import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Button, TouchableOpacity, ScrollView } from 'react-native';
import Dialog from "react-native-dialog";
import {Icon} from 'native-base';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
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
      <Image
          source={require('./img/chat.png')}
          style={{width:35, height:37, marginTop: 10,}}
      />
        // //<Image source={require('../com.jpg')}/>
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
    today: '',
    yesterday: '',
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

      var wordAfter7 = firebase.firestore().collection("messages").where('dateTime', '<=', time)

      console.log(time);
      wordAfter7
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.delete();
        });
      });
    }

    componentDidMount() {
      this._get();

      var date = new Date().getDate(); //Current Date
      if(date < 10) {
        date = '0' + new Date().getDate(); //Current Minutes
      }
      var month = new Date().getMonth() + 1; //Current Month
      if(month < 10) {
        month = '0' + new Date().getMonth() + 1;
      }

      var today = month.toString() + date;
      this.setState({today: today});

      var yesterdate = date - 1;
      var yesterday = month.toString() + yesterdate;
      this.setState({yesterday: yesterday});
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
    };

    render() {
      return (
        <View style={style.container}>
        <NavigationEvents onDidFocus={payload => this._get()}/>
        <NavigationEvents onWillBlur={() => this.delete7days()}/>
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

              var chatDate = message.dateTime[4] + message.dateTime[5] +message.dateTime[6] + message.dateTime[7]
              console.log(chatDate);

              var swipeoutBtns = [
                {
                  text: '삭제',
                  onPress: () => [id = message.id, this.handleDelete(id)],
                  backgroundColor: '#f2e0f5',
                }
              ]
              return (
                <Swipeout right={swipeoutBtns} style={style.swipeout} key={id}>

                <View style={style.list}>
                  <View style={style.line}>
                    <View style={{flex:0.2}}>
                    <Image
                        source={ gender == '남자' ? require('./img/male.png') : require('./img/female.png') }
                        style={style.genderImg}
                    />
                    </View>
                    <View style={{flex:0.7}}>
                    <TouchableOpacity onPress={() => {this.props.navigation.dispatch(StackActions.push({
                      routeName: 'ChatTab',
                        params: {
                          collectionId: message.id,
                          replyReceiver: message.sender != firebase.auth().currentUser.email ? message.sender : message.receiver,
                          age: age,
                          region: region,
                          check: message.check,
                          yourInfo: message.yourInfo,
                          myInfo: message.myInfo,
                          yesterday: this.state.yesterday,
                        },
                      }))} }>
                      <View style={style.info}>
                        <Text style={style.data}>[{region}/{age}세]</Text>
                        <Text style={style.message}>{message.message}</Text>
                      </View>
                    </TouchableOpacity>
                    </View>
                    <View style={style.heart}>
                      <Image
                          source={require('./img/pkheart.png') }
                          style={style.heartimg}
                      />
                    </View>
                  </View>
                  <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>쪽지 삭제하기</Dialog.Title>
                    <Dialog.Description>삭제하시겠습니까?</Dialog.Description>
                    <Dialog.Button label="네" onPress={() => this.handleDelete(key)}/>
                    <Dialog.Button label="아니오" onPress={this.handleCancel}/>
                  </Dialog.Container>
                  <Text style={this.state.today == chatDate ? style.time : {display:'none'}}>
                    {message.dateTime[8]}{message.dateTime[9]}:{message.dateTime[10]}{message.dateTime[11]}
                  </Text>
                  <Text style={this.state.yesterday == chatDate ? style.time : {display:'none'}}>
                    어제 {message.dateTime[8]}{message.dateTime[9]}:{message.dateTime[10]}{message.dateTime[11]}
                  </Text>
                  <Text style={(this.state.today != chatDate && this.state.yesterday != chatDate) ? style.time : {display:'none'}}>
                    {message.dateTime[4]}{message.dateTime[5]}/{message.dateTime[6]}{message.dateTime[7]} {message.dateTime[8]}{message.dateTime[9]}:{message.dateTime[10]}{message.dateTime[11]}
                  </Text>
                </View>

                </Swipeout>
              );
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
    backgroundColor: '#f2e0f5',
  },
  head: {
    flex:0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#D9E5FF',
  },
  list: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#efefef',
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#FFFFFF',
  },
  line: {
    flex: 0.9,
    flexDirection: 'row',
    margin: 15,
    borderColor: '#f2e0f5',
    borderRightWidth: 1,
  },
  genderImg: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 2,
    flexDirection: 'column',
  },
  data: {
    marginLeft: 15,
    fontSize: 18,
    fontFamily: 'PFStardust',
  },
  message: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 15,
    width: '100%',
    fontFamily: 'PFStardust',
    fontSize: 16,
  },
  heart: {
    flex:0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  heartimg: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 15,
    height: 13,
  },
  time: {
    flex: 0.12,
    flexDirection: 'row',
    fontSize: 13,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    fontFamily: 'PFStardust',
  },
});
