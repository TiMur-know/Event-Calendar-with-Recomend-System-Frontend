import rootSlice from "@/redux/rootReducer"
import { configureStore } from "@reduxjs/toolkit"

const store = configureStore({
	reducer: rootSlice
})
export type AppStore = typeof store
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = typeof store.dispatch;
export default store;