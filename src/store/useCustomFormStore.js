import { create } from "zustand";

const useCustomFormStore = create((set) => ({
  showFormBuilder: false,
  setShowFormBuilder: (value) => set({ showFormBuilder: value }),

  showFormModal: false,
  setShowFormModal: (value) => set({ showFormModal: value }),

  customForms: [],
  setCustomForms: (forms) => set({ customForms: forms }),

  selectedDay: null,
  setSelectedDay: (day) => set({ selectedDay: day }),

  selectedForm: "",
  setSelectedForm: (form) => set({ selectedForm: form }),

  formData: null,
  setFormData: (updater) =>
    set((state) => {
      const newData =
        typeof updater === "function" ? updater(state.formData) : updater;

      return { formData: newData };
    }),

  savedData: {},
  setSavedData: (data) => set({ savedData: data }),
}));

export default useCustomFormStore;
