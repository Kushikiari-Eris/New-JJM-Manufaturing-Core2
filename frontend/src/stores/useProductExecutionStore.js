import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useProductExecutionStore = create((set) => ({
  executions: [],
  workOrders: [],
  productExecution: [],
  countdowns: {},
  loading: false,
  error: null,

  fetchWorkOrders: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/execution");
      set({ productExecution: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  handleStartProduction: async (id) => {
    console.log(
      "🛠 Checking raw materials before starting production for Execution ID:",
      id
    );

    if (!id || id.length !== 24) {
      console.error("❌ Invalid ID format:", id);
      return;
    }

    try {
      // ✅ Step 1: Fetch execution details to get required raw materials
      const executionRes = await axios.get(`/execution/${id}`);
      const { productId, quantity, materials } = executionRes.data || {};

      if (!productId || !quantity) {
        console.error("❌ Missing productId or quantity in execution data");
        return;
      }

      if (!materials || materials.length === 0) {
        console.error("❌ No raw materials specified for this execution");
        toast.error("No raw materials defined for production", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // ✅ Step 2: Check raw material stock BEFORE starting production
      for (const material of materials) {
        const { materialId, quantity } = material;

        if (!materialId || !quantity) {
          console.error("⚠️ Invalid raw material data:", material);
          continue;
        }

        // Fetch the raw material stock
        const materialRes = await axios.get("/rawMaterial");
        const allMaterials = materialRes.data; // Ensure you're accessing the correct data structure
        const foundMaterial = allMaterials.find((m) => m._id === materialId);

        const availableStock = foundMaterial ? foundMaterial.quantity : 0;


        console.log(
          `🔍 Checking Raw Material ID: ${materialId}, Required: ${quantity}, Available: ${availableStock}`
        );

        if (availableStock < quantity) {
          console.error(
            `❌ Insufficient stock for Raw Material ID: ${materialId}`
          );
          toast.error(
            `❌ Insufficient stock for Raw Material ID: ${materialId}`,
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
          return; // ❌ Stop production if any raw material is insufficient
        }
      }

      console.log(
        "✅ All raw materials are available. Proceeding with production..."
      );

      // ✅ Step 3: Start production only if all materials are available
      const duration = 10; // Example duration (10 seconds)
      const response = await axios.put("/execution/start", { id, duration });

      if (response.status === 200) {
        set((state) => ({
          executions: state.executions.map((execution) =>
            execution._id === id
              ? { ...execution, status: "In Progress" }
              : execution
          ),
          countdowns: { ...state.countdowns, [id]: duration },
        }));

        console.log(`✅ Production started for Execution ID: ${id}`);

        // Start countdown timer
        let timeLeft = duration;
        const interval = setInterval(async () => {
          timeLeft -= 1;
          set((state) => ({
            countdowns: { ...state.countdowns, [id]: timeLeft },
          }));

          if (timeLeft <= 0) {
            clearInterval(interval);

            // ✅ Update status to "Completed"
            set((state) => ({
              executions: state.executions.map((execution) =>
                execution._id === id
                  ? { ...execution, status: "Completed" }
                  : execution
              ),
              countdowns: { ...state.countdowns, [id]: 0 }, // Reset countdown
            }));

            console.log(`✅ Production completed for Execution ID: ${id}`);

            try {
              console.log(
                `📦 Updating stock for Product ID: ${productId} (+${quantity})`
              );

              // ✅ Update finished product stock
              await axios.put(`/products/updateStock`, { productId, quantity });

              console.log(
                `✅ Stock updated successfully for Product ${productId}`
              );

              // ✅ Process raw materials decrement
              for (const material of materials) {
                const { materialId, quantity } = material;

                console.log(
                  `🔻 Deducting ${quantity} from Raw Material ID: ${materialId}`
                );

                // ✅ Decrement raw material stock
                await axios.put(`/rawMaterial/decrement`, {
                  id: materialId,
                  quantity: quantity,
                });

                console.log(
                  `✅ Raw Material ${materialId} stock updated successfully`
                );
              }
            } catch (error) {
              console.error("❌ Error updating stocks:", error);
            }
          }
        }, 1000);
      } else {
        console.error("❌ Unexpected response from server:", response);
      }
    } catch (error) {
      console.error("❌ Error starting production:", error);
      toast.error("Error starting production. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  },

  generateWorkOrder: async (orderId) => {
    try {
      const response = await axios.post("/execution/generate", { orderId });
      set((state) => ({
        productExecution: [...state.productExecution, response.data],
      }));
    } catch (error) {
      console.error("Error generating work order:", error);
    }
  },

  fetchExecutions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/execution"); // Fetch from local API
      set({
        executions: res.data.executions,
        workOrders: res.data.workOrders,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createExecution: async (executionData) => {
    try {
      const res = await axios.post("/execution", executionData);
      set((state) => ({ executions: [...state.executions, res.data] }));
    } catch (error) {
      console.error(error);
    }
  },

  updateExecution: async (id, updatedData) => {
    try {
      const res = await axios.put(`/execution/${id}`, updatedData);
      set((state) => ({
        executions: state.executions.map((exec) =>
          exec._id === id ? res.data : exec
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  deleteExecution: async (id) => {
    try {
      await axios.delete(`/execution/${id}`);
      set((state) => ({
        executions: state.executions.filter((exec) => exec._id !== id),
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));
