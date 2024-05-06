import React,{useState} from 'react';
import Sidebar from '../NavBar/Sidebar';
import { useParams,useNavigate } from 'react-router-dom';
import './ProductInfo.css'
function ProductInfo() {
   const API= import.meta.env.VITE_REACT_API
   
    var { item } = useParams(); // Get the serialized object from the URL parameter
    const decodedItem = decodeURIComponent(item); // Decode the URL parameter
    const itemObj = JSON.parse(decodedItem); // Parse the decoded string back into an object
    item = itemObj
    console.log(item)
    var id = item.id
    const [wishmsg, setwishmsg] = useState(sessionStorage.getItem(item.id)=='true'?'Remove from wishlist':'Add to wishlist');
    const originalURL = itemObj.image
    const modifiedURL = originalURL.replace("/products/", "/products%2F");
    const navigate = useNavigate();
    console.log(item);
    function startchat(){
        sessionStorage.setItem("receiver",item.username)
        navigate('/chatinit')
    }
    async function managecart(route,m){
        var username = sessionStorage.getItem('username')
          const response = await fetch(`${API}/${route}`,{
            method:m,
            
            headers:{
              'Content-Type':'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
            
            },
              
            body:JSON.stringify({username,id})
          })
          const data = await response.text()
        }
    async function wishlist(){
        if(sessionStorage.getItem(item.id)=='true'){
            sessionStorage.setItem(item.id,false)
            setwishmsg('Add to wishlist')
            await managecart('deletecart','DELETE')
        }else{
            sessionStorage.setItem(item.id,true)
            setwishmsg('Remove from wishlist')
            await managecart('addcart','POST')
        }
    }
    return (
        <div className='page-container'>
            <Sidebar /> 
            <div className="item-details-overlay">
            <div className="item-details-modal">
                <button className="item-details-close" onClick={()=>{navigate('/product');}}>&times;</button>
                <div className="item-details-content">
                    <div className="item-details-image-wrapper">
                        <img src={modifiedURL} alt={item.Description} />
                    </div>
                    <div className="item-details-info">
                        <h1>{item.Title || "Item Details"}</h1>
                        <p className="item-description">{item.Description}</p>
                        <p className="item-price">Price: {item.price}</p>
                        <p className="item-seller">Seller: {item.username}</p>
                        <button onClick={wishlist}>{}{wishmsg}</button>
                        {/* More details here */}
                    </div>
                    <div className="go-to-chat">
                        <button onClick={startchat}>Chat with Seller</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    ); 
}

export default ProductInfo;
