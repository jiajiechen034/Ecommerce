import ProductImage from './ProductImage';

function ProductDisplay({ product, onEdit, onDelete, clearMessage }) {
  return (
    <div className="product-card">
      <ProductImage imageUrl={product.imageUrl} />

      <h3 className="product-title">
        {product.name}
      </h3>

      <p className="product-description">
        {product.description}
      </p>

      <p className="product-category">
        Category: {product.category || 'Uncategorized'}
      </p>

      <p className="product-price">
        ${product.price}
      </p>

      <div className="product-actions">
        <button className="btn" onClick={onEdit}>
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
    </div>
  );
}

export default ProductDisplay;
