import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Switch, SectionList, TouchableOpacity } from 'react-native';
import { SwitchNavigator, NavigationActions, StackActions } from 'react-navigation';
import { Icon } from 'native-base';
import Dialog from "react-native-dialog";
import Hr from "react-native-hr-component";
import VersionCheck from "react-native-version-check";
import firebase from '../src/config';
import rnfirebase from 'react-native-firebase';
import admin from "firebase-admin";

export default class ProfileTab extends Component {

  static navigationOptions = {
    title: '',
    tabBarIcon: ({ tintColor }) => (
      <Image
          source={require('./img/profile.png')}
          style={{width:35, height:37, marginTop: 10,}}
      />
        // //<Image source={require('../com.jpg')}/>
    )
  }

  constructor(props) {
  super(props);
  this.state = {
    email: '',
    age: '',
    region: '',
    gender: '',
    dialogVisible: false,
    switch1Value: false,
    };
  }

  // firebase notification

  async _checkPermission(){
      const enabled = await rnfirebase.messaging().hasPermission();
      if (enabled) {
          // user has permissions
          console.log(enabled);
          this._updateTokenToServer();
      } else {
          // user doesn't have permission
          this._requestPermission();
      }
    }

    async _requestPermission(){
      try {
        // User has authorised
        alert('알림을 설정하세요');
        // await rnfirebase.messaging().requestPermission();
        // await this._updateTokenToServer();
      } catch (error) {
          // User has rejected permissions
          alert("you can't handle push notification");
      }
    }

    async _updateTokenToServer(){
      const fcmToken = await rnfirebase.messaging().getToken();
      console.log(fcmToken);

      const header = {
        method: "POST",
        headers: {
          'Accept':  'application/json',
           'Content-Type': 'application/json',
           'Cache': 'no-cache'
        },
        body: JSON.stringify({
          user_id: "CURRENT_USER_ID",
          firebase_token: fcmToken
        }),
        credentials: 'include',
      };
      //const url = "http://YOUR_SERVER_URL";

      // if you want to notification using server,
      // do registry current user token

      // await fetch(url, header);
    }


    async _listenForNotifications(){
        // onNotificationDisplayed - ios only

        this.notificationListener = firebase.notifications().onNotification((notification) => {
          console.log('onNotification', notification);
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            console.log('onNotificationOpened', notificationOpen);
        });

        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            console.log('getInitialNotification', notificationOpen);
        }
      }

  // firebase notification

  toggleSwitch1 = (value) => {
      this.setState({switch1Value: value})
   }

  // firebase authentication logout
  logout() {
    firebase.auth().signOut();

    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Main' })],
    }));
  }

  // firebase authentication user delete
  delete(id) {
    firebase.firestore().collection("users").doc(id)
    .delete()
    .then(function() {
    }).catch(function(error) {
      console.error("Error removing user: ", error);
    });

    var deleteWords = firebase.firestore().collection("words").where('id', '==', id)

    if(deleteWords) {
      deleteWords
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.delete();
        });
      });
    }

    var deleteMessage = firebase.firestore().collection("messages").where('talker', 'array-contains', id)

    if(deleteMessage) {
      deleteMessage
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.delete();
        });
      });
    }

    firebase.auth().currentUser
    .delete()
    .then(function() {
      console.log('auth delete');
    }).catch(function(error) {
      // An error happened.
    });

    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Login' })],
    }));
  }

  componentDidMount() {
    this._checkPermission();
    this._listenForNotifications();

    var ss = rnfirebase.messaging().getToken();

    var message = {
  data: {
    score: '850',
    time: '2:45'
  },
  token: ss
}


// Send a message to the device corresponding to the provided
// registration token.
rnfirebase.messaging().notification.builder(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });


    firebase.firestore().collection('users').where('email', '==', firebase.auth().currentUser.email)
    .get()
    .then(querySnapshot => {
      const user = querySnapshot.docs.map(doc => doc.data());
      const keys = Object.keys(user);

      const k = keys[0];
      email = user[k].email;
      age = user[k].age;
      region = user[k].region;
      gender = user[k].gender;

      this.setState({email: email});
      this.setState({age: age});
      this.setState({region: region});
      this.setState({gender: gender});
    });
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  render() {
    var id = firebase.auth().currentUser.email;
    return (
      <View style={style.container}>
        <View style={style.infoContainer}>
          <View style={style.myinfo}>
            <Image
                source={require('./img/pkheart.png')}
                style={style.haertImg}
            />
            <Image
                source={ this.state.gender == '남자' ? require('./img/male.png') : require('./img/female.png') }
                style={style.genderImg}
            />
            <Text style={style.private}>{this.state.region}/{this.state.age}세</Text>
            <Text style={style.email}>{this.state.email}</Text>
          </View>
          <Hr lineColor="#f2e0f5" width={1} style={{padding: 10}}/>
          <View style={style.appinfo}>

            <Text style={style.title}>앱 정보</Text>

              <TouchableOpacity style={style.list}>
                  <Text style={style.text}>버전</Text>
                  <Text style={style.ver}>{VersionCheck.getCurrentVersion()}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={style.list}>
                <Text style={style.text}>이용약관</Text>
                <Image
                    source={require('./img/go.png') }
                    style={style.gobtn}
                />

              </TouchableOpacity>
              <TouchableOpacity style={style.list}>
                <Text style={style.text}>푸시설정</Text>
                <Switch style={style.switch}
                    onValueChange={this.toggleSwitch1}
                    value={this.state.switch1Value}
                />
              </TouchableOpacity>
              <TouchableOpacity style={style.list} onPress={() => this.logout()}>
                <Text style={style.text}>로그아웃</Text>
                <Image
                    source={require('./img/go.png') }
                    style={style.gobtn}
                />
              </TouchableOpacity>
              <TouchableOpacity style={style.list} onPress={this.showDialog}>
                <Text style={style.text}>회원탈퇴</Text>
                <Image
                    source={require('./img/go.png') }
                    style={style.gobtn}
                />
              </TouchableOpacity>
            </View>
            <View style={style.logoContainer}>
              <Image
                  source={require('./img/cuckoo_logo3.png')}
                  style={style.logo}
              />
            </View>
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title style={{fontFamily:'PFStardust'}}>탈퇴하시겠습니까?</Dialog.Title>
              <Dialog.Button label="네" color='black' style={{fontFamily:'PFStardust'}} onPress={() => this.delete(id)}/>
              <Dialog.Button label="아니오" color='black' style={{fontFamily:'PFStardust'}} onPress={this.handleCancel}/>
            </Dialog.Container>
         </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
    padding: 10,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8c378b',
  },
  myinfo: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderColor: '#f2e0f5',
  },
  private: {
    fontSize: 18,
    fontFamily: 'PFStardust',
  },
  email: {
    fontSize: 16,
    fontFamily: 'PFStardust',
  },
  appinfo: {
    flex: 0.5,
    padding: 35,
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    marginLeft: 10,
    fontFamily: 'PFStardust',
  },
  list: {
    flex: 1,
    width: '90%',
    flexDirection: 'row',
    marginLeft: 15,
  },
  text: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'PFStardust',
  },
  ver: {
    position: 'absolute',
    right: 20,
    fontSize: 15,
    fontFamily: 'PFStardust',
  },
  switch: {
    position: 'absolute',
    right: 5,
  },
  haertImg: {
    width: 15,
    height: 13,
    margin: 10,
  },
  genderImg: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    margin: 10,
  },
  gobtn: {
    position: 'absolute',
    right: 20,
  },
  logoContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 85,
    height: 30,
    marginBottom: 10,
  },
  SectionHeader:{
    backgroundColor : '#BDBDBD',
    fontSize : 20,
    padding: 5,
    color: '#fff',
    fontWeight: 'bold'
  },
  SectionListItemS:{
    fontSize : 16,
    padding: 6,
    margin: 10,
    color: '#000',
    backgroundColor : '#FFFFFF'
  }
});
