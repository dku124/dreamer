import configSlice from './config/config.slice';
import authSlice from './auth/auth.slice';
import {combineReducers, configureStore} from '@reduxjs/toolkit';

import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from 'redux-persist';
import userSlice from "@store/user/user.slice.ts";
import supplierSlice from "@store/supplier/supplier.slice.ts";
import categorySlice from "@store/category/category.slice.ts";
import productUnitSlice from "@store/product-unit/product-unit.slice.ts";
import settingSlice from "@store/setting/setting.slice.ts";
import productSlice from "@store/product/product.slice.ts";
import skuSlice from "@store/sku/sku.slice.ts";
import orderSlice from "@store/order/order.slice.ts";
import notiSlice from "@store/noti/noti.slice.ts";
import reportSlice from "@store/report/report.slice.ts";
import customerSlice from './customer/customer.slice.ts';
import campSlice from "@store/camp/camp.slice.ts";

const rootReducer = combineReducers({
	  config: configSlice,
	  auth: authSlice,
	  user:userSlice,
	  supplier:supplierSlice, 
	  category:categorySlice, 
	  productUnit:productUnitSlice, 
	  setting:settingSlice,
	  product:productSlice,
	  customer:customerSlice,
	  sku:skuSlice,
	  order:orderSlice,
	  noti: notiSlice,
	  report: reportSlice,
	  camp: campSlice,
})
const persistedConfig = {
  key: 'root',
  storage,
  whitelist: ['config', 'auth']
}
const persistedReducer = persistReducer(persistedConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;