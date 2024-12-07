import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import AddProductForm from './pages/AddProductForm';
import CreateOrderForm from './pages/CreateOrderForm';
import OrderList from './pages/OrderList';
import EditProduct from './pages/EditProduct'
import './index.css'; 

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State để mở/đóng sidebar

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Lật trạng thái mở/đóng
  };

  const closeSidebar = () => {
    setSidebarOpen(false); // Đóng sidebar
  };

  return (
    <BrowserRouter>
      <div className="App">
        <h1>Ứng Dụng Quản Lý Sản Phẩm và Đơn Hàng</h1>
  
        <button className="menu-btn" onClick={toggleSidebar}>
          <span>&#9776;</span> 
        </button>

        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button className="close-btn" onClick={closeSidebar}>
            &times;
          </button>
          <h1>QUẢN LÝ</h1>
          <div className="nav-item"><a href="/products">Sản phẩm</a></div>
          <div className="nav-item"><a href="/add-product">Tạo sản phẩm</a></div>
          <div className="nav-item"><a href="/create-order">Tạo đơn hàng</a></div>
          <div className="nav-item"><a href="/orders">Danh sách đơn hàng</a></div> 
        </div>

        <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/add-product" element={<AddProductForm />} />
          <Route path="/create-order" element={<CreateOrderForm />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/edit/:id" element={<EditProduct />} />
          
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
