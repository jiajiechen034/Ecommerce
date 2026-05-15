import { useState } from 'react';
import ProductForm from './ProductForm';
import ProductDisplay from './ProductDisplay';

function Product({
  product,
  canManage = false,
  onUpdate,
  onDelete,
  clearMessage = () => {},
  onAddToCart,
  cartQuantity = 0,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleStartEdit = () => {
    setIsEditing(true);
    clearMessage();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = (productData) => {
    return onUpdate(product.id, productData).then(() => {
      setIsEditing(false);
    });
  };

  if (canManage && isEditing) {
    return (
      <ProductForm
        product={product}
        onUpdate={handleSave}
        onCancel={handleCancelEdit}
        clearMessage={clearMessage}
      />
    );
  }

  return (
    <ProductDisplay
      product={product}
      canManage={canManage}
      onEdit={handleStartEdit}
      onDelete={onDelete}
      clearMessage={clearMessage}
      onAddToCart={onAddToCart}
      cartQuantity={cartQuantity}
    />
  );
}

export default Product;