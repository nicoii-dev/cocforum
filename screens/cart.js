import React, { useEffect, useState } from 'react'
import { StyleSheet, Button, Text, View, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { Icon } from 'react-native-elements'
import { WebView } from 'react-native-webview';

function Cart ({route, navigation}) {
	const [cartItems, setCartItems] = useState([
			/* Sample data from walmart */
			{itemId: "501436323", name: "Power Wheels Dune Racer Extreme", thumbnailImage: "https://i5.walmartimages.com/asr/a3922e8e-2128-4603-ba8c-b58d1333253b_1.44d66337098c1db8fed9abe2ff4b57ce.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", color: "Red", qty: 1, salePrice: "105", checked: 0},
			{itemId: "35031861", name: "Better Homes & Gardens Leighton Twin Over Twin Wood Bunk Bed, Multiple Finishes", thumbnailImage: "https://i5.walmartimages.com/asr/4aedb609-4b61-4593-ad8a-cdc8c88696b1_1.3f505ce3d55db4745cf4c51d559994dc.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", qty: 1, color: "Green", salePrice: "199", checked: 0},
			{itemId: "801099131", name: "LEGO Star Wars 2019 Advent Calendar 75245 Holiday Building Kit", thumbnailImage: "https://i5.walmartimages.com/asr/9a8ea1ab-311d-455c-bda8-ce15692a8185_3.208d48e0260f80891d32b351cb116a4b.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", qty: 1, color: "Blue", salePrice: "27.99", checked: 0},
			{itemId: "42608079", name: "Little Tikes Cape Cottage Playhouse, Tan", thumbnailImage: "https://i5.walmartimages.com/asr/2654cd64-1471-44af-8b0c-1debaf598cb3_1.c30c481d1ac8fdd6aa041c0690d7214c.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", color: "Purple", qty: 1, salePrice: "129.99", checked: 0},
			{itemId: "247714372", name: "HP 14\" Laptop, Intel Core i3-1005G1, 4GB SDRAM, 128GB SSD, Pale Gold, 14-DQ1038wm", thumbnailImage: "https://i5.walmartimages.com/asr/b442f6e7-c5e1-4387-9cd9-9205811d4980_1.82b94d1c11dd12a6697bc517219f331e.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF", qty: 1, color: "Black", salePrice: "269", checked: 0}
	])

	const [checkOutItems, setCheckOutItems] = useState([]);
	const [showModal, setShowModal] = useState(false);


	selectHandler = (index, value) => {
		const newItems = [...cartItems]; // clone the array 
		newItems[index]['checked'] = value == 1 ? 0 : 1; // set the new value 
		setCartItems(newItems);// set new state
	}
	
	
	quantityHandler = (action, index) => {
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

	subtotalPrice = () => {
		const newItems = [...cartItems];
		if(newItems){
			return newItems.reduce((sum, item) => sum + (item.checked == 1 ? item.qty * item.salePrice : 0), 0 );
		}
		return 0;
	}

	checkOut = () =>{
		const newItems = [...cartItems]; // clone the array
		let checkItems = [];
		for (var i = 0; i < newItems.length; i++) {
			if(newItems[i].checked == 1){
				checkItems.push({"itemId":newItems[i].itemId, "name":newItems[i].name,"thumbnailImage":newItems[i].thumbnailImage,"color": newItems[i].color, "qty":newItems[i].qty, "salePrice":newItems[i].salePrice})
			}
		}
		console.log(checkItems);
		setShowModal(true);
		setCheckOutItems(checkItems);
	}

		const htmlContent = `
            
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
				<meta http-equiv="X-UA-Compatible" content="ie=edge">
				<title>Paypal Payment</title>
				<!-- Latest compiled and minified CSS -->
				<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

				<!-- jQuery library -->
				<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

				<!-- Latest compiled JavaScript -->
				<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
			</head>

			<body>
				<section class="pt-5 pb-5">
				<div class="container">
				<div class="row w-100">
					<div class="col-lg-12 col-md-12 col-12">
						<h3 class="display-5 mb-2 text-center">Shopping Cart</h3>
						<p class="mb-5 text-center">
							<i class="text-info font-weight-bold">3</i> items in your cart</p>
						<table id="shoppingCart" class="table table-condensed table-responsive">
							<thead>
								<tr>
									<th style="width:60%">Product</th>
									<th style="width:12%">Price</th>
									<th style="width:10%">Quantity</th>
									<th style="width:16%"></th>
								</tr>
							</thead>
							<tbody>
							${
								checkOutItems.map((item, i) => (
									`
									<tr>
										<td data-th="Product">
											<div class="row">
												<div class="col-md-3 text-left">
													<img src=${item.thumbnailImage} alt="" class="img-fluid d-none d-md-block rounded mb-2 shadow ">
												</div>
												<div class="col-md-9 text-left mt-sm-2">
													<h4>Product Name</h4>
													<p class="font-weight-light">${item.name}</p>
												</div>
											</div>
										</td>
										<td data-th="Price">$${item.salePrice}</td>
										<td data-th="Quantity">
											<input type="number" class="form-control form-control-lg text-center" value=${item.qty}>
										</td>
										<td class="actions" data-th="">
										</td>
									</tr>

									`
								))
							}

							</tbody>
						</table>
						<div class="float-right text-right">
							<h4>Subtotal:</h4>
							<h1>$${subtotalPrice()}</h1>
						</div>
					</div>
				</div>
				<div class="row mt-4 d-flex align-items-center">
				
					<div id="paypal-payment-button">
					</div>

					<button onclick=me()>aa</button>

				</div>
			</div>
			</section>

			

			<script src="https://www.paypal.com/sdk/js?client-id=ATZKBUfrjxQCsY9zvAEqt70hBOd5OPgy7xVgWWK21sjnsfqY433imCvsx0i5rT58VXQhq2ga273BXZNw&disable-funding=credit,card">

			</script>
			<script>
				function me(){
					alert(1)
				}
				paypal.Buttons({
					style : {
						color: 'blue',
						shape: 'pill'
					},
					createOrder: function (data, actions) {
						return actions.order.create({
							purchase_units : [{
								amount: {
									value: '0.1'
								}
							}]
						});
					},
					onApprove: function (data, actions) {
						return actions.order.capture().then(function (details) {
							console.log(details)
						  //  window.location.replace("http://localhost:63342/tutorial/paypal/success.php")
						})
					},
					onCancel: function (data) {
						//window.location.replace("http://localhost:63342/tutorial/paypal/Oncancel.php")
					}
				}).render('#paypal-payment-button');
		
			</script>

			</body>
		</html>

	`; 

	const injectedJavaScript = ``
		

		
		//const { cartItems, cartItemsIsLoading, selectAll } = this.state;
		
		return (
			<View style={{flex: 1, backgroundColor: '#f6f6f6'}}>

				<Modal
                    visible={showModal}
                    onRequestClose={() => setShowModal(false)}
                >
                   { <WebView
                        javaScriptEnabled={true}
                        style={{ flex: 1}}
                        originWhitelist={['*']}
                        source={{ html: htmlContent}}
                        injectedJavaScript={''}
                        
                    />}
                </Modal>

					<ScrollView>	
						{cartItems && cartItems.map((item, i) => (
							<View key={i} style={{flexDirection: 'row', backgroundColor: '#fff', marginBottom: 2, height: 120}}>
								<View style={[styles.centerElement, {width: 60}]}>
									<TouchableOpacity style={[styles.centerElement, {width: 32, height: 32}]} onPress={() => selectHandler(i, item.checked)}>
										{item.checked == 1? <View><Icon name="checkroom"/></View>:<Text>No</Text>}
										
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
								<Text>Select All</Text>
								<View style={{flexDirection: 'row', paddingRight: 20, alignItems: 'center'}}>
									<Text style={{color: '#8f8f8f'}}>SubTotal: </Text>
									<Text>${subtotalPrice()}</Text>
								</View>
							</View>
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'flex-end', height: 32, paddingRight: 20, alignItems: 'center'}}>
							<TouchableOpacity style={[styles.centerElement, {backgroundColor: '#0faf9a', width: 100, height: 25, borderRadius: 5}]} onPress={()=>checkOut()}>
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