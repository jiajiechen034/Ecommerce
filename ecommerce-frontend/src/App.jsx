import { useEffect, useState } from 'react';
import ProductList from './components/ProductList';

function App() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [showNewProductCard, setShowNewProductCard] = useState(false);

  const fetchProducts = () => {
    fetch('http://localhost:8080/api/products')
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddClick = () => {
    setShowNewProductCard(true);
    setMessage('');
  };

  const handleCancelNewProduct = () => {
    setShowNewProductCard(false);
  };

  const createProduct = (productData) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);

    if (productData.imageFile) {
      formData.append('image', productData.imageFile);
    }

    return fetch('http://localhost:8080/api/products', {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to create product');
        }
        return res.json();
      })
      .then(() => {
        setShowNewProductCard(false);
        setMessage('Product added successfully');
        fetchProducts();
      });
  };

  const updateProduct = (id, productData) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);

    if (productData.imageFile) {
      formData.append('image', productData.imageFile);
    }

    return fetch(`http://localhost:8080/api/products/${id}`, {
      method: 'PUT',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update product');
        }
        return res.json();
      })
      .then(() => {
        setMessage('Product updated successfully');
        fetchProducts();
      });
  };

  const deleteProduct = (id) => {
    fetch(`http://localhost:8080/api/products/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete product');
        }

        setMessage('Product deleted successfully');
        fetchProducts();
      })
      .catch(console.error);
  };

  return (
    <div
      style={{
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>Products</h1>

      {message && (
        <p style={{ color: 'green', marginBottom: '16px' }}>
          {message}
        </p>
      )}

      <button
        onClick={handleAddClick}
        disabled={showNewProductCard}
        style={{
          marginBottom: '20px',
          padding: '10px 14px',
          fontSize: '16px',
        }}
      >
        + Add Product
      </button>

      <ProductList
        products={products}
        onCreate={createProduct}
        onUpdate={updateProduct}
        onDelete={deleteProduct}
        showNewProductCard={showNewProductCard}
        onCancelNewProduct={handleCancelNewProduct}
        clearMessage={() => setMessage('')}
      />
    </div>
  );
}

export default App;