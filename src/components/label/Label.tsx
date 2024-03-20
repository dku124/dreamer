import {Typography} from "antd";

type  Props = {
	text: string;
	minWidth?: number;
	notRequired?: boolean;
	align?: "left" | "center" | "right";
}
export function Label(props:Props) {
	return (
		<div style={{
			minWidth: props.minWidth ? (props.notRequired ? props.minWidth+14:props.minWidth) +"px" : '100px',
			padding: '5px 10px',
			
			margin: '5px 0px',

			textAlign: props.align ? props.align : "left",
		}}>
			<span>
				<Typography.Text  style={{margin:0}}>{props.text}</Typography.Text>
			</span>
		</div>
	)
}
