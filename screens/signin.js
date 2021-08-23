import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../assets/signin_styles';
import AsyncStorage from '@react-native-community/async-storage';

function Signin({navigation}) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const url = "http://192.168.1.2/forum/api.php?op=";
  


  const onLoginPress = () => {
    if(!email.trim()){
        alert('Please enter your Email');
    }else if(!password.trim()){
        alert('Please enter your password');
    }else{
            var operation = url+"login"
            fetch(operation,{
                method:'post',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                body:"email="+email+"&password="+password
            })
            .then((response)=>response.json())
            .then((json)=>{
                if(json.data == 0){
                    alert("Email or Password is incorrect");
                }else{
                        try {
                            AsyncStorage.setItem('userId', json.data)
                        }catch (err){
                            console.log(err)
                        }
                    navigation.replace('TabNavigation');
                }
                
            })
    }

  }
    const onFooterLinkPress = () => {
        navigation.navigate('RegisterScreen')
    }

    return (
      <View style={styles.container}>
      <KeyboardAwareScrollView
          style={{ flex: 1, width: '100%' }}
          keyboardShouldPersistTaps="always">
               <Image
                    style={styles.logo}
                    
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
          <TouchableOpacity
              style={styles.button}
              onPress={() => onLoginPress()}>
              <Text style={styles.buttonTitle}>Log in</Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
              <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
          </View>
      </KeyboardAwareScrollView>
  </View>
    );
  }


  export default Signin;