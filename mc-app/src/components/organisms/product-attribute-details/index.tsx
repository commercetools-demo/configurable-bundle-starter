import React from 'react'
import { BundleFormikValues } from '../../molecules/add-new-bundle-button';
import { useFormik } from 'formik';
type Formik = ReturnType<typeof useFormik>;

interface Props {
    values: BundleFormikValues;
    touched: Formik['touched'];
    errors: Formik['errors'];
    handleChange: Formik['handleChange'];
    handleBlur: Formik['handleBlur'];
}
const ProductAttributeDetails = ({values}: Props) => {
    if (!values.mainProductReference?.id) {
        return null;
    }
    return (
        <div>ProductAttributeDetails</div>
    )
}

export default ProductAttributeDetails