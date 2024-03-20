import { EventNoti, Noti } from "@/@types/noti/noti.type";
import { NotiHelper } from "@/common/helpers/noti.helper";
import { notiSelector } from "@/common/store/noti/noti.slice";
import { DateUtil } from "@utils/date.util.tsx";
import { Modal, ModalProps } from "antd";
import { useSelector } from "react-redux";

export function NotiModal(props: ModalProps) {
    const noti = useSelector(notiSelector);

    if (noti.select?.action !== EventNoti.ORDER_REFUND_TO_SALE && noti.select?.action !== EventNoti.ORDER_NEW && noti.select?.action !== EventNoti.USER_UPDATE && noti.select?.action !== EventNoti.USER_RESET_PASSWORD) {
        return (
            <div id="NotiModal">
                <Modal
                    {...props}
                    width={NotiHelper.toWidth(noti.select as Noti)}
                    title={
                        NotiHelper.toTitle(noti.select as Noti) +
                        " - " +
                        (noti.select?.fullName ?? "") +
                        "  " +
                        DateUtil.format(
                            noti.select?.createdAt,
                            "DD/MM/yyyy hh:mm:ss",
                        )
                    }
                    cancelText="Đóng"
                    okButtonProps={{ style: { display: "none" } }}
                >
                    <div style={{ paddingTop: "10px" }}>
                        {NotiHelper.toModal(noti.select as Noti)}
                    </div>
                </Modal>
            </div>
        );
    }
}
