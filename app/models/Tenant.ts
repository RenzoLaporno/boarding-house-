import mongoose, { Schema, Document } from "mongoose";

export interface ITenant extends Document {
  uid: number;
  type: string;
  gender: "Male" | "Female";
  name: string;
  signature: string;
  dateApplied: Date;
  contractYears: number;
  room: string;
  status: "Active" | "Pending" | "Overdue";
  contact: string;
  moveIn: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    uid: { type: Number, required: true, unique: true },
    type: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    name: { type: String, required: true },
    signature: { type: String, default: "" },
    dateApplied: { type: Date, required: true, default: Date.now },
    contractYears: { type: Number, required: true },
    room: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Active", "Pending", "Overdue"],
      default: "Active",
    },
    contact: { type: String, default: "" },
    moveIn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Tenant ||
  mongoose.model<ITenant>("Tenant", TenantSchema);
