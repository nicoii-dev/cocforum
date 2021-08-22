import React from 'react';
import { View, Text, Button, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const SettingScreen = ({navigation}) => {

  const { colors } = useTheme();

  const theme = useTheme();
  
  function Logout(){
    AsyncStorage.clear();
    navigation.navigate("Auth")
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