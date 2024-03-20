import './NotFound.scss'
import emoji from '@/assets/images/emoji.png'
import {Link} from 'react-router-dom';

export default function NotFound() {
	return (
		<div id="notfound">
			<div className="notfound">
				<div className="notfound-404">
					<h1>
						4 <span style={{backgroundImage:`url(${emoji})`}} /> 4
					</h1>
				</div>
				<h2>Oops! Không tìm thấy trang</h2>
				<p>
					Xin lỗi nhưng trang bạn đang tìm kiếm không tồn tại, đã bị xóa.
					tên đã thay đổi hoặc tạm thời không có
				</p>
				<Link to="/">Trở về trang chủ</Link>
			</div>
		</div>
	
	)
}
