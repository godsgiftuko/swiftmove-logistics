import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export enum EUserRole {
  admin = "admin",
  manager = "manager",
  driver = "driver",
}

export enum EUserStatus {
  active = "active",
  inactive = "inactive",
  suspended = "suspended",
  deleted = "deleted",
  busy = "busy",
}

export type UserRole = keyof typeof EUserRole;
export type UserStatus = keyof typeof EUserStatus;

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(EUserRole),
    },
    status: {
      type: String,
      enum: Object.values(EUserStatus),
      default: "active",
    },
    phone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Make Mongoose check your schema rules during updates
userSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function () {
  this.setOptions({ runValidators: true });
});

export default mongoose.model<IUser>("User", userSchema);
