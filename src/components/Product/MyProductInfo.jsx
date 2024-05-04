import React, { useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import Sidebar from '../NavBar/Sidebar'


import './MyProductInfo.css'

function MyProductInfo() {
  const [errormsg, seterrormsg] = useState();
  const API = import.meta.env.VITE_REACT_API
  var { item } = useParams(); // Get the serialized object from the URL parameter
  const decodedItem = decodeURIComponent(item); // Decode the URL parameter
  const itemObj = JSON.parse(decodedItem); // Parse the decoded string back into an object
  item = itemObj
  const [editedItem, setEditedItem] = useState(item);
  const[editMode,seteditmode]= useState(false)



  const originalURL = itemObj.image
  const modifiedURL = originalURL.replace("/products/", "/products%2F");
  const navigate = useNavigate();
async function deleteitem(){
  var id = item.id
  const response = await fetch(`${API}/deleteitem`,{
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json', // Specify content type as JSON
    },
    body: JSON.stringify({id})
  })
  if(response.ok){
    navigate('/myproducts')
  }else{
    console.log('failed')
  }
}

  async function handleSubmit(){
    console.log(item)
    var id = item.id
    var info = editedItem
    const response = await fetch(`${API}/edititem`,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json', // Specify content type as JSON
      },
      body: JSON.stringify({id,info})
    })
    const data = response.json()
    if(response.ok){
      seterrormsg(data.error)
      const updatedItem = encodeURIComponent(JSON.stringify(editedItem));
      const updatedURL = `/myproductsinfo/${updatedItem}`;
      navigate(updatedURL)
      seteditmode(false)
    }else{
      seterrormsg(data.error)
    }

   
  }
  function handleEdit(){
    seteditmode(true)
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem(prevItem => ({
      ...prevItem,
      [name]: value
    }));
  };

  return (
    <div className='page-container'>
<Sidebar/>
    <div className='content'>
    <div className="item-details-overlay">
            <div className="item-details-modal">
                <button className="item-details-close" onClick={()=>navigate('/myproducts')}>&times;</button>
                <div className="item-details-content">
                    <div className="item-details-image-wrapper">
                        <img src={modifiedURL} alt={item.Description} />
                    </div>
                    <div className="item-details-info">
                    {editMode ? (
                 <div>
                 <div className="form-group">
                   <label htmlFor="Title">Title:</label>
                   <input type="text" id="Title" name="Title" value={editedItem.Title} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                   <label htmlFor="Description">Description:</label>
                   <textarea id="Description" name="Description" value={editedItem.Description} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                   <label htmlFor="price">Price:</label>
                   <input type="text" id="price" name="price" value={editedItem.price} onChange={handleChange} />
                 </div>
                <div>
                  <button onClick={()=>seteditmode(false)}>Cancel Edit</button>
                  </div>
               </div>
               
                ) : (
                  <div>
                    <h1>{editedItem.Title || "Item Details"}</h1>
                    <p className="item-description">{editedItem.Description}</p>
                    <p className="item-price">Price: {editedItem.price}</p>
                    <button onClick={deleteitem}>Delete item</button>
                  </div>
                )}
                <button onClick={editMode ? handleSubmit : handleEdit}>{editMode ? "Submit Changes" : "Edit"}</button>
                    </div>
                   
                </div>
               
            </div>
        </div>
        </div>
      </div>
  
  )
}

export default MyProductInfo