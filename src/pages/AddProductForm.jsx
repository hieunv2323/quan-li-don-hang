import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorageUtils';
import '../index.css';

const AddProductForm = () => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Tên sản phẩm không được bỏ trống'),
    quantity: Yup.number()
      .min(0, 'Số lượng không thể âm')
      .required('Vui lòng nhập số lượng'),
    prices: Yup.string()
      .matches(/^(\d+(\.\d{1,2})?)(,\s*(\d+(\.\d{1,2})?))*$/, 'Giá phải là số')
      .required('Vui lòng nhập giá sản phẩm'),
  });

  const handleFormSubmit = (values, { resetForm }) => {
  const newProduct = {
        id: `p${Date.now()}`,
        ...values,
        prices: values.prices.split(',').map((price) => parseInt(price.trim(), 10)),
        status: values.quantity === 0 ? 'Hết hàng' : 'Đang bán',
      };

      const existingProducts = getFromLocalStorage('products') || [];
      saveToLocalStorage('products', [...existingProducts, newProduct]);

      alert('Thêm sản phẩm thành công!');
      resetForm();
  };

  return (
    <>
      <Formik
        initialValues={{ name: '', quantity: 0, description: '', prices: '' }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ errors, touched }) => (
          <Form className="product-form">
            <h1>Thêm Sản Phẩm</h1>
            <div>
              <label>Tên sản phẩm</label>
              <Field name="name" type="text" />
              {errors.name && touched.name && <div className="error">{errors.name}</div>}
            </div>
            <div>
              <label>Số lượng</label>
              <Field name="quantity" type="number" />
              {errors.quantity && touched.quantity && <div className="error">{errors.quantity}</div>}
            </div>
            <div>
              <label>Miêu tả</label>
              <Field name="description" as="textarea" />
            </div>
            <div>
              <label>Giá</label>
              <Field name="prices" type="text" />
              {errors.prices && touched.prices && <div className="error">{errors.prices}</div>}
            </div>
            <button type="submit">Lưu sản phẩm</button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddProductForm;
