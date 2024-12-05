import { create } from "zustand";

type State = {
  status: "idle" | "process" | "ok" | "fail";
};

type Actions = {
  checkPaid: (pid: string) => Promise<void>;
  setStatus: (status: "process" | "ok" | "fail") => void;
};

const initialState: State = {
  status: "idle",
};

export const useFormStore = create<State & Actions>((set) => ({
  ...initialState,
  checkPaid: async (pid) => {
    try {
      const response = await fetch(`http://localhost:2050/pay/check/${pid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      set({ status: data.status });
    } catch (error) {
      console.log(error);
      set({ status: "fail" });
    }
  },
  setStatus: (status) => {
    set({ status });
  },
}));
