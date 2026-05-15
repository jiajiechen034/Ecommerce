import Product from './Product';

function ProductList({
  products,
  canManage = false,
  onUpdate,
  onDelete,
  clearMessage = () => {},
  onAddToCart,
  getCartQuantityByProductId = () => 0,
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
            canManage={canManage}
            onUpdate={onUpdate}
            onDelete={onDelete}
            clearMessage={clearMessage}
            onAddToCart={onAddToCart}
            cartQuantity={getCartQuantityByProductId(product.id)}
          />
        ))
      )}
    </div>
  );
}

export default ProductList;