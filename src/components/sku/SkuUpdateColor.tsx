import {Button, Form, Space} from "antd";

export default function SkuUpdateColorForm()
{
	return(
		<div style={{marginLeft:"10px"}}>
			<Form.List name={"colors"}>
				{
					(fields, { add, remove }) => (
						<div >
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
	)
}