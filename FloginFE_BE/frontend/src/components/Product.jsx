import React, { useState, useEffect } from 'react';

function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // TODO: Fetch products from API
    console.log('Fetching products...');
  }, []);

  return (
    <div className="product-container">
      <h2>Products</h2>
      <div className="product-list">
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-item">
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Product;
