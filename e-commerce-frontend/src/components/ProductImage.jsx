import { API_BASE_URL } from '../config/api';

function ProductImage({ imageUrl }) {
  if (!imageUrl) return null;

  const imageSrc = imageUrl.startsWith('http')
    ? imageUrl
    : `${API_BASE_URL}${imageUrl}`;

  return (
    <div className="product-image">
      <img
        src={imageSrc}
        alt="Product"
      />
    </div>
  );
}

export default ProductImage;