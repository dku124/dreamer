import React from 'react';
import { ArcElement, Chart as ChartJS, Chart, Legend, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Col, Row, Typography } from "antd";
import { useSelector } from 'react-redux';
import { userSelector } from '@/common/store/user/user.slice';
import { reportSelector } from '@/common/store/report/report.slice';
import { CampType } from '@/@types/camp/camp.type';
import { Doughnut } from 'react-chartjs-2';
import { configSelector } from '@/common/store/config/config.slice';
import { ShipStatus } from '@/@types/order/order.type';
import { ShipHelper } from '@/common/helpers/ship.helper';
import { CampHelper } from '@/common/helpers/camp.helper';
import { FaDotCircle } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, ArcElement, ChartDataLabels);


export default function CampChartAnalysis() {
    const report = useSelector(reportSelector)
    const config = useSelector(configSelector)

    const getData = () => {
        let spendTest = 0;
        let spendMain = 0;
        let totalwebcakeTest = 0;
        let totalWebCakeMain = 0;

        for (let i = 0; i < report.reportCampaign.length; i++) {
            const item = report.reportCampaign[i];
            switch (item.typeCamp) {

                case CampType.TEST:
                    spendTest += item.totalSpend;
                    totalwebcakeTest += item.totalConvertion;
                    break;
                case CampType.MAIN:
                    spendMain += item.totalSpend;
                    totalWebCakeMain += item.totalConvertion;
                    break;
                default:
                    break;
            }

        }
        return [spendTest, spendMain, totalwebcakeTest, totalWebCakeMain];
    }

    function getPersentSpendAds(value: any, total: any, flag?: boolean) {
        if (flag) {
            const data = getData()
            const sumSpend = data[0] + data[1];
            const spendTest = Number(((data[0] / sumSpend) * 100).toFixed(2));
            const spendMain = Number(((data[1] / sumSpend) * 100).toFixed(2));
            return 100 - (spendTest + spendMain);
        }
        if (total === 0) return 0
        return value / total * 100;
    }
    const total = (index: number) => {
        const data = getData();

        const sum = data[0] + data[1];

        if (sum === 0) return "0"
        return (data[index] / sum * 100).toFixed(2);
    }
    const optionSpends = {
        plugins: {
            legend: {
                display: false,
                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                }
            },
            title: {
                display: true,
                text: 'Total Feedback',
                fontSize: 30,
                fontColor: 'white',
            },
            datalabels: {
                color: config.darkMode ? '#fff' : '#000',
                // display: true,
                renderer: 'percentage',
                formatter: function (value: any, context: any) {
                    const label = context.chart.data.labels[context.dataIndex]
                    const total = context.dataset.data[0] + context.dataset.data[1];
                    switch (label) {
                        case "TEST":
                            return getPersentSpendAds(value, total).toFixed(2) + "%";
                        case "MAIN":
                            return getPersentSpendAds(value, total).toFixed(2) + "%";
                        default:
                            return "";
                    }
                }
            },
        },
    }

    function getPersentTotalConvertion(value: any, total: any, flag?: boolean) {
        if (flag) {
            const data = getData()
            const TotalConvertion = data[2] + data[3];
            const convertionTest = Number(((data[2] / TotalConvertion) * 100).toFixed(2));
            const convertionMain = Number(((data[3] / TotalConvertion) * 100).toFixed(2));
            return 100 - (convertionTest + convertionMain);
        }
        if (total === 0) return 0
        return value / total * 100;
    }
    const totalConvertion = (index: number) => {
        const data = getData();

        const sum = data[2] + data[3];

        if (sum === 0) return "0"
        return (data[index] / sum * 100).toFixed(2);
    }
    const optionConvertion = {
        plugins: {
            legend: {
                display: false,
                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                }
            },
            title: {
                display: true,
                text: 'Total Feedback',
                fontSize: 30,
                fontColor: 'white',
            },
            datalabels: {
                color: config.darkMode ? '#fff' : '#000',
                // display: true,
                renderer: 'percentage',
                formatter: function (value: any, context: any) {
                    const label = context.chart.data.labels[context.dataIndex]
                    const total = context.dataset.data[0] + context.dataset.data[1];
                    switch (label) {
                        case "TEST":
                            return getPersentTotalConvertion(value, total).toFixed(2) + "%";
                        case "MAIN":
                            return getPersentTotalConvertion(value, total).toFixed(2) + "%";
                        default:
                            return "";
                    }
                }
            },
        },
    }

    function formatMoney(money: number) {
        const formatter = new Intl.NumberFormat('vi-VN');
        return formatter.format(money);
    }

    const isRender = () => {
        return report.reportCampaign.length > 0;
    }

    return (
        <Row gutter={[16, 16]} style={{ height: "100%", alignItems: "center", display: "flex" }}>
            <Col span={12} >
                <Col span={24} >
                    <div style={{ height: "340px", display: "flex", justifyContent: "space-around" }}>
                        {(report.reportCampaign.length > 0 && isRender()) ? <Doughnut id={"shipChart"}
                            data={{
                                labels: ['TEST', 'MAIN'],
                                datasets: [
                                    {
                                        label: 'Số chi phí quảng cáo',
                                        data: [getData()[0], getData()[1]],
                                        backgroundColor: [
                                            CampHelper.toType(CampType.TEST).props.color,
                                            CampHelper.toType(CampType.MAIN).props.color,
                                        ],
                                        borderWidth: 0,
                                    },
                                ],
                            }}
                            plugins={[{
                                id: 'textCenter',
                                afterDatasetsDraw(chart: Chart<any>): boolean | void {
                                    const { ctx, chartArea } = chart;
                                    ctx.save();
                                    //ctx.clearRect(0, 0, chart.width, chart.height); // Xóa toàn bộ nội dung để vẽ lại

                                    // get chart data
                                    // @ts-ignore
                                    const data = chart.data.datasets[0].data || [];

                                    const total = data.reduce((a: any, b: any) => a + b, 0).toFixed(0);


                                    ctx.font = "30px Arial";
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillStyle = config.darkMode ? '#fff' : '#000';
                                    const centerX = (chartArea.left + chartArea.right) / 2;
                                    const centerY = (chartArea.top + chartArea.bottom) / 2;
                                    ctx.fillText((formatMoney(total)).toString() + ' đ', centerX, centerY);
                                    ctx.restore();
                                }
                                // @ts-ignore
                            }, ChartDataLabels]}
                            // @ts-ignore
                            options={optionSpends}
                        /> : <div />}
                    </div>

                </Col>
                <Col span={24} style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                    <div className={"info labelList"} style={{ width: "max-content", padding: "15px", borderRadius: "10px" }}>
                        <div>
                            <FaDotCircle className={"labelList-item"} color={CampHelper.toType(CampType.TEST).props.color} />
                            <Typography.Text >Chi phí quảng cáo Test ({total(0)}%)</Typography.Text>
                        </div>
                        <div>
                            <FaDotCircle className={"labelList-item"} color={CampHelper.toType(CampType.MAIN).props.color} />
                            <Typography.Text>Chi phí quảng cáo Main ({total(1)}%)</Typography.Text>
                        </div>
                    </div>
                </Col>

            </Col>

            <Col span={12} >
                <Col span={24} >
                    <div style={{ height: "340px", display: "flex", justifyContent: "space-around" }}>
                        {(report.reportCampaign.length > 0 && isRender()) ? <Doughnut id={"shipChart"}
                            data={{
                                labels: ['TEST', 'MAIN'],
                                datasets: [
                                    {
                                        label: 'Số chuyển đổi',
                                        data: [getData()[2], getData()[3]],
                                        backgroundColor: [
                                            CampHelper.toType(CampType.TEST).props.color,
                                            CampHelper.toType(CampType.MAIN).props.color,
                                        ],
                                        borderWidth: 0,
                                    },
                                ],
                            }}
                            plugins={[{
                                id: 'textCenter',
                                afterDatasetsDraw(chart: Chart<any>): boolean | void {
                                    const { ctx, chartArea } = chart;
                                    ctx.save();
                                    //ctx.clearRect(0, 0, chart.width, chart.height); // Xóa toàn bộ nội dung để vẽ lại

                                    // get chart data
                                    // @ts-ignore
                                    const data = chart.data.datasets[0].data || [];

                                    const total = data.reduce((a: any, b: any) => a + b, 0);


                                    ctx.font = "30px Arial";
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillStyle = config.darkMode ? '#fff' : '#000';
                                    const centerX = (chartArea.left + chartArea.right) / 2;
                                    const centerY = (chartArea.top + chartArea.bottom) / 2;
                                    ctx.fillText((total).toString(), centerX, centerY);
                                    ctx.restore();
                                }
                                // @ts-ignore
                            }, ChartDataLabels]}
                            // @ts-ignore
                            options={optionConvertion}
                        /> : <div />}
                    </div>

                </Col>
                <Col span={24} style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                    <div className={"info labelList"} style={{ width: "max-content", padding: "15px", borderRadius: "10px" }}>
                        <div>
                            <FaDotCircle className={"labelList-item"} color={CampHelper.toType(CampType.TEST).props.color} />
                            <Typography.Text >Chuyển đổi Test ({totalConvertion(2)}%)</Typography.Text>
                        </div>
                        <div>
                            <FaDotCircle className={"labelList-item"} color={CampHelper.toType(CampType.MAIN).props.color} />
                            <Typography.Text>Chuyển đổi Main ({totalConvertion(3)}%)</Typography.Text>
                        </div>
                    </div>
                </Col>
            </Col>
        </Row>
    )
}
