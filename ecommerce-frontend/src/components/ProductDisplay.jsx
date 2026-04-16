import ProductImage from './ProductImage';

function ProductDisplay({ product, onEdit, onDelete, clearMessage }) {
  return (
    <div
      style={{
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
      }}
    >
      <ProductImage imageUrl={product.imageUrl} />

      <h3 style={{ marginTop: 0, marginBottom: '8px' }}>
        {product.name}
      </h3>

      <p style={{ margin: '4px 0', whiteSpace: 'pre-wrap' }}>
        {product.description}
      </p>

      <p style={{ margin: '8px 0', fontWeight: 'bold' }}>
        ${product.price}
      </p>

      <button
        onClick={onEdit}
        style={{ marginRight: '8px', padding: '6px 10px' }}
      >
        Edit
      </button>

      <button
        onClick={() => {
          clearMessage();
          onDelete(product.id);
        }}
        style={{ padding: '6px 10px' }}
      >
        Delete
      </button>
    </div>
  );
}

export default ProductDisplay;
