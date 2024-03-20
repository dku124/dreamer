import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Order } from "@/@types/order/order.type.ts";
import OrderThunk from "@store/order/order.thunk.ts";
import { Timeline } from '@/@types/order/timeline.type';

interface ProductState<T extends BaseEntity> {
	query: Query | undefined,
	data: Page<T> | undefined
	list: T[]
	select: T | undefined
	detail: T | undefined,
	reloading: boolean,
	loadInfoDetail: boolean,
	loading: boolean
	timeline: Timeline[],
	loadings: {
		getPage: boolean,
		getDetail: boolean,
		create: boolean,
		update: boolean,
		delete: boolean,
		getOrderRaw: boolean,
		timeline: boolean,
		createship: Record<string, boolean>
		cancelship: Record<string, boolean>
	}
}

const defaultInitialState: ProductState<Order> = {
	query: undefined,
	data: undefined,
	list: [],
	select: undefined,
	detail: undefined,
	reloading: false,
	loadInfoDetail: false,
	loading: false,
	timeline: [],
	loadings: {
		getPage: false,
		getDetail: false,
		create: false,
		update: false,
		delete: false,
		getOrderRaw: false,
		timeline: false,
		createship: {},
		cancelship: {}
	}
};

const orderSlice = createSlice({
	name: 'product',
	initialState: defaultInitialState,
	reducers: {
		setOrderQuery: (state, action: PayloadAction<Query>) => {
			state.query = action.payload;
		},
		setSelectOrder: (state, action: PayloadAction<Order | undefined>) => {
			state.select = action.payload
		},
		setReload: (state, action: PayloadAction<boolean>) => {
			state.reloading = action.payload
		},
		clearDetail: (state) => {
			state.detail = undefined;
		},
		pushOrderRaw: (state, action: PayloadAction<Order>) => {
			if (state.list) {
				state.list.push(action.payload);
			}
			else {
				state.list = [action.payload]
			}
		},
		pushOrder(state, action: PayloadAction<Order>) {
			const status = state.query?.status;
			if (status && (status === '' || status === action.payload.status)) {
				state.data?.data.push(action.payload);
			}
		},
		setCreateShipLoading: (state, action: PayloadAction<string>) => {
			state.loadings.createship[action.payload] = true;
		},
		setCancelShipLoading: (state, action: PayloadAction<string>) => {
			state.loadings.cancelship[action.payload] = true;
		}
	},
	extraReducers(builder) {
		builder
			.addCase(OrderThunk.getPage.pending, (state, action) => {
				state.loadings.getPage = true;
			})
			.addCase(OrderThunk.getPage.rejected, (state, action) => {
				state.loadings.getPage = false;
			})
			.addCase(OrderThunk.getPage.fulfilled, (state, action) => {
				state.data = action.payload;
				state.loadings.getPage = false;
			})
			.addCase(OrderThunk.getDetail.pending, (state, action) => {
				state.detail = undefined;
			})
			.addCase(OrderThunk.getDetail.fulfilled, (state, action) => {
				state.detail = action.payload;
			})
			.addCase(OrderThunk.update.fulfilled, (state, action) => {
				state.detail = action.payload;
			})
			.addCase(OrderThunk.delete.fulfilled, (state, action) => {
				state.detail = action.payload;
			})
			.addCase(OrderThunk.create.fulfilled, (state, action) => {
				state.detail = action.payload;
			})
			.addCase(OrderThunk.ShipAsync.fulfilled,(state,acction)=>{
				console.log(state,acction)
				state.detail = acction.payload
			})
			.addCase(OrderThunk.getOrderRaw.pending, (state, action) => {
				state.loadings.getOrderRaw = true;
			})
			.addCase(OrderThunk.getOrderRaw.rejected, (state, action) => {
				state.loadings.getOrderRaw = false;
			})
			.addCase(OrderThunk.getOrderRaw.fulfilled, (state, action) => {
				state.list = action.payload;
				state.loadings.getOrderRaw = false;
			})
			.addCase(OrderThunk.splitOrderForSale.fulfilled, (state, action) => {
				state.loading = false;
			})

			.addCase(OrderThunk.splitOrderForSale.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(OrderThunk.splitOrderForSale.rejected, (state, action) => {
				state.loading = false;
			})
			.addCase(OrderThunk.createOrderShip.fulfilled, (state, action) => {
				state.detail = action.payload;
				state.loadings.createship[action.payload._id] = false;
			})
			.addCase(OrderThunk.createOrderShip.rejected, (state, action) => {
				state.loadings.createship[action.meta.arg] = false;
			})
			.addCase(OrderThunk.getTimeline.pending, (state, action) => {
				state.loadings.timeline = true;
			})
			.addCase(OrderThunk.getTimeline.rejected, (state, action) => {
				state.loadings.timeline = false;
			})
			.addCase(OrderThunk.getTimeline.fulfilled, (state, action) => {
				state.timeline = action.payload;
				state.loadings.timeline = false;
			})
	},
});

export const { setCancelShipLoading, setCreateShipLoading, setOrderQuery, setSelectOrder, setReload, clearDetail, pushOrderRaw, pushOrder } = orderSlice.actions;
export const orderSelector = (state: RootState) => state.order;
export default orderSlice.reducer;
