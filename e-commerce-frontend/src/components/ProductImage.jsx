import { API_BASE_URL } from '../config/api';

function ProductImage({ imageUrl }) {
  if (!imageUrl) return null;

  return (
    <div className="product-image">
      <img
        src={`${API_BASE_URL}${imageUrl}`}
        alt="Product"
      />
    </div>
  );
}

export default ProductImage;
