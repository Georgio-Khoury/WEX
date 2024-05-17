
const {inifire} = require('../firebase')
const {collection,getDocs,deleteDoc,doc,where,query, addDoc,Timestamp, serverTimestamp,setDoc,getDoc, FieldValue, updateDoc, orderBy }=require("firebase/firestore");
const firestore= inifire()


module.exports.cartstatus = async (req,res)=>{
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
    }


module.exports.addcart = async (req,res)=>{
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
  }

module.exports.deletecart = async (req,res)=>{
    const username = req.user.username
    const {id} = req.body
    try{
      await deleteDoc(doc(firestore,"Users",username,"Cart",id))
    }catch(error){
      console.log(error)
      res.send("Error deleting from cart:",error)
    }
    res.send('ok')
  }


  module.exports.getcart = async (req,res)=>{
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
        console.log(item.data())
               return item
        
    }));
    
    const products = items.map(item=>item.data()).filter(product=>product!== undefined)
    console.log(products)
      res.json({"products":products})
    }catch(error){
      console.log(error)
      res.json({"error":error})
    }
  
  }