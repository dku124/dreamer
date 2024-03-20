import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {Customer} from '@/@types/repo/customer.type';
import CustomerThunk from './customer.thunk';
import {Order} from '@/@types/order/order.type';
import html2pdf from "html2pdf.js";

interface CustomerState<T extends BaseEntity> {
    query: Query | undefined,
    data: Page<Customer> | undefined,
    select: Customer | undefined
    detail: T[] | undefined,
    loading: boolean,
    loadings: {
        printOrder: boolean,
    },
	printBill:string

}

const defaultInitialState: CustomerState<Order> = {
    query: undefined,
    data: undefined,
    select: undefined,
    detail: undefined,
    loading: false,
    loadings: {
        printOrder: false,
    },
	printBill:""
};

const customerSlice = createSlice({
    name: 'customer',
    initialState: defaultInitialState,
    reducers: {
        setCustomerQuery: (state, action: PayloadAction<Query>) => {
            state.query = action.payload;
        },
        setCustomerSelect: (state, action: PayloadAction<Customer>) => {
            state.select = action.payload
        }

    },
    extraReducers(builder) {
        builder
            .addCase(CustomerThunk.getPage.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(CustomerThunk.getPage.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(CustomerThunk.getPage.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(CustomerThunk.getDetail.pending, (state, action) => {
                state.detail = undefined;
            })
            .addCase(CustomerThunk.getDetail.fulfilled, (state, action) => {
                state.detail = action.payload;
            })
            .addCase(CustomerThunk.update.fulfilled, (state, action) => {
                state.select = action.payload;
            })
            .addCase(CustomerThunk.delete.fulfilled, (state, action) => {
                state.select = action.payload;
            })
            .addCase(CustomerThunk.uploadImg.fulfilled, (state, action) => {
                state.select = action.payload;
            })
            .addCase(CustomerThunk.printBill.pending, (state, action) => {
				state.loadings.printOrder = true
			})
			.addCase(CustomerThunk.printBill.rejected, (state, action) => {
				state.loadings.printOrder = false
			})
            .addCase(CustomerThunk.printBill.fulfilled, (state, action) => {
				state.loadings.printOrder = false
				state.printBill = action.payload
				var worker = html2pdf();
				worker.from(action.payload)
					.set({
						image:{ type: 'jpeg', quality: 0.98 },
						html2canvas: { scale: 2 },
					})
					.save("bill.pdf")
			}) 
            .addCase(CustomerThunk.printOrder.pending, (state, action) => {
				state.loadings.printOrder = true
			})
            .addCase(CustomerThunk.printOrder.fulfilled, (state, action) => {
				state.loadings.printOrder = false
			})
           
    },
});
export const { setCustomerQuery, setCustomerSelect } = customerSlice.actions;
export const customerSelector = (state: RootState) => state.customer;
export default customerSlice.reducer;
