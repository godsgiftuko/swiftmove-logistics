import mongoose, { Document, Schema } from 'mongoose';

export interface IParcel extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  weightInKg: number;
  quantity: number;
  isFragile: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const parcelSchema = new Schema<IParcel>({
  name: {
    type: String,
    required: true,
  },
  weightInKg: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  isFragile: {
    type: Boolean,
  },
}, {
  timestamps: true,
});

// Make Mongoose check your schema rules during updates
parcelSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
  this.setOptions({ runValidators: true });
});

// Index for efficient querying
parcelSchema.index({ createdAt: -1 });

export default mongoose.model<IParcel>('Parcel', parcelSchema);