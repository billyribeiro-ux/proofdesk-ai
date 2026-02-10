import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  globalLoading: boolean;
  activeModal: string | null;
  toastQueue: Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>;
}

const initialState: UIState = {
  globalLoading: false,
  activeModal: null,
  toastQueue: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
    addToast(
      state,
      action: PayloadAction<{
        id: string;
        type: "success" | "error" | "info" | "warning";
        message: string;
      }>
    ) {
      state.toastQueue.push(action.payload);
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toastQueue = state.toastQueue.filter(
        (t) => t.id !== action.payload
      );
    },
  },
});

export const { setGlobalLoading, openModal, closeModal, addToast, removeToast } =
  uiSlice.actions;
export default uiSlice.reducer;
