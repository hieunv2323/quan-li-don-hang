import React, { useRef, useState } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorageUtils';
import Modal from '../components/Modal'; 

const CreateOrderForm = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const modalRef = useRef(); 
  const products = getFromLocalStorage('products') || [];

  const addProductToOrder = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setOrderItems((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleOrderSubmit = () => {
    if (!customerName.trim() || orderItems.length === 0) {
      modalRef.current.open();
      return;
    }

    const newOrder = {
      id: `o${Date.now()}`,
      customerName,
      items: orderItems,
      total: orderItems.reduce((sum, item) => sum + item.prices[0] * item.quantity, 0),
      date: new Date().toISOString(),
      status: 'Đang xử lý',
    };

    const existingOrders = getFromLocalStorage('orders') || [];
    saveToLocalStorage('orders', [...existingOrders, newOrder]);

    alert('Tạo đơn hàng thành công!');
    setOrderItems([]);
    setCustomerName('');
  };

  return (
    <div>
      <h1>Tạo đơn hàng mới</h1>
      <input
        type="text"
        placeholder="Tên khách hàng"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />
      <h2>Danh sách sản phẩm</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.prices[0]} VND
            <button onClick={() => addProductToOrder(product.id)}>Thêm</button>
          </li>
        ))}
      </ul>
      <h2>Sản phẩm trong đơn hàng</h2>
      <ul>
        {orderItems.map((item, index) => (
          <li key={index}>
            {item.name} - {item.quantity} x {item.prices[0]} VND
          </li>
        ))}
      </ul>
      <button onClick={handleOrderSubmit}>Tạo đơn hàng</button>

      <Modal ref={modalRef} buttonCaption="Đóng">
        <h3>Thông báo lỗi</h3>
        <p>Vui lòng nhập tên khách hàng và thêm ít nhất một sản phẩm vào đơn hàng.</p>
      </Modal>
    </div>
  );
};

export default CreateOrderForm;
