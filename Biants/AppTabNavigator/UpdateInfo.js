import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, SectionList, TouchableOpacity, TextInput, TouchableWithoutFeedback, Picker } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { Icon } from 'native-base';
import Dialog from "react-native-dialog";
import Hr from "react-native-hr-component";
import VersionCheck from "react-native-version-check";
import RNPickerSelect from 'react-native-picker-select';
import DismissKeyboard from 'dismissKeyboard';
import firebase from '../src/config';
import fb from 'react-native-firebase';


export default class UpdateInfo extends Component {

  static navigationOptions = {
    title: '',
    headerTitle: (
        <View style={{flex:1, flexDirection:'row', justifyContent:'center', marginLeft: -60}}>
            <Image
                source={require('./img/cuckoo_logo2.png')}
                style={{width:102, height:35}}
            />
        </View>
    ),
    headerStyle: {
      backgroundColor: '#8c378b',
      elevation: 0,
    },
  }

  constructor(props) {
  super(props);
  this.state = {
    email: '',
    age: '',
    region: '',
    gender: '',
    };
  }

  componentDidMount() {
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

  goToMain() {
    this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'MainScreen' })],
    }));
  }

  render() {
    var id = firebase.auth().currentUser.email;
    var user = firebase.firestore().collection('users').where('email', '==', id);
    return (
      <TouchableWithoutFeedback onPress={()=>{DismissKeyboard()}}>
        <View style={style.container}>
          <View style={style.infoContainer}>
            <View style={style.myinfo}>
              <Image
                  source={require('./img/pkheart.png')}
                  style={style.haertImg}
              />

            </View>

            <View style={style.appinfo}>

              <Text style={style.title}>내 정보</Text>


                <View style={style.list}>
                    <Text style={style.text}>이메일</Text>
                    <Text style={style.ver}>{this.state.email}</Text>
                </View>

                <View style={style.list}>
                  <Text style={style.text}>성별</Text>
                  <Text style={style.ver}>{this.state.gender}</Text>
                </View>
                <View style={style.list}>
                  <Text style={style.text}>나이</Text>
                  <TextInput
                    autoCapitalize="none"
                    style={style.textInput}
                    onChangeText={age => this.setState({ age })}
                    value={this.state.age}
                  />
                </View>
                <View style={style.list}>
                  <Text style={style.text}>지역</Text>
                  <Picker
                    selectedValue={this.state.region}
                    style={{height: 25, width: 100, position: 'absolute',
                    right:0,
                    fontSize: 15,
                    padding: 0,
                    fontFamily: 'PFStardust',}}
                    onValueChange={region => this.setState({ region })}>
                    <Picker.Item label="서울" value="서울" />
                    <Picker.Item label="경기" value="경기" />
                    <Picker.Item label="인천" value="인천" />
                    <Picker.Item label="강원" value="강원" />
                    <Picker.Item label="충북" value="충북" />
                    <Picker.Item label="충남" value="충남" />
                    <Picker.Item label="대전" value="대전" />
                    <Picker.Item label="전북" value="전북" />
                    <Picker.Item label="전남" value="전남" />
                    <Picker.Item label="광주" value="광주" />
                    <Picker.Item label="울산" value="울산" />
                    <Picker.Item label="대구" value="대구" />
                    <Picker.Item label="경북" value="경북" />
                    <Picker.Item label="경남" value="경남" />
                    <Picker.Item label="부산" value="부산" />
                    <Picker.Item label="제주" value="제주" />
                  </Picker>

                </View>
                <TouchableOpacity style={style.list} onPress={() => {firebase.firestore().collection('users').doc(id).update({ age: this.state.age, region: this.state.region}); this.goToMain()}}>
                  <View style={style.btnContainer}>
                    <Text style={style.start}>수정</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={style.logoContainer}>
                <Image
                    source={require('./img/cuckoo_logo3.png')}
                    style={style.logo}
                />
              </View>
           </View>
        </View>
      </TouchableWithoutFeedback>
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
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginTop: 20,
  },
  email: {
    fontSize: 16,
    fontFamily: 'PFStardust',
  },
  appinfo: {
    flex: 1,
    padding: 35,
    marginBottom: 40,
    minHeight: 290,
  },
  title: {
    fontSize: 18,
    marginTop: -20,
    marginBottom: 50,
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
    fontSize: 16,
    fontFamily: 'PFStardust',
  },
  ver: {
    position: 'absolute',
    right: 20,
    fontSize: 15,
    fontFamily: 'PFStardust',
  },
  textInput: {
    position: 'absolute',
    right: 20,
    fontSize: 15,
    fontFamily: 'PFStardust',
    padding: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8c378b',
  },
  haertImg: {
    width: 15,
    height: 13,
    margin: 10,
  },
  logoContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    height: '100%'
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 85,
    height: 40,
    marginBottom: 10,
  },
  btnContainer: {
    flex:1,
    backgroundColor: '#8c378b',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
  },
  start: {
    color: '#FFFFFF',
    fontFamily: 'PFStardust',
  },
});
