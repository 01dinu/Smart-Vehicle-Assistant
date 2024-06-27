import React, { Component } from 'react';
import {  View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    
    const { params } = this.props.navigation.state;

    this.state = {
        results: params.result,
        resultMain: params.resultMain,
        resultTxt: params.resultTxt,
        message:'',
        showAlert: false,
        title:''
    };

  }

  static navigationOptions = ({navigation}) => ({
    title: 'Results Page',
    headerStyle: {
      backgroundColor: '#00a2ff',
      elevation: 0,
    },
    headerTintColor: '#ffffff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 24,
    }
  });

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };
 
  hideAlert = () => {
    this.setState({
      showAlert: false,
      message: '',
      title: ''
    });
  };

  render() {
    const {showAlert} = this.state;
    return (
      <View style={styles.container}>
        <Image
            source={require('./../assets/logo.png')}
            style={{ width: 200, height: 200, marginBottom: 50, marginTop: 10 }}
          />

        <View style={styles.center}>
            <Text style={{ fontWeight: 'bold' , fontSize: 24 , marginBottom: 20}}>{ this.state.resultMain }</Text>
        </View>
        <View style={styles.center}>
            <Text style={{ fontSize: 12 , marginBottom: 20 , marginLeft: 15 ,marginRight: 15}}>{ this.state.resultTxt }</Text>
        </View>

        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() =>  this.props.navigation.navigate('HomePage')}>
          <Text style={{color: '#ffffff', fontWeight: 'bold'}}>Back to Home Page</Text>
        </TouchableOpacity>

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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  input: {
    borderBottomWidth: 1,
    width: 80 + '%',
    height:45,
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
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 80,
    height: 80,
  },
  registerButton: {
    backgroundColor: "#4ff47c",
  }
});