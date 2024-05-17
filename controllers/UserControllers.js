const {inifire} = require('../firebase')
const {collection,getDocs,deleteDoc,doc,where,query, addDoc,Timestamp, serverTimestamp,setDoc,getDoc, FieldValue, updateDoc, orderBy }=require("firebase/firestore");
const{uploadSingleImage} = require('../uploadImg/uploadimg')
const firestore = inifire()
const jwt = require('jsonwebtoken');

module.exports.login = async (req,res)=>{
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
  }

  module.exports.adduser = async (req, res) => {
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
  }


  module.exports.edituser =async(req,res)=>{
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
  }