import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

//tour type schema
const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

//tour type model
export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },

    division: {
      type: Schema.Types.ObjectId,
      // 'ref' tells Mongoose which model this ObjectId refers to.
      // It lets you use `.populate('division')` to get the full Division data.
      ref: "Division",
      required: true,
    },

    tourType: {
      type: Schema.Types.ObjectId,
      // 'ref' here links to the TourType model.
      // This allows you to access the full tour type details using populate.
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Tour = model<ITour>("Tour", tourSchema);
