import { useState } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import { useProducts } from './hooks/useProducts';

function App() {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
  const [message, setMessage] = useState('');
  const [showNewProductCard, setShowNewProductCard] = useState(false);

  const handleAddClick = () => {
    setShowNewProductCard(true);
    setMessage('');
  };

  const handleCancelNewProduct = () => {
    setShowNewProductCard(false);
  };

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData);
      setShowNewProductCard(false);
      setMessage('Product added successfully');
    } catch (err) {
      if (err.message && err.message.includes('already exists')) {
        setMessage('Product name is already taken. Please choose a different name.');
      } else {
        setMessage('Failed to add product');
      }
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      await updateProduct(id, productData);
      setMessage('Product updated successfully');
    } catch (err) {
      setMessage('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setMessage('Product deleted successfully');
    } catch (err) {
      setMessage('Failed to delete product');
    }
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

      {error && (
        <p className="error-message">
          Error: {error}
        </p>
      )}

      {loading && (
        <p className="loading-message">
          Loading products...
        </p>
      )}

      <button
        onClick={handleAddClick}
        disabled={showNewProductCard}
        className="btn"
        style={{ marginBottom: '20px' }}
      >
        + Add Product
      </button>

      <ProductList
        products={products}
        onCreate={handleCreateProduct}
        onUpdate={handleUpdateProduct}
        onDelete={handleDeleteProduct}
        showNewProductCard={showNewProductCard}
        onCancelNewProduct={handleCancelNewProduct}
        clearMessage={() => setMessage('')}
      />
    </div>
  );
}

export default App;