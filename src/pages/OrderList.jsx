import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Text,
  Group,
  ScrollArea,
  Container,
} from "@mantine/core";
import "../index.css";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedOrders = [...orders].sort((a, b) => {
      if (field === "date") {
        return order === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (field === "total") {
        return order === "asc" ? a.total - b.total : b.total - a.total;
      }
      return 0;
    });

    setOrders(sortedOrders);
  };

  const handleDeleteOrder = (orderId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa đơn hàng này?"
    );
    if (confirmDelete) {
      const updatedOrders = orders.filter((order) => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      alert("Đơn hàng đã được xóa!");
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const filteredOrders = orders
    .filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((order) =>
      filterStatus === "all" ? true : order.status === filterStatus
    );

  return (
    <Container size="lg">
      <h2>Danh sách đơn hàng</h2>

      <Group position="apart" mb="md">
        <Input
          placeholder="Tìm kiếm đơn hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          data={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "Đang xử lý", label: "Đang xử lý" },
            { value: "Đã giao", label: "Đã giao" },
          ]}
          placeholder="Chọn trạng thái"
          styles={{
            input: { padding: "10px", fontSize: "16px" },
            dropdown: { maxHeight: "150px" },
          }}
        />
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover withBorder>
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>Mã đơn hàng</th>
              <th>Tên khách hàng</th>
              <th onClick={() => handleSort("total")}>Tổng giá trị</th>
              <th onClick={() => handleSort("date")}>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>
                  {new Intl.NumberFormat("vi-VN").format(order.total)} VND
                </td>
                <td>{new Date(order.date).toLocaleDateString("vi-VN")}</td>
                <td>
                  <Select
                    value={order.status}
                    onChange={(value) => handleStatusChange(order.id, value)}
                    data={[
                      { value: "Đang xử lý", label: "Đang xử lý" },
                      { value: "Đã giao", label: "Đã giao" },
                    ]}
                  />
                </td>
                <td>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Xem
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    variant="outline"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>

      <Modal
        opened={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Chi tiết đơn hàng"
      >
        {selectedOrder && (
          <>
            <Text>
              <strong>Mã đơn hàng:</strong> {selectedOrder.id}
            </Text>
            <Text>
              <strong>Tên khách hàng:</strong> {selectedOrder.customerName}
            </Text>
            <Text>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(selectedOrder.date).toLocaleDateString("vi-VN")}
            </Text>
            <Text>
              <strong>Trạng thái:</strong> {selectedOrder.status}
            </Text>
            <Text>
              <strong>Sản phẩm:</strong>
            </Text>
            <ul>
              {selectedOrder.items.map((item, index) => (
                <li key={index}>
                  {item.name} - Số lượng: {item.quantity} - Giá:{" "}
                  {new Intl.NumberFormat("vi-VN").format(item.prices[0])} VND
                </li>
              ))}
            </ul>
            <Text>
              <strong>Tổng giá trị:</strong>{" "}
              {new Intl.NumberFormat("vi-VN").format(selectedOrder.total)} VND
            </Text>
          </>
        )}
      </Modal>
    </Container>
  );
}

export default OrderList;
