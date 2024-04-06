import { configureStore } from "@reduxjs/toolkit";
// import modulesReducer from "../Courses/Modules/reducer";
export interface PokenetState {
    // modulesReducer: {
    //     modules: any[];
    //     module: any;
    // };
}
const store = configureStore({
    reducer: {
        // modulesReducer
    }
});

export default store;