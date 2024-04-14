import { useState } from 'react'
import Chat from './Chat';
import './Appi.css'
import SellProduct from './SellProduct';


function Appi() {
  
  const [categ,setcateg]=useState('')
  const [res,setres] = useState([])
  
    const [file, setFile] = useState(null);
  
    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };

  const handleUpload = async () => {
    try {
      if (!file) {
        console.error('No file selected');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://127.0.0.1:3001/api/test', {
        method: 'POST',
        
        body: formData,
      });

      if (response.ok) {
        console.log('Image uploaded successfully');
        // Optionally, do something with the response data
      } else {
        console.error('Error uploading image:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
  




   async function getdata(){
    console.log('hello')
    setcateg('car')
  const response = await fetch(`/api/getitems?categ=${categ}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
    
  })
  
  if(response.ok){
    console.log('helloagainzz')
    
    const data = await response.json()
   
    console.log(data)
    setres(data.message)
  }
}
async function getdataz() {
  const datax = { username: "helloz",email:"wtvr@hotmail.com",pn:12345,dob:12345 }; // Create a JSON object with your data
  const response = await fetch('/api/adduser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datax), // Convert data to JSON string
  });
  const dataz = await response.json();
  if (response.ok) {
    console.log(dataz);
    setres(dataz.pn);
    
  }
}
  async function lol(){
    const username="lahme"
    const response = await fetch('/api/login',{
      method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username}), 
    })
  }

  


  return (
    <>
      {/* hello ayooo
      <button onClick={lol}>Get Data</button>
      {res && (<p style={{color:'red'}}>{res}</p>)}

      <div>
      <input type="file" name="img" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
    <div>
      <img src="https://firebasestorage.googleapis.com/v0/b/projectfirebase-462ec.appspot.com/o/products%2F1711494228523?alt=media&token=1d4c5f5e-c1f3-4671-b1f0-d0f9065ebaa6" alt="Product" />
    </div>
    <SellProduct/> */}
    <Chat/>

    </>
  )
}

export default Appi
