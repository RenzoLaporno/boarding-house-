import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPayment extends Document {
  tenant: Types.ObjectId;
  room: string;
  amount: number;
  month: string;
  year: number;
  paidAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    room: { type: String, required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    paidAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);
