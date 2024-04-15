const express = require('express')
const {createID} = require('./helpers/helper')
const http = require( 'http' );
const ws = require( "ws" ) ;
const{uploadSingleImage} = require('./uploadImg/uploadimg')
const {upload} = require('./multerconfig/multerconfig')
const bodyParser = require('body-parser');
const cors = require('cors')
const session = require('express-session')
const port = 3001
const app = express()
const server = http.createServer(app)
const wss = new ws.Server({ server });
const {initializeFireBase,inifire} = require('./firebase')
const {collection,getDocs,deleteDoc,doc,where,query, addDoc,Timestamp, serverTimestamp,setDoc,getDoc, FieldValue, updateDoc }=require("firebase/firestore");
const firebase = initializeFireBase()
const firestore= inifire()
const {getStorage,ref,uploadBytes, uploadBytesResumable} = require('firebase/storage');
const { time } = require('console');
app.use(cors({
    origin: 'http://localhost:5173',  // replace with your frontend's URL
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

const storage = getStorage()

//const productsref = ref(storage,'products')


//---------------------------------------------------------------
app.post('/api/login', async (req,res)=>{
  const {email} = req.body
  console.log(email)
  var doc = await getDocs(query(collection(firestore,"Users"),where('email','==',email)))
  var username = doc.docs[0].id
  var name = doc.docs[0].data().name
  console.log(username);
  req.session.username = username
  console.log(req.session.username)
  res.json({username:username,name:name})
})
 
 
 
app.post('/api/adduser',upload, async (req, res) => {
  try {
   
    let { name,username, email, pn } = req.body;
    console.log(username)
    pn = parseInt(pn);
    

    //checking if the document already exists(la2an usernames are unique)
    const userDocRef = doc(collection(firestore, 'Users'), username);//points to the document with ID=username
    const docSnapshot = await getDoc(userDocRef);//fetches the doc with the username 

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
    const joinDate = serverTimestamp();
  
    let profilepic
    let location = "pfp"
    try{
    profilepic = await uploadSingleImage(req,res,location);
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
    await setDoc(doc(firestore, "Users",username,"Cart","0"),{
      item:""
    });
    res.json({ id: username });
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/api/logout',async (req,res)=>{
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.sendStatus(500);
    }
    res.send("Logged out")
})
})

//------------------------------------------------
// items management
app.get('/api/edititem',async (req,res)=>{
  const {id,info} = req.body
  const docref = doc(firestore,'Products',id)
  try{const updating = await updateDoc(docref,{
    Description: info.Description,
    price: info.price,
    category: info.categ,
    id: info.id,
    image:  info.image,
    username: info.username
  })
  res.send('ok')
}catch(error){
    console.log(error)
    res.json({"error":error})
  }
  
})

app.get('/api/myitems',async (req,res)=>{
  //const username = req.session.username
  const {username} = req.body
  console.log(username)
  const q = query(collection(firestore,"Products"),where('username','==',username))
  const result = await getDocs(q)
  console.log(result.docs)
  if(result.empty){
   return res.send("You have no items")
  }
  const products=result.docs.map(doc=>doc.data());
  return res.json({products})
})

app.get('/api/getitems',async (req,res)=>{
  //first we get the category of the item selected from the frontend(the frontend inserts the category in the request api link)
 
  const categ = req.query.categ
  //res.json({message: `${categ} is being sent to the server`})
  const Products = collection(firestore,'Products')
  const q = query(Products,where('category','==',categ))
  const result = await getDocs(q)
 console.log(result.docs.length)
  if(result.empty) {
      return res.status(404).json({ error: `No items in category ${categ} are found` });
    } 
    //return res.json({result})
    const product = result.docs.map(doc => doc.data());
   return res.json({product})
})

app.post('/api/additem',upload,async (req,res)=>{
  let img
  try{
  let {description,category,price} = req.body
  const username = "tolo"//req.session.username
  try{
  img = await uploadSingleImage(req,res,products)
  console.log(img)
  }catch{
    res.send('error getting img')
  }
  try{
  const docRef = await addDoc(collection(firestore, "Products"), {
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
  res.send(docRef.id)
}catch(error){
  console.log(error)
  res.send("error posting doc to db")
}
  }catch{
    res.send("error getting req body")
  }
  
})


app.delete('/api/deleteitem',async (req,res)=>{
const id = req.body
try{
await deleteDoc(doc(firestore,Product,id))
}catch(error){
  console.log(error)
  res.send("Error deleting the item")
}
res.send("ok")
})


//-------------------------------------------------------------------------
//cart management

app.post('/api/addcart',async (req,res)=>{
  //let username = req.session.username
  const {username,id} = req.body
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
app.delete('/api/deletecart',async (req,res)=>{
  const {username,id} = req.body
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


app.get('/api/getchats', async (req, res) => {
  try {
    // Fetch chats from Firestore
    const chatsSnapshot = await getDocs(collection(firestore, 'Chats'));
    const chats = chatsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

app.post('/api/newchat', async (req,res)=>{
  
  const {p1,p2} = req.body
  const ID = createID(p1,p2)
  try{
 await setDoc(doc(firestore,"Chats",ID),{
  "participants":[p1,p2]
 })
 var timestamp = new Date()
 console.log(timestamp)
 var time = timestamp.toString()
 await setDoc(doc(firestore,"Chats",ID,"Messages",time),{
  
})
 res.send("OK")
}catch(error){
  console.error("Error creating new chat!, ",error)
  res.status(500).json({error: 'Failed to create new Chat'})
}
})

app.get('/api/getmessages', async (req, res) => {
  const chatId  = req.query.chatid;

  try {
    // Query messages from Firestore
    const messagesSnapshot = await getDocs(collection(firestore, `Chats/${chatId}/Messages`));
    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// app.post('/api/uploadsingle', upload, async (req, res) => {
//   const file = {
//       type: req.file.mimetype,
//       buffer: req.file.buffer
//   }
//   try {
//       const buildImage = await uploadImage(file, 'single'); 
//       res.send({
//           status: "SUCCESS",
//           imageName: buildImage
//       })
//   } catch(err) {
//       console.log(err);
//   }
// })

//web sockets
wss.on('connection',(ws,req)=>{
  console.log("connected to msgs")
  const chatId = req.url.split('=')[1];
  ws.chatId = chatId;
  ws.on('message',async (message)=>{
    console.log('recieved msgs', message)
    try {
      const parsedMessage = JSON.parse(message);
      console.log(parsedMessage)
      if (parsedMessage.type === 'message') {
        // Handle message
        const { type,chatId, sender, content } = parsedMessage;
        var timestamp = new Date();
        var time = timestamp.toString() 
        await setDoc(doc(firestore,"Chats",chatId,'Messages',time),{
          sender,
          content,
          timestamp
        })
        
        
        wss.clients.forEach((client) => {
          console.log(  ws.chatId )
          if (client !== ws && client.readyState === ws.OPEN&&ws.chatId===chatId) {
            console.log('im in')
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