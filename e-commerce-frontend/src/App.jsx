import { useState } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import { useProducts } from './hooks/useProducts';

function App() {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [message, setMessage] = useState('');
  const [page, setPage] = useState('shopping');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData);
      setMessage('Product added successfully');
      setPage('shopping');
    } catch (err) {
      setMessage('Failed to add product');
      throw err;
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      await updateProduct(id, productData);
      setMessage('Product updated successfully');
    } catch (err) {
      setMessage('Failed to update product');
      throw err;
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

  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ].sort();

  const filteredProducts = products.filter((product) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchesSearch =
      normalizedSearch === ''
      || product.name?.toLowerCase().includes(normalizedSearch)
      || product.description?.toLowerCase().includes(normalizedSearch)
      || product.category?.toLowerCase().includes(normalizedSearch);

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
      <nav className="navbar">
        <div className="navbar-logo">
          My Store
        </div>

        <div className="navbar-links">
          <button
            className={`nav-link ${page === 'shopping' ? 'active-nav' : ''}`}
            onClick={() => setPage('shopping')}
          >
            Shop
          </button>

          <button
            className={`nav-link ${page === 'add' ? 'active-nav' : ''}`}
            onClick={() => setPage('add')}
          >
            Add Product
          </button>
        </div>
      </nav>

      {message && (
        <p className="loading-message">
          {message}
        </p>
      )}

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

      {page === 'shopping' && (
        <>
          <div className="shop-controls">
            <input
              className="search-input"
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <ProductList
            products={filteredProducts}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
            clearMessage={() => setMessage('')}
          />
        </>
      )}

      {page === 'add' && (
        <>
          <h2>Add Product</h2>

          <ProductForm
            product={{
              name: '',
              description: '',
              price: '',
              category: '',
              imageUrl: '',
            }}
            isNew={true}
            onCreate={handleCreateProduct}
            onCancel={() => setPage('shopping')}
            clearMessage={() => setMessage('')}
          />
        </>
      )}
    </div>
  );
}

export default App;