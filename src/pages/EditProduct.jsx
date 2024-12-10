import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorageUtils";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  // Schema xác thực
  const validationSchema = Yup.object({
    name: Yup.string().required("Tên sản phẩm không được bỏ trống"),
    quantity: Yup.number()
      .min(0, "Số lượng không thể âm")
      .required("Vui lòng nhập số lượng"),
    prices: Yup.string()
      .matches(
        /^(\d+(\.\d{1,2})?)(,\s*(\d+(\.\d{1,2})?))*$/,
        "Giá phải là số, ngăn cách bởi dấu phẩy"
      )
      .required("Vui lòng nhập giá sản phẩm"),
  });

  // Lấy dữ liệu sản phẩm từ LocalStorage
  useEffect(() => {
    const storedProducts = getFromLocalStorage("products");
    const foundProduct = storedProducts?.find((p) => p.id === id);
    if (!foundProduct) {
      alert("Không tìm thấy sản phẩm!");
      navigate("/products");
    } else {
      setInitialValues({
        name: foundProduct.name || "",
        quantity: foundProduct.quantity || 0,
        description: foundProduct.description || "",
        prices: foundProduct.prices?.join(", ") || "",
        isLocked: foundProduct.isLocked || false,
      });
      setLoading(false);
    }
  }, [id, navigate]);

  const handleSubmit = (values) => {
    const updatedProducts = getFromLocalStorage("products").map((p) =>
      p.id === id
        ? {
            ...p,
            ...values,
            prices: values.prices
              .split(",")
              .map((price) => parseFloat(price.trim())),
          }
        : p
    );

    saveToLocalStorage("products", updatedProducts);
    alert("Chỉnh sửa sản phẩm thành công!");
    navigate("/products");
  };

  if (loading) return <LoadingOverlay visible />;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize // Cho phép cập nhật giá trị khi initialValues thay đổi
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form style={{ maxWidth: 600, margin: "0 auto" }}>
          <h1>Chỉnh sửa sản phẩm</h1>

          <TextInput
            label="Tên sản phẩm"
            placeholder="Nhập tên sản phẩm"
            value={values.name}
            error={errors.name && touched.name ? errors.name : null}
            withAsterisk
            onChange={(event) =>
              setFieldValue("name", event.currentTarget.value)
            }
          />

          <NumberInput
            label="Số lượng"
            placeholder="Nhập số lượng"
            value={values.quantity}
            error={errors.quantity && touched.quantity ? errors.quantity : null}
            min={0}
            withAsterisk
            onChange={(value) => setFieldValue("quantity", value)}
          />

          <Textarea
            label="Miêu tả"
            placeholder="Nhập miêu tả sản phẩm"
            value={values.description}
            onChange={(event) =>
              setFieldValue("description", event.currentTarget.value)
            }
          />

          <TextInput
            label="Giá (ngăn cách bởi dấu phẩy)"
            placeholder="VD: 100000, 200000, 300000"
            value={values.prices}
            error={errors.prices && touched.prices ? errors.prices : null}
            withAsterisk
            onChange={(event) =>
              setFieldValue("prices", event.currentTarget.value)
            }
          />

          <Group position="right" mt="md">
            <Button
              type="button"
              color="red"
              onClick={() => navigate("/products")}
            >
              Hủy bỏ
            </Button>
            <Button
              color="green"
              type="submit"
              disabled={initialValues.isLocked}
            >
              Lưu chỉnh sửa
            </Button>
          </Group>
        </Form>
      )}
    </Formik>
  );
};

export default EditProduct;
