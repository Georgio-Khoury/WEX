const express = require('express')
const port = 3002
const http = require('http');
const ws = require( "ws" ) ;
const app = express()
const server = http.createServer(app)
const wss = new ws.Server({ server });

const {collection,getDocs,deleteDoc,doc,where,query, addDoc,Timestamp, serverTimestamp,setDoc,getDoc, FieldValue, updateDoc, orderBy }=require("firebase/firestore");
const firebase = require('../firebase/firebaseinit')
const firestore= require('../firebase/firebaseinit')
firestore.firestore
firebase.firebase

wss.on('connection',(ws,req)=>{
    console.log("connected to msgs")
    const chatId = req.url.split('=')[1];
    ws.chatId = chatId;
    console.log("the chat id is: ", chatId )
    ws.on('message',async (message)=>{
      console.log('recieved msgs', message)
      try {
        const parsedMessage = JSON.parse(message);
        console.log(parsedMessage)
        if (parsedMessage.type === 'message') {
          // Handle message
          const { type,chatID, sender, content } = parsedMessage;
          var timestamp = new Date();
          var time = timestamp.toString() 
          try{
          await setDoc(doc(firestore,"Chats",chatID,'Messages',time),{
            sender,
            content,
            timestamp
          })
        }catch(e){console.log("i hate this ",e)}
          console.log(wss.clients[0])
          wss.clients.forEach((client) => {
            console.log( wss.clients.size)
            if (client !== ws && client.readyState === ws.OPEN&&ws.chatId===chatId) {
              
              client.send(JSON.stringify(parsedMessage));
            }
          });
        }
      } catch (error) {
        console.error('Error parsing message: ', error);
      }
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  }); 
 module.exports = server
 server.listen(3002,()=>{
  console.log(`Server is running at http://localhost:3002`);
})
  