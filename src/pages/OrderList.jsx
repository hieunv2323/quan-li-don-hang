import React, { useState, useEffect } from 'react';
import '../index.css';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, []);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);

    const sortedOrders = [...orders].sort((a, b) => {
      if (field === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (field === 'total') {
        return order === 'asc' ? a.total - b.total : b.total - a.total;
      }
      return 0;
    });

    setOrders(sortedOrders);
  };

  const handleDeleteOrder = (orderId) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?');
    if (confirmDelete) {
      const updatedOrders = orders.filter((order) => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      alert('Đơn hàng đã được xóa!');
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );

    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const filteredOrders = orders
    .filter((order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((order) => (filterStatus === 'all' ? true : order.status === filterStatus));

  return (
    <div>
      <h2>Danh sách đơn hàng</h2>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm đơn hàng theo tên hoặc mã đơn..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Dropdown lọc theo trạng thái */}
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
        <option value="all">Tất cả trạng thái</option>
        <option value="Đang xử lý">Đang xử lý</option>
        <option value="Đã giao">Đã giao</option>
      </select>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>Mã đơn hàng</th>
            <th>Tên khách hàng</th>
            <th onClick={() => handleSort('total')}>Tổng giá trị</th>
            <th onClick={() => handleSort('date')}>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{new Intl.NumberFormat('vi-VN').format(order.total)} VND</td>
              <td>{new Date(order.date).toLocaleDateString('vi-VN')}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã giao">Đã giao</option>
                </select>
              </td>
              <td>
                {/* Nút xem chi tiết với icon */}
                <button onClick={() => setSelectedOrder(order)}>
                  <i className="fas fa-eye"></i> Xem chi tiết
                </button>

                {/* Nút xóa đơn hàng với icon */}
                <button onClick={() => handleDeleteOrder(order.id)}>
                  <i className="fas fa-trash"></i> Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal hiển thị chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h3>Chi tiết đơn hàng</h3>
            <p><strong>Mã đơn hàng:</strong> {selectedOrder.id}</p>
            <p><strong>Tên khách hàng:</strong> {selectedOrder.customerName}</p>
            <p><strong>Ngày tạo:</strong> {new Date(selectedOrder.date).toLocaleDateString('vi-VN')}</p>
            <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
            <p><strong>Sản phẩm:</strong></p>
            <ul>
              {selectedOrder.items.map((item, index) => (
                <li key={index}>
                  {item.name} - Số lượng: {item.quantity} - Giá: {new Intl.NumberFormat('vi-VN').format(item.prices[0])} VND
                </li>
              ))}
            </ul>
            <p><strong>Tổng giá trị:</strong> {new Intl.NumberFormat('vi-VN').format(selectedOrder.total)} VND</p>
            <button onClick={() => setSelectedOrder(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderList;
