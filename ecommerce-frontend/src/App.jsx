import { useEffect, useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const fetchProducts = () => {
    fetch('http://localhost:8080/api/products')
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = () => {
    fetch('http://localhost:8080/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
      }),
    })
      .then(() => {
        setName('');
        setDescription('');
        setPrice('');
        fetchProducts();
      })
      .catch(console.error);
  };

  const deleteProduct = (id) => {
    fetch(`http://localhost:8080/api/products/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchProducts();
      })
      .catch(console.error);
  };

  return (
    <div>
      <h1>Products</h1>

      <ProductForm
        name={name}
        description={description}
        price={price}
        setName={setName}
        setDescription={setDescription}
        setPrice={setPrice}
        onAddProduct={createProduct}
      />

      <ProductList
        products={products}
        onDelete={deleteProduct}
      />
    </div>
  );
}

export default App;