import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import RNPickerSelect from 'react-native-picker-select';
import firebase from '../src/config'

const databaseURL = "https://biants-project.firebaseio.com/";

export default class Register extends React.Component {

  state = { email: '', password: '', age: '', region : '', gender: '', errorMessage: null }

  constructor() {
  super();
  this.state = {
  users: {},
  user: {}
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
    const user = {
    email: this.state.email,
    password: this.state.password,
    age: this.state.age,
    region: this.state.region,
    gender: this.state.gender
    }

    let result = 0;

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() =>
        result = 1, this.props.navigation.navigate('Login'))
      .catch(error => this.setState({ errorMessage: error.message }))


    if(result = 1) {
    firebase.firestore().collection('users').add({
      email: this.state.email,
      password: this.state.password,
      age: this.state.age,
      region: this.state.region,
      gender: this.state.gender
    })
  }

    }
render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          placeholder="이메일"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="비밀번호"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <TextInput
          placeholder="나이"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={age => this.setState({ age })}
          value={this.state.age}
        />
        <RNPickerSelect
          placeholder={{
            label: '지역',
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
        <RNPickerSelect
          placeholder={{
            label: '성별',
            value: '',
          }}
          onValueChange={gender => this.setState({ gender })}
            items={[
                { label: '여자', value: '여자' },
                { label: '남자', value: '남자' },
            ]}
            value={this.state.gender}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.goBack(null)}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
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
  },
})
