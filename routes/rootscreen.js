import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/homescreen';
import SettingsScreen from '../screens/settingsscreen';
import Payment from '../screens/payment';
import Cart from '../screens/cart';

const Tab = createBottomTabNavigator();

const RootStackScreen = (props) => (

      <Tab.Navigator>
        <Tab.Screen name="HomeScreen" options={{tabBarLabel: 'Home Screen', title: 'Forum', //Set Header Title
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },}} component={HomeScreen} />

        <Tab.Screen name="SettingsScreen" options={{tabBarLabel: 'Settings Screen', title: 'Settings', //Set Header Title
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },}} component={SettingsScreen} />

        <Tab.Screen name="Cart" options={{tabBarLabel: 'Payment Screen', title: 'Cart', //Set Header Title
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },}} component={Cart} />

          <Tab.Screen name="Payment" options={{tabBarLabel: 'Payment Screen', title: 'Cart', //Set Header Title
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },}} component={Payment} />
          
      </Tab.Navigator>

);

export default RootStackScreen;