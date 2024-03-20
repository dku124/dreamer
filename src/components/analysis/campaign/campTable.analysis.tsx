import {Table, Tag} from "antd";
import {reportSelector} from "@store/report/report.slice.ts";
import {useSelector} from "react-redux";
import {NumberUtil} from "@utils/number.util.ts";
import {CampHelper} from '../../../common/helpers/camp.helper';

export function CampTableAnalysis() {
    const report = useSelector(reportSelector);

    const coverData = () => {
        const data = report.reportCampaign.map((item, index) => ({
            key: index,
            type: CampHelper.toType(item.typeCamp),
            totalCamp : item.totalCamp,
            sumConvertion: item.totalConvertion,
            totalMoneyShip: item.totalSpend,
        }));

        const sumConvertionTotal = data.reduce((acc, item) => acc + item.sumConvertion, 0);
        const totalMoneyShipTotal = data.reduce((acc, item) => acc + item.totalMoneyShip, 0);

        data.push({
            key: data.length,
            type: <Tag color={"#000"}>Tổng</Tag>,
            totalCamp: data.reduce((acc, item) => acc + item.totalCamp, 0),
            sumConvertion: sumConvertionTotal,
            totalMoneyShip: totalMoneyShipTotal,
        });

        return data;
    };

    return (
        <Table
            className={"table shadow border-radius"}
            dataSource={coverData()}
            pagination={false}
            rowKey={"key"}
            loading={report.loadings.analysisOrder === 0}
        >
            <Table.Column title={"Loại chiến dịch"} dataIndex={"type"} key={"type"} align={"center"} />
            <Table.Column title={"Tổng chiến dịch"} dataIndex={"totalCamp"} key={"totalCamp"} align={"center"} />
            <Table.Column
                title={"Số chuyển đổi"}
                dataIndex={"sumConvertion"}
                key={"sumConvertion"}
                align={"center"}
                render={(value) => NumberUtil.toNumberMoney(value)}
            />
            <Table.Column
                title={"Chi phí quảng cáo"}
                dataIndex={"totalMoneyShip"}
                key={"totalMoneyShip"}
                align={"center"}
                render={(value) => NumberUtil.toNumberMoney(value)}
            />
        </Table>
    );
}
