import React from 'react';
import { ActivityIndicator , Picker , Alert , View, StyleSheet, TouchableOpacity, Text, Image , Dimensions  , ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
import LocalIP from "./localIPAddress";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class Damage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localUri: '',
      resultUri: '',
      resultTxt: '',
      message:'',
art   loader: false,
    };

  }
  
  static navigationOptions = ({navigation}) => ({
    title: 'Damage Prediction',
    headerStyle: {
      backgroundColor: '#00a2ff',
      elevation: 0,
    },
    headerTintColor: '#000000',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 24,
    },

    headerLeft: () => (
      <View style={{marginLeft: 10, marginTop:5}}>
        <TouchableOpacity  onPress={ () =>  navigation.navigate('HomePage') }>
          <MaterialCommunityIcons name="menu" color='#000000' size={30} />
        </TouchableOpacity>
      </View>
    ),
  });
//upload an image to the server
  uploadImage = async(uri_data) => {
    console.log(uri_data)
    const data = new FormData();
    await data.append("file", {
      uri: uri_data,
      name: "photo.jpg",
      type: "image/jpg"
    });
    try {
      await axios.post("http://"+LocalIP+":3500/main/upload",data, { //axios to send a post request with the image
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(async(res) => {
        console.log(res.data.filename)
        const url="http://"+LocalIP+":1111/damage"
        const data = JSON.stringify({ url : res.data.filename });
        await axios.post(url,data,{
          headers: { "Content-Type": "application/json" }
        }).then( async(res) =>{
            console.log(res.data)
            this.setState({loader:false,result:true,resultTxt:res.data.result})
        })
      }).catch(error => {
        console.log(error);
      })
    } catch(err) {
      console.log(err);
    }
  }

  onInsert = async(e) =>{
    if(this.state.localUri!=""){

        this.setState({loader:true})

        await this.uploadImage(this.state.localUri)

    }else{
        this.setState({title:"Required!",message:"Please choose image!"})
        this.showAlert()
    }
  }

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      message: "",
      title: "",
    });
  };
//from device camera image selection
  openImagePickerAsync = async (x) => {
    
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      this.setState({title:"Permission Denied!",message:"Permission to access camera roll is required!"})
      this.showAlert()
      return;
    }

    let pickerResult

    if(x===1){
  
      pickerResult = await ImagePicker.launchImageLibraryAsync();

    }else{
      
      pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images 
      });

    }

    if (pickerResult.cancelled === true) {
      return;
    }

    await this.setState({ localUri: pickerResult.uri});
    
  }

  open_image_option = async() =>{
    Alert.alert('Select Option', 'Camera or Gallery', [
      {
        text: 'Camera',
        onPress: () => {this.openImagePickerAsync(0)}
      },
      { text: 'Gallery',
        onPress: () => {this.openImagePickerAsync(1)} },
    ]);
  }

  render() {
    const { showAlert } = this.state;
    
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.center}>
            <Image
              source={require("./../assets/logo.png")}
              style={{ width: 150, height: 150, marginBottom: 20, marginTop: 10 }}
            />
          </View>

        <Text  style={styles.labelText}>Upload Image:</Text>
        <View style={styles.center}>
          <TouchableOpacity onPress={this.open_image_option} style={{width: 80 + '%', 
            height: Dimensions.get('window').width*0.8 ,
            borderWidth: 1,
            marginBottom:10 , 
            marginTop: 10,
            borderColor: '#c4c4c4',
            }}>
              <View>
                <Image source={{ uri: this.state.localUri }}
                  style={{width: 100 + '%', 
                  height: 100 + '%' 
                  }}
                  />
              </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonContainer, styles.registerButton , {width: 50 + '%'}]} onPress={this.open_image_option}>
            <Text style={{color: '#ffffff', fontWeight: 'bold'}}>Choose Image</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.center}>
          <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={this.onInsert}>
            {!this.state.loader ? (
              <Text style={{color: '#000000', fontWeight: 'bold'}}>Upload</Text>
            ) : null}
            {this.state.loader ? (
                <ActivityIndicator size="large" color={"#000000"} />
            ) : null}
          </TouchableOpacity>
        </View>
        { this.state.result == true ? ([
          <View style={styles.center}>
            <View>
              <Text style={{ fontWeight: 'bold' , fontSize: 18 }}>{ this.state.resultTxt }</Text>
            </View>
          </View>]
        ):null}

        <AwesomeAlert
            show={showAlert}
            title={this.state.title}
            message={this.state.message}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            cancelButtonColor="#AEDEF4"
            onCancelPressed={() => {
              this.hideAlert();
            }}
          />

        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center:{
    alignItems: 'center',
  },
  labelText:{
    fontWeight: 'bold' ,
    fontSize: 14 , 
    marginLeft: 10+'%'
  },
  firstLabelText:{
    fontWeight: 'bold' ,
    fontSize: 14 , 
    marginLeft: 10+'%',
    marginTop: 2+'%',
  },
  input: {
    borderBottomWidth: 1,
    width: 80 + '%',
    height:45,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center',
    borderBottomColor: '#c4c4c4',
    color: '#000000'
  },
  TextInputStyleClass:{
    borderBottomWidth: 1,
    width: 80 + '%',
    height:100,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center',
    marginLeft: 4, 
    borderBottomColor: '#c4c4c4',
    color: '#000000'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:10,
    width: 80 + '%',
    height: 40,
    borderRadius: 60
  },
  loginButton: {
    backgroundColor: "#00a2ff",
  },
  registerButton: {
    backgroundColor: "#000000",
  }
});