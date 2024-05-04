import React,{useEffect, useState} from 'react'
import Sidebar from '../NavBar/Sidebar'
import { useNavigate } from 'react-router-dom';
function MyProducts() {
  const [items, setitems] = useState([]);
  const navigate = useNavigate()
  useEffect(()=>{
    async function myitems(){
      const response = await fetch(`/api/myitems?username=${sessionStorage.getItem('username')}`)
      const data =await  response.json()
      if(response.ok){
        setitems(data.products)
        console.log(items)
      }
    }
    myitems()
  },[])
  return (
    <div className='page-container'>
    <Sidebar/>
        <div className='content'>
          <div className='items-container'>
      {items.map((item,index)=>{
           var itemobj = encodeURIComponent(JSON.stringify(item))
        return(
          <div key={index} className="item" onClick={()=>navigate(`/myproductsinfo/${itemobj}`)}>
                        <img src={item.image} alt="Product" />
                        <h3>{item.Title}</h3>
                        <p>{item.price}</p>
                    </div>
        )
      })}
      </div>
          </div>
        </div>
  )
}

export default MyProducts