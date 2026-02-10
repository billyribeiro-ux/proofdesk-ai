import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DemoState {
  isActive: boolean;
  scenarioId: string | null;
  runId: string | null;
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  guidedOverlayVisible: boolean;
  guidedStep: number;
}

const initialState: DemoState = {
  isActive: false,
  scenarioId: null,
  runId: null,
  currentStep: 0,
  totalSteps: 0,
  isPlaying: false,
  speed: 1,
  guidedOverlayVisible: false,
  guidedStep: 0,
};

export const demoSlice = createSlice({
  name: "demo",
  initialState,
  reducers: {
    startDemo(
      state,
      action: PayloadAction<{
        scenarioId: string;
        runId: string;
        totalSteps: number;
      }>
    ) {
      state.isActive = true;
      state.scenarioId = action.payload.scenarioId;
      state.runId = action.payload.runId;
      state.totalSteps = action.payload.totalSteps;
      state.currentStep = 0;
      state.isPlaying = false;
    },
    setStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    nextStep(state) {
      if (state.currentStep < state.totalSteps - 1) {
        state.currentStep++;
      }
    },
    prevStep(state) {
      if (state.currentStep > 0) {
        state.currentStep--;
      }
    },
    play(state) {
      state.isPlaying = true;
    },
    pause(state) {
      state.isPlaying = false;
    },
    setSpeed(state, action: PayloadAction<number>) {
      state.speed = action.payload;
    },
    showGuidedOverlay(state) {
      state.guidedOverlayVisible = true;
      state.guidedStep = 0;
    },
    hideGuidedOverlay(state) {
      state.guidedOverlayVisible = false;
    },
    nextGuidedStep(state) {
      state.guidedStep++;
    },
    resetDemo() {
      return initialState;
    },
  },
});

export const {
  startDemo,
  setStep,
  nextStep,
  prevStep,
  play,
  pause,
  setSpeed,
  showGuidedOverlay,
  hideGuidedOverlay,
  nextGuidedStep,
  resetDemo,
} = demoSlice.actions;
export default demoSlice.reducer;
