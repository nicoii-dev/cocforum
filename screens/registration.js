import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../assets/sinup_styles';

export default function RegistrationScreen({navigation}) {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    

    const url = "http://192.168.1.32/forum/api.php?op=";

    const onRegisterPress = () => {

        if(!fullName.trim()) {
            alert('Please enter your Full name');
        }else if(!email.trim()){
            alert('Please enter your Email');
        }else if(!password.trim() || !confirmPassword.trim()){
            alert('Please enter your password');
        }else{
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (reg.test(email) === false) {
              alert("Email is not correct.")
              return false;
            }
            else {
                if(password.length < 6 || confirmPassword.length < 6){
                    alert('Password must be atleast 6 characters.')
                }else if(password != confirmPassword){
                    alert('Password did not match');
                }else{
                    var operation = url+"register"
                    fetch(operation,{
                        method:'post',
                        headers:{
                            'Content-Type':'application/x-www-form-urlencoded'
                        },
                        body:"fullname="+fullName+"&email="+email+"&password="+password
                    })
                    .then((response)=>response.json())
                    .then((json)=>{
                        alert(json.data);
                        setFullName('');
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                    })
                }
            }
        } 
    }

    const onFooterLinkPress = () => {
      navigation.navigate('LoginScreen')
  }
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">

                <TextInput
                    style={styles.input}
                    placeholder='Full Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}