import { useEffect, useState } from 'react';
import './App.css';

import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import Cart from './components/Cart';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import { useProducts } from './hooks/useProducts';

const getCartStorageKey = (email) =>
  `cartItems:${email.trim().toLowerCase()}`;

const readStoredCart = (email) => {
  if (!email) {
    return [];
  }

  const storedCart = localStorage.getItem(getCartStorageKey(email));

  if (!storedCart) {
    return [];
  }

  try {
    const parsedCart = JSON.parse(storedCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
};

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
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const getCartQuantityByProductId = (productId) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);
    return item?.quantity || 0;
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setCartItems(readStoredCart(parsedUser?.email));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUser?.email) {
      return;
    }

    localStorage.setItem(
      getCartStorageKey(currentUser.email),
      JSON.stringify(cartItems)
    );
  }, [cartItems, currentUser]);

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData);
      setMessage('Product added successfully');
    } catch (err) {
      setMessage('Failed to add product');
      throw err;
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCartItems(readStoredCart(user?.email));

    localStorage.setItem(
      'currentUser',
      JSON.stringify(user)
    );

    setPage('shopping');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]);
    localStorage.removeItem('currentUser');
    setPage('shopping');
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

      setCartItems((items) =>
        items.filter((item) => item.id !== id)
      );
    } catch {
      setMessage('Failed to delete product');
    }
  };


  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);
      const maxQty = Number(product.quantity) || 1;
      const existingQty = existing?.quantity || 0;
      const remainingQty = Math.max(0, maxQty - existingQty);
      const addQty = Math.max(1, Math.min(quantity, remainingQty));

      if (remainingQty <= 0) {
        setMessage('Cannot add more than available quantity');
        return items;
      }

      if (existing) {
        setMessage('Product quantity updated in cart');
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + addQty }
            : item
        );
      } else {
        setMessage('Product added to cart');
        return [...items, { ...product, quantity: addQty }];
      }
    });
  };


  const handleRemoveFromCart = (id) => {
    setCartItems(
      cartItems.filter((item) => item.id !== id)
    );
    setMessage('Product removed from cart');
  };

  const handleClearCart = () => {
    setCartItems([]);
    setMessage('Cart cleared');
  };

  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

  const filteredProducts = products.filter((product) => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    const matchesSearch =
      normalizedSearch === ''
      || product.name?.toLowerCase().includes(normalizedSearch)
      || product.description?.toLowerCase().includes(normalizedSearch)
      || product.category?.toLowerCase().includes(normalizedSearch);

    const matchesCategory =
      selectedCategory === 'all'
      || product.category === selectedCategory;

    const currentUserEmail =
      currentUser?.email?.trim().toLowerCase();

    const productOwnerEmail =
      product.createdBy?.trim().toLowerCase();

    const isNotOwnedByCurrentUser =
      !currentUserEmail
      || !productOwnerEmail
      || productOwnerEmail !== currentUserEmail;

    return matchesSearch && matchesCategory && isNotOwnedByCurrentUser;
  });

  const userProducts = currentUser
    ? products.filter((product) => {
        if (!product.createdBy || !currentUser.email) {
          return false;
        }

        return (
          product.createdBy.trim().toLowerCase()
          === currentUser.email.trim().toLowerCase()
        );
      })
    : [];

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
          Store
        </div>

        <div className="navbar-links">
          <button
            className={`nav-link ${
              page === 'shopping' ? 'active-nav' : ''
            }`}
            onClick={() => setPage('shopping')}
          >
            Shop
          </button>

          <button
            className={`nav-link ${
              page === 'cart' ? 'active-nav' : ''
            }`}
            onClick={() => setPage('cart')}
          >
            Cart <span className="nav-count-badge">{cartItemCount}</span>
          </button>

          {currentUser && (
            <button
              className={`nav-link ${
                page === 'add' ? 'active-nav' : ''
              }`}
              onClick={() => setPage('add')}
            >
              Add Product
            </button>
          )}

          {currentUser ? (
            <button
              className="nav-link"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className={`nav-link ${
                page === 'login' ? 'active-nav' : ''
              }`}
              onClick={() => setPage('login')}
            >
              Login
            </button>
          )}
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
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
            >
              <option value="all">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <ProductList
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            getCartQuantityByProductId={getCartQuantityByProductId}
          />
        </>
      )}

      {page === 'cart' && (
        <Cart
          cartItems={cartItems}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
        />
      )}

      {page === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          setPage={setPage}
        />
      )}

      {page === 'register' && (
        <RegisterPage setPage={setPage} />
      )}

      {page === 'add' && (
        <>
          <h2>Add Product</h2>

          <ProductForm
            product={{
              name: '',
              description: '',
              price: '',
              quantity: '',
              category: '',
              imageUrl: '',
            }}
            isNew={true}
            onCreate={(productData) =>
              handleCreateProduct({
                ...productData,
                createdBy: currentUser?.email || '',
              })
            }
            onCancel={() => setPage('shopping')}
            clearMessage={() => setMessage('')}
          />

          <h2>My Products</h2>

          <ProductList
            products={userProducts}
            canManage={true}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
            clearMessage={() => setMessage('')}
          />
        </>
      )}
    </div>
  );
}

export default App;