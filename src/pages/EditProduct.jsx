import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorageUtils';
import '../index.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  // Schema xác thực
  const validationSchema = Yup.object({
    name: Yup.string().required('Tên sản phẩm không được bỏ trống'),
    quantity: Yup.number()
      .min(0, 'Số lượng không thể âm')
      .required('Vui lòng nhập số lượng'),
    prices: Yup.string()
      .matches(
        /^(\d+(\.\d{1,2})?)(,\s*(\d+(\.\d{1,2})?))*$/,
        'Giá phải là số, ngăn cách bởi dấu phẩy'
      )
      .required('Vui lòng nhập giá sản phẩm'),
  });

  useEffect(() => {
    const storedProducts = getFromLocalStorage('products');
    const foundProduct = storedProducts?.find((p) => p.id === id);
    if (!foundProduct) {
      alert('Không tìm thấy sản phẩm!');
      navigate('/products');
    } else {
      setInitialValues({
        name: foundProduct.name || '',
        quantity: foundProduct.quantity || 0,
        description: foundProduct.description || '',
        prices: foundProduct.prices?.join(', ') || '',
        isLocked: foundProduct.isLocked || false,
        status: foundProduct.status || 'Đang bán',
      });
    }
  }, [id, navigate]);

  const handleSubmit = (values) => {
    if (values.isLocked) {
      alert('Sản phẩm này đã bị khóa, không thể chỉnh sửa!');
      return;
    }

    // Cập nhật trạng thái dựa trên số lượng
    const updatedStatus = values.quantity === 0 ? 'Hết hàng' : 'Đang bán';

    const updatedProducts = getFromLocalStorage('products').map((p) =>
      p.id === id
        ? {
            ...p,
            ...values,
            status: updatedStatus,
            prices: values.prices.split(',').map((price) => parseFloat(price.trim())),
          }
        : p
    );

    saveToLocalStorage('products', updatedProducts);
    alert('Chỉnh sửa sản phẩm thành công!');
    navigate('/products');
  };

  if (!initialValues) return <div>Loading...</div>;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="product-form">
          <h1>Chỉnh sửa sản phẩm</h1>
          <div>
            <label>Tên sản phẩm</label>
            <Field name="name" type="text" />
            {errors.name && touched.name && <div className="error">{errors.name}</div>}
          </div>
          <div>
            <label>Số lượng</label>
            <Field name="quantity" type="number" />
            {errors.quantity && touched.quantity && (
              <div className="error">{errors.quantity}</div>
            )}
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
          <button type="submit">Lưu chỉnh sửa</button>
        </Form>
      )}
    </Formik>
  );
};

export default EditProduct;
