import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorageUtils';
import '../index.css'; 

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const storedProducts = getFromLocalStorage('products');
    const foundProduct = storedProducts?.find((p) => p.id === id);
    setProduct(foundProduct || {});
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product.isLocked) {
      alert('Sản phẩm này đã bị khóa, không thể chỉnh sửa!');
      return;
    }
    const updatedProducts = getFromLocalStorage('products').map((p) =>
      p.id === id ? { ...p, ...product } : p
    );
    saveToLocalStorage('products', updatedProducts);
    alert('Chỉnh sửa sản phẩm thành công!');
    navigate('/products');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="product-form">
  <h1>Chỉnh sửa sản phẩm</h1>
  <div>
    <label>Tên sản phẩm</label>
    <input
      type="text"
      value={product.name || ''}
      onChange={(e) => setProduct({ ...product, name: e.target.value })}
    />
  </div>
  <div>
    <label>Số lượng</label>
    <input
      type="number"
      value={product.quantity || ''}
      onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
    />
  </div>
  <div>
    <label>Miêu tả</label>
    <textarea
      value={product.description || ''}
      onChange={(e) => setProduct({ ...product, description: e.target.value })}
    />
  </div>
  <div>
    <label>Giá</label>
    <input
      type="text"
      value={product.prices?.join(', ') || ''}
      onChange={(e) =>
        setProduct({
          ...product,
          prices: e.target.value.split(',').map((price) => parseInt(price.trim(), 10)),
        })
      }
    />
  </div>
  <button type="submit">Lưu chỉnh sửa</button>
</form>

  );
};

export default EditProduct;
