import React, { useEffect, useState } from 'react'
import { StyleSheet, Button, Text, View, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { Icon } from 'react-native-elements'
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';

function Cart ({route, navigation}) {

	const [cartItems, setCartItems] = useState([
			/* Sample data from walmart */
			{itemId: "501436323", name: "Power Wheels Dune Racer Extreme", thumbnailImage: "https://i5.walmartimages.com/asr/a3922e8e-2128-4603-ba8c-b58d1333253b_1.44d66337098c1db8fed9abe2ff4b57ce.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", color: "Red", qty: 1, salePrice: "105", checked: 0},
			{itemId: "35031861", name: "Better Homes & Gardens Leighton Twin Over Twin Wood Bunk Bed, Multiple Finishes", thumbnailImage: "https://i5.walmartimages.com/asr/4aedb609-4b61-4593-ad8a-cdc8c88696b1_1.3f505ce3d55db4745cf4c51d559994dc.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", qty: 1, color: "Green", salePrice: "199", checked: 0},
			{itemId: "801099131", name: "LEGO Star Wars 2019 Advent Calendar 75245 Holiday Building Kit", thumbnailImage: "https://i5.walmartimages.com/asr/9a8ea1ab-311d-455c-bda8-ce15692a8185_3.208d48e0260f80891d32b351cb116a4b.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", qty: 1, color: "Blue", salePrice: "27.99", checked: 0},
			{itemId: "42608079", name: "Little Tikes Cape Cottage Playhouse, Tan", thumbnailImage: "https://i5.walmartimages.com/asr/2654cd64-1471-44af-8b0c-1debaf598cb3_1.c30c481d1ac8fdd6aa041c0690d7214c.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", color: "Purple", qty: 1, salePrice: "129.99", checked: 0},
	])
    const [count, setCount] = useState(0)//for re-rendering
	const [checkOutItems, setCheckOutItems] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [total, setTotal] = useState(1);
	const [auth, setAuth] = useState([]);
	const [orderId, setOrderId] = useState('');

    useEffect(()=>{
      async function getAuth(){
        AsyncStorage.getItem('auth')
        .then(data => {
            setAuth(data)
        })
      }
      getAuth();
    },[count])

	function selectHandler(index, value){
		const newItems = [...cartItems]; // clone the array 
		newItems[index]['checked'] = value == 1 ? 0 : 1; // set the new value 
		setCartItems(newItems);// set new state
	}
	
	
	function quantityHandler(action, index){
		const newItems = [...cartItems]; // clone the array 
		
		let currentQty = newItems[index]['qty'];
		
		if(action == 'more'){
			newItems[index]['qty'] = currentQty + 1;
		} else if(action == 'less'){
			newItems[index]['qty'] = currentQty > 1 ? currentQty - 1 : 1;
		}
		setCartItems(newItems);
		//this.setState({ cartItems: newItems }); // set new state
	}

	function subtotalPrice(){
		const newItems = [...cartItems];
		if(newItems){
			return newItems.reduce((sum, item) => sum + (item.checked == 1 ? item.qty * item.salePrice : 0), 0 );
		}
		return 0;
	}

	function checkOut(){
		if(subtotalPrice() == 0){
			alert("Please select item(s) to be paid");
		}else{
			fetch('http://192.168.1.2:8000/api/order',{
                method:'POST',
                headers:{
                    'Authorization': `Bearer ${JSON.parse(auth).token}`,
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"description":"description","grand_total":subtotalPrice(),"payment_type":"paypal", "payment_status":"pending"})
            })
            .then((response)=>response.json())
            .then((json)=>{
				setOrderId(json.id);

				const newItems = [...cartItems]; // clone the array
				let checkItems = [];
				for (var i = 0; i < newItems.length; i++) {
					if(newItems[i].checked == 1){
						checkItems.push({"order_id":json.id,"itemId":newItems[i].itemId, "name":newItems[i].name,"thumbnailImage":newItems[i].thumbnailImage,"color": newItems[i].color, "qty":newItems[i].qty, "price":newItems[i].salePrice})
					}
				}
				setShowModal(true);
				setCheckOutItems(checkItems);
					fetch('http://192.168.1.2:8000/api/orderdetails',{
						method:'POST',
						headers:{
							'Authorization': `Bearer ${JSON.parse(auth).token}`,
							'Accept': 'application/json',
							'Content-Type':'application/json'
						},
						body:JSON.stringify({"orders":checkItems})
					})
					.then((response)=>response.json())
					.then((json)=>{
						console.log(json);
					})
            })

			
		}
	}

	function handleResponse (data) {
		console.log(data);
        if (data.title === "success") {
			alert("Payment is successful.");
				fetch('http://192.168.1.2:8000/api/order/'+orderId,{
					method:'POST',
					headers:{
						'Authorization': `Bearer ${JSON.parse(auth).token}`,
						'Accept': 'application/json',
						'Content-Type':'application/json'
					},
					body:JSON.stringify({"payment_status":"paid"})
				})
				.then((response)=>response.json())
				.then((json)=>{
					//console.log(json);
				})
          	setShowModal(false);
        } else if (data.title === "cancel") {
			alert("Transaction cancelled.");
				fetch('http://192.168.1.2:8000/api/order/'+orderId,{
					method:'DELETE',
					headers:{
						'Authorization': `Bearer ${JSON.parse(auth).token}`,
					},
				})
				.then((response)=>response.json())
				.then((json)=>{
					//console.log(json);
				})
			setShowModal(false);
        } else {
            return;
        }
    }
		
		//const { cartItems, cartItemsIsLoading, selectAll } = this.state;
		
		return (
			<View style={{flex: 1, backgroundColor: '#f6f6f6'}}>

				<Modal
                    visible={showModal}
                    onRequestClose={() => setShowModal(false)}
                >

					<WebView
                        source={{ uri: "http://192.168.1.2:8000/paypal"}}
                        onNavigationStateChange={data => handleResponse(data)}
                        injectedJavaScript={`
							document.getElementById('total').innerHTML="${subtotalPrice()}";
							document.getElementById('total_value').value="${subtotalPrice()}"
						`}
                    />
                </Modal>

					<ScrollView>	
						{cartItems && cartItems.map((item, i) => (
							<View key={i} style={{flexDirection: 'row', backgroundColor: '#fff', marginBottom: 2, height: 120}}>
								<View style={[styles.centerElement, {width: 60}]}>
									<TouchableOpacity style={[styles.centerElement, {width: 32, height: 32}]} onPress={() => selectHandler(i, item.checked)}>
										{item.checked == 1? <View><Text style={{height:25,width:25,borderRadius:10,backgroundColor: '#00CC66'}}></Text></View>:
										<Text style={{height:25,width:25,borderRadius:10,backgroundColor: '#C0C0C0'}}></Text>}
									</TouchableOpacity>
						
								</View>
								<View style={{flexDirection: 'row', flexGrow: 1, flexShrink: 1, alignSelf: 'center'}}>
									<TouchableOpacity onPress={() => {/*this.props.navigation.navigate('ProductDetails', {productDetails: item})*/}} style={{paddingRight: 10}}>
										<Image source={{uri: item.thumbnailImage}} style={[styles.centerElement, {height: 60, width: 60, backgroundColor: '#eeeeee'}]} />
									</TouchableOpacity>
									<View style={{flexGrow: 1, flexShrink: 1, alignSelf: 'center'}}>
										<Text numberOfLines={1} style={{fontSize: 15}}>{item.name}</Text>
										<Text numberOfLines={1} style={{color: '#8f8f8f'}}>{item.color ? 'Variation: ' + item.color : ''}</Text>
                    		<Text numberOfLines={1} style={{color: '#333333', marginBottom: 10}}>${item.qty * item.salePrice}</Text>
										<View style={{flexDirection: 'row'}}>
											<TouchableOpacity onPress={() => quantityHandler('less', i)} style={{ borderWidth: 1, borderColor: '#cccccc' }}>
												<Text style={{width:20,textAlign:'center',fontWeight:'bold'}}>-</Text>
												
											</TouchableOpacity>
											<Text style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#cccccc', paddingHorizontal: 7, paddingTop: 3, color: '#bbbbbb', fontSize: 13 }}>{item.qty}</Text>
											<TouchableOpacity onPress={() => quantityHandler('more', i)} style={{ borderWidth: 1, borderColor: '#cccccc' }}>
												<Text style={{width:20,textAlign:'center',fontWeight:'bold'}}>+</Text>
											</TouchableOpacity>
										</View>
									</View>
									
								</View>
							</View>
						))}

						<View style={{flexDirection: 'row'}}>
							<View style={{flexDirection: 'row', flexGrow: 1, flexShrink: 1, justifyContent: 'space-between', alignItems: 'center'}}>
								<Text></Text>
								<View style={{flexDirection: 'row', paddingRight: 20, alignItems: 'center'}}>
									<Text style={{color: '#8f8f8f'}}>SubTotal: </Text>
									<Text>${subtotalPrice()}</Text>
								</View>
							</View>
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'flex-end', height: 40, paddingRight: 20, alignItems: 'center'}}>
							<TouchableOpacity style={[styles.centerElement, {backgroundColor: '#0faf9a', width: 100, height: 30, borderRadius: 5}]} onPress={()=>checkOut()}>
								<Text style={{color: '#ffffff'}}>Checkout</Text>
							</TouchableOpacity>
						</View>

					</ScrollView>
			</View>
		);
	}


	const styles = StyleSheet.create({
		centerElement: {justifyContent: 'center', alignItems: 'center'},
	});

export default Cart