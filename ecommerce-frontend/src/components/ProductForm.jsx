import { useState } from 'react';
import { validateProductForm } from '../utils/validateProductForm';

function ProductForm({
  product,
  isNew = false,
  onCreate,
  onUpdate,
  onCancel,
  clearMessage,
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(
    product.price !== null && product.price !== undefined
      ? product.price.toString()
      : ''
  );
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (setter) => () => {
    if (error) setError('');
    clearMessage();
  };

  const handleSave = () => {
    const validationError = validateProductForm({ name, description, price });

    if (validationError) {
      setError(validationError);
      return;
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      price,
      imageFile,
    };

    if (isNew) {
      onCreate(productData).catch(() => {
        setError('Could not save product');
      });
    } else {
      onUpdate(product.id, productData).catch(() => {
        setError('Could not update product');
      });
    }
  };

  return (
    <div
      style={{
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        {isNew ? 'New Product' : 'Edit Product'}
      </h3>

      {error && (
        <p style={{ color: 'red', marginBottom: '12px' }}>
          {error}
        </p>
      )}

      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            handleInputChange();
          }}
          style={{
            width: '100%',
            padding: '10px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleInputChange();
          }}
          rows={5}
          style={{
            width: '100%',
            padding: '10px',
            boxSizing: 'border-box',
            resize: 'vertical',
            minHeight: '120px',
          }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            handleInputChange();
          }}
          style={{
            width: '100%',
            padding: '10px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImageFile(e.target.files[0] || null);
            handleInputChange();
          }}
        />
      </div>

      <button
        onClick={handleSave}
        style={{ marginRight: '8px', padding: '8px 12px' }}
      >
        Save
      </button>

      <button
        onClick={onCancel}
        style={{ padding: '8px 12px' }}
      >
        Cancel
      </button>
    </div>
  );
}

export default ProductForm;
