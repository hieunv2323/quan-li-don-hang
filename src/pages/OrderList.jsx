// src/pages/OrderList.jsx
import React, { useState, useEffect } from 'react';

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, []); 

  return (
    <div>
      <h2>Danh sách đơn hàng</h2>
      <table>
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Tên khách hàng</th>
            <th>Tổng giá trị</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
