import { useEffect, useState } from 'react';
import ProductImage from './ProductImage';

function ProductDisplay({
  product,
  canManage = false,
  onEdit,
  onDelete,
  clearMessage = () => {},
  onAddToCart,
  cartQuantity = 0,
}) {
  const parsedPrice = Number(product.price);
  const displayPrice = Number.isFinite(parsedPrice)
    ? parsedPrice.toFixed(2)
    : product.price;

  return (
    <div className="product-card">

      <ProductImage imageUrl={product.imageUrl} />

      <h3 className="product-title">
        {product.name}
      </h3>

      <p className="product-description">
        {product.description}
      </p>

      <div className="product-details">
        <p className="product-detail-row product-price-row">
          <span className="product-detail-label">Price</span>
          <span className="product-detail-value product-price-value">
            ${displayPrice}
          </span>
        </p>

        <p className="product-detail-row">
          <span className="product-detail-label">Category</span>
          <span className="product-detail-value">
            {product.category || 'Uncategorized'}
          </span>
        </p>

        <p className="product-detail-row">
          <span className="product-detail-label">Quantity</span>
          <span className="product-detail-value">
            {product.quantity ?? 0}
          </span>
        </p>

        <p className="product-detail-row">
          <span className="product-detail-label">Added by</span>
          <span className="product-detail-value product-seller-value">
            {product.createdBy || 'Unknown'}
          </span>
        </p>
      </div>

      {canManage ? (
        <div className="product-actions">
          <button
            className="btn btn-secondary"
            onClick={onEdit}
          >
            Edit
          </button>

          <button
            className="btn btn-danger"
            onClick={() => {
              clearMessage();
              onDelete(product.id);
            }}
          >
            Delete
          </button>
        </div>
      ) : (
        onAddToCart && (
          <ProductAddToCart
            product={product}
            onAddToCart={onAddToCart}
            cartQuantity={cartQuantity}
          />
        )
      )}

    </div>
  );
}

function ProductAddToCart({ product, onAddToCart, cartQuantity = 0 }) {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = Number(product.quantity) || 1;
  const remainingQuantity = Math.max(0, maxQuantity - cartQuantity);
  const cannotAddMore = remainingQuantity <= 0;

  useEffect(() => {
    if (cannotAddMore) {
      setQuantity(1);
      return;
    }

    setQuantity((currentQuantity) => Math.min(currentQuantity, remainingQuantity));
  }, [cannotAddMore, remainingQuantity]);

  const handleAdd = () => {
    if (!cannotAddMore && quantity > 0 && quantity <= remainingQuantity) {
      onAddToCart(product, quantity);
    }
  };

  return (
    <div className="product-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 8 }}>
      <label style={{ display: 'flex', alignItems: 'center', fontWeight: 500, fontSize: 15, color: '#333' }}>
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          style={{
            width: 32,
            height: 32,
            border: '1px solid #ccc',
            borderRadius: '50%',
            background: quantity <= 1 ? '#e0e2e7' : '#f5f6fa',
            color: '#2357d5',
            fontSize: 20,
            fontWeight: 700,
            marginRight: 4,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          disabled={quantity <= 1}
        >
          -
        </button>
        <input
          type="number"
          min={1}
          max={Math.max(1, remainingQuantity)}
          value={quantity}
          onChange={(e) => {
            const rawValue = Number(e.target.value);
            const nextValue = Number.isFinite(rawValue) ? rawValue : 1;
            setQuantity(Math.max(1, Math.min(Math.max(1, remainingQuantity), nextValue)));
          }}
          aria-label="Quantity"
          style={{
            width: 48,
            padding: '4px 8px',
            border: '1px solid #ccc',
            borderRadius: 6,
            fontSize: 15,
            textAlign: 'center',
            margin: '0 4px',
            background: '#fafbfc',
            outline: 'none',
            transition: 'border 0.2s',
          }}
        />
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQuantity((q) => Math.min(Math.max(1, remainingQuantity), q + 1))}
          style={{
            width: 32,
            height: 32,
            border: '1px solid #ccc',
            borderRadius: '50%',
            background: quantity >= remainingQuantity || cannotAddMore ? '#e0e2e7' : '#f5f6fa',
            color: '#2357d5',
            fontSize: 20,
            fontWeight: 700,
            marginLeft: 4,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          disabled={quantity >= remainingQuantity || cannotAddMore}
        >
          +
        </button>
      </label>
      <button
        className="btn btn-primary"
        onClick={handleAdd}
        disabled={cannotAddMore}
        style={{
          padding: '7px 18px',
          fontSize: 15,
          borderRadius: 6,
          fontWeight: 600,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          background: cannotAddMore
            ? 'linear-gradient(90deg, #8a909f 0%, #6c7382 100%)'
            : 'linear-gradient(90deg, #4f8cff 0%, #2357d5 100%)',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          opacity: 1,
          transition: 'background 0.2s, opacity 0.2s',
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDisplay;