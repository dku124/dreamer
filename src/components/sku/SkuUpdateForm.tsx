import {Button, Col, Form, Input, Row, Space} from "antd";

export default function SkuUpdateForm()
{
	return (
		<Row>
			<Col span={24}>
				<Form.List name={"skus"}>
					{
						(fields, { add, remove }) => (
							<div>
								<div>
									<Space.Compact>
										<Button onClick={() => add()} type={"primary"}>Thêm Màu</Button>
									</Space.Compact>
								</div>
								<div>
									{
										fields.map((field, index) => {
											return (
												<div>
													<Row key={field.key}>
														<Col span={10}>
															<Space.Compact>
																<Form.Item
																	label={"Màu"}
																	fieldId={field.name.toString()}
																	name={[field.name, "name"]}
																>
																	<Input placeholder={"Màu"} />
																</Form.Item>
																
																<Button onClick={() => remove(index)} danger={true}>Xóa</Button>
															</Space.Compact>
														</Col>
													</Row>
													<Row>
														<Col span={24}>
															<div>
																<Form.List key={index} name={"colors"}>
																	{
																		(fields, { add, remove }) => (
																			<div style={{
																				marginLeft: "30px",
																			}}>
																				<div>
																					<Space.Compact>
																						<Button onClick={() => add()} type={"primary"}>Thêm Size</Button>
																					</Space.Compact>
																				</div>
																				<div>
																					{
																						fields.map((field, index) => {
																							return (
																								<div key={index}>
																									{field.key}
																								</div>
																							)
																						})
																					}
																				</div>
																			</div>
																		)
																	}
																</Form.List>
															</div>
														</Col>
													</Row>
												</div>
											)
										})
									}
								</div>
							</div>
						)
					}
				</Form.List>
			</Col>
		</Row>
	)
}