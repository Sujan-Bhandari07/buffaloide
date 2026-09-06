import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

type MainView = "editor" | "preview";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface IdeState {
  projectName: string;
  explorerVisible: boolean;
  assistantVisible: boolean;

    activeFileName: string | null;
  mainView: MainView;
  isExplorerExpanded: boolean;
  activeFileId: string | null;
  terminalOpen: boolean;
  chatMessages: ChatMessage[];
  chatDraft: string;
  isAssistantThinking: boolean;
}

const initialState: IdeState = {
  projectName: "calculator",
  explorerVisible: true,
  assistantVisible: false,
  mainView: "editor",
  isExplorerExpanded: true,
  activeFileId: null,
  terminalOpen: false,
  chatMessages: [],

     activeFileName: null,
  chatDraft: "",
  isAssistantThinking: false,
};

const ideSlice = createSlice({
  name: "ide",
  initialState,
  reducers: {
    toggleExplorerPanel(state) {
      state.explorerVisible = !state.explorerVisible;
    },
    toggleAssistantPanel(state) {
      state.assistantVisible = !state.assistantVisible;
    },
    setMainView(state, action: PayloadAction<MainView>) {
      state.mainView = action.payload;
    },
    toggleExplorer(state) {
      state.isExplorerExpanded = !state.isExplorerExpanded;
    },
    toggleTerminal(state) {
      state.terminalOpen = !state.terminalOpen;
    },
    setChatDraft(state, action: PayloadAction<string>) {
      state.chatDraft = action.payload;
    },
    sendChatMessage: {
      reducer(state, action: PayloadAction<ChatMessage>) {
        state.chatMessages.push(action.payload);
        state.chatDraft = "";
        state.isAssistantThinking = true;
      },
      prepare(text: string) {
        return { payload: { id: nanoid(), role: "user" as const, text } };
      },
    },


    setActiveFile: (state, action: PayloadAction<{ id: string; name: string }>) => {
  state.activeFileId = action.payload.id;
  state.activeFileName = action.payload.name;
},
    receiveAssistantMessage: {
      reducer(state, action: PayloadAction<ChatMessage>) {
        state.chatMessages.push(action.payload);
        state.isAssistantThinking = false;
      },
      prepare(text: string) {
        return { payload: { id: nanoid(), role: "assistant" as const, text } };
      },
    },
  },
});

export const {
  toggleExplorerPanel,
  toggleAssistantPanel,
  setMainView,
  toggleExplorer,
  toggleTerminal,
  setChatDraft,
  sendChatMessage,
  receiveAssistantMessage,
} = ideSlice.actions;

export default ideSlice.reducer


