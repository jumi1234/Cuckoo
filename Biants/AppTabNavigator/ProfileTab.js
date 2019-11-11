import React, { Component } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { Icon } from 'native-base';

export default class ProfileTab extends Component {
  static navigationOptions = {
      title: '',
        tabBarIcon: ({ tintColor }) => (
            <Icon name='ios-person' style={{ color: '#BDBDBD' }} />
        )
    }

    render() {
        return (
            <View style={style.container}>
                <SectionList
       sections={[
         { title: '내 정보', data: ['아이디', '나이', '성별', '지역'] },
         { title: '앱 정보', data: ['버전', '이용약관', '푸시설정', 'FAQ'] },
       ]}
       renderSectionHeader={ ({section}) => <Text style={style.SectionHeader}> { section.title } </Text> }
       renderItem={ ({item}) => <Text style={style.SectionListItemS}> { item } </Text> }
       keyExtractor={ (item, index) => index }
     />

            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
      //  justifyContent: 'center',
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
