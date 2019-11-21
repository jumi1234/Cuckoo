import React from 'react'
import { StyleSheet, Text, TextInput, Image, View, Button, AsyncStorage, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { SwitchNavigator, NavigationActions, StackActions } from 'react-navigation';
import { Icon } from 'native-base';
import { Fonts } from '../Fonts';
import firebase from '../src/config';
import Register from './Register';
import MainScreen from '../MainScreen';
import SplashScreen from 'react-native-splash-screen';

export default class Login extends React.Component {

   static navigationOptions = {
       headerStyle: {
         backgroundColor: '#f2e0f5',
         elevation: 0,
       }
     }

  state = { email: '', password: '', error: ''};
  onLoginPress() {
      this.setState({ error: '' });
      const { email, password } = this.state;
      firebase.auth().signInWithEmailAndPassword(email, password)
          .then(() => {
            AsyncStorage.setItem('loggedIn', password);
            AsyncStorage.setItem('userId', email);
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                key: null,
                actions: [NavigationActions.navigate({ routeName: 'MainScreen' })],
            }));
          }).catch(() => { this.setState({ error: '로그인에 실패했습니다.' });
      });
  }

  // componentDidMount() {
  //   AsyncStorage.getAllKeys((err, keys) => {
  //     AsyncStorage.multiGet(keys, (err, stores) => {
  //       stores.map((result, i, store) => {
  //         // get at each store's key/value so you can work with it
  //         let key = store[i][0];
  //         let value = store[i][1];
  //         console.log(value);
  //       });
  //     });
  //   });
  // }
//

  render() {
      return (
          <View style={styles.container}>
            <View style={styles.logocontainer}>
              <Image
                  source={require('./img/cuckoo_logo.png')}
                  style={styles.logo}
              />
            </View>
            <View style={styles.inputContainer} behavior="padding" enabled>
              <View style={styles.input}>
                  <Icon style={styles.icon} name='mail'/>
                  <TextInput
                      label='Email Address'
                      placeholder=' 계정을 입력하세요'
                      style={{fontFamily: 'PFStardust'}}
                      value={this.state.email}
                      onChangeText={email => this.setState({ email })}
                  />
              </View>
              <View style={styles.input}>
                  <Icon style={styles.icon} name='lock'/>
                  <TextInput
                      label='Password'
                      autoCorrect={false}
                      placeholder='  비밀번호를 입력하세요'
                      style={{fontFamily: 'PFStardust'}}
                      secureTextEntry
                      value={this.state.password}
                      onChangeText={password => this.setState({ password })}
                  />
              </View>
              <TouchableOpacity onPress={() => this.onLoginPress(this)} style={{marginTop: 15,}}>
                <View style={styles.btnContainer}>
                  <Text style={styles.start}>시작하기</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.errorTextStyle}>{this.state.error}</Text>
            </View>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>계정이 없으신가요? </Text>
              <TouchableOpacity onPress={() =>   this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    key: null,
                    actions: [NavigationActions.navigate({ routeName: 'Register'})],
                }))}>
                <Text style={styles.signup}>계정 만들기</Text>
              </TouchableOpacity>
            </View>
          </View>
      );
  }
}

  const styles = {
      errorTextStyle: {
          color: '#cda8d2',
          alignSelf: 'center',
          paddingTop: 10,
          paddingBottom: 10
      },
      container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#DDDBE7',
      },
      logocontainer: {
        position: 'relative',
        top: 0,
        flex: 0.6,
        backgroundColor: '#f2e0f5',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      },
      logo: {
        width: 136,
        height: 105,
      },
      inputContainer: {
        position: 'absolute',
        top: '40%',
        flex: 1,
        flexDirection: 'column',
        margin: 10,
        // borderTopWidth: 0,
        // borderBottomWidth: 1,
        // borderBottomLeftRadius: 24,
        // borderBottomRightRadius: 24,
        // borderColor: '#f2e0f5',
      },
      icon: {
        marginTop: 10,
        marginLeft: 15,
        color: '#8c378b'
      },
      btnContainer: {
        flex:1,
        backgroundColor: '#8c378b',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
      },
      start: {
        color: '#FFFFFF',
        fontFamily: 'PFStardust',
      },
      textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
      },
      input: {
        flex: 1,
        flexDirection: 'row',
        borderColor:'#8c378b',
        width:350,
        height: '100%',
        borderWidth: 1,
        borderStyle: 'solid',
        fontSize:15,
        borderRadius: 25,
        margin: 10,
      },
      loginbtn: {
      },
      signupContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 30,
      },
      signupText: {
        color: 'gray',
        fontFamily: 'PFStardust'
      },
      signup: {
        color: 'gray',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        fontFamily: 'PFStardust',
      }
  };
