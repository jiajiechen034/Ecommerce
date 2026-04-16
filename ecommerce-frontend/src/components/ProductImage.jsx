function ProductImage({ imageUrl }) {
  if (!imageUrl) return null;

  return (
    <div
      style={{
        width: '100%',
        height: '260px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        marginBottom: '12px',
        overflow: 'hidden',
      }}
    >
      <img
        src={`http://localhost:8080${imageUrl}`}
        alt="Product"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

export default ProductImage;
