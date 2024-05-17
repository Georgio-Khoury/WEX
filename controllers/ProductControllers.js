const {inifire} = require('../firebase')
const {collection,getDocs,deleteDoc,doc,where,query, addDoc,Timestamp, serverTimestamp,setDoc,getDoc, FieldValue, updateDoc, orderBy }=require("firebase/firestore");
const{uploadSingleImage} = require('../uploadImg/uploadimg')

const firestore= inifire()

module.exports.myitems = async (req,res)=>{
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
}

  module.exports.edititems =async (req,res)=>{
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
    
  }
    
  

  module.exports.getitems = async (req,res)=>{
    //first we get the category of the item selected from the frontend(the frontend inserts the category in the request api link)
   
    const categ = req.query.categ
    if(!categ){
      res.json({"error":"Invalid category"})
    }
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
  }


  module.exports.additem= async (req,res)=>{
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
    
  }

  module.exports.deleteitem= async (req,res)=>{
    const {id} = req.body
    console.log(id)
    try{
    await deleteDoc(doc(firestore,'Products',id))
    }catch(error){
      console.log(error)
      res.status(500).send("Error deleting the item")
    }
    res.send("ok")
    }