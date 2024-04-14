import React, { useState, useCallback } from 'react';
import './Form.css'; // Import CSS file

function SellProduct() {
  const [state, setState] = useState({
    productName: '',
    price: 0,
    category: '',
    description: '',
    selectedImages: [],
  });

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const handleImageUpload = useCallback((event) => {
    const imageFiles = Array.from(event.target.files);
    setState(prevState => ({
      ...prevState,
      selectedImages: imageFiles
    }));
  }, []);

  const removeImage = useCallback((indexToRemove) => {
    const updatedImages = state.selectedImages.filter((_, index) => index !== indexToRemove);
    setState(prevState => ({
      ...prevState,
      selectedImages: updatedImages
    }));
  }, [state.selectedImages]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const url = 'https://your-backend-api.com/endpoint'; // Replace with your backend API URL

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      });

      if (response.ok) {
        console.log('Data successfully sent!');
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }, [state]);

  const { productName, category, description, selectedImages } = state;
  const categoryOptions = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Beauty',
    'Vehicles',
  ];

  return (
    <div className="formBox">
      <h2>Sell a Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Product Name:
          <input
            type="text"
            name="productName"
            value={productName}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Category:
          <select
            name="category"
            value={category}
            onChange={handleInputChange}
          >
            <option value="">Select a category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={description}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label className="custom-file-label" htmlFor="upload">
          Product Images:
          <input
            id="upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </label>
        <br />
        {/* Display image previews */}
        {selectedImages.map((image, index) => (
          <div key={index} className="image-preview">
            <img
              src={URL.createObjectURL(image)}
              
              style={{ maxWidth: '100px', margin: '5px' }}/>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="remove-button"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SellProduct;