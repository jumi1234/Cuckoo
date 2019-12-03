import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Platform, Image, Button, TextField, AsyncStorage, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'native-base';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import Textarea from 'react-native-textarea';
import DismissKeyboard from 'dismissKeyboard';
import MainScreen from '../MainScreen';
import firebase from '../src/config';

const databaseURL = "https://biants-project.firebaseio.com/";

export default class Board extends React.Component {

  static navigationOptions = {
    title: '',
        tabBarIcon: ({ tintColor }) => (
          <Image
              source={require('./img/board.png')}
              style={{width:35, height:37, marginTop: 10,}}
          />
            // //<Image source={require('../com.jpg')}/>
        )
    }

  constructor() {
    super();
    this.state = {
      words: {},
      id: '',
      word: '',
      dateTime: '',
      age: '',
      region: '',
      gender: '',
      users: {},
      postavailable: '',
    };
  }

  _get() {
    var emailad = firebase.auth().currentUser.email;
    firebase.firestore().collection("users").where('email', '==', emailad)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
            this.setState({users: data});
            this.setState({age: data[0].age});
            this.setState({region: data[0].region});
            this.setState({gender: data[0].gender});
      });
  }

  availableCheck() {
    firebase.firestore().collection('words').where('id', '==', firebase.auth().currentUser.email).orderBy('dateTime', 'desc').limit(1)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        const keys = Object.keys(data);

        const k = keys[0];
        var time = data[k].dateTime;

        var yyyy = time[0] + time[1] + time[2] + time[3];
        var mm = time[4] + time[5];
        var dd = time[6] + time[7];
        var h = time[8] + time[9];
        var m = time[10] + time[11];
        var s = time[12] + time[13];

        var date = new Date(yyyy, mm, dd, h, m, s);
        var a = date.getHours() + 12;
        date.setHours(a);

        var day = date.getDate(); //Current Date
        if(day < 10) {
          day = '0' + new Date().getDate(); //Current Minutes
        }

        var mon = date.getMonth(); //Current Month
        if(mon < 10) {
          mon = '0' + date.getMonth();
        }
        var y = date.getFullYear(); //Current Year

        var hr = date.getHours(); //Current Hours
        if(hr < 10) {
          hr = '0' + date.getHours();
        }
        var mm = date.getMinutes(); //Current Minutes
        if(mm < 10) {
          mm = '0' + date.getMinutes(); //Current Minutes
        }
        var ss = date.getSeconds(); //Current Seconds
        if(ss < 10) {
          ss = '0' + date.getSeconds();
        }

        var postavailable = y.toString() + mon + day + hr + mm + ss;

        this.setState({postavailable: postavailable});
     });
  }

  componentDidMount() {
    var emailad = firebase.auth().currentUser.email;
    this._get();
  }

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

    if(this.state.word == null || ! this.state.word) {
      alert('내용을 입력하세요');
    } else {
      if(dateTime < this.state.postavailable ) {
        alert('12시간 이후 등록 가능합니다\n' + this.state.postavailable[4] + this.state.postavailable[5] + "/" + this.state.postavailable[6] + this.state.postavailable[7] + ' ' +
        this.state.postavailable[8] + this.state.postavailable[9] + ":" + this.state.postavailable[10] + this.state.postavailable[11] + "~");
      } else {
        var user = firebase.auth().currentUser;
        var email;
        var userAge;
        var userRegion;
        var userSex;

        if (user != null) {
        email = user.email;
        }

        firebase.firestore().collection('words').add({
          word: this.state.word,
          dateTime: dateTime,
          id: email,
          age: this.state.age,
          region: this.state.region,
          gender: this.state.gender,
        })

        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'MainScreen'})],
        }));
      }
    }
  }

  doClear() {
     let textInput = this.refs["textinput"];
     textInput.clear();
  }

  render() {
      return (
        <TouchableWithoutFeedback onPress={()=>{DismissKeyboard()}}>
          <View style={style.container}>
          <NavigationEvents onDidBlur={payload => this.doClear()}/>
          <NavigationEvents onDidFocus={() => this.availableCheck()}/>
            <View style={style.registerContainer}>
              <View style={style.area}>
                <TextInput
                    name="word"
                    ref="textinput"
                    value={this.state.word}
                    style={style.textarea}
                    maxLength={70}
                    multiline
                    numberOfLines={4}
                    placeholder={'내용을 입력하세요. (70자 내외)'}
                    placeholderTextColor={'#c7c7c7'}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({word: text})}
                />
              </View>
              <TouchableOpacity onPress={this.handleSubmit} style={{flex:0.5, height: 100,}}>
                <View style={style.btnContainer}>
                  <Text style={style.register}>등록</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
   }

}

const style = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f2e0f5',
      paddingTop: 10,
      paddingBottom: 10,
    },
    registerContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      width: '95%',
      height: '95%',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#8c378b',
    },
    area: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width:'80%',
      height: 500,
      fontSize:15,
    },
    textarea: {
      flex: 1,
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'center',
      width: '100%',
      height: 400,
      fontFamily: 'PFStardust',
    },
    btnContainer: {
      backgroundColor: '#8c378b',
      justifyContent: 'center',
      alignItems: 'center',
      width: 340,
      height: 40,
    },
    btn: {
      flex: 1,
      width: '90%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    register: {
      color: '#FFFFFF',
      fontFamily: 'PFStardust',
    },
});
