import { useForm } from "react-hook-form";
import { useUser } from "@clerk/clerk-react";
import { useFinancialRecordStore } from "../../store/financial-record-store";

interface FinancialRecordFormData {
  description: string;
  amount: string;
  category: string;
  paymentMethod: string;
}

export default function FinancialRecordForm() {
  const { user } = useUser();
  const { submitFinancialRecords, isLoading, error } =
    useFinancialRecordStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FinancialRecordFormData>();

  const onSubmit = async (data: FinancialRecordFormData) => {
    const newRecord = {
      userId: user?.id,
      date: new Date(),
      description: data.description,
      amount: parseFloat(data.amount),
      category: data.category,
      paymentMethod: data.paymentMethod,
    };

    try {
      await submitFinancialRecords(newRecord);
      reset();
    } catch (err) {
      console.error("Error submitting financial record:", err);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            className="input"
            {...register("description", {
              required: "Description is required",
              minLength: { value: 3, message: "at least 3 characters" },
            })}
          />
          {errors.description && (
            <span className="error-message">{errors.description.message}</span>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            className="input"
            {...register("amount", {
              required: "Amount is required",
              min: { value: 0, message: "Amount must be a positive number" },
            })}
          />
          {errors.amount && (
            <span className="error-message">{errors.amount.message}</span>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            {...register("category", { required: "Please select a category" })}
          >
            <option value="">Select</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Salary">Salary</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <span className="error-message">{errors.category.message}</span>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="payment-method">Payment Method:</label>
          <select
            id="payment-method"
            className="input"
            {...register("paymentMethod", {
              required: "Payment Method is Required",
            })}
          >
            <option value="">Select</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
          {errors.paymentMethod && (
            <span className="error-message">
              {errors.paymentMethod.message}
            </span>
          )}
        </div>

        <button className="button" type="submit">
          Add Record
        </button>
      </form>
    </div>
  );
}
