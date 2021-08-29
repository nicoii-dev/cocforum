import React, { useEffect, useState } from 'react'
import { Button, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Pressable} from 'react-native'
import {Dialog, HelperText, Portal} from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage';
import {Text,Card} from 'react-native-elements';
import axios from 'axios';

function HomeScreen({ route,navigation }) {
    const [listData, setlistData] = useState([])
    const [title, setTitle] = useState('')
    const [thread, setThread] = useState('')
    const [thread_id, setThread_id] = useState('')
    const [newTitle, setnewTitle] = useState('')
    const [newThread, setnewThread] = useState('')
    const [count, setCount] = useState(0)//for re-rendering
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)//for modal DELETE
    
    const [auth, setAuth] = useState([]);
    
    useEffect(()=>{
        async function DataList(){
            axios
            .get("http://192.168.1.2:8000/api/post")
            .then(function (response) {
              // handle success
              setlistData(response.data);
            })
         
      }
      async function getAuth(){
        AsyncStorage.getItem('auth')
        .then(data => {
            setAuth(data)
        })
      }
      DataList();
      getAuth();
    },[count])

    function addThread(){
        if(title == '' || thread == ''){
            alert('Please fill out all fields');
        }else{
            fetch('http://192.168.1.2:8000/api/post',{
                method:'POST',
                headers:{
                    'Authorization': `Bearer ${JSON.parse(auth).token}`,
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"title":title,"post":thread,"user_id":JSON.parse(auth).user_id})
            })
            .then((response)=>response.json())
            .then((json)=>{
               listData.push({"id":json.id,"user_id":json.user_id,"title":json.title,"post":json.post})
               setTitle('');
               setThread('');
               setVisible(false)
            })
        }
    }

    function onLongPress(thread_id, user_id, title, thread){
        if(JSON.parse(auth).user_id == user_id){
            setModalVisible(true)
            setThread_id(thread_id)
            setnewTitle(title)
            setnewThread(thread)
        }

    }

    function cancelClicked(){
        setModalVisible(!modalVisible);
        setnewTitle('');
    }

    function editClicked(){
        setVisible(true)
        setModalVisible(false)
        setTitle(newTitle)
        setThread(newThread)
    }

    function UpdateThread(){
        if(title == '' || thread == ''){
            alert('Please fill out all fields');
        }else{
            fetch('http://192.168.1.2:8000/api/post/'+thread_id,{
                method:'PUT',
                headers:{
                    'Authorization': `Bearer ${JSON.parse(auth).token}`,
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"title":title,"post":thread})
            })
            .then((response)=>response.json())
            .then((json)=>{
                listData.some(function(obj){
                    if (obj.id == json.id){
                         //change the value here
                         obj.title = json.title;
                         obj.post = json.post;
                         return true;    //breaks out of he loop
                        
                    }
                   
                 });
                 alert("Updated successfully.")
                setTitle('');
                setThread('');
                setnewTitle('');
                setVisible(false)
            })
        }
    }

    function deleteClicked(){
        setDeleteModal(true)
        setModalVisible(false)
    }

    function cancelDelete(){
        setDeleteModal(false)
    }

    function deleteThread(){
        fetch('http://192.168.1.2:8000/api/post/'+thread_id,{
            method:'DELETE',
            headers:{
                'Authorization': `Bearer ${JSON.parse(auth).token}`,
            },
        })
        .then((response)=>response.json())
        .then((json)=>{
            if(json == "1"){
                for (var i = 0; i < listData.length; i++) {
                    if(listData[i].id == thread_id){
                            listData.splice(i, 1);
                    }
                }
                alert("Data deleted successfully.")
            }else{
                alert("Something went wrong.")
            }
            setDeleteModal(false)
        })
    }

    return (

        <View style={styles.container}>
            {/* Added this scroll view to enable scrolling when list gets longer than the page */}
            <ScrollView >
                {
                listData.slice(0).reverse().map((item, index) => {
                    return(
                        <Card style={styles.containerCard}key={index}>
                            <View style={styles.subContainer} >
                                <TouchableOpacity
                                        onPress={() => navigation.navigate("ThreadInfo",{
                                            screen: 'ThreadScreen',
                                            params: { post_id: item.id , token:JSON.parse(auth).token, user_id:JSON.parse(auth).user_id}
                                            })} 
                                        onLongPress={()=>{onLongPress(item.id, item.user_id, item.title, item.post)}}>
                                    <View>
                                        <Text h4>{item.title}</Text>
                                    </View>
                                    <View>
                                        <Text h5>{item.post}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    )
                })}
            </ScrollView>

               {/*MODAL FOR EDIT*/}
               <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable style={styles.buttonModal}
                        onPress={() => editClicked()}
                        >
                            <Text style={{padding:10, textAlign:'center', color:'blue'}}>Edit</Text>
                        </Pressable>
                        <Pressable style={styles.buttonModal}
                        onPress={() => deleteClicked()}
                        >
                            <Text style={{padding:10, textAlign:'center', color:'red'}}>Delete</Text>
                        </Pressable >
                        <Pressable 
                        onPress={() => cancelClicked()}
                        >
                            <Text style={{padding:10, color:'blue'}}>Cancel</Text>
                        </Pressable >
                    </View>
                    </View>
                </Modal>
           </View>

             {/**MODAL FOR DELETE*/}
             <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={deleteModal}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setDeleteModal(!deleteModal);
                    }}
                >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <Text style={{fontWeight:'bold', fontSize:20}}>Delete Thread</Text>
                    <Text style={{marginTop:10, borderBottomWidth: .5}}>Are you sure you want to permanently remove this Thread?</Text>
                        <Pressable style={styles.buttonModal}
                        onPress={() => cancelDelete()}
                        >
                            <Text style={{padding:10, textAlign:'center', color:'blue'}}>No</Text>
                        </Pressable>
                        <Pressable style={{}}
                        onPress={() => deleteThread()}
                        >
                            <Text style={{padding:10, textAlign:'center', color:'red'}}>Yes</Text>
                        </Pressable >
                    </View>
                    </View>
                </Modal>
           </View>


            <View style={styles.buttonFrame}>
                
                <TouchableOpacity 
                    onPress={() => setVisible(true)}
                    style={styles.button}
                    mode="outlined">
                    <Text style={styles.buttonTitle}>Add thread</Text>
                </TouchableOpacity>
            </View>

            <Portal>
                <Dialog visible={visible} onDismiss={() => {
                    setVisible(false);
                    setTitle('');
                    setThread('');
                    setnewTitle('');
                    }}>
                {newTitle?<Dialog.Title>Update thread</Dialog.Title> : <Dialog.Title>Add new thread</Dialog.Title>}
                <Dialog.Content>
                    <View/>
                    <TextInput
                   
                    autoFocus={true}
                    style={{borderBottomWidth:.6}}
                    label="title"
                    placeholder="title"
                    onChangeText={text => {
                        setTitle(text);
                    }}>
                    {title}
                    </TextInput>
                    <View/>
                    <TextInput
                    style={{borderBottomWidth:.5}}
                    label="description"
                    placeholder="description"
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={text => {
                        setThread(text);
                    }}>
                    {thread}
                    </TextInput>
                    <HelperText type="error"></HelperText>
                </Dialog.Content>

                <Dialog.Actions>
                    {newTitle?
                    <TouchableOpacity style={styles.btn} onPress={UpdateThread}>
                        <Text>Update thread</Text>
                    </TouchableOpacity>    
                    :                    
                    <TouchableOpacity style={styles.btn} onPress={addThread}>
                       <Text>Add thread</Text>
                    </TouchableOpacity>
                    }
                   <TouchableOpacity style={styles.btn}
                        onPress={() => {
                            setVisible(false);
                            setTitle('');
                            setThread('');
                            setnewTitle('');
                        }}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </Dialog.Actions>
                </Dialog>
            </Portal>
        
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E8EAED',
    },
    containerCard: {
        flex: 1,
        padding: 20,
        backgroundColor:'gray'
      },
      subContainer: {
        flex: 1,
        paddingBottom: 15,
        borderBottomColor: '#CCCCCC',
    },    
    tasksWrapper: {
      paddingTop: 80,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold'
    },
    items: {
      marginTop: -30,
    },
    btn: {
        height: 50,
        paddingTop: 6,
        marginLeft: 16,
        marginRight: 16,
      },
      button: {
        backgroundColor: '#307ecc',
        marginLeft: 30,
        marginRight: 30,
        marginBottom:10,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    writeTaskWrapper: {
      position: 'absolute',
      bottom: 60,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    input: {
      paddingVertical: 15,
      paddingHorizontal: 15,
      backgroundColor: '#FFF',
      borderRadius: 10,
      borderColor: '#C0C0C0',
      borderWidth: 1,
      width: 250,
      height:50,
      maxHeight:80
    },
    addWrapper: {
      width: 60,
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#C0C0C0',
      borderWidth: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        padding:10,
        marginTop: 22
      },
      modalView: {
        backgroundColor: "white",
        borderRadius: 10, 
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      buttonModal: {
        textAlign:'center',
        borderBottomWidth: .5,
        width:"100%",
        marginBottom:5,
      },
      buttonModal: {
        textAlign:'center',
        borderBottomWidth: .5,
        width:"100%",
        marginBottom:5,
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
  });

export default HomeScreen