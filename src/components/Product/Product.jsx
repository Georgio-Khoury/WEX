import React,{useState,useEffect} from 'react'
import Sidebar from '../NavBar/Sidebar'
import { useNavigate } from 'react-router-dom';
import './Product.css'
function Product() {
  const [categ, setCateg] = useState('');
  const [items, setItems] = useState([]);
  const [noitem, setnoitem] = useState(false);
  const categories = ['car', 'electronics', 'book',"accessories",'apartment','appliance','sports','furniture','games','pets'];
  const navigate = useNavigate()
  useEffect(() => {
      if (categ) {
          getdata();
      }
  }, [categ]);
  useEffect(() => {
    if (categ) {
        getdata();
    }
}, []);
  async function getdata() {
    const response = await fetch(`/api/getitems?categ=${categ}`, {
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
                    <button key={index} onClick={() => setCateg(category)}>
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