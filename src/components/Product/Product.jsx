import React,{useState,useEffect} from 'react'
import Sidebar from '../NavBar/Sidebar'
import { useNavigate } from 'react-router-dom';

function Product() {
  const [categ, setCateg] = useState('');
  const [items, setItems] = useState([]);
  const categories = ['car', 'appliance', 'electronics', 'books'];
  const navigate = useNavigate()
  useEffect(() => {
      if (categ) {
          getdata();
      }
  }, [categ]);
  async function getdata() {
    const response = await fetch(`/api/getitems?categ=${categ}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        setItems(data.product);
    } else {
        console.log('Error fetching items:', response.statusText);
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
                {items.map((item, index) => {
                  var itemobj = encodeURIComponent(JSON.stringify(item))
                  return(
                    <div key={index} className="item" onClick={()=>navigate(`/productinfo/${itemobj}`)}>
                        <img src={item.image} alt="Product" />
                        <h3>{item.Description}</h3>
                        <p>{item.price}</p>
                    </div>
)})}
            </div>
      </div>
    </div>
  )
}

export default Product