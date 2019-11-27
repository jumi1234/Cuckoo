import React from 'react'
import { StyleSheet, Text, Image, TextInput, View, Button, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native'
import { SwitchNavigator, NavigationActions, StackActions } from 'react-navigation';
import RNPickerSelect from 'react-native-picker-select';
import firebase from '../src/config';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import DismissKeyboard from 'dismissKeyboard';

const databaseURL = "https://biants-project.firebaseio.com/";

export default class Register extends React.Component {

  static navigationOptions = {
      headerTitle: (
          <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
              <Image
                  source={require('./img/cuckoo_logo2.png')}
                  style={{width:102, height:35}}
              />
          </View>
      ),
      headerStyle: {
        backgroundColor: '#8c378b',
        elevation: 0,
      }
    }

  state = { email: '', password: '', passwordCheck: '', age: '', region : '', gender: '', errorMessage: null,}

  constructor() {
  super();
  this.state = {
  users: {},
  user: {},
  issignup: '',
  };
  }

  _post = () => {
    firebase.firestore().collection('users').add({
      email: this.state.email,
      password: this.state.password,
      age: this.state.age,
      region: this.state.region,
      gender: this.state.gender
    })
  }

  handleSignUp = () => {

    if( !this.state.email || !this.state.password || !this.state.passwordCheck || !this.state.age || !this.state.region || !this.state.gender ) {
      alert('정보를 입력하세요');
    } else if(this.state.password.length < 6) {
      alert('비밀번호는 6자 이상 입력하세요');
    } else if(this.state.password != this.state.passwordCheck) {
      alert('비밀번호가 일치하지 않습니다');
    } else if( this.state.issignup == 2 ){
      alert('중복된 이메일입니다');
    } else {
        const user = {
        email: this.state.email,
        password: this.state.password,
        age: this.state.age,
        region: this.state.region,
        gender: this.state.gender
        }

        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(() =>
            this.props.navigation.navigate('Login'))
          .catch(error => this.setState({ errorMessage: error.message }))

        var em = this.state.email;

        firebase.firestore().collection('users').doc(em).set({
          email: this.state.email,
          password: this.state.password,
          age: this.state.age,
          region: this.state.region,
          gender: this.state.gender
        })

      this.props.navigation.dispatch(StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'Login'})],
      }));

    }
}

render() {
  var issignup;
  if(this.state.email) {
  firebase.firestore().collection('users').where('email', '==', this.state.email)
  .get()
  .then(querySnapshot => {
    const data = querySnapshot.docs.map(doc => doc.data());
        if(data.length > 0) {
          issignup = 2;
        } else {
            issignup = 1;
        }
        this.setState({issignup: issignup});
  });
}
    return (
      <TouchableWithoutFeedback onPress={()=>{DismissKeyboard()}}>
        <View style={styles.container}>
          {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
              {this.state.errorMessage}
            </Text>}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="  이메일"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={(email) => this.setState({email: email})}
              value={this.state.email}
              ref="emailInput"
            />
            <TextInput
              secureTextEntry
              placeholder="  비밀번호"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
            <TextInput
              secureTextEntry
              placeholder="  비밀번호 확인"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={passwordCheck => this.setState({ passwordCheck })}
              value={this.state.passwordCheck}
            />
            <TextInput
              placeholder="  나이"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={age => this.setState({ age })}
              value={this.state.age}
            />
            <View style={styles.select}>
              <RNPickerSelect
                placeholder={{
                  label: '  지역',
                  value: '',
                }}
                onValueChange={region => this.setState({ region })}
                  items={[
                      { label: '서울', value: '서울' },
                      { label: '경기', value: '경기' },
                      { label: '인천', value: '인천' },
                      { label: '강원', value: '강원' },
                      { label: '충북', value: '충북' },
                      { label: '충남', value: '충남' },
                      { label: '대전', value: '대전' },
                      { label: '전북', value: '전북' },
                      { label: '전남', value: '전남' },
                      { label: '광주', value: '광주' },
                      { label: '울산', value: '울산' },
                      { label: '대구', value: '대구' },
                      { label: '경북', value: '경북' },
                      { label: '경남', value: '경남' },
                      { label: '부산', value: '부산' },
                      { label: '제주', value: '제주' },
                  ]}
                  value={this.state.region}
              />
            </View>
            <View style={styles.select}>
              <RNPickerSelect
                placeholder={{
                  label: '  성별',
                  value: '',
                }}
                onValueChange={gender => this.setState({ gender })}
                  items={[
                      { label: '여자', value: '여자' },
                      { label: '남자', value: '남자' },
                  ]}
                  value={this.state.gender}
              />
            </View>

            <View style={styles.imgcontainer}>
              <Image
                  source={require('./img/heart.png')}
                  style={styles.heart}
              />
            </View>

            <TouchableOpacity onPress={this.handleSignUp} style={{flex: 1, marginTop: 15,}}>
              <View style={styles.btnContainer}>
                <Text style={styles.start}>가입하기</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.signinContainer}>
              <Text style={styles.signinText}>이미 가입하셨나요?</Text>
              <TouchableOpacity onPress={() =>   this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    key: null,
                    actions: [NavigationActions.navigate({ routeName: 'Login'})],
                }))}>
                <Text style={styles.signin}> 로그인</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2e0f5',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    width: '95%',
    height: '95%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8c378b',
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
  textInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8c378b',
    fontSize:15,
    borderRadius: 25,
    width: '95%',
    margin: 10,
    color: '#8c378b',
    fontFamily: 'PFStardust',
  },
  select: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8c378b',
    fontSize:15,
    borderRadius: 25,
    margin: 10,
    fontFamily: 'PFStardust',
  },
  imgcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  heart: {
    width: 28,
    height: 24,
    alignSelf: 'center',
  },
  btnContainer: {
    height: 45,
    backgroundColor: '#8c378b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  start: {
    color: '#FFFFFF',
    fontFamily: 'PFStardust',
  },
  signinContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  signinText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#8c378b',
    fontFamily: 'PFStardust',
  },
  signin: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#8c378b',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontFamily: 'PFStardust',
  }
})
