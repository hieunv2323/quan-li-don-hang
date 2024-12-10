import React, { useState, useEffect } from "react";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorageUtils";
import {
  TextInput,
  Button,
  List,
  Group,
  Modal,
  Table,
  Text,
} from "@mantine/core";

const CreateOrderForm = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [modalOpened, setModalOpened] = useState(false);
  const products = getFromLocalStorage("products") || [];

  const addProductToOrder = (productId) => {
    const product = products.find((p) => p.id === productId);

    if (product) {
      const existingProduct = orderItems.find((item) => item.id === productId);

      if (existingProduct) {
        setOrderItems((prev) =>
          prev.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setOrderItems((prev) => [...prev, { ...product, quantity: 1 }]);
      }
    }
  };

  useEffect(() => {
    const newTotalAmount = orderItems.reduce(
      (sum, item) => sum + item.prices[0] * item.quantity,
      0
    );
    setTotalAmount(newTotalAmount);
  }, [orderItems]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const handleOrderSubmit = () => {
    if (!customerName.trim() || orderItems.length === 0) {
      setModalOpened(true);
      return;
    }

    const newOrder = {
      id: `o${Date.now()}`,
      customerName,
      items: orderItems,
      total: totalAmount,
      date: new Date().toISOString(),
      status: "Đang xử lý",
    };

    const existingOrders = getFromLocalStorage("orders") || [];
    saveToLocalStorage("orders", [...existingOrders, newOrder]);

    alert("Tạo đơn hàng thành công!");
    setOrderItems([]);
    setCustomerName("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>Tạo đơn hàng</h1>

      <TextInput
        label="Tên khách hàng"
        placeholder="Nhập tên khách hàng"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
        mb="lg"
      />

      <Text weight={600} size="md" mb="sm">
        Danh Sách Sản Phẩm
      </Text>
      <Table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{formatCurrency(product.prices[0])} VND</td>
              <td>
                <Button
                  size="xs"
                  variant="outline"
                  color="blue"
                  onClick={() => addProductToOrder(product.id)}
                >
                  Thêm
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Text weight={600} size="md" mt="lg" mb="sm">
        Sản Phẩm Trong Đơn Hàng
      </Text>
      {orderItems.length > 0 ? (
        <List spacing="xs">
          {orderItems.map((item) => (
            <List.Item key={item.id}>
              {item.name} - {item.quantity} x {formatCurrency(item.prices[0])}{" "}
              VND
            </List.Item>
          ))}
        </List>
      ) : (
        <Text color="dimmed">Không có sản phẩm nào trong đơn hàng</Text>
      )}

      <Text align="right" weight={700} size="lg" mt="lg">
        Tổng tiền: {formatCurrency(totalAmount)} VND
      </Text>

      <Group position="right" mt="lg">
        <Button onClick={handleOrderSubmit} color="green">
          Tạo Đơn Hàng
        </Button>
      </Group>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Thông Báo Lỗi"
      >
        <Text>
          Vui lòng nhập tên khách hàng và thêm ít nhất một sản phẩm vào đơn
          hàng.
        </Text>
      </Modal>
    </div>
  );
};

export default CreateOrderForm;
