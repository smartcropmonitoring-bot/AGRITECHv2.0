document.getElementById("infoForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  const data = {
    fullName: formData.get("fullName"),
    contact: formData.get("contact"),
    location: {
      province: formData.get("province"),
      municipality: formData.get("municipality"),
      barangay: formData.get("barangay"),
    },
    farming: {
      totalLandArea: Number(formData.get("totalLandArea") || 0),
      ownershipStatus: formData.get("ownershipStatus"),
      landType: [formData.get("landType")],
      crops: {
        mainCrop: formData.get("mainCrop"),
        secondaryCrops: [formData.get("secondaryCrops")],
        plantingSeason: [formData.get("plantingSeason")],
        avgYield: Number(formData.get("avgYield") || 0),
        harvestFrequency: formData.get("harvestFrequency"),
        usage: formData.get("usage"),
      },
      practices: {
        method: formData.get("method"),
        irrigationSource: formData.get("irrigationSource"),
        fertilizerUse: formData.get("fertilizerUse"),
        pesticideUse: formData.get("pesticideUse") === "true",
      },
      equipment: [formData.get("equipment")],
      storageFacility: formData.get("storageFacility"),
      expenses: {
        seeds: Number(formData.get("expSeeds") || 0),
        fertilizers: Number(formData.get("expFertilizers") || 0),
        pesticides: Number(formData.get("expPesticides") || 0),
        labor: Number(formData.get("expLabor") || 0),
        water: Number(formData.get("expWater") || 0),
        fuel: Number(formData.get("expFuel") || 0),
        others: Number(formData.get("expOthers") || 0),
      },
      challenges: [],
    },
    animalHusbandry: {
      cattle: {
        numberOfHeads: Number(formData.get("cattleHeads") || 0),
        breed: formData.get("cattleBreed"),
        purpose: [formData.get("cattlePurpose")],
        avgMilkProduction: Number(formData.get("cattleMilk") || 0),
        ageDistribution: [formData.get("cattleAgeDist")],
        expenses: {
          feed: Number(formData.get("cattleFeed") || 0),
          veterinary: Number(formData.get("cattleVet") || 0),
          housing: Number(formData.get("cattleHousing") || 0),
          labor: Number(formData.get("cattleLabor") || 0),
          others: Number(formData.get("cattleOthers") || 0),
        },
        challenges: [formData.get("cattleChallenges")],
      },
      goat: {
        numberOfHeads: Number(formData.get("goatHeads") || 0),
        breed: formData.get("goatBreed"),
        purpose: [formData.get("goatPurpose")],
        avgMilkProduction: Number(formData.get("goatMilk") || 0),
        breedingMethod: formData.get("goatBreeding"),
        expenses: {
          feed: Number(formData.get("goatFeed") || 0),
          veterinary: Number(formData.get("goatVet") || 0),
          housing: Number(formData.get("goatHousing") || 0),
          labor: Number(formData.get("goatLabor") || 0),
          others: Number(formData.get("goatOthers") || 0),
        },
        challenges: [formData.get("goatChallenges")],
      },
      pig: {
        numberOfPigs: Number(formData.get("pigCount") || 0),
        type: [formData.get("pigType")],
        avgLitterSize: Number(formData.get("pigLitter") || 0),
        growthCycleMonths: Number(formData.get("pigGrowth") || 0),
        expenses: {
          feed: Number(formData.get("pigFeed") || 0),
          medicines: Number(formData.get("pigMeds") || 0),
          housing: Number(formData.get("pigHousing") || 0),
          labor: Number(formData.get("pigLabor") || 0),
          others: Number(formData.get("pigOthers") || 0),
        },
        challenges: [formData.get("pigChallenges")],
      },
      chicken: {
        numberOfBirds: Number(formData.get("chickenCount") || 0),
        type: [formData.get("chickenType")],
        avgEggProduction: Number(formData.get("chickenEggs") || 0),
        growthCycleWeeks: Number(formData.get("chickenGrowth") || 0),
        housing: formData.get("chickenHousing"),
        expenses: {
          feed: Number(formData.get("chickenFeed") || 0),
          vaccines: Number(formData.get("chickenVac") || 0),
          housing: Number(formData.get("chickenHouseExp") || 0),
          labor: Number(formData.get("chickenLabor") || 0),
          others: Number(formData.get("chickenOthers") || 0),
        },
        challenges: [formData.get("chickenChallenges")],
      },
      duck: {
        numberOfBirds: Number(formData.get("duckCount") || 0),
        purpose: [formData.get("duckPurpose")],
        avgEggProduction: Number(formData.get("duckEggs") || 0),
        housing: formData.get("duckHousing"),
        expenses: {
          feed: Number(formData.get("duckFeed") || 0),
          veterinary: Number(formData.get("duckVet") || 0),
          housing: Number(formData.get("duckHouseExp") || 0),
          labor: Number(formData.get("duckLabor") || 0),
          others: Number(formData.get("duckOthers") || 0),
        },
        challenges: [formData.get("duckChallenges")],
      },
    },
  };

  try {
    const res = await fetch("https://agritechv2-0.onrender.com/api/farmers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ Farmer record saved successfully!");
      this.reset();
    } else {
      alert("❌ Failed to save farmer: " + (result.message || "Unknown error"));
    }
  } catch (err) {
    console.error("Save error:", err);
    alert("⚠️ Server error. Please try again.");
  }
});
