import React, { useState, useEffect } from "react";
import { getFromLocalStorage } from "../utils/localStorageUtils";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faLock,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import {
  Container,
  TextInput,
  Select,
  Button,
  Table,
  Alert,
  Group,
} from "@mantine/core";
import "../index.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const storedProducts = getFromLocalStorage("products");
    setProducts(storedProducts || []);
  }, []);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    const sortedProducts = [...products].sort((a, b) => {
      if (order === "asc") return a[field] > b[field] ? 1 : -1;
      return a[field] < b[field] ? 1 : -1;
    });
    setProducts(sortedProducts);
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      filterStatus === "all"
        ? true
        : product.status.toLowerCase() === filterStatus
    );

  const handleLockProduct = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, isLocked: !product.isLocked }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  return (
    <Container size="lg">
      <div className="product-list-container">
        <h1>Danh sách sản phẩm</h1>

        <Group position="apart" mb="md">
          <TextInput
            label="Tìm kiếm sản phẩm"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            label="Lọc theo trạng thái"
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            data={[
              { value: "all", label: "Tất cả" },
              { value: "đang bán", label: "Còn hàng" },
              { value: "hết hàng", label: "Hết hàng" },
            ]}
          />
        </Group>

        <Table striped highlightOnHover withBorder>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>Tên sản phẩm</th>
              <th onClick={() => handleSort("quantity")}>Số lượng</th>
              <th onClick={() => handleSort("prices")}>Giá</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.prices.join(", ")}</td>
                <td>{product.description || "Không có mô tả"}</td>
                <td>{product.status}</td>
                <td>
                  {product.isLocked ? (
                    <span>
                      <FontAwesomeIcon icon={faLock} /> Khóa
                    </span>
                  ) : (
                    <Link to={`/edit/${product.id}`}>
                      <Button variant="outline" color="blue" size="xs">
                        <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="outline"
                    color={product.isLocked ? "green" : "red"}
                    size="xs"
                    onClick={() => handleLockProduct(product.id)}
                  >
                    <FontAwesomeIcon
                      icon={product.isLocked ? faUnlock : faLock}
                    />{" "}
                    {product.isLocked ? "Mở khóa" : "Khóa"}
                  </Button>

                  <Button
                    variant="outline"
                    color="red"
                    size="xs"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Bạn có chắc chắn muốn xóa sản phẩm này?"
                        )
                      ) {
                        handleDeleteProduct(product.id);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {filteredProducts.length === 0 && (
          <Alert color="yellow">Không có sản phẩm nào .</Alert>
        )}
      </div>
    </Container>
  );
};

export default ProductList;
