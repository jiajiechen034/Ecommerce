import { useRef, useState } from 'react';
import { validateProductForm } from '../utils/validateProductForm';

const IMAGE_MAX_SIZE = 2 * 1024 * 1024;

function ProductForm({
  product,
  isNew = false,
  onCreate,
  onUpdate,
  onCancel,
  clearMessage,
}) {

  const [name, setName] = useState(product.name);

  const [description, setDescription] =
    useState(product.description);

  const [price, setPrice] = useState(
    product.price !== null &&
    product.price !== undefined
      ? product.price.toString()
      : ''
  );

  const [quantity, setQuantity] = useState(
    product.quantity !== null &&
    product.quantity !== undefined
      ? product.quantity.toString()
      : ''
  );

  const [category, setCategory] =
    useState(product.category || '');

  const [imageFile, setImageFile] =
    useState(null);

  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setQuantity('');
    setCategory('');
    setImageFile(null);
    setError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = () => {

    if (error) {
      setError('');
    }

    clearMessage();
  };

  const handleSave = () => {

    const validationError =
      validateProductForm({
        name,
        description,
        price,
        category,
      });

    if (validationError) {

      setError(validationError);

      return;
    }

    const productData = {

      name: name.trim(),

      description: description.trim(),

      price,

      quantity,

      category: category.trim(),

      imageFile,
    };

    if (isNew) {

      onCreate(productData)
        .then(() => {
          resetForm();
        })
        .catch((err) => {

          if (err.message) {
            setError(err.message);
          } else {
            setError('Could not save product');
          }
        });

    } else {

      onUpdate(productData).catch((err) => {

        if (err?.message) {
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
        <select
          className="form-input"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            handleInputChange();
          }}
        >
          <option value="">
            Select Category
          </option>

          <option value="Fashion">
            Fashion
          </option>

          <option value="Electronics">
            Electronics
          </option>

          <option value="Books">
            Books
          </option>

          <option value="Home">
            Home
          </option>

          <option value="Gaming">
            Gaming
          </option>

          <option value="Sports">
            Sports
          </option>

          <option value="Beauty">
            Beauty
          </option>
        </select>
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
          className="form-input"
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            handleInputChange();
          }}
        />
      </div>

      <div className="form-group">
        <input
          ref={fileInputRef}
          className="form-file"
          type="file"
          accept="image/*"
          onChange={(e) => {

            const file =
              e.target.files[0] || null;

            if (
              file &&
              file.size > IMAGE_MAX_SIZE
            ) {

              setError(
                'Image is too large. Maximum size is 2MB.'
              );

              setImageFile(null);

              return;
            }

            setImageFile(file);

            handleInputChange();
          }}
        />

        <p className="form-caption">
          Max image size: 2MB.
        </p>
      </div>

      <div className="form-actions">

        <button
          className="btn"
          onClick={handleSave}
        >
          Save
        </button>

        <button
          className="btn"
          onClick={onCancel}
        >
          Cancel
        </button>

      </div>

    </div>
  );
}

export default ProductForm;