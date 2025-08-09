import mongoose, { Document, Schema } from 'mongoose';
import { IParcel } from './parcel.model';
import { IAddress } from '@/interfaces';


export enum EDeliveryStatus {
    pending = 'pending',
    assigned = 'assigned',
    in_transit = 'in_transit',
    delivered = 'delivered',
    cancelled = 'cancelled',
}

export enum EDeliveryPriority {
    low = 'low',
    medium = 'medium',
    high = 'high'
}

export type DeliveryStatus = 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
export type DeliveryPriority = 'low' | 'medium' | 'high';

export interface IDelivery extends Document {
  _id: mongoose.Types.ObjectId;
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupAddress: IAddress;
  destinationAddress: IAddress;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  assignedDriver?: mongoose.Types.ObjectId;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  deliveryReceiptUrl?: string;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  assignedBy?: mongoose.Types.ObjectId;
  parcel: IParcel;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  }
});

const deliverySchema = new Schema<IDelivery>({
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
    immutable: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    lowercase: true,
    trim: true,
  },
  pickupAddress: {
    type: addressSchema,
    required: true,
  },
  destinationAddress: {
    type: addressSchema,
    required: true,
  },
  parcel: {
    type: Schema.Types.ObjectId,
    ref: 'Parcel',
  },
  status: {
    type: String,
    enum: Object.values(EDeliveryStatus),
    default: 'pending',
  },
  priority: {
    type: String,
    enum: Object.values(EDeliveryPriority),
    default: 'medium',
  },
  assignedDriver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  estimatedDeliveryDate: {
    type: Date,
    required: true,
  },
  actualDeliveryDate: {
    type: Date,
  },
  deliveryReceiptUrl: {
    type: String,
  },
  notes: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Generate tracking number before saving
deliverySchema.pre('save', function (next) {
  if (!this.trackingNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.trackingNumber = `SM${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Make Mongoose check your schema rules during updates
deliverySchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
  this.setOptions({ runValidators: true });
});

// Index for efficient querying
deliverySchema.index({ status: 1 });
deliverySchema.index({ assignedDriver: 1 });
deliverySchema.index({ createdAt: -1 });

export default mongoose.model<IDelivery>('Delivery', deliverySchema);