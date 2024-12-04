import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorageUtils';


const AddProductForm = () => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Tên sản phẩm không được bỏ trống'),
    quantity: Yup.number()
      .min(1, 'Số lượng phải lớn hơn hoặc bằng 1')
      .required('Vui lòng nhập số lượng'),
    prices: Yup.string().required('Vui lòng nhập giá sản phẩm'),

  });

  const handleFormSubmit = (values, { resetForm }) => {
    const newProduct = {
      id: `p${Date.now()}`,
      ...values,
      prices: values.prices.split(',').map((price) => parseInt(price.trim(), 10)),
      status: 'Đang bán',
    };

    const existingProducts = getFromLocalStorage('products');
    saveToLocalStorage('products', [...existingProducts, newProduct]);

    alert('Thêm sản phẩm thành công!');
    resetForm();
  };

  return (
    <Formik
      initialValues={{ name: '', quantity: 0, description: '', prices: '' }}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div>
            <label>Tên sản phẩm</label>
            <Field name="name" type="text" />
            {errors.name && touched.name && <div>{errors.name}</div>}
          </div>
          <div>
            <label>Số lượng</label>
            <Field name="quantity" type="number" />
            {errors.quantity && touched.quantity && <div>{errors.quantity}</div>}
          </div>
          <div>
            <label>Miêu tả</label>
            <Field name="description" as="textarea" />
          </div>
          <div>
            <label>Giá (phân cách bằng dấu phẩy)</label>
            <Field name="prices" type="text" />
            {errors.prices && touched.prices && <div>{errors.prices}</div>}
          </div>
          <button type="submit">Lưu sản phẩm</button>
        </Form>
      )}
    </Formik>
  );
};

export default AddProductForm;
