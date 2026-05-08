export function validateProductForm({ name, description, price }) {
  if (!name.trim()) {
    return 'Name is required';
  }

  if (!description.trim()) {
    return 'Description is required';
  }

  if (!price || isNaN(price)) {
    return 'Price must be a valid number';
  }

  if (parseFloat(price) < 0) {
    return 'Price cannot be negative';
  }

  return '';
}