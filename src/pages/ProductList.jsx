import React, { useState, useEffect } from 'react';
import { getFromLocalStorage } from '../utils/localStorageUtils';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const storedProducts = getFromLocalStorage('products');
    setProducts(storedProducts);
  }, []);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    const sortedProducts = [...products].sort((a, b) => {
      if (order === 'asc') return a[field] > b[field] ? 1 : -1;
      return a[field] < b[field] ? 1 : -1;
    });
    setProducts(sortedProducts);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Tên sản phẩm</th>
            <th onClick={() => handleSort('quantity')}>Số lượng</th>
            <th onClick={() => handleSort('prices')}>Giá</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.prices.join(', ')}</td>
              <td>{product.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
