import React, { Component } from 'react';
import { Image, View, Text, AsyncStorage } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { NavigationActions } from 'react-navigation';


export default class Homescreen extends Component {
async componentDidMount(){
    setTimeout (
      async ()=>{
        if(await AsyncStorage.getItem("userid")===null){
          console.log("yes")
        this.props.navigation.navigate('Login')
      }
        else{
          this.props.navigation.navigate('Homee')  
          console.log("no")
        }
      },4*1000
    );
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:"black",alignItems:'center'}}>
        <Image
                style={{width: 150, height: 158,marginTop:250}}
                source={{uri:"https://graphicriver.img.customer.envatousercontent.com/files/270440720/CartoonDogPointer%20p.jpg?auto=compress%2Cformat&q=80&fit=crop&crop=top&max-h=8000&max-w=590&s=d7ccf47eef9f9a8f679c134cc70bffa5"}} />
        <Text style={{color:"white",fontSize:30,marginTop:0}}>Welcome Dood..</Text>
      </View>
    )
  }
}