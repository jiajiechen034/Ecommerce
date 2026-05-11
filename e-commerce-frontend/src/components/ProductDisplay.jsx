import ProductImage from './ProductImage';

function ProductDisplay({
  product,
  canManage = false,
  onEdit,
  onDelete,
  clearMessage,
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

      {canManage && (
        <div className="product-actions">
          <button
            className="btn"
            onClick={onEdit}
          >
            Edit
          </button>

          <button
            className="btn"
            onClick={() => {
              clearMessage();
              onDelete(product.id);
            }}
          >
            Delete
          </button>
        </div>
      )}

    </div>
  );
}

export default ProductDisplay;