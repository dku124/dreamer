import {createAsyncThunk} from "@reduxjs/toolkit";
import OrderService from "@/services/order/order.service.ts";
import {RootState} from "@store/store.ts";
import {setOrderQuery} from "@store/order/order.slice.ts";
import {Order} from "@/@types/order/order.type.ts";
import {OfEntity} from "@/@types/custom.type.ts";
import ShipService from '@/services/order/ship.service.ts';

const OrderThunk = {
	getPage:createAsyncThunk("order/getPage",async (data:Query|undefined,thunkAPI)=>{
		const state = (thunkAPI.getState() as RootState);
		const query = state.order.query;
		if (!data)
		{
			data = query as unknown as Query;
		}
		else
		{
			thunkAPI.dispatch(setOrderQuery(data as unknown as Query))
		}
		return await OrderService.getPage(data).catch(thunkAPI.rejectWithValue)
	}),
	getDetail:createAsyncThunk("order/getDetail",async (data:OfEntity<Order>,thunkAPI)=>{
		return await OrderService
			.getDetail(data).catch(thunkAPI.rejectWithValue)
	}),
	update:createAsyncThunk("order/update",async (data:OfEntity<Order>,thunkAPI)=>{
		return await OrderService
			.update(data)
			.then((res)=>{
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				return res;
			}).catch(thunkAPI.rejectWithValue)
	}),
	delete:createAsyncThunk("order/delete",async (data:OfEntity<Order>,thunkAPI)=>{
		return await OrderService
			.delete(data)
			.then((res)=>{
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				return res;
			}).catch(thunkAPI.rejectWithValue)
	}),
	create:createAsyncThunk("order/create",async (data:Partial<OfEntity<Order>>,thunkAPI)=>{
		return await OrderService
			.create(data)
			.then((res)=>{
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				return res;
			}).catch(thunkAPI.rejectWithValue)
	}),
	updateStatus:createAsyncThunk("order/updateStatus",async (data:Record<string, any>,thunkAPI)=>{
		return await OrderService
			.updateStatus(data)
			.then((res)=>{
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				return res;
			}).catch(thunkAPI.rejectWithValue)
	}),
	getOrderRaw:createAsyncThunk("order/getOrderRaw",async (_,thunkAPI)=>{
		return await OrderService
			.getOrderRaw().catch(thunkAPI.rejectWithValue)
	}),
	splitOrderForSale:createAsyncThunk("order/splitOrderForSale",async (data:Array<string>,thunkAPI)=>{
		return await OrderService
			.splitOrderForSale(data)
			.then(()=>{
				thunkAPI.dispatch(OrderThunk.getOrderRaw())
			}).catch(thunkAPI.rejectWithValue)
	}),
	createOrderShip:createAsyncThunk("order/createOrderShip",async (data:string,thunkAPI)=>{
		return await OrderService
			.createOrderShip(data)
			.then((ressult:Order)=>{
				thunkAPI.dispatch(OrderThunk.getDetail({_id:data} as unknown as OfEntity<Order>	))
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				return ressult;
			}).catch(thunkAPI.rejectWithValue)
	}),
	cancelOrderShip:createAsyncThunk("order/cancelOrderShip",async (data:string,thunkAPI)=>{
		return await OrderService
			.cancelOrderShip(data)
			.then((result:Order)=>{
				thunkAPI.dispatch(OrderThunk.getDetail({_id:data} as unknown as OfEntity<Order>	))
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				return result;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	getTimeline : createAsyncThunk("order/getTimeline",async (data:string,thunkAPI)=>{
		return await ShipService
			.getTimeline(data)
			.catch(thunkAPI.rejectWithValue)
	}),
	ReturnedOderShip:createAsyncThunk("order/ReturnedOderShip",async (data:{id : string,data:object},thunkAPI)=>{
		return await OrderService
			.ReturnedOderShip(data.id,data.data)
			.then((res)=>{
				thunkAPI.dispatch(OrderThunk.getDetail({_id:data.id} as unknown as OfEntity<Order>	))
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	UpdateInforShip:createAsyncThunk("order/UpdateInforShip",async (data:{id : string,shipTo:object},thunkAPI)=>{
		return await OrderService
			.UpdateInforShip(data.id,data.shipTo)
			.then((res)=>{
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	ReturnOrderToSale:createAsyncThunk("order/ReturnOrderToSale",async (data:string,thunkAPI)=>{
		return await OrderService
			.ReturnOrderToSale(data)
			.then((res)=>{
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	updateNoteOrder:createAsyncThunk("order/updateNoteOrder",async (data:{id:string,note:string},thunkAPI)=>{
		return await OrderService
			.updateNoteOrder(data.id,data.note)
			.then((res)=>{
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	ShipAsync:createAsyncThunk("order/ship/async",async (data:{order_code:string , ship_code:string},thunkAPI)=>{
		return await OrderService
			.asyncShip(data)
			.then((result:Order)=>{
				thunkAPI.dispatch(OrderThunk.getDetail({_id:result._id} as unknown as OfEntity<Order>	))
				thunkAPI.dispatch(OrderThunk.getPage(undefined))
				return result;
			})
			.catch(thunkAPI.rejectWithValue)
	})
}
export default OrderThunk;