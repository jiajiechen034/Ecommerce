import { useState } from 'react';
import { validateProductForm } from '../utils/validateProductForm';

const IMAGE_MAX_SIZE = 2 * 1024 * 1024; // 2MB

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
  const [price, setPrice] = useState(product.price !== null && product.price !== undefined ? product.price.toString() : '');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [category, setCategory] = useState(product.category || '');

  const handleInputChange = () => {
    if (error) setError('');
    clearMessage();
  };

  const handleSave = () => {
    const validationError = validateProductForm({name, description, price, category});

    if (validationError) {
      setError(validationError);
      return;
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      imageFile,
    };

    if (isNew) {
      onCreate(productData).catch((err) => {
        if (err.message) {
          setError(err.message);
        } else {
          setError('Could not save product');
        }
      });
    } else {
      onUpdate(product.id, productData).catch((err) => {
        if (err && err.message) {
          setError(err.message);
        } else {
          setError('Could not update product');
        }
      });
    }
  };

  return (
    <div className="form-card">
      <h3 className="form-title">
        {isNew ? 'New Product' : 'Edit Product'}
      </h3>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <div className="form-group">
        <input
          className="form-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            handleInputChange();
          }}
        />
      </div>

      <div className="form-group">
        <textarea
          className="form-textarea"
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleInputChange();
          }}
          rows={5}
        />
      </div>
      
      <div className="form-group">
        <input
          className="form-input"
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            handleInputChange();
          }}
        />
      </div>

      <div className="form-group">
        <input
          className="form-input"
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            handleInputChange();
          }}
        />
      </div>

      <div className="form-group">
        <input
          className="form-file"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0] || null;
            if (file && file.size > IMAGE_MAX_SIZE) {
              setError('Image is too large. Maximum size is 2MB.');
              setImageFile(null);
              return;
            }
            setImageFile(file);
            handleInputChange();
          }}
        />
        <p className="form-caption">Max image size: 2MB.</p>
      </div>

      <div className="form-actions">
        <button className="btn" onClick={handleSave}>
          Save
        </button>

        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ProductForm;
