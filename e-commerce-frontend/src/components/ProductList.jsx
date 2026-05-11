import Product from './Product';

function ProductList({
  products,
  onUpdate,
  onDelete,
  clearMessage,
}) {
  return (
    <div className="product-list">
      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        products.map((product) => (
          <Product
            key={product.id}
            product={product}
            onUpdate={onUpdate}
            onDelete={onDelete}
            clearMessage={clearMessage}
          />
        ))
      )}
    </div>
  );
}

export default ProductList;