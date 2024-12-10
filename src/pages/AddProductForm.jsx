import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  saveToLocalStorage,
  getFromLocalStorage,
} from "../utils/localStorageUtils";
import {
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Group,
  Alert,
} from "@mantine/core";

const AddProductForm = () => {
  const validationSchema = Yup.object({
    name: Yup.string().required("Tên sản phẩm không được bỏ trống"),
    quantity: Yup.number()
      .min(0, "Số lượng không thể âm")
      .required("Vui lòng nhập số lượng"),
    prices: Yup.string()
      .matches(
        /^(\d+(\.\d{1,2})?)(,\s*(\d+(\.\d{1,2})?))*$/,
        "Giá phải là số, cách nhau bởi dấu phẩy"
      )
      .required("Vui lòng nhập giá sản phẩm"),
  });

  const handleFormSubmit = (values, { resetForm }) => {
    const newProduct = {
      id: `p${Date.now()}`,
      ...values,
      prices: values.prices.split(",").map((price) => parseFloat(price.trim())),
      status: values.quantity === 0 ? "Hết hàng" : "Đang bán",
    };

    const existingProducts = getFromLocalStorage("products") || [];
    saveToLocalStorage("products", [...existingProducts, newProduct]);

    alert("Thêm sản phẩm thành công!");

    resetForm();
  };

  return (
    <Formik
      initialValues={{ name: "", quantity: 0, description: "", prices: "" }}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
      }) => (
        <Form style={{ maxWidth: 600, margin: "0 auto" }}>
          <h1>Thêm Sản Phẩm</h1>

          <TextInput
            label="Tên sản phẩm"
            placeholder="Nhập tên sản phẩm"
            required
            value={values.name}
            name="name"
            onChange={handleChange}
            error={errors.name && touched.name ? errors.name : null}
          />

          <NumberInput
            label="Số lượng"
            placeholder="Nhập số lượng"
            required
            min={0}
            value={values.quantity}
            onChange={(value) => setFieldValue("quantity", value || 0)}
            error={errors.quantity && touched.quantity ? errors.quantity : null}
          />

          <Textarea
            label="Miêu tả"
            placeholder="Miêu tả về sản phẩm"
            value={values.description}
            name="description"
            onChange={handleChange}
          />

          <TextInput
            label="Giá"
            placeholder="Nhập giá sản phẩm, cách nhau bởi dấu phẩy"
            required
            value={values.prices}
            name="prices"
            onChange={handleChange}
            error={errors.prices && touched.prices ? errors.prices : null}
          />

          <Group position="right" mt="md">
            <Button type="submit" color="green">
              Lưu sản phẩm
            </Button>
          </Group>

          {errors.submit && (
            <Alert color="red" mt="sm">
              {errors.submit}
            </Alert>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default AddProductForm;
