import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/ui-slice";
import workflowReducer from "./slices/workflow-slice";
import demoReducer from "./slices/demo-slice";
import selectionReducer from "./slices/selection-slice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    workflow: workflowReducer,
    demo: demoReducer,
    selection: selectionReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
