import {io} from 'socket.io-client';
import {UserRole} from "@/@types/user.type.ts";
import {EventNoti, Noti, NotiData} from "@/@types/noti/noti.type.ts";
import {store} from "@store/store.ts";
import {loadMore, pushNoti, setInitData, setNumUnread} from "@store/noti/noti.slice.ts";
import {Order} from "@/@types/order/order.type.ts";
import {pushOrderRaw} from "@store/order/order.slice.ts";
import OrderThunk from '../store/order/order.thunk';

const socket = io(`${import.meta.env.VITE_API_HOST}notification`, {
	transports: ['websocket'],
	autoConnect: false,
	auth: (cb: Function) => {
		cb({
			Authorization: 'Bearer ' + localStorage.getItem('token'),
		});
	},
});

socket.on('initData', (noti: NotiData) => {
	store.dispatch(setInitData(noti.data));
	store.dispatch(setNumUnread(noti.numUnread));
});
socket.on('notification', (data: Noti) => {
	store.dispatch(pushNoti(data));
	switch (data.action) {
		case EventNoti.ORDER_NEW:
			if (data.data[0]?.orderCount == 1 && !data.data[0]?.isSplit) {
				store.dispatch(pushOrderRaw(data.data[0]?.order as Order));
			}
			else {
				store.dispatch(OrderThunk.getPage())
			}
			break;
		case EventNoti.ORDER_REFUND_TO_SALE:
			store.dispatch(OrderThunk.getPage())
			break;
		default:
			break;
	}
});
socket.on('disconnect', () => {

});

socket.on('loadNoti', (noti: NotiData) => {
	store.dispatch(loadMore(noti.data));
})
socket.on('ORDER.NEW_RAW', (data: Order) => {
	store.dispatch(pushOrderRaw(data));
});
socket.on('ORDER.CONFIRM', (data: Order) => {
	store.dispatch(OrderThunk.getPage())
});



socket.on('connect', () => {
	const auth = store.getState().auth.roles;
	auth.forEach((e: UserRole) => {
		socket.on(e, (data: Noti) => {
			store.dispatch(pushNoti(data));
		});
	});
});


export default socket;