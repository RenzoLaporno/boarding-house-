import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRoom extends Document {
  roomNumber: string;
  floor: number;
  status: "Occupied" | "Available";
  tenant: Types.ObjectId | null;
  monthlyRate: number;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomNumber: { type: String, required: true, unique: true },
    floor: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Occupied", "Available"],
      default: "Available",
    },
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", default: null },
    monthlyRate: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Room ||
  mongoose.model<IRoom>("Room", RoomSchema);
