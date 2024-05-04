import React,{useState,useEffect} from 'react'
import Sidebar from '../NavBar/Sidebar'
import { useNavigate } from 'react-router-dom';
import './Product.css'

function Product() {
    const API = import.meta.env.VITE_REACT_API
  const [categ, setCateg] = useState(sessionStorage.getItem('categ'));
  const [items, setItems] = useState([]);
  const [noitem, setnoitem] = useState(false);
  const categories = ['car', 'electronics', 'book',"accessories",'apartment','appliance','sports','furniture','games','pets'];
  const navigate = useNavigate()
  console.log('categ is',categ)
  useEffect(() => {
      if (categ) {
          getdata();
      }
  }, [categ]);
  useEffect(() => {
    console.log(categ)
    if (categ) {
        getdata();
    }
}, []);
  async function getdata() {
    const response = await fetch(`${API}/getitems?categ=${categ}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        setnoitem(false)
        setItems(data.product);
    } else {
        console.log('Error fetching items:', response.statusText);
        setnoitem(true)
        setItems([])
        
    }


}
  return (
    <div className='page-container'>
<Sidebar/>
    <div className='content'>
       
    <div className="categories">
   
                {categories.map((category, index) => (
                    <button key={index} onClick={() => {setCateg(category);sessionStorage.setItem('categ',category)}}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>
            <div className="items-container">
            {noitem&& <h1>No item available</h1>}
                {items.map((item, index) => {
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

export default Product