import Product from './Product';

function ProductList({
  products,
  onCreate,
  onUpdate,
  onDelete,
  showNewProductCard,
  onCancelNewProduct,
  clearMessage,
}) {
  return (
    <div>
      {showNewProductCard && (
        <Product
          isNew={true}
          product={{
            id: 'new',
            name: '',
            description: '',
            price: '',
            imageUrl: '',
          }}
          onCreate={onCreate}
          onCancelNew={onCancelNewProduct}
          clearMessage={clearMessage}
        />
      )}

      {products.length === 0 && !showNewProductCard ? (
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