import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Platform, Image, Button, TextField, AsyncStorage } from 'react-native';
import { Icon } from 'native-base';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import Textarea from 'react-native-textarea';
import MainScreen from '../MainScreen';
import firebase from '../src/config';

const databaseURL = "https://biants-project.firebaseio.com/";

export default class Board extends React.Component {

  static navigationOptions = {
      title: '',
        tabBarIcon: ({ tintColor }) => (
            <Icon name='ios-add-circle' style={{ color: '#BDBDBD' }} />
            // //<Image source={require('../com.jpg')}/>
        )
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
      id: '',
      word: '',
      dateTime: '',
      age: '',
      region: '',
      gender: '',
      users: {},
    };
  }

  // _post(word) {
  //   return fetch(`${databaseURL}/words.json`, {
  //   method: 'POST',
  //   body: JSON.stringify(word)
  //   }).then(res => {
  //   if(res.status != 200) {
  //   throw new Error(res.statusText);
  //   }
  //   return res.json();
  //   }).then(data => {
  //   let nextState = this.state.words;
  //   nextState[data.name] = word;
  //   this.setState({words: nextState});
  //   });
  // }


  // _post = (querySnapshot) => {
  //     const words = [];
  //     querySnapshot.forEach((doc) => {
  //       const { id, age, region, gender, word, dateTime } = doc.data();
  //       words.push({
  //         key: doc.id,
  //         doc, // DocumentSnapshot
  //         id,
  //         age,
  //         region,
  //         gender,
  //         word,
  //         dateTime
  //       });
  //     });
  //     this.setState({
  //       words
  //    });
  //   }

  _get() {
    var emailad = firebase.auth().currentUser.email;
    firebase.firestore().collection("users").where('email', '==', emailad)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
            this.setState({users: data});
            console.log(this.state.users);
            this.setState({age: data[0].age});
            this.setState({region: data[0].region});
            this.setState({gender: data[0].gender});
      });

    // rootRef.child('users').orderByChild('email').equalTo(emailad).once('value', (data) => {
    //         const users = data.val();
    //         console.log(users);
    //         const keys = Object.keys(users);
    //
    //             const k = keys[0];
    //             age = users[k].age;
    //             region = users[k].region;
    //             gender = users[k].gender;
    //
    //             AsyncStorage.setItem('age', age);
    //             AsyncStorage.setItem('region', region);
    //             AsyncStorage.setItem('gender', gender);
    //             AsyncStorage.getItem('age').then((data) => this.setState({age: data}))
    //             AsyncStorage.getItem('region').then((data) => this.setState({region: data}))
    //             AsyncStorage.getItem('gender').then((data) => this.setState({gender: data}))
    // });


    // AsyncStorage.getAllKeys((err, keys) => {
    //   AsyncStorage.multiGet(keys, (err, stores) => {
    //     stores.map((result, i, store) => {
    //       let key = store[i][0];
    //       let value = store[i][1];
    //       alert(value);
    //     });
    //   });
    // });
}

  componentDidMount() {
    var emailad = firebase.auth().currentUser.email;
    this._get();
  }

handleSubmit = () => {
  if(this.state.word == null || ! this.state.word) {
    alert('내용을 입력하세요');
  } else {
  var user = firebase.auth().currentUser;
  var email;
  var userAge;
  var userRegion;
  var userSex;

  if (user != null) {
  email = user.email;
  }

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

render(){
    return(
      <View style={style.container}>
      <Textarea
          name="word"
          value={this.state.word}
          containerStyle={style.textareaContainer}
          style={style.textarea}
          maxLength={70}
          placeholder={'내용을 입력하세요'}
          placeholderTextColor={'#c7c7c7'}
          underlineColorAndroid={'transparent'}
          onChangeText={(text) => this.setState({word: text})}
          />
        <View style={style.btn}>
          <Button title="등록" color="#F15382" onPress={this.handleSubmit} style={{padding: 10}}/>
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
      borderTopWidth: 12,
      borderRightWidth: 12,
      borderLeftWidth: 12,
      borderBottomWidth: 12,
      borderColor: '#efefef',
    },
    textareaContainer: {
      height: '70%',
      padding: 0,
      backgroundColor: '#FFFFFF',
    },
    textarea: {
      height: 180,
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    btn: {
      padding: 20,
      width: '90%',
    },
});
