const contract = require("../config/blockchain");

// Indian Products with Journey Details
const indianProducts = [
  {
    name: "Organic Basmati Rice",
    brand: "Great Value",
    sku: "BAS-001",
    batch: "BATCH-2024-001",
    originFarm: "Punjab Organic Farms",
    originCountry: "India",
    manufacturingDate: "2024-01-15",
    journey: [
      {
        step: "Harvesting",
        location: "Punjab Organic Farms, Amritsar",
        status: "completed",
        metadata: "Temperature: 28°C, Humidity: 65%, Organic certified"
      },
      {
        step: "Processing",
        location: "Punjab Rice Mill, Ludhiana",
        status: "completed",
        metadata: "Quality grade: Premium, Processing time: 48 hours"
      },
      {
        step: "Quality Testing",
        location: "Walmart Quality Lab, Mumbai",
        status: "completed",
        metadata: "Pesticide test: Passed, Contamination test: Passed"
      },
      {
        step: "Packaging",
        location: "Walmart Distribution Center, Delhi",
        status: "completed",
        metadata: "Package type: Eco-friendly, Weight: 5kg"
      },
      {
        step: "Warehouse Storage",
        location: "Walmart Warehouse, Bangalore",
        status: "completed",
        metadata: "Storage conditions: 22°C, 60% humidity"
      },
      {
        step: "In Transit",
        location: "Walmart Logistics, Chennai",
        status: "in progress",
        metadata: "ETA: 2 days, Transport: Refrigerated truck"
      }
    ]
  },
  {
    name: "Premium Darjeeling Tea",
    brand: "Great Value",
    sku: "TEA-002",
    batch: "BATCH-2024-002",
    originFarm: "Darjeeling Tea Estate",
    originCountry: "India",
    manufacturingDate: "2024-01-20",
    journey: [
      {
        step: "Tea Picking",
        location: "Darjeeling Tea Estate, West Bengal",
        status: "completed",
        metadata: "Altitude: 2000m, First flush, Hand-picked"
      },
      {
        step: "Processing",
        location: "Darjeeling Tea Factory, Darjeeling",
        status: "completed",
        metadata: "Oxidation: 80%, Drying: Sun-dried"
      },
      {
        step: "Quality Certification",
        location: "Tea Board of India, Kolkata",
        status: "completed",
        metadata: "GI certified, Organic certified"
      },
      {
        step: "Packaging",
        location: "Walmart Packaging Unit, Kolkata",
        status: "completed",
        metadata: "Package: Biodegradable, Quantity: 100g"
      },
      {
        step: "Warehouse",
        location: "Walmart Regional DC, Hyderabad",
        status: "completed",
        metadata: "Storage: Climate controlled"
      },
      {
        step: "Distribution",
        location: "Walmart Stores, Mumbai",
        status: "in progress",
        metadata: "Delivery: Next day, Store: 15 locations"
      }
    ]
  },
  {
    name: "Organic Cotton T-Shirt",
    brand: "George",
    sku: "COT-003",
    batch: "BATCH-2024-003",
    originFarm: "Gujarat Cotton Farms",
    originCountry: "India",
    manufacturingDate: "2024-01-25",
    journey: [
      {
        step: "Cotton Harvesting",
        location: "Gujarat Organic Cotton Farms, Ahmedabad",
        status: "completed",
        metadata: "Organic certified, Rain-fed, Hand-picked"
      },
      {
        step: "Ginning",
        location: "Gujarat Cotton Gin, Surat",
        status: "completed",
        metadata: "Process: Mechanical, Quality: Grade A"
      },
      {
        step: "Spinning",
        location: "Walmart Textile Mill, Coimbatore",
        status: "completed",
        metadata: "Yarn count: 40s, Process: Ring spinning"
      },
      {
        step: "Weaving",
        location: "Walmart Weaving Unit, Tirupur",
        status: "completed",
        metadata: "Fabric: 100% cotton, GSM: 180"
      },
      {
        step: "Dyeing & Finishing",
        location: "Walmart Dyeing Unit, Erode",
        status: "completed",
        metadata: "Dye: Natural, Process: Eco-friendly"
      },
      {
        step: "Stitching",
        location: "Walmart Garment Unit, Bangalore",
        status: "completed",
        metadata: "Size: M, Color: White, Quantity: 1000 pieces"
      },
      {
        step: "Quality Check",
        location: "Walmart QC Lab, Bangalore",
        status: "completed",
        metadata: "Test: Color fastness, Stitching quality"
      },
      {
        step: "Packaging",
        location: "Walmart Packaging, Bangalore",
        status: "completed",
        metadata: "Package: Recycled plastic, Tags: RFID enabled"
      },
      {
        step: "Distribution",
        location: "Walmart Stores, Delhi",
        status: "in progress",
        metadata: "Delivery: Same day, Store: 25 locations"
      }
    ]
  },
  {
    name: "Spices Collection",
    brand: "Great Value",
    sku: "SPI-004",
    batch: "BATCH-2024-004",
    originFarm: "Kerala Spice Gardens",
    originCountry: "India",
    manufacturingDate: "2024-01-30",
    journey: [
      {
        step: "Spice Harvesting",
        location: "Kerala Spice Gardens, Munnar",
        status: "completed",
        metadata: "Spices: Cardamom, Pepper, Cinnamon, Organic"
      },
      {
        step: "Drying & Processing",
        location: "Kerala Spice Processing, Kochi",
        status: "completed",
        metadata: "Method: Sun-dried, Temperature: 35°C"
      },
      {
        step: "Quality Testing",
        location: "FSSAI Lab, Mumbai",
        status: "completed",
        metadata: "Test: Purity, Contamination, Heavy metals"
      },
      {
        step: "Packaging",
        location: "Walmart Spice Unit, Mumbai",
        status: "completed",
        metadata: "Package: Glass jars, Sealed: Vacuum packed"
      },
      {
        step: "Warehouse",
        location: "Walmart Cold Storage, Pune",
        status: "completed",
        metadata: "Temperature: 18°C, Humidity: 45%"
      },
      {
        step: "Distribution",
        location: "Walmart Stores, Bangalore",
        status: "in progress",
        metadata: "Delivery: 3 days, Store: 30 locations"
      }
    ]
  },
  {
    name: "Handcrafted Pottery",
    brand: "Handmade",
    sku: "POT-005",
    batch: "BATCH-2024-005",
    originFarm: "Jaipur Pottery Village",
    originCountry: "India",
    manufacturingDate: "2024-02-01",
    journey: [
      {
        step: "Clay Extraction",
        location: "Jaipur Clay Mines, Rajasthan",
        status: "completed",
        metadata: "Clay type: Red clay, Source: Natural"
      },
      {
        step: "Pottery Making",
        location: "Jaipur Pottery Village, Jaipur",
        status: "completed",
        metadata: "Method: Hand-thrown, Artisan: Master craftsman"
      },
      {
        step: "Drying",
        location: "Jaipur Drying Yard, Jaipur",
        status: "completed",
        metadata: "Time: 7 days, Method: Natural air drying"
      },
      {
        step: "Firing",
        location: "Jaipur Kiln, Jaipur",
        status: "completed",
        metadata: "Temperature: 1200°C, Time: 24 hours"
      },
      {
        step: "Glazing",
        location: "Jaipur Glazing Unit, Jaipur",
        status: "completed",
        metadata: "Glaze: Food-safe, Color: Traditional blue"
      },
      {
        step: "Quality Check",
        location: "Walmart Artisan Lab, Delhi",
        status: "completed",
        metadata: "Test: Durability, Food safety, Lead content"
      },
      {
        step: "Packaging",
        location: "Walmart Handmade Unit, Delhi",
        status: "completed",
        metadata: "Package: Eco-friendly, Protection: Bubble wrap"
      },
      {
        step: "Distribution",
        location: "Walmart Stores, Mumbai",
        status: "in progress",
        metadata: "Delivery: 5 days, Store: 10 locations"
      }
    ]
  }
];

// Function to register products and add journey checkpoints
async function addIndianProducts() {
  try {
    console.log("Starting Indian Products registration...");
    
    for (let i = 0; i < indianProducts.length; i++) {
      const product = indianProducts[i];
      
      // Register the product
      console.log(`Registering product: ${product.name}`);
      
      const timestamp = Math.floor(new Date(product.manufacturingDate).getTime() / 1000);
      const qrHash = `india-${product.sku}-${Date.now()}`;
      
      const tx = await contract.registerProduct(
        product.name,
        product.brand,
        product.sku,
        product.batch,
        product.originFarm,
        product.originCountry,
        timestamp,
        qrHash
      );
      await tx.wait();
      
      const productId = await contract.productCount();
      console.log(`Product registered with ID: ${productId}`);
      
      // Add journey checkpoints
      console.log(`Adding journey checkpoints for product ${productId}...`);
      
      for (const checkpoint of product.journey) {
        const checkpointTx = await contract.addCheckpoint(
          productId,
          checkpoint.step,
          checkpoint.location,
          checkpoint.status,
          checkpoint.metadata
        );
        await checkpointTx.wait();
        console.log(`Added checkpoint: ${checkpoint.step}`);
      }
      
      console.log(`Completed product ${productId}: ${product.name}\n`);
    }
    
    console.log("All Indian products registered successfully!");
    console.log("Journey data stored on blockchain - immutable and traceable");
    
  } catch (error) {
    console.error("Error adding Indian products:", error);
  }
}

// Function to get product journey from blockchain
async function getProductJourney(productId) {
  try {
    const journey = await contract.getProductJourney(productId);
    return journey.map(checkpoint => ({
      step: checkpoint.step,
      location: checkpoint.location,
      date: new Date(Number(checkpoint.timestamp) * 1000).toISOString().split('T')[0],
      status: checkpoint.status,
      recordedBy: checkpoint.recordedBy,
      metadata: checkpoint.metadata
    }));
  } catch (error) {
    console.error("Error getting product journey:", error);
    return [];
  }
}

// Function to update journey checkpoint (only add new, cannot modify existing)
async function updateJourneyCheckpoint(productId, step, location, status, metadata) {
  try {
    const tx = await contract.addCheckpoint(
      productId,
      step,
      location,
      status,
      metadata
    );
    await tx.wait();
    console.log(`Updated journey checkpoint for product ${productId}: ${step}`);
    return true;
  } catch (error) {
    console.error("Error updating journey checkpoint:", error);
    return false;
  }
}

module.exports = {
  addIndianProducts,
  getProductJourney,
  updateJourneyCheckpoint,
  indianProducts
};

// Run if called directly
if (require.main === module) {
  addIndianProducts()
    .then(() => {
      console.log("Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
} 