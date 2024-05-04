import React, { useEffect } from 'react'
import { API } from '../../../apiconfig';
function Cart() {
    const [cart, setcart] = useState([]);
    useEffect(()=>{
        async function getcart(){
            const response = await fetch(`${API}/getcart?username=${sessionStorage.getItem('username')}`)
            const data = await response.json()
            if(response.ok){
                setcart(data.products)
            }else{
                console.log('no cart data')
            }
        }
    },[])
  return (
    <div>Here we map through the cart items and display them</div>
  )
}

export default Cart