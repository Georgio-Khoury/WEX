import React, { useEffect,useState } from 'react'
import Sidebar from '../NavBar/Sidebar';
import { useNavigate } from 'react-router-dom';
function Cart() {
    const API = import.meta.env.VITE_REACT_API
    const navigate = useNavigate()
    const [cart, setcart] = useState([]);
    const [noitem, setnoitem] = useState();
    useEffect(()=>{
        async function getcart(){
            const response = await fetch(`${API}/getcart?username=${sessionStorage.getItem('username')}`,{
                method:'GET',
               headers:{
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
               }
            })
            console.log('here')
            const data = await response.json()
            if(response.ok){

                setcart(data.products)
                console.log(data.products.length)
                if(data.products.length===0){
                    console.log('empty')
                setnoitem(true)
                }
            }else{
                console.log('no cart data')
            }
        }
        getcart()
        console.log(cart)
    },[])
  return (
    <div className='page-container'>
    <Sidebar/>
    <div className='content'>
    <div className="items-container">
            {noitem&& <h1>No item available</h1>}
                {cart.map((item, index) => {
                  var itemobj = encodeURIComponent(JSON.stringify(item))
                  return(
                    <div key={index} className="item" onClick={()=>navigate(`/productinfo/${itemobj}`)}>
                        <img src={item.image} alt="Product" />
                        <h1>{item.Title}</h1>
                        <p>{item.price}</p>
                       
                    </div>
)})}
            </div>
    </div>
    </div>
   
    
  )
}

export default Cart