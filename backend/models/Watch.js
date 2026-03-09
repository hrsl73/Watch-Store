import mongoose from 'mongoose';

const watchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
  },
  img: {
    type: String, // URL or base64 or path to image
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Watch', watchSchema);
