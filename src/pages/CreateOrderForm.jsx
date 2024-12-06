import React, { useRef, useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorageUtils';
import Modal from '../components/Modal';
import '../index.css'; // Sử dụng CSS chung

const CreateOrderForm = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const modalRef = useRef();
  const products = getFromLocalStorage('products') || [];

  const addProductToOrder = (productId) => {
    const product = products.find((p) => p.id === productId);

    if (product) {
      const existingProduct = orderItems.find((item) => item.id === productId);

      if (existingProduct) {
        setOrderItems((prev) =>
          prev.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        setOrderItems((prev) => [...prev, { ...product, quantity: 1 }]);
      }
    }
  };

  useEffect(() => {
    const newTotalAmount = orderItems.reduce((sum, item) => sum + item.prices[0] * item.quantity, 0);
    setTotalAmount(newTotalAmount);
  }, [orderItems]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
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
      total: totalAmount,
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
    <div className="product-form">
      <h1>Tạo Đơn Hàng</h1>
      <input
        type="text"
        placeholder="Tên khách hàng"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />
      <h2>Danh Sách Sản Phẩm</h2>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id}>
            <span>
              {product.name} - {formatCurrency(product.prices[0])} VND
            </span>
            <button onClick={() => addProductToOrder(product.id)}>Thêm</button>
          </li>
        ))}
      </ul>
      <h2>Sản Phẩm Trong Đơn Hàng</h2>
      <ul className="order-items">
        {orderItems.map((item, index) => (
          <li key={index}>
            <span>
              {item.name} - {item.quantity} x {formatCurrency(item.prices[0])} VND
            </span>
          </li>
        ))}
      </ul>
      <div className="total-amount">Tổng tiền: {formatCurrency(totalAmount)} VND</div>
      <button onClick={handleOrderSubmit}>Tạo Đơn Hàng</button>
      <Modal ref={modalRef} buttonCaption="Đóng">
        <h3>Thông Báo Lỗi</h3>
        <p>Vui lòng nhập tên khách hàng và thêm ít nhất một sản phẩm vào đơn hàng.</p>
      </Modal>
    </div>
  );
};

export default CreateOrderForm;
