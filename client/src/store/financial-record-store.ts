import { create } from "zustand";

interface FinancialRecord {
  id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordStore {
  financialRecords: FinancialRecord[];
  isLoading: boolean;
  error: string | null;

  addFinancialRecord: (userRecord: FinancialRecord) => void;
  submitFinancialRecords: (records: FinancialRecord[]) => Promise<void>;
}

export const useFinancialRecordStore = create<FinancialRecordStore>((set) => ({
  financialRecords: [],
  isLoading: false,
  error: null,

  addFinancialRecord: (userRecord) =>
    set((state) => ({
      financialRecords: [...state.financialRecords, userRecord],
    })),

  submitFinancialRecords: async (record) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const res = await fetch(`http://localhost:3000/financial-records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch financial records");
      }

      const savedRecords = await res.json();

      set((state) => ({
        financialRecords: [...state.financialRecords, ...savedRecords],
        isLoading: false,
      }));
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  },
}));
