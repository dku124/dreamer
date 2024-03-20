export class ReportHelper
{
	static orderInDay = (data:Record<string, number>) => {
		const labels = [];
		for (let i = 0; i < 24; i++) {
			labels.push({
				label: i + "h",
				value: data[i] || 0,
			})
		}
		return labels;
	}
}