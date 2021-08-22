import React, { useState, useEffect } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../assets/sinup_styles';
import AsyncStorage from '@react-native-community/async-storage';

export default function RegistrationScreen({navigation}) {
    const [userId, setUserId] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [newfullName, setNewFullName] = useState('')
    const [newemail, setNewEmail] = useState('')
    const [password, setPassword] = useState('')
    const [currentpassword, setCurrentPassword] = useState('')
    const [newpassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
  
    const url = "http://192.168.1.32/forum/api.php?op=";

    useEffect(()=>{
      async function getUserId(){
        AsyncStorage.getItem('userId')
        .then(data => {
            setUserId(data)
        })
      }
      getUserId();

      async function getUserData(){
      await fetch(url+"getuser&user_id="+userId)
      .then((response)=>response.json())
      .then((json)=>{
        setFullName(json[0].fullname);
        setEmail(json[0].email);
        setPassword(json[0].password)
      })
      .catch((error)=>{
          console.log(error);
      })
    }
    getUserData();
  }, )

    const onUpdateProfile = () => {
        if(!newpassword.trim() || !confirmPassword.trim() || !currentpassword.trim()){
            alert('Please enter your password');
        }else if(currentpassword != password){
            alert('Current password is incorrect')
        }else{
            if(newpassword.length < 6 || confirmPassword.length < 6){
                alert('Password must be atleast 6 characters.')
            }else if(newpassword != confirmPassword){
                alert('Password did not match');
            }else{
                fetch(url+"updateuser&user_id="+userId+"&password="+newpassword)
                .then((response)=>response.json())
                .then((json)=>{
                    alert(json.data);
                    setCurrentPassword('')
                    setNewPassword('');
                    setConfirmPassword('');
                })
            }
          
        }
    }

    const onFooterLinkPress = () => {
      navigation.goBack();
  }

  

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">

                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Current Password'
                    onChangeText={(text) => setCurrentPassword(text)}
                    value={currentpassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='New Password'
                    onChangeText={(text) => setNewPassword(text)}
                    value={newpassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                 <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm New Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />               
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onUpdateProfile()}>
                    <Text style={styles.buttonTitle}>Update password</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}><Text onPress={onFooterLinkPress} style={styles.footerLink}>Go back</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}