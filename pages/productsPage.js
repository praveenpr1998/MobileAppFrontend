import React , {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    CheckBox,
    TextInput,
    Button,
    FlatList,
    ScrollView,
    TouchableHighlight,
    Image,
    Alert
  } from 'react-native';
  import 'react-native-gesture-handler';
  import MultiSelect from 'react-native-multiple-select';
  import { Card } from 'react-native-elements';
  import {AsyncStorage} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Homeheading from "../components/homeHeading.js";


export default class productsPage extends Component{
    state={
        allProducts:[],
        allProducts1:[],
        filteredCat:[],
        searchValue:"",
        selectedItems: []
    }
    
  
  onSelectedItemsChange = selectedItems => {
    this.setState({allProducts:null})
    this.setState({ selectedItems });
  };
  
 
    componentDidMount(){
    fetch("http://192.168.43.239:1337/products/")
        .then(res => res.json())
        .then(
        (result) => {
               this.setState({allProducts:result,allProducts1:result});
              const allCat = [...new Set(this.state.allProducts.map(data => data.category))];
                this.setState({selectedItems:allCat})     
            let uniqueObject=[];
            let newArray=[];
            let objTitle=[];
                for(let i in this.state.allProducts){
                  objTitle=this.state.allProducts[i]['category'];
                  uniqueObject[objTitle]=this.state.allProducts[i];
                }
                 for (i in uniqueObject) { 
                newArray.push(uniqueObject[i]); 
            }
            this.setState({filteredCat:newArray})    
            })
    }

    async addItems(e){
      fetch("http://192.168.43.239:1337/cartitems/add/",{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({Name:e.name,link:e.link,price:e.price,Quantity:"1",productId:e.id,userid:await AsyncStorage.getItem("userid")}),
      })
    .then(res => res.json())
    .then(
     (result) => {
       if(result.message !== "Success"){
        alert("Unauthorized Usage Need to Login again");   
       }
     });
    }

    displayCategories(){
        const { selectedItems } = this.state;
      return(
        
        <View style={{  marginLeft:3,marginRight:3,paddingTop:10,backgroundColor:"#6b5b95"}}>
        <TextInput placeholder="     Search Items" style={{paddingBottom:10}} value={this.state.searchValue} onChangeText={(text)=>{this.setState({searchValue:text})}}></TextInput>
          <MultiSelect
            hideTags
            items={this.state.filteredCat}
            uniqueKey="category"
            ref={(component) => { this.multiSelect = component }}
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText="        Filter Category"
            searchInputPlaceholderText="Search Category..."
           tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="red"
            selectedItemTextColor="black"
            selectedItemIconColor="red"
            itemTextColor="red"
            displayKey="category"
            searchInputStyle={{ color: 'black' }}
            submitButtonColor="#CCC"
            submitButtonText="Apply"
          />
        </View>
        
      )
    }


    render(){
        var loop=true;
        const all=[];
          this.state.selectedItems.sort().map((Category) => {
            const test=this.state.allProducts1.filter(x => { return x.category === Category });
            all.push(...test.filter(data => {
              return data.name.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1;
            }))
           
           })

      return (
        <View style={{flex:1}}>
          <Homeheading navigation={this.props.navigation}/>
            {this.displayCategories()}
        <View style={{flex:1}}>
        <FlatList numColumns={2} 
          keyExtractor={(item)=>item.id} 
          data={all} 
          renderItem={({item})=>(
          <Card style={styles.card}>
            <View style={{paddingLeft:10}}>
              <Image
                style={{width: 110, height: 98}}
                source={{uri: item.link}}/></View>
              <View style={styles.textcontent}>   
                 <Text style={styles.cardText}>{item.name}</Text>
                 <Text style={styles.priceText}>RS: {item.price}</Text>
              </View>
              <TouchableOpacity style={styles.button}>
                <Button title='add'color="red" onPress={()=>{this.addItems(item)}}/></TouchableOpacity>
          </Card>
        )} />
        </View>
          
         </View>
      );
    }
}
const styles = StyleSheet.create({
    container: { flexDirection:'row'},
    cardbox:{},
    categoryName:{
      fontSize:15,
      paddingLeft:10,
      paddingTop:10,
      fontWeight:'bold'
    },
    card:{
      marginTop:10,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
    },
    cardText:{
    fontSize:17
    },
    textcontent:{
      alignItems:'center',
      alignContent:'center',
      marginTop:10,
      marginBottom:10
    },
    priceText:{
      fontSize:17,
    },
    button:{
      alignContent:'center',
      marginLeft:23,
    width:70
    }
  })