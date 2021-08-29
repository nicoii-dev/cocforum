import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createIconSetFromFontello } from 'react-native-vector-icons';

const SettingScreen = ({navigation}) => {
  const [token, setToken] = useState('');

    useEffect(()=>{
      async function getToken(){
        AsyncStorage.getItem('auth')
        .then(data => {
          setToken(JSON.parse(data).token)
        })
      }
      getToken();
    },)
  
  function Logout(){

     fetch('http://192.168.1.2:8000/api/logout',{
        method:'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response)=>response.json())
      .then((json)=>{
        alert(json.message)
        AsyncStorage.clear();
        navigation.navigate("Auth")
      })
  }
  function profile(){
    navigation.navigate('SettingsStack')
  }
    return (
      <View style={styles.container}>
        <Button title="Update password" onPress={profile}/>
        <Text></Text>
        <Button title="Logout" onPress={Logout} style={{}}/>
      </View>
    );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#307ecc',
    marginLeft: 30,
    marginRight: 30,
    marginBottom:10,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center',
    width:150
}
});