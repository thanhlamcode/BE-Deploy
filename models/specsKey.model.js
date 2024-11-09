import mongoose from "mongoose";
import slug from "mongoose-slug-generator";

mongoose.plugin(slug);

// Schema của từng key trong specifications
const specificationKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const specsKey = mongoose.model(
  "SpecificationKey",
  specificationKeySchema,
  "SpecificationKey"
);
export default specsKey;
