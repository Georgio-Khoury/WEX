import React, { useEffect, useState } from 'react'
import Heart from './Heart'
function CartButton({id,status}) {
const [active,setActive] = useState(status)
const [selected, setselected] = useState(status);

useEffect(() => {
  setActive(status);
  setselected(status);
}, [status]);

    const API = import.meta.env.VITE_REACT_API
    async function handlesubmit(e){
      e.stopPropagation()
      setselected(prevSelected => !prevSelected);
      console.log(!selected)
      if(!selected){
        sessionStorage.setItem(id,true)
        await managecart('addcart','POST')
      }else{
        sessionStorage.setItem(id,false)
       await managecart('deletecart','DELETE')
      }
    }
     
    async function managecart(route,m){
      var username = sessionStorage.getItem('username')
        const response = await fetch(`${API}/${route}`,{
          method:m,
          headers:{
            'Content-Type':'application/json'},
            credentials:'include',
          body:JSON.stringify({username,id})
        })
        const data = await response.text()
      }
        
      
    
  return (
    <div className='heart' style={{ width: "2rem" }} onClick={handlesubmit}><Heart isActive={active} onClick={() => setActive(!active)} animationTrigger = "both" inactiveColor = "rgba(255,125,125,.75)" activeColor = "#e019ae" style = {{marginTop:'1rem'}} animationDuration = {0.1}/></div>
   
  )
}

export default CartButton