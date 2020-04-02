import {NavigationEvents } from "react-navigation";
import Modal from 'react-native-modal';
import React , {Component} from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import {
    StyleSheet,
    Text,
    View,
    CheckBox,
    TextInput,
    Button,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    TouchableOpacityBase
  } from 'react-native';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import  AntDesign  from 'react-native-vector-icons/AntDesign';
import {AsyncStorage} from 'react-native';
import Homeheading from "../components/homeHeading.js";

  export default class cartPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
          orderId:"",
          isModalVisible:false,
          allData:[],
          allProducts: [],
          data:[],
          totalAmount:"0",
        }
    }

    //remove item in cart by making req to server with product id and userid
    async removeItem(id){
      
      fetch("http://192.168.43.239:1337/cartitems/remove/",{
      method:"POST",
      body:JSON.stringify({productId:id,userid:await AsyncStorage.getItem("userid")}),
      })
      .then(res => res.json())
      .then(
      (result) => {
         this.setState({allProducts:result});
         this.totalAmount()
       })  
    }

    
    //increment item in cart by making req to server with product id and userid
    async increment(id){
      fetch("http://192.168.43.239:1337/cartitems/increment/",{
        method:"POST",
        body:JSON.stringify({productId:id,userid:await AsyncStorage.getItem("userid")}),
      })
     .then(res => res.json())
     .then(
       (result) => {
        this.setState({allProducts:result});
        this.totalAmount();  
         })  
    }

    
    //decrement item in cart by making req to server with product id and userid
   async decrement(id){
      fetch("http://192.168.43.239:1337/cartitems/decrement/",{
        method:"POST",
        body:JSON.stringify({productId:id,userid:await AsyncStorage.getItem("userid")}),
      })
     .then(res => res.json())
     .then(
       (result) => {
        this.setState({allProducts:result});
        this.totalAmount()
    })      
    }

    //getting the totalAmount of cart 
    async totalAmount(){
      fetch("http://192.168.43.239:1337/cartitems/totalAmount",{
        method:"POST",
        body:JSON.stringify({userid:await AsyncStorage.getItem("userid")})
      })
     .then(res => res.json())
     .then(
       (result) => {
         this.setState({totalAmount:result})
       }) 
    }

    //allProducts -- all the items added in the cart 
    //data -- all the products 
    async componentDidMount(){
        fetch("http://192.168.43.239:1337/cartitems?userid="+await AsyncStorage.getItem("userid"))
   .then(res => res.json())
   .then(
     (result) => {
    
       this.setState({allProducts:result});
       this.totalAmount()
     })

     fetch("http://192.168.43.239:1337/products/")
        .then(res => res.json())
        .then(
        (result) => {
          this.setState({data:result})
        })
  }
  
  //oncick to payment and checkout
  //getting the order api and and initiating payment 
    orderplaced(orders){
      fetch("http://192.168.43.239:1337/Orders/orderid/",{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({totalamount:this.state.totalAmount}),
      })
     .then(res => res.json())
     .then(
       (result) => {
         if(result.message !== "Success"){
          alert("Unauthorized Usage Need to Login again");     
         }
         else{
           this.setState({orderid:result.id})
           var options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: 'INR',
            key: 'rzp_test_wwfPnacJ10szIa',
            amount: '5000',
            name: 'Shopping Cart',
            order_id:this.state.orderid,
            prefill: {
              email: '',
              contact: '',
              name: ''
            },
            theme: {color: '#F37254'}
          }
          var today=new Date();
          var dd=String(today.getDate()).padStart(2,'0');
          var mm=String(today.getMonth()+1).padStart(2,'0');
          var yyyy=today.getFullYear();
          today=mm + '/' + dd +'/' +yyyy;
          
          return(
            RazorpayCheckout.open(options).then(async (data) => {
              
              fetch("http://192.168.43.239:1337/Orders/add/",{
                method:"POST",
                headers:{
                  'Content-Type':'application/json'
                },
              body:JSON.stringify({orderid:data.razorpay_payment_id,date:today,paymentid:data.razorpay_order_id,signature:data.razorpay_signature,totalamount:this.state.totalAmount,items:this.state.allProducts,userid:await AsyncStorage.getItem("userid")}),
              })
              .then(res => res.json())
              .then(
                (result) => {
                  if(result.message !== "Success"){
                    alert("Unauthorized Usage Need to Login again");
                  }
              });
            this.setState({orderId:data.razorpay_payment_id,isModalVisible:true})
            
            this.props.navigation.navigate('MyOrders')
    
              }).catch((error) => {
            alert(`Error: ${error.code} | ${error.description}`);
              })
          )
         }
       });
       
      
    }

    //diplaying the cartitems of user
  displayCart(){
    return(
      
        <View style={{flex:1}}>
          
        <FlatList
          data={this.state.allProducts}
          keyExtractor={(item)=>item.id} 
          renderItem={({item})=>(  
              <View  style={{flexDirection:'row',height:120,marginTop:10,backgroundColor:'white', borderWidth:1,borderColor: '#ddd'}} >
                <View >
                  <Image
                    style={{marginTop:10,width: 110, height: 98}}
                    source={{uri: item.Link}}/>
                </View>
                  <View >   
                    <Text style={styles.cardText}>{item.Name}</Text>
                    <Text style={styles.priceText}>PRICE: ${item.Price}</Text>
                      <TouchableOpacity style={{paddingTop:15}} onPress={()=>{this.removeItem(item.productId)}}>
                        <Ionicons name="md-remove-circle" size={22} style={{paddingLeft:20}} color="red" />
                      </TouchableOpacity>
                  </View>
                    <View style={{paddingLeft:280,paddingTop:50,flexDirection:'row',position:'absolute'}}>
                        <AntDesign name="plussquareo" size={15} onPress={()=>{this.increment(item.productId)}} >  <Text>{item.Quantity}</Text>  </AntDesign><AntDesign name="minussquareo" size={15} onPress={()=>{((item.Quantity>1)?this.decrement(item.productId):this.removeItem(item.productId))}}></AntDesign>
                    </View>
              </View>
          )}
          />

            <View style={{height:70,flexDirection:'row',backgroundColor:'#fbe4d1'}}>
              <Text style={styles.totalAmount}>TotalAmount  </Text><Text style={styles.amount}> ${this.state.totalAmount} </Text>
            </View>
            <View style={{height:50,backgroundColor:'#f60404',alignItems:'center'}}>
              <Text style={{fontSize:20,marginTop:10,color:'white'}} onPress={()=>{this.orderplaced(joinedData)}}>Checkout</Text>
            </View>
        </View>
    )
  }

      render(){ 
          return(
            
            <View style={{flex:1}}>  

            //Used NavigationEvents to Reload the items when navigating             
                <NavigationEvents onDidFocus={async ()=>{ fetch("http://192.168.43.239:1337/cartitems?userid="+await AsyncStorage.getItem("userid"))
                .then(res => res.json())
                .then(
                (result) => {
    
                  this.setState({allProducts:result});
                  this.totalAmount()
                })}}   /> 

              <Homeheading navigation={this.props.navigation}/>

                <Modal isVisible={this.state.isModalVisible}>
                  <View style={{alignItems:'center',flex: 1,marginTop:150,marginLeft:10,backgroundColor:'white',height:'50%',marginBottom:250,width:300}}>
                    <Image
                      style={{width: 150, height: 158}}
                      source={{uri:"https://graphicriver.img.customer.envatousercontent.com/files/270440720/CartoonDogPointer%20p.jpg?auto=compress%2Cformat&q=80&fit=crop&crop=top&max-h=8000&max-w=590&s=d7ccf47eef9f9a8f679c134cc70bffa5"}} />
                     <Text style={{fontSize:20}}>Order Placed !</Text>
                    <Text style={{fontSize:20}}>Order Id: {this.state.orderId}</Text> 
                  <Button title="Okay" onPress={()=>{this.setState({isModalVisible:false})}} />
                 </View>
              </Modal>

                {this.displayCart()}  

            </View>

          )
        }
}

  const styles = StyleSheet.create({
    cartBox:{
        width:10,
        height:70,
    },
    Col:{
     height:140,width:30
    },
    cardText:{
      fontSize:20,
      fontWeight:'bold'
    },
    priceText:{
      fontSize:13,
      paddingTop:8
      
    },
    totalAmount:{
      fontWeight:'bold',
      fontSize:17,
      marginTop:15,
      marginLeft:15,
      alignContent:'center'
    },
    amount:{
      fontWeight:'bold',
      fontSize:17,
      marginTop:15,
      marginLeft:180,
    }
  });