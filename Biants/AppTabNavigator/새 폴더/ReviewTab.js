import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

export default class ReviewTab extends Component {
  static navigationOptions = {
      title: '',
        tabBarIcon: ({ tintColor }) => (
            <Icon name='ios-paper' style={{ color: '#BDBDBD' }} />
        )
    }
    render() {
        return (
            <View style={style.container}>
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
