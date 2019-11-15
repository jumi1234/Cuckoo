import React from 'react'
import { StyleSheet, Text, TextInput, Image, View, Button, AsyncStorage, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { SwitchNavigator, NavigationActions,StackActions } from 'react-navigation';
import { Icon } from 'native-base';
import firebase from '../src/config';
import Register from './Register';
import MainScreen from '../MainScreen';

export default class Login extends React.Component {

   // static navigationOptions = {
   //     title: 'CUCKOO',
   //   }

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

  render() {
      return (
          <View style={styles.container}>
            <View style={styles.inputContainer} behavior="padding" enabled>
              <View style={styles.input}>
                  <Icon style={styles.icon} name='mail'/>
                  <TextInput
                      label='Email Address'
                      placeholder='  계정을 입력하세요'
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
                      secureTextEntry
                      value={this.state.password}
                      onChangeText={password => this.setState({ password })}
                  />
              </View>
                  <Text style={styles.errorTextStyle}>{this.state.error}</Text>

                  <Button style={{width:'100%', height:150}} color='#F15382' onPress={this.onLoginPress.bind(this)} title="시작하기"/>
            </View>

                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>계정이 없으신가요?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                      <Text style={styles.signup}> 계정 만들기</Text>
                    </TouchableOpacity>
                  </View>
          </View>
      );
  }
}

  const styles = {
      errorTextStyle: {
          color: '#E64A19',
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
      logo: {
        marginLeft: 50,
        marginRight: 50,
        marginTop: 0,
      },
      inputContainer: {
        position: 'absolute',
        flex: 1,
        flexDirection: 'column',
        marginTop: 150,
      },
      icon: {
        marginTop: 10,
        marginLeft: 15,
        color: '#DDDBE7'
      },
      btnContainer: {
        flex: 1,
        marginTop: 100,
        width: '80%',
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
        borderColor:'#DDDBE7',
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
      },
      signup: {
        color: 'gray',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
      }
  };
