import {Form, Modal, ModalProps} from "antd";
import {useForm} from "antd/es/form/Form";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {useEffect} from "react";
import {productUnitSelector} from "@store/product-unit/product-unit.slice.ts";
import {categorySelector} from "@store/category/category.slice.ts";
import ProductUnitThunk from "@store/product-unit/product-unit.thunk.ts";
import CategoryThunk from "@store/category/category.thunk.ts";
import ProductThunk from "@store/product/product.thunk.ts";
import {productSelector} from "@store/product/product.slice.ts";
import ProductUpdateForm from "@components/product/ProductUpdateForm.tsx";

// sản phẩm có tên,mã,link,size (width,height),minQuantity,MaxQuantity,unit,category,description,warrantyUnit


export default function ProductUpdateModal(props: ModalProps) {
	const dispatch = useDispatch<AppDispatch>()
	const productUnit = useSelector(productUnitSelector)
	const category = useSelector(categorySelector)
	const product = useSelector(productSelector)
	const onFinish = (values: any) => {
		dispatch(ProductThunk.update({
			...product.select,
			...values,
			size:[values.height,values.width],
			inventory:[values.quantityMin,values.quantityMax],
			warrantyPeriod:values.warrantyPeriod,
			warrantyUnit:values.warrantyUnit,
		}))
		if (props.onCancel)
		{
			props.onCancel(undefined as  any)
		}
	}
	useEffect(() => {
		dispatch(ProductUnitThunk.list())
		dispatch(CategoryThunk.list())
		form.resetFields()
		if(props.open){
			form.setFieldsValue({
				...product.select,
				width:product.select?.size[1],
				height:product.select?.size[0],
				quantityMin:product.select?.inventory[0],
				quantityMax:product.select?.inventory[1],
				warrantyPeriod:product.select?.warrantyPeriod,
				warrantyUnit:product.select?.warrantyUnit,
				category:product.select?.category,
				unit:product.select?.unit,
			})
		}
	}, [props.open])
	const [form] = useForm()
	// const itemTabs = [
	// 	{
	// 		key: "info",
	// 		label: "Thông tin",
	// 		children: <ProductUpdateForm onFinish={onFinish} form={form} {...props} />,
	// 	},
	// 	{
	// 		key: "history",
	// 		label: "SKU",
	// 		children: <SkuUpdateForm />,
	// 	},
	// ]
	
	return(
		<div id="ProductCreateModal">
			<Modal {...props}
				   title={"Cập nhật sản phẩm"}
				   okText={"Cập nhật"}
				   cancelText={"Đóng"}
				   onOk={form.submit}
				   width={1280}
			>
				<Form form={form} onFinish={onFinish} >
					{/*<Tabs items={itemTabs} />*/}
					<ProductUpdateForm onFinish={onFinish} form={form} {...props} />
				</Form>
			</Modal>
		</div>
	)
}