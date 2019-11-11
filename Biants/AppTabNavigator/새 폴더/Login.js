import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

export default class Login extends Component {
  static navigationOptions = {
      title: '',
        tabBarIcon: ({ tintColor }) => (
            <Icon name='ios-search' style={{ color: '#BDBDBD' }} />
        )
    }
    render() {
        return (
            <View style={style.container}>
                <Text>Login</Text>
            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
