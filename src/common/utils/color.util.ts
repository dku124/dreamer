import {Shipping} from "@/@types/order/ship.type.ts";
import {MapUtil} from "@utils/map.util.ts";

export class ColorUtil
{
	static generateColor(p1:string, p2?:string, p3?:string) {
		p1 = this.hashCode(p1)
		p2 = this.hashCode(p2 || p1)
		p3 = this.hashCode(p3 || p2)
		return {
			p1: this.getColorFromCode(p1),
			p2: this.getColorFromCode(p2),
			p3: this.getColorFromCode(p3),
		}
	}
	
	static getColorFromCode(code:string, baseColor = "#000000") {
		// Sử dụng code và baseColor để tạo màu mới
		// Ví dụ đơn giản: sử dụng một hàm hash phức tạp hơn
		const hash = (code.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0) & 0x00FFFFFF).toString(16).toUpperCase();

		// Đảm bảo mã màu luôn có 6 ký tự
		const color = `#${'00000'.substring(0, 6 - hash.length)}${hash}`;

		// Nếu bạn muốn sử dụng baseColor, bạn có thể kết hợp chúng ở đây

		return color;
	}
	
	
	
	
	static hashCode(str:string) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
		}
		return hash.toString();
	}
	
	
	static toCodeShip(ship:Shipping)
	{
		return ColorUtil.generateColor(
			MapUtil.gI().getProvince(ship.to.province)?.name || "",
			MapUtil.gI().getDistrict(ship.to.district)?.name,
			MapUtil.gI().getWard(ship.to.ward)?.name)
	}
}