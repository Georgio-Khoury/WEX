const {inifire} = require('../firebase')
const {collection,getDocs,deleteDoc,doc,where,query, addDoc,Timestamp, serverTimestamp,setDoc,getDoc, FieldValue, updateDoc, orderBy }=require("firebase/firestore");
const firestore= inifire()
const {createID} = require('../helpers/helper')

module.exports.getchats = async (req, res) => {
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
  }

  module.exports.getid = async (req,res)=>{ 
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
  }

  module.exports.getmessages = async (req, res) => {
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
  }