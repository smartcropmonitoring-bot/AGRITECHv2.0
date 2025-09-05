// models/Farmer.js
import mongoose from "mongoose";

const { Schema } = mongoose;

// 🐮 Cattle / Carabao Schema
const cattleSchema = new Schema({
  numberOfHeads: Number,
  breed: String,
  purpose: [String], // ["Milk", "Meat", "Draft", "Breeding"]
  avgMilkProduction: Number, // liters/day
  ageDistribution: [String], // ["Calves", "Heifers", "Adults", "Breeding Bull"]
  expenses: {
    feed: Number,
    veterinary: Number,
    housing: Number,
    labor: Number,
    others: Number,
  },
  challenges: [String],
});

// 🐐 Goat / Sheep Schema
const goatSchema = new Schema({
  numberOfHeads: Number,
  breed: String,
  purpose: [String], // ["Meat", "Milk", "Breeding"]
  avgMilkProduction: Number,
  breedingMethod: String, // "Natural" or "AI"
  expenses: {
    feed: Number,
    veterinary: Number,
    housing: Number,
    labor: Number,
    others: Number,
  },
  challenges: [String],
});

// 🐖 Pig Schema
const pigSchema = new Schema({
  numberOfPigs: Number,
  type: [String], // ["Sow", "Boar", "Piglets", "Fatteners"]
  avgLitterSize: Number,
  growthCycleMonths: Number,
  expenses: {
    feed: Number,
    medicines: Number,
    housing: Number,
    labor: Number,
    others: Number,
  },
  challenges: [String],
});

// 🐔 Chicken Schema
const chickenSchema = new Schema({
  numberOfBirds: Number,
  type: [String], // ["Broiler", "Layer", "Native"]
  avgEggProduction: Number,
  growthCycleWeeks: Number,
  housing: String, // "Free-range", "Caged", "Semi-intensive"
  expenses: {
    feed: Number,
    vaccines: Number,
    housing: Number,
    labor: Number,
    others: Number,
  },
  challenges: [String],
});

// 🦆 Duck / Others Schema
const duckSchema = new Schema({
  numberOfBirds: Number,
  purpose: [String], // ["Meat", "Eggs", "Breeding"]
  avgEggProduction: Number,
  housing: String,
  expenses: {
    feed: Number,
    veterinary: Number,
    housing: Number,
    labor: Number,
    others: Number,
  },
  challenges: [String],
});

// 🌾 Farming Schema
const farmingSchema = new Schema({
  totalLandArea: Number,
  ownershipStatus: String, // Owned, Rented, Shared, Government/Coop
  landType: [String],
  crops: {
    mainCrop: String,
    secondaryCrops: [String],
    plantingSeason: [String],
    avgYield: Number,
    harvestFrequency: String,
    usage: String,
  },
  practices: {
    method: String,
    irrigationSource: String,
    fertilizerUse: String,
    pesticideUse: Boolean,
  },
  equipment: [String],
  storageFacility: String,
  expenses: {
    seeds: Number,
    fertilizers: Number,
    pesticides: Number,
    labor: Number,
    water: Number,
    fuel: Number,
    others: Number,
  },
  challenges: [String],
});

// 👨‍🌾 Main Farmer Schema
const farmerSchema = new Schema(
  {
    farmerId: { type: String, unique: true },
    fullName: String,
    contact: String,
    location: {
      province: String,
      municipality: String,
      barangay: String,
    },
    farming: farmingSchema,
    animalHusbandry: {
      cattle: cattleSchema,
      goat: goatSchema,
      pig: pigSchema,
      chicken: chickenSchema,
      duck: duckSchema,
    },
    lastUpdate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Farmer", farmerSchema);
