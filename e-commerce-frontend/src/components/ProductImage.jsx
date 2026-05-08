function ProductImage({ imageUrl }) {
  if (!imageUrl) return null;

  return (
    <div className="product-image">
      <img
        src={`http://localhost:8080${imageUrl}`}
        alt="Product"
      />
    </div>
  );
}

export default ProductImage;
