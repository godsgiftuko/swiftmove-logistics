import { Schema } from 'mongoose';

export function toJSONPlugin(schema: Schema) {
  // Apply transform to both JSON and Object
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Record<string, any>) => {
        if (ret._id) {
          ret.id = ret._id.toString();
          delete ret._id;
        }
        return ret;
      },
  });

  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Record<string, any>) => {
        if (ret._id) {
          ret.id = ret._id.toString();
          delete ret._id;
        }
        return ret;
      },
  });
}
