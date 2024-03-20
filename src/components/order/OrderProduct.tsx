import {
	AutoComplete,
	Button,
	Checkbox,
	Col,
	Divider,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Row,
	Select,
	Space,
	TreeSelect
} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {productSelector} from "@store/product/product.slice.ts";
import {AppDispatch} from "@store/store.ts";
import ProductThunk from "@store/product/product.thunk.ts";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";
import {Product} from "@/@types/repo/product.type.ts";
import {NumberUtil} from "@utils/number.util.ts";
import {orderSelector, setReload} from "@store/order/order.slice.ts";

interface OrderProductProps
{
	form:FormInstance
}


export function OrderProduct(props:OrderProductProps)
{
	const product = useSelector(productSelector);
	const order = useSelector(orderSelector);
	const dispatch = useDispatch<AppDispatch>();
	const {form} = props;
	const searchProduct = (value:string) => {
		dispatch(ProductThunk.getList(value));
	}
	
	const selectProduct = (value:Product,key:number) => {
		const newProducts = form.getFieldsValue().details;
		newProducts[key].entity = (value as  any).entity;
		newProducts[key].sku = undefined;
		newProducts[key].size = undefined;
		newProducts[key].quantity = 1;
		newProducts[key].defaultPrice = 0;
		newProducts[key].retailPrice = 0;
		newProducts[key].price = 0;
		newProducts[key].showPrice = NumberUtil.toNumberMoney(newProducts[key].price);
		newProducts[key].selectSku = undefined;
		newProducts[key].colorSelect = undefined;
		newProducts[key].size = undefined;
		form.setFieldsValue({
			details: [...newProducts]
		})
		dispatch(setReload(true))
	}
	
	const selectSKU = (value:any,key:number) => {
		const newProducts = form.getFieldsValue().details;
		newProducts[key].selectSku = value.entity;
		newProducts[key].size = undefined;
		newProducts[key].sizeSelect = undefined; 
		newProducts[key].quantity = 1;
		newProducts[key].defaultPrice = value.entity.price;
		newProducts[key].retailPrice = value.entity.retailPrice;
		newProducts[key].price = 0;
		newProducts[key].showPrice = NumberUtil.toNumberMoney(newProducts[key].price);
		form.setFieldsValue({
			details: [...newProducts]
		})
		dispatch(setReload(true))
	}
	
	const selectColor = (value:any,key:number) => {
		const newProducts = form.getFieldsValue().details;
		newProducts[key].colorSelect = value?.color;
		newProducts[key].color = {
			id:value?.color?.id,
			color:value?.color?.color,
			size:value?.size
		}
		newProducts[key].sizeSelect = value?.size;
		if (newProducts[key]?.isRetail)
		{
			newProducts[key].price = (newProducts[key].retailPrice + (newProducts[key].sizeSelect?.price || 0)) * newProducts[key].quantity
		}
		else
		{
			newProducts[key].price = (newProducts[key].defaultPrice + (newProducts[key].sizeSelect?.price || 0)) * newProducts[key].quantity;
		}
		newProducts[key].showPrice = NumberUtil.toNumberMoney(newProducts[key].price);
		form.setFieldsValue({
			details: [...newProducts]
		})
		dispatch(setReload(true))
	}
	
	const getQuantityAvailable = (key:number) => {
		const newProducts = form.getFieldsValue().details;
		const size = newProducts[key]?.sizeSelect || null ;
		const sku = newProducts[key]?.selectSku || null;
		if (!sku || !size)
		{
			return 0
		}
		if(sku?.state)
		{
			return size?.quantity
		}
		else
		{
			return  (size?.reQuantity || 0) + (size?.quantity || 0)

		}
	}
	
	
	const selectIsRetail = (value:any,key:number) => {	
		const newProducts = form.getFieldsValue().details;
		newProducts[key].isRetail = value.target.checked;
		if (newProducts[key]?.isRetail)
		{
			newProducts[key].price = (newProducts[key].retailPrice + (newProducts[key].sizeSelect?.price || 0)) * newProducts[key].quantity
		}
		else
		{
			newProducts[key].price = (newProducts[key].defaultPrice + (newProducts[key].sizeSelect?.price || 0)) * newProducts[key].quantity
		}
		newProducts[key].showPrice = NumberUtil.toNumberMoney(newProducts[key].price);
		form.setFieldsValue({
			details: [...newProducts]
		})
		dispatch(setReload(true))
	}
	
	const updateQuantity = (value:any,key:number) => {
		const newProducts = form.getFieldsValue().details;
		newProducts[key].quantity = value;
		if (newProducts[key]?.isRetail)
		{
			newProducts[key].price = (newProducts[key].retailPrice + (newProducts[key].sizeSelect?.price || 0)) * newProducts[key].quantity
		}
		else
		{
			newProducts[key].price = (newProducts[key].defaultPrice + (newProducts[key].sizeSelect?.price || 0)) * newProducts[key].quantity
		}
		newProducts[key].showPrice = NumberUtil.toNumberMoney(newProducts[key].price);
		form.setFieldsValue({
			details: [...newProducts]
		})
		dispatch(setReload(true))
	}
	
	const getSku = (key:number) => {
		const newProducts = form.getFieldsValue().details;
		const product = newProducts[key]?.entity;
		return product
	}
	
	const getSkuColor = (key:number) => {
		const newProducts = form.getFieldsValue().details;
		const product = newProducts[key]?.selectSku;
		return product?.colors
	}
	
	return (
		<div id={"OrderProduct"}>
			<Form.Item label={"Danh sách sản phẩm"} >
				<Form.List name={"details"} >
					{(fields, { add, remove }) => {
						return (
							<div>
								{fields.map((field, index) => (
									<Form.Item
										
										key={index}
										required={false}
										style={{ marginBottom: 0 }}
									>
										<Row>
											<Col span={20}>
												<div>
													<Space.Compact style={{width:"100%"}}>
														<Form.Item
															
															name={[field.name, 'product']}
															rules={[{ required: true, message: 'Vui lòng nhập thông tin sản phẩm' }]}
															style={{height:"100%",minWidth:"250px"}}
														>
															
															<AutoComplete
																placeholder={"Nhập tên sản phẩm"}
																options={product.lists.map(e=>{
																	return {
																		value: `${e.code} - ${e.name}`,
																		label: `${e.code} - ${e.name}`,
																		entity:e,
																	}
																})}
																onSearch={searchProduct}
																onSelect={(_,data)=>selectProduct(data as any,field.name)}
																showSearch={true}
															>
																
															</AutoComplete>
															
														</Form.Item>
														<Form.Item
															name={[field.name, 'sku']}
															rules={[{ required: false, message: 'Vui lòng chọn sku' }]}
															style={{
																height:"100%",
																width:"50%",
															}}
														>
															<Select placeholder={"SKU"} 
																	onSelect={(_,data)=>selectSKU(data as any,field.name)}
																	options={OrderHelper.ToSKUList(getSku(field.name))}  />
														</Form.Item>
													</Space.Compact>
												</div>
												<div>
													<Space.Compact style={{width:"100%"}}>
														<Form.Item
															name={[field.name, 'quantity']}
															rules={[{ required: false, message: 'Vui lòng nhập số lượng' }]}
															initialValue={1}
															label={"Số lượng"}
														>
															<InputNumber min={1} max={getQuantityAvailable(field.name) || 1} placeholder="Số lượng" onChange={(num:any)=> updateQuantity(num,field.name)}  />
														</Form.Item>
														<Form.Item

															name={[field.name, 'showPrice']}
															label={"Giá"}

														>
															<Input disabled={true} />
														</Form.Item>
														<Form.Item
															name={[field.name, 'size']}
															label={`Mẫu mã - Hiện có : ${getQuantityAvailable(field.name) || 0}`}
															style={{width:"55%"}}
															rules={[{ required: false, message: 'Vui lòng chọn mẫu mã' }]}
														>
															<TreeSelect 
																treeData={OrderHelper.ToColorList(getSkuColor(field.name),getSku(field.name))}
																placeholder={"Mẫu mã"}
																treeDefaultExpandAll={true}
																onSelect={(_,data)=>selectColor(data as any,field.name)}
															/>
														</Form.Item>
													</Space.Compact>
												</div>
											</Col>
											<Col span={4}>
												<Form.Item>
													<Button
														danger={true}
														block={true}
														type={"primary"}
														onClick={() => remove(field.name)}
														style={{width:"85%",marginLeft:"10px"}}
													>
														Xóa
													</Button>
												</Form.Item>
												<Form.Item
													label={"Giá sỉ"}
													name={[field.name, 'isRetail']}
													style={{width:"85%",marginLeft:"20px"}}
													initialValue={false}
													valuePropName="checked"
												>
													<Checkbox
														onChange={(e)=>selectIsRetail(e,field.name)}
													/>
												</Form.Item>
											</Col>
										</Row>
										<Divider style={{margin:"12px 0"}} />
									</Form.Item>
								))}
								<Form.Item>
									<Button block={true}  onClick={()=> add()} type={"dashed"}  >
										Thêm sản phẩm
									</Button>
								</Form.Item>
							</div>
						)
					}}
				</Form.List>
			</Form.Item>
			
		</div>
	)
}