import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SelectionState {
  selectedIds: string[];
  focusedId: string | null;
  focusedIndex: number;
  selectionMode: "single" | "multi";
}

const initialState: SelectionState = {
  selectedIds: [],
  focusedId: null,
  focusedIndex: -1,
  selectionMode: "single",
};

export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    select(state, action: PayloadAction<string>) {
      if (state.selectionMode === "single") {
        state.selectedIds = [action.payload];
      } else {
        if (!state.selectedIds.includes(action.payload)) {
          state.selectedIds.push(action.payload);
        }
      }
    },
    deselect(state, action: PayloadAction<string>) {
      state.selectedIds = state.selectedIds.filter(
        (id) => id !== action.payload
      );
    },
    toggleSelect(state, action: PayloadAction<string>) {
      const idx = state.selectedIds.indexOf(action.payload);
      if (idx === -1) {
        if (state.selectionMode === "single") {
          state.selectedIds = [action.payload];
        } else {
          state.selectedIds.push(action.payload);
        }
      } else {
        state.selectedIds.splice(idx, 1);
      }
    },
    selectRange(state, action: PayloadAction<string[]>) {
      const unique = new Set([...state.selectedIds, ...action.payload]);
      state.selectedIds = Array.from(unique);
    },
    clearSelection(state) {
      state.selectedIds = [];
      state.focusedId = null;
      state.focusedIndex = -1;
    },
    setFocus(state, action: PayloadAction<{ id: string; index: number }>) {
      state.focusedId = action.payload.id;
      state.focusedIndex = action.payload.index;
    },
    moveFocusUp(state) {
      if (state.focusedIndex > 0) {
        state.focusedIndex--;
      }
    },
    moveFocusDown(state, action: PayloadAction<number>) {
      if (state.focusedIndex < action.payload - 1) {
        state.focusedIndex++;
      }
    },
    setSelectionMode(state, action: PayloadAction<"single" | "multi">) {
      state.selectionMode = action.payload;
    },
  },
});

export const {
  select,
  deselect,
  toggleSelect,
  selectRange,
  clearSelection,
  setFocus,
  moveFocusUp,
  moveFocusDown,
  setSelectionMode,
} = selectionSlice.actions;
export default selectionSlice.reducer;
