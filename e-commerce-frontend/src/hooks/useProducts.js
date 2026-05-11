import { useState, useEffect } from 'react';

export function useProducts() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const fetchProducts = async () => {

    setLoading(true);

    setError(null);

    try {

      const res =
        await fetch('http://localhost:8080/api/products');

      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await res.json();

      setProducts(data);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  const createProduct = async (productData) => {

    const formData = new FormData();

    formData.append('name', productData.name);

    formData.append(
      'description',
      productData.description
    );

    formData.append(
      'category',
      productData.category
    );

    formData.append(
      'price',
      productData.price
    );

    formData.append(
      'quantity',
      productData.quantity
    );

    formData.append(
      'createdBy',
      productData.createdBy
    );

    if (productData.imageFile) {

      formData.append(
        'image',
        productData.imageFile
      );
    }

    const res = await fetch(
      'http://localhost:8080/api/products',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) {

      if (res.status === 400) {

        throw new Error(
          'Image file must be 2MB or smaller.'
        );
      }

      throw new Error('Failed to create product');
    }

    await fetchProducts();
  };

  const updateProduct = async (id, productData) => {

    const formData = new FormData();

    formData.append('name', productData.name);

    formData.append(
      'description',
      productData.description
    );

    formData.append(
      'category',
      productData.category
    );

    formData.append(
      'price',
      productData.price
    );

    formData.append(
      'quantity',
      productData.quantity
    );

    if (productData.imageFile) {

      formData.append(
        'image',
        productData.imageFile
      );
    }

    const res = await fetch(
      `http://localhost:8080/api/products/${id}`,
      {
        method: 'PUT',
        body: formData,
      }
    );

    if (!res.ok) {

      if (res.status === 400) {

        throw new Error(
          'Image file must be 2MB or smaller.'
        );
      }

      throw new Error('Failed to update product');
    }

    await fetchProducts();
  };

  const deleteProduct = async (id) => {

    const res = await fetch(
      `http://localhost:8080/api/products/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (!res.ok) {

      throw new Error('Failed to delete product');
    }

    await fetchProducts();
  };

  useEffect(() => {

    fetchProducts();

  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}