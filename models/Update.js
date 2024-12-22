const mongoose= require('mongoose');
const slugify= require('slugify');
const Schema= mongoose.Schema;

const UpdateSchema= new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    version: {
        type: Number,
        unique: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    day1Retention: { type: Number, required: true },
    day7Retention: { type: Number, required: true },
    day30Retention: { type: Number, required: true },
    purchasesDay1: { type: Number, required: true },
    purchasesDay7: { type: Number, required: true },
    purchasesDay30: { type: Number, required: true },
    averageScreenTimeDay1: { type: Number, required: true },
    averageScreenTimeDay7: { type: Number, required: true },
    averageScreenTimeDay30: { type: Number, required: true },
    numberOfTesters: {
        type: Number,
        default: 1000,
    },
    slug: {
        type: String,
        unique: true,
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
    ref:'user'
    }
});

UpdateSchema.pre('validate', function(next){
    this.slug = slugify(this.name, {
      lower:true,
      strict:true
    })
    next();
  })

const Update= mongoose.model('Update', UpdateSchema);
module.exports= Update;