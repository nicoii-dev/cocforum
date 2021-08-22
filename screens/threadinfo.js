import React, {useState, useEffect} from 'react';
import { ScrollView, View, StyleSheet, StatusBar, TouchableOpacity, KeyboardAvoidingView, TextInput, Modal, Pressable} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { List, ListItem, Text, Card, Button } from 'react-native-elements';
import Clipboard from '@react-native-clipboard/clipboard';

function TheadInfo ({route,navigation}){
    const [textHeight, setTextHeight] = useState('')
    const { thread_id, otherParam } = route.params;
    const [title, setTitle] = useState('')
    const [thread, setThread] = useState('')
    const [author, setAuthor] = useState('')
    const [commentList, setCommentList] = useState([])
    const [comment, setComment] = useState('')
    const [comment_id, setComment_id] = useState('')
    const [newComment, setNewCommet] = useState('')
    const [userId, setUserId] = useState('')
    const [count, setCount] = useState(0)//for re-rendering
    const [modalVisible, setModalVisible] = useState(false)//for modal EDIT
    const [deleteModal, setDeleteModal] = useState(false)//for modal DELETE
    const [copyCommentModal, setCopyCommentModal] = useState(false)//for copying comments
    const [boolFocus, setBoolFocus] = useState(false)//for editing comments
    const [editSelected, setEditSelected] = useState(false)
    const url = "http://192.168.1.32/forum/api.php?op=";

    useEffect(()=>{
        async function getThread(){
        await fetch(url+"thread&thread_id="+thread_id)
        .then((response)=>response.json())
        .then((json)=>{
            setTitle(json[0].title)
            setThread(json[0].thread)
            setAuthor(json[0].fullname)  
           
        })
        .catch((error)=>{
            console.log(error);
        })
      }
      async function getComments(){
        await fetch(url+"getcomments&thread_id="+thread_id)
        .then((response)=>response.json())
        .then((json)=>{
            setCommentList(json)
        })
        .catch((error)=>{
            console.log(error);
        })
      }
      async function getUserId(){
        AsyncStorage.getItem('userId')
        .then(data => {
            setUserId(data)
        })
      }
      getUserId();
      getThread();
      getComments();
    }, [count])

   function addComment(){
        if(comment == ''){
            alert('Please fill out empty fields');
        }else{
            var operation = url+"comments"
            fetch(operation,{
                method:'post',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                body:"comment="+comment+"&thread_id="+thread_id+"&user_id="+userId
            })
            .then((response)=>response.json())
            .then((json)=>{
                setComment('');
                setCount(count+1);
            })
        }
    }


    function onLongPress(comment_id, comment, user_id){
        setComment_id(comment_id)
        setNewCommet(comment)
        if(user_id == userId){
            setModalVisible(true);
        }else{
            setCopyCommentModal(true)
        }

    }

    function editClicked(){
        setComment(newComment);
        setModalVisible(false);
        setBoolFocus(!boolFocus);
        setEditSelected(true);
    }

    function cancelEdit(){
        setEditSelected(false);
        setComment('');
    }

    function UpdateComment(){
        fetch(url+"updatecomment&comment_id="+comment_id+"&comment="+comment)
        .then((response)=>response.json())
        .then((json)=>{
            setComment('');
            setComment_id('');
            setCount(count+1);
            setEditSelected(false);
            setBoolFocus(false)
        })

    }
    
    function deleteClicked(){
        setDeleteModal(true)
        setModalVisible(false)
    }

    function cancelDelete(){
        setDeleteModal(false)
    }

    function deleteComment(){
        fetch(url+"deletecomment&comment_id="+comment_id)
        .then((response)=>response.json())
        .then((json)=>{
            setComment('');
            setComment_id('');
            setCount(count+1);
            setEditSelected(false);
            setBoolFocus(false)
            setDeleteModal(false)
        })
    }

    function CopyToClipboard(){
        Clipboard.setString(newComment)
        setCopyCommentModal(false)
    }


    return (
        <View style={{flex:1}}>
            <ScrollView >
                <Card style={styles.container}>
                    <View style={styles.subContainer}>
                        <TouchableOpacity>
                            <View>
                                <Text h4>{title}</Text>
                            </View>
                            <View>
                                <Text h5>{thread}</Text>
                            </View>
                            <View style={{paddingTop:10}}>
                                <Text style={{textAlign:'right', marginTop:10}}>posted by: <Text style={{fontWeight:'bold'}}>{author}</Text></Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View>
                    {
                      
                        commentList.map((item, index) => {
                            return(
                            <View key={index}>
                                <TouchableOpacity style={styles.comment} onLongPress={() => onLongPress(item.comment_id, item.comment, item.user_id)}>
                                    <Text style={{fontWeight:'bold'}}>{item.fullname}</Text>
                                    <Text style={{}} >{item.comment}</Text>
                                </TouchableOpacity>
                            </View>
                            )
                        })
                  
                    }  
                    </View> 
            
                </Card>
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
                        onPress={() => setModalVisible(!modalVisible)}
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
                    <Text style={{fontWeight:'bold', fontSize:20}}>Delete Comment</Text>
                    <Text style={{marginTop:10}}>Are you sure you want to permanently remove this comment?</Text>
                        <Pressable style={{}}
                        onPress={() => cancelDelete()}
                        >
                            <Text style={{padding:10, textAlign:'center', color:'blue'}}>No</Text>
                        </Pressable>
                        <Pressable style={{}}
                        onPress={() => deleteComment()}
                        >
                            <Text style={{padding:10, textAlign:'center', color:'red'}}>Yes</Text>
                        </Pressable >
                    </View>
                    </View>
                </Modal>
           </View>

               {/*MODAL FOR COPY COMMENTS*/}
               <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={copyCommentModal}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!copyCommentModal);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Pressable style={styles.buttonModal}
                            onPress={() => CopyToClipboard()}
                            >
                                <Text style={{padding:10, textAlign:'center', color:'blue'}}>Copy</Text>
                            </Pressable>
                            <Pressable 
                            onPress={() => setCopyCommentModal(!copyCommentModal)}
                            >
                                <Text style={{padding:10, color:'blue'}}>Cancel</Text>
                            </Pressable >
                        </View>
                    </View>
                </Modal>
           </View>

            <View>              
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.writeTaskWrapper}
                    >
                    <TextInput style={[styles.input, {height: Math.max(50, textHeight)}]} 
                                    placeholder={'Write a task'} 
                                    value={comment}
                                    multiline={true} 
                                    autoFocus={boolFocus}
                                    onChangeText={text => setComment(text)} 
                                    onContentSizeChange={(e) => {
                                        setTextHeight(e.nativeEvent.contentSize.height);
                                    }}/>
                    {editSelected ?
                    <View>
                        <TouchableOpacity style={{marginBottom:10, alignItems:'center'}} onPress={() => cancelEdit()}>
                            <Text style={{color:'blue'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => UpdateComment()}>
                            <Text style={{color:'blue'}}>Update</Text>
                        </TouchableOpacity>
                    </View>
                        :
                    <TouchableOpacity onPress={() => addComment()}>
                        <View style={styles.addWrapper}>
                        <Text style={styles.addText}>+</Text>
                        </View>
                    </TouchableOpacity>
                    }
                </KeyboardAvoidingView>
            </View>

        </View>
    );
};

export default TheadInfo;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor:'gray'
    },
    subContainer: {
      flex: 1,
      paddingBottom: 15,
      borderBottomWidth: 2,
      borderBottomColor: '#CCCCCC',
    },
    activity: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailButton: {
      marginTop: 10
    },
    comment: {
        marginTop:10,
        backgroundColor:'#F2F0F0',
        borderRadius:10,
        height:70,
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
        marginTop: 30,
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
        height:20,
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
      item: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
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
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
  })