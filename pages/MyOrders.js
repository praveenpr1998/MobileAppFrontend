import {NavigationEvents } from "react-navigation";
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';
import {AsyncStorage} from 'react-native';
import Modal from 'react-native-modal';
import Homeheading from "../components/homeHeading.js";
import { FlatList } from 'react-native-gesture-handler';
export default class Loginscreen extends Component {
    state={
        allOrders:[],
        modalDisplaydata:[],
        isModalVisible:false
    }

    async componentDidMount(){
        fetch("http://192.168.43.239:1337/Orders?userid="+await AsyncStorage.getItem("userid"))
        .then(res => res.json())
        .then(
        (result) => {
        
            this.setState({allOrders:result});
       
        })
    }

    displayOrders(){
        return(
                <View >
                     <View style={styles.orderstext}>
                         <Text style={{fontSize:25,paddingTop:10,paddingBottom:10}}>Orders</Text></View>
           
                        <FlatList
                        data={this.state.allOrders}
                        keyExtractor={(item)=>item.id}
                        renderItem={({item})=>(
                            <View style={{flexDirection:'row',height:70,marginTop:5,backgroundColor:'#fde2e2', borderWidth:1,borderColor: '#ddd'}}>
                                <View>
                                    <Text style={styles.ordertext} onPress={()=>{this.modalDisplay(item.orderid)}}>OrderId: {item.orderid}</Text>
                                    <Text style={styles.totaltext}>TotalAmount: {item.totalamount}</Text>
                                </View>  
                                <View style={{alignItems:'center',alignContent:'center'}}>
                                    <Text style={styles.date}> {item.date}</Text> 
                                </View>
                            </View>
                        )} />
                </View>
        )
    }

    modalDisplay(id){
        const clickedOrderdata=this.state.allOrders.filter((data)=>data.orderid===id);
        clickedOrderdata.map((data=>{
            this.setState({modalDisplaydata:data});

        }))
         this.setState({isModalVisible:true})
       
    }
    render(){
        return(
            <View style={{flex:1}}>
                <NavigationEvents onDidFocus={async ()=>{   fetch("http://192.168.43.239:1337/Orders?userid="+await AsyncStorage.getItem("userid"))
                    .then(res => res.json())
                    .then(
                    (result) => {
        
                         this.setState({allOrders:result});
       
                     })}}   /> 
            <Homeheading navigation={this.props.navigation}/>
            {this.displayOrders()}
            <Modal isVisible={this.state.isModalVisible}>
            <View style={{flex: 1,marginTop:150,marginLeft:10,backgroundColor:'white',height:'50%',marginBottom:250,width:300}}>
             
               <View style={{alignItems:'center'}}><Text style={styles.ordertext} >{this.state.modalDisplaydata.orderid}</Text></View>
               <View style={{flexDirection:'row'}}>
               
               <Text style={styles.totaltext}>TotalAmount: {this.state.modalDisplaydata.totalamount}</Text>
                  <Text style={styles.dateinModal}> {this.state.modalDisplaydata.date}</Text> 
                </View>    
                <FlatList
                data={this.state.modalDisplaydata.items}
                keyExtractor={(item)=>item.id}
                renderItem={({item})=>(
                     <View  style={{flexDirection:'row',height:60,backgroundColor:'white', borderWidth:1,borderColor: '#ddd'}} >
                        <View >
                            <Image
                                style={{marginTop:10,width: 60, height: 48}}
                                source={{uri: item.Link}}/></View>
                            <View >   
                                <Text style={styles.cardText}>{item.Name}</Text>
                                <Text style={styles.priceText}>PRICE: ${item.Price}</Text>
                            </View>
                            <View style={{paddingLeft:200,paddingTop:5,flexDirection:'row',position:'absolute'}}>
                                <Text>Quantity:{item.Quantity}</Text>  
                            </View>
                        </View>
                )}
                 />
                <Button title="Okay" onPress={()=>{this.setState({isModalVisible:false})}} />
            </View>
            </Modal>
         </View>
        )
    }
}


const styles = StyleSheet.create({
ordertext:{
    fontSize:15 ,
    color:'#f78259',
    paddingLeft:12,
    paddingTop:12
},
totaltext:{
    fontSize:15 ,
    color:'#eb4559',
    paddingLeft:12,
    paddingTop:10
   
},date:{
    paddingLeft:60,paddingTop:10
},
dateinModal:{
    paddingLeft:60,paddingTop:10
},
orderstext:{
alignContent:'center',
justifyContent:'center',
alignItems:'center'
},
cardText:{
    fontSize:17,
    fontWeight:'bold'
  },
  priceText:{
    fontSize:13,
    paddingTop:8
    
  },
})