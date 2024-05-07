const express = require('express')
require('dotenv').config();
const cookieParser= require('cookie-parser')
const {createID} = require('./helpers/helper')
const http = require( 'http' );
const ws = require( "ws" ) ;
const{uploadSingleImage} = require('./uploadImg/uploadimg')
const {upload} = require('./multerconfig/multerconfig')
const bodyParser = require('body-parser');
const cors = require('cors')
const session = require('express-session')
const jwt = require('jsonwebtoken');
 
const {requireAuth} = require('./middleware/authControl')
const port = 3001 
const app = express() 
const server = http.createServer(app)
const wss = new ws.Server({ server }); 
const {initializeFireBase,inifire} = require('./firebase')
const {collection,getDocs,deleteDoc,doc,where,query, addDoc,Timestamp, serverTimestamp,setDoc,getDoc, FieldValue, updateDoc, orderBy }=require("firebase/firestore");
const firebase = initializeFireBase()
const firestore= inifire()
const {getStorage,ref,uploadBytes, uploadBytesResumable} = require('firebase/storage');
const { time } = require('console');
app.use(cors({
    origin: ['https://wex-frontend.onrender.com','http://localhost:5173'],  // replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable credentials (cookies, authorization headers)
  }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  
 app.use(express.json()); 
 app.use(session({
  secret: 'ilvsftwr',
    resave: false,
    saveUninitialized: true
 }))
app.use(cookieParser())
const storage = getStorage()

//const productsref = ref(storage,'products')


//---------------------------------------------------------------
app.get('/api/login/:email', async (req,res)=>{
  var email = req.params.email
  if (email){
  email = email.toLowerCase()
}else{res.json({error:"Invalid email"})}
 
  var doc = await getDocs(query(collection(firestore,"Users"),where('email','==',email)))
  var username = doc.docs[0].id
  var name = doc.docs[0].data().name
  var pfp = doc.docs[0].data().profilepic
  var email = doc.docs[0].data().email
  var pn = doc.docs[0].data().pn
  
  const token = jwt.sign({ username, email }, process.env.SECRET_KEY, { expiresIn: '1h' });

  res.json({"username":username,"name":name,"pfp":pfp,"pn":pn,"email":email,"token":token})
})
 
 
 
app.post('/api/adduser',upload, async (req, res) => {
  try {
   
    let { name,username, email, pn } = req.body;
    if(!username) res.json({"error":"Invalid input"})
    pn = parseInt(pn);
    if (email){
      email = email.toLowerCase()
    }else{res.json({"error":"Invalid input"})}

    //checking if the document already exists(la2an usernames are unique)
    const userDocRef = doc(collection(firestore, 'Users'), username.toLowerCase());//points to the document with ID=username
    console.log('here')
    const docSnapshot = await getDoc(userDocRef);//fetches the doc with the username 
    console.log('got doc')
    if (docSnapshot.exists()) {
      //if it exists return the below error msg(to be displayed under the Register form)
      
      return res.status(401).json({ error: 'Username already in use' });
    }
    const queryemails = query(collection(firestore,"Users"),where("email","==",email))
    const checkemails = await getDocs(queryemails)
    if(!checkemails.empty){
      return res.status(401).json({ error: 'Email already in use' });

    }   

    //else let's create it
    console.log('sort hon')
    const joinDate = serverTimestamp();
  
    let profilepic=''
    let location = "pfp"
    try{
    profilepic = await uploadSingleImage(req,res,location);
    console.log('ayooo')
    }catch(error){
      res.json({error:"error uploading image"})
    }
    await setDoc(userDocRef, {
      name,
      username,
      email, 
      pn,
      joinDate,
      profilepic,
 
    });
    await setDoc(doc(firestore, "Users",username.toLowerCase(),"Cart","0"),{
      item:""
    });
    
    res.json({ id: username });
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
    res.json({ error: 'Something went wrong' });
  }
});


app.post('/api/edituser',requireAuth,async(req,res)=>{
  try {
    const { name,pn } = req.body;
    const userDocRef = doc(collection(firestore, 'Users'), req.user.username.toLowerCase());
    const docSnapshot = await getDoc(userDocRef);
    if (!docSnapshot.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }
    await updateDoc(userDocRef, {
      name,
     
      pn
    });
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
})
//------------------------------------------------
// items management 
app.post('/api/edititem',requireAuth,async (req,res)=>{
  const {id,info} = req.body
  //console.log(id)
  //console.log(info)
  const docref = doc(firestore,'Products',id)
  try{const updating = await updateDoc(docref,{ 
    Title:info.Title,
    Description: info.Description,
    price: info.price,
    category: info.category,
    id: info.id, 
   
    username: info.username
  })
  console.log('updated')
  res.json({"error":"Item edited Successfully"})
}catch(error){
    console.log(error)
    res.json({"error":error})
  }
  
})

app.get('/api/myitems',requireAuth,async (req,res)=>{
  const username = req.user.username
  //const username = req.query.username
  console.log(username)
  const q = query(collection(firestore,"Products"),where('username','==',username))
  const result = await getDocs(q)
 // console.log(result.docs)
  if(result.empty){
   return res.send("You have no items")
  }
  const products=result.docs.map(doc=>doc.data());
  return res.json({products})
})

app.get('/api/getitems',requireAuth,async (req,res)=>{
  //first we get the category of the item selected from the frontend(the frontend inserts the category in the request api link)
 
  const categ = req.query.categ
  //res.json({message: `${categ} is being sent to the server`})
  const Products = collection(firestore,'Products')
  const q = query(Products,where('category','==',categ))
  const result = await getDocs(q)

  if(result.empty) {
      return res.status(404).json({ error: `No items in category ${categ} are found` });
    } 
    //return res.json({result})
    const product = result.docs.map(doc => doc.data());
   return res.json({product})
})

app.post('/api/additem',requireAuth,upload,async (req,res)=>{
  let img
  try{
  let {Title,description,category,price} = req.body
    let username = req.user.username
  try{
  
  img = await uploadSingleImage(req,res,'products')
  
  console.log(img," img")
  }catch{
    res.json({"error":'error getting img'})
  } 
  try{
    console.log(img)
  const docRef = await addDoc(collection(firestore, "Products"), {
    Title: Title,
    Description: description,
    category: category,
    image: img,
    price:price,
    username: username,
    id:""
    
  });
  await updateDoc(doc(firestore,"Products",docRef.id),{
    id:docRef.id
  })
  res.json({"id":docRef.id})
}catch(error){
  console.log(error)
  res.json({"error":"error posting doc to db"})
}
  }catch{
    res.json({"error":"error getting req body"})
  }
  
})


app.delete('/api/deleteitem',requireAuth,async (req,res)=>{
const {id} = req.body
console.log(id)
try{
await deleteDoc(doc(firestore,'Products',id))
}catch(error){
  console.log(error)
  res.status(500).send("Error deleting the item")
}
res.send("ok")
})
 

//-------------------------------------------------------------------------
//cart management
app.get('/api/cartstatus',requireAuth,async (req,res)=>{
  //const username = req.query.username
  const username = req.user.username
  console.log("username is: ",username)
  try{
    const docref = collection(firestore,"Users",username,"Cart")
    const cartitems = await getDocs(docref)
  
    const ids = cartitems.docs.map(doc=>{
      console.log(doc.id)
      if(doc.id!=0)
      return doc.id
    }).filter(id => id !== undefined);
    return res.json({'ids':ids})
  }catch(error){
    console.log(error)
    res.send(error)
  }
  })

app.get('/api/getcart',requireAuth,async (req,res)=>{
  const username = req.user.username
  //const username = req.query.username
  console.log("username is: ",username)
  try{
    const docref = collection(firestore,"Users",username,"Cart")
    const cartitems = await getDocs(docref)
  
    const ids = cartitems.docs.map(doc=>{
      console.log(doc.id)
      if(doc.id!=0)
      return doc.id
    }).filter(id => id !== undefined);
    console.log(ids)
    //then query every item by its id and return it
   

    const items = await Promise.all(ids.map(async (id) => {
      const item = await getDoc(doc(firestore, "Products", id));
             return item
      
  }));
  
  const products = items.map(item=>item.data())
    res.json({"products":products})
  }catch(error){
    console.log(error)
    res.json({"error":error})
  }

})


app.post('/api/addcart',requireAuth,async (req,res)=>{
  const username = req.user.username
  const {id} = req.body
  //the id is the item's id
  try{
    await setDoc(doc(firestore,"Users",username,"Cart",id),{
      item:id, 
    })
  }catch(error){
    console.log(error)
    res.send("Error adding to cart:",error)
  }
  res.send('ok')
})
app.delete('/api/deletecart',requireAuth,async (req,res)=>{
  console.log('deleting')
  const username = req.user.username
  const {id} = req.body
  //id is the item's id
  try{
    await deleteDoc(doc(firestore,"Users",username,"Cart",id))
  }catch(error){
    console.log(error)
    res.send('Error deleting the item please try again')
  }
  res.send("ok")
})

//-----------------------------------------------------------------------------
//chatting and messages


app.get('/api/getchats', requireAuth, async (req, res) => {
  const username = req.user.username;
  console.log(username);
  try {
    // Fetch chats from Firestore
    const chatsSnapshot = await getDocs(query(collection(firestore, 'Chats'), where("Participants", "array-contains", username)));
    const chats = [];

    // Iterate through each chat
    for (const docz of chatsSnapshot.docs) {
      const chatData = docz.data();
      const participants = chatData.Participants;
      console.log('parts ',participants)
      // Find the participant other than the current user
      var otherParticipant = participants.find(participant => participant !== username);
      console.log('other part: ',otherParticipant)
      
      // Fetch the profile pic of the other participant from Users collection
      var userDoc=null
      if(otherParticipant!=null){
      var docref = doc(firestore, 'Users', otherParticipant)
       userDoc = await getDoc(docref);
      }

      const pfp = userDoc ? userDoc.data().profilepic : null;

      // Construct chat object with pfp of other participant
      const chat = {
        id: docz.id,
        participants: participants,
        pfp: pfp,
        ...chatData
      };
      chats.push(chat);
    }

    console.log(chats);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});


app.post('/api/getid',requireAuth,async (req,res)=>{ 
  const username = req.user.username
  const {reciever} = req.body
 //console.log(username) 
// console.log(reciever) 
 const id = createID(username,reciever)
 var docid
  try{
   docid = await getDoc(doc(firestore,"Chats",id))
  if(docid.exists()) 
  return res.json({"id":docid.id})
else{
  //else we create it
  await setDoc(doc(firestore,"Chats",id),{
    "Participants":[username,reciever]
   })
   var timestamp = new Date()
   console.log(timestamp)
   var time = timestamp.toString()
   await setDoc(doc(firestore,"Chats",id,"Messages",time),{
    
  })
  res.json({"id":id})
}
  }catch(error){
    console.log(error)
    res.json({'error':error})
  }
})









app.get('/api/getmessages',requireAuth, async (req, res) => {
  const chatId  = req.query.chatid;
  console.log(chatId)
  try {
    // Query messages from Firestore
    const messagesSnapshot = await getDocs(query(collection(firestore, `Chats/${chatId}/Messages`),orderBy('timestamp')));
    
    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('ok')
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});



//web sockets
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


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  server.listen(3002,()=>{
    console.log(`Server is running at http://localhost:3002`);
  })