import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, AsyncStorage } from 'react-native';
import { SwitchNavigator, NavigationActions,StackActions } from 'react-navigation';
import firebase from '../src/config';
import Register from './Register';
import MainScreen from '../MainScreen';

export default class Login extends React.Component {

   static navigationOptions = {
       title: 'CUCKOO',
     }

  state = { email: '', password: '', error: '' };
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
          }).catch(() => { this.setState({ error: 'Authentication failed.' });
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
          <View>
                  <TextInput
                      label='Email Address'
                      placeholder='email@domain.com'
                      value={this.state.email}
                      onChangeText={email => this.setState({ email })}
                  />
                  <TextInput
                      label='Password'
                      autoCorrect={false}
                      placeholder='*******'
                      secureTextEntry
                      value={this.state.password}
                      onChangeText={password => this.setState({ password })}
                  />
                  <Text style={styles.errorTextStyle}>{this.state.error}</Text>
                  <Button onPress={this.onLoginPress.bind(this)} title="Login"/>
                  <Button
          title="Don't have an account? Sign Up"
          onPress={() => this.props.navigation.navigate('Register')}
        />
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
        justifyContent: 'center',
        alignItems: 'center'
      },
      textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
      }
  };
