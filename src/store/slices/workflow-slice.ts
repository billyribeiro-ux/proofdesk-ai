import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WorkflowStep {
  id: string;
  label: string;
  status: "pending" | "active" | "completed" | "error";
  error?: string;
}

interface WorkflowState {
  activeWorkflow: string | null;
  steps: WorkflowStep[];
  currentStepIndex: number;
  isRunning: boolean;
}

const initialState: WorkflowState = {
  activeWorkflow: null,
  steps: [],
  currentStepIndex: -1,
  isRunning: false,
};

export const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    startWorkflow(
      state,
      action: PayloadAction<{ id: string; steps: Omit<WorkflowStep, "status">[] }>
    ) {
      state.activeWorkflow = action.payload.id;
      state.steps = action.payload.steps.map((s) => ({
        ...s,
        status: "pending",
      }));
      state.currentStepIndex = 0;
      state.isRunning = true;
      if (state.steps[0]) state.steps[0].status = "active";
    },
    advanceStep(state) {
      if (state.currentStepIndex >= 0 && state.steps[state.currentStepIndex]) {
        state.steps[state.currentStepIndex].status = "completed";
      }
      state.currentStepIndex++;
      if (state.currentStepIndex < state.steps.length) {
        state.steps[state.currentStepIndex].status = "active";
      } else {
        state.isRunning = false;
      }
    },
    failStep(state, action: PayloadAction<string>) {
      if (state.currentStepIndex >= 0 && state.steps[state.currentStepIndex]) {
        state.steps[state.currentStepIndex].status = "error";
        state.steps[state.currentStepIndex].error = action.payload;
      }
      state.isRunning = false;
    },
    resetWorkflow(state) {
      state.activeWorkflow = null;
      state.steps = [];
      state.currentStepIndex = -1;
      state.isRunning = false;
    },
  },
});

export const { startWorkflow, advanceStep, failStep, resetWorkflow } =
  workflowSlice.actions;
export default workflowSlice.reducer;
