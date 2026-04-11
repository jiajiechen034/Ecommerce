function Product({ product, onDelete }) {
  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <button onClick={() => onDelete(product.id)}>Delete</button>
    </div>
  );
}

export default Product;
