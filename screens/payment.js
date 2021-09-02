import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../assets/signin_styles';
import { WebView } from 'react-native-webview';

function Payment({navigation}) {

    const [showModal, setShowModal] = useState(false);
	const [cartItems, setCartItems] = useState([
        /* Sample data from walmart */
        {itemId: "501436323", name: "Power Wheels Dune Racer Extreme", thumbnailImage: "https://i5.walmartimages.com/asr/a3922e8e-2128-4603-ba8c-b58d1333253b_1.44d66337098c1db8fed9abe2ff4b57ce.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", color: "Red", qty: 1, salePrice: "105", checked: 0},
        {itemId: "35031861", name: "Better Homes & Gardens Leighton Twin Over Twin Wood Bunk Bed, Multiple Finishes", thumbnailImage: "https://i5.walmartimages.com/asr/4aedb609-4b61-4593-ad8a-cdc8c88696b1_1.3f505ce3d55db4745cf4c51d559994dc.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", qty: 1, color: "Green", salePrice: "199", checked: 0},
        {itemId: "801099131", name: "LEGO Star Wars 2019 Advent Calendar 75245 Holiday Building Kit", thumbnailImage: "https://i5.walmartimages.com/asr/9a8ea1ab-311d-455c-bda8-ce15692a8185_3.208d48e0260f80891d32b351cb116a4b.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", qty: 1, color: "Blue", salePrice: "27.99", checked: 0},
        {itemId: "42608079", name: "Little Tikes Cape Cottage Playhouse, Tan", thumbnailImage: "https://i5.walmartimages.com/asr/2654cd64-1471-44af-8b0c-1debaf598cb3_1.c30c481d1ac8fdd6aa041c0690d7214c.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", color: "Purple", qty: 1, salePrice: "129.99", checked: 0},
        {itemId: "247714372", name: "HP 14\" Laptop, Intel Core i3-1005G1, 4GB SDRAM, 128GB SSD, Pale Gold, 14-DQ1038wm", thumbnailImage: "https://i5.walmartimages.com/asr/b442f6e7-c5e1-4387-9cd9-9205811d4980_1.82b94d1c11dd12a6697bc517219f331e.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", qty: 1, color: "Black", salePrice: "269", checked: 0}
])

    const onFooterLinkPress = () => {
        navigation.navigate('RegisterScreen')
    }

    function handleResponse (data) {
        if (data.title === "success") {
          //  this.setState({ showModal: false, status: "Complete" });
        } else if (data.title === "cancel") {
           // this.setState({ showModal: false, status: "Cancelled" });
        } else {
            return;
        }
    }

    const htmlContent = `
            
                <!DOCTYPE html>
                <html lang="en">
                <head>
                </head>

                <body style="font-size:50">
                    ${cartItems.map((item,i) =>({
                      
                    }))
                      
                    }
                </body>

                </html>

            `

    return (
      <View style={styles.container}>
      <KeyboardAwareScrollView
          style={{ flex: 1, width: '100%' }}
          keyboardShouldPersistTaps="always">

                <Modal
                    visible={showModal}
                    onRequestClose={() => setShowModal(false)}
                >
                    
                    <WebView
                        source={{ uri: "http://192.168.1.2:8000/paypal" }}
                        onNavigationStateChange={data => handleResponse(data)}
                        injectedJavaScript={`document.getElementById('loophole').innerHTML=${cartItems};document.pay.submit()`}
                    />
{/*
                    <WebView
                        javaScriptEnabled={true}
                        style={{ flex: 1}}
                        originWhitelist={['*']}
                        source={{ html: htmlContent}}
                        injectedJavaScript={''}
                        
                    />*/}
                </Modal>


               <Image
                    style={styles.logo}
                    
                />
           <Text>$100</Text>

          <Text>$100</Text>
          <TouchableOpacity
              style={styles.button}
              onPress={()=> setShowModal(true)}>
              <Text style={styles.buttonTitle}>Pay</Text>
          </TouchableOpacity>

      </KeyboardAwareScrollView>
  </View>
    );
  }


  export default Payment;