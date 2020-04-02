import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity,Image,Button, View, Text,ScrollView,SafeAreaView, AsyncStorage } from 'react-native';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from "../pages/productsPage.js";
import cartPage from "../pages/cartPage.js";
import Login from "../pages/loginScreen.js";
import MyOrders from "../pages/MyOrders.js";
import { createDrawerNavigator } from 'react-navigation-drawer';
import {  createAppContainer } from 'react-navigation';

const DrawerWithLogoutButton=(props)=>{
    return(
        <ScrollView contentContainerStyle={{flex: 1,  flexDirection: 'column', justifyContent: 'space-between' }}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <TouchableOpacity style={{paddingTop:50}} onPress={()=>{props.navigation.navigate('Homee')}}>
              <Text style={{fontSize:20,paddingLeft:20}}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingTop:30}} onPress={()=>{props.navigation.navigate('Cartt')}}>
              <Text style={{fontSize:20,paddingLeft:20}}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingTop:30}} onPress={()=>{props.navigation.navigate('MyOrders')}}>
              <Text style={{fontSize:20,paddingLeft:20}}>MyOrders</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <TouchableOpacity onPress={()=>{AsyncStorage.removeItem("userid");props.navigation.navigate('Login')}}>
          <View style={styles.item}>
            <Text style={styles.label}>Logoutt</Text>
            <MaterialCommunityIcons name="logout" size={32} style={{paddingLeft:20}}  color="black" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
}

const DrawerNavigation =createDrawerNavigator({

  Homee:{
    screen:Home,

  },
  Login:{
    screen:Login,
  },
  Cartt:{
    screen:cartPage,
  },
  MyOrders:{
    screen:MyOrders,
  }
},
  {
    contentComponent:DrawerWithLogoutButton,
    });

    const DrawerNav = createAppContainer(DrawerNavigation);
    const styles = StyleSheet.create({
        item: {
            flexDirection: 'row',
            alignItems: 'center',
          },
          label: {
            paddingRight:20,
            margin: 16,
            fontSize:20,
            fontWeight: 'bold',
            color: 'rgba(0, 0, 0, .87)',
          },
          iconContainer: {
            marginHorizontal: 16,
            width: 24,
            alignItems: 'center',
          },
          icon: {
            width: 24,
            height: 24,
          }
      });
    export default DrawerNav;