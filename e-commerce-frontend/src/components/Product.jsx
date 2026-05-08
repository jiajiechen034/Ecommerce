import { useState } from 'react';
import ProductForm from './ProductForm';
import ProductDisplay from './ProductDisplay';

function Product({
  product,
  isNew = false,
  onCreate,
  onUpdate,
  onDelete,
  onCancelNew,
  clearMessage,
}) {
  const [isEditing, setIsEditing] = useState(isNew);

  const handleStartEdit = () => {
    setIsEditing(true);
    clearMessage();
  };

  const handleCancelEdit = () => {
    if (isNew) {
      onCancelNew();
    } else {
      setIsEditing(false);
    }
  };

  const handleSave = (productData) => {
    if (isNew) {
      return onCreate(productData);
    } else {
      return onUpdate(product.id, productData).then(() => {
        setIsEditing(false);
      });
    }
  };

  if (isEditing) {
    return (
      <ProductForm
        product={product}
        isNew={isNew}
        onCreate={handleSave}
        onUpdate={handleSave}
        onCancel={handleCancelEdit}
        clearMessage={clearMessage}
      />
    );
  }

  return (
    <ProductDisplay
      product={product}
      onEdit={handleStartEdit}
      onDelete={onDelete}
      clearMessage={clearMessage}
    />
  );
}

export default Product;