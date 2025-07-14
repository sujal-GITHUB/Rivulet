const contract = require("../config/blockchain");

// Test Products with Journey Details
const testProducts = [
  {
    name: "Organic Quinoa",
    brand: "Premium Organics",
    sku: "QUI-001",
    batch: "BATCH-2024-001",
    originFarm: "Andean Highlands Farm",
    originCountry: "Peru",
    manufacturingDate: "2024-01-15",
    journey: [
      {
        step: "Harvesting",
        location: "Andean Highlands Farm, Cusco",
        status: "completed",
        metadata: "Altitude: 3000m, Organic certified, Hand-harvested"
      },
      {
        step: "Processing",
        location: "Cusco Processing Plant",
        status: "completed",
        metadata: "Cleaning: Mechanical, Drying: Natural, Quality: Grade A"
      },
      {
        step: "Quality Testing",
        location: "Quality Lab, Lima",
        status: "completed",
        metadata: "Purity test: 99.8%, Contamination: None detected"
      },
      {
        step: "Packaging",
        location: "Packaging Unit, Lima",
        status: "completed",
        metadata: "Package: Eco-friendly, Weight: 1kg, Sealed: Vacuum"
      },
      {
        step: "Warehouse Storage",
        location: "Distribution Center, Lima",
        status: "completed",
        metadata: "Storage: Climate controlled, Temperature: 18°C"
      },
      {
        step: "In Transit",
        location: "Logistics Hub, Miami",
        status: "in progress",
        metadata: "ETA: 3 days, Transport: Refrigerated container"
      }
    ]
  },
  {
    name: "Premium Coffee Beans",
    brand: "Mountain Roast",
    sku: "COF-002",
    batch: "BATCH-2024-002",
    originFarm: "Colombian Highlands",
    originCountry: "Colombia",
    manufacturingDate: "2024-01-20",
    journey: [
      {
        step: "Coffee Picking",
        location: "Colombian Highlands, Medellin",
        status: "completed",
        metadata: "Altitude: 1800m, Variety: Arabica, Hand-picked"
      },
      {
        step: "Processing",
        location: "Medellin Processing Plant",
        status: "completed",
        metadata: "Method: Washed, Drying: Sun-dried, Grade: Premium"
      },
      {
        step: "Roasting",
        location: "Bogota Roasting Facility",
        status: "completed",
        metadata: "Roast level: Medium, Temperature: 200°C, Time: 12 min"
      },
      {
        step: "Quality Certification",
        location: "Coffee Board, Bogota",
        status: "completed",
        metadata: "Certification: Organic, Fair Trade, Rainforest Alliance"
      },
      {
        step: "Packaging",
        location: "Packaging Facility, Cali",
        status: "completed",
        metadata: "Package: Resealable bag, Weight: 500g, Freshness: 18 months"
      },
      {
        step: "Distribution",
        location: "Distribution Center, Cartagena",
        status: "in progress",
        metadata: "Delivery: Next week, Store: 50 locations"
      }
    ]
  },
  {
    name: "Fresh Organic Vegetables",
    brand: "Farm Fresh",
    sku: "VEG-003",
    batch: "BATCH-2024-003",
    originFarm: "Green Valley Farm",
    originCountry: "USA",
    manufacturingDate: "2024-01-25",
    journey: [
      {
        step: "Harvesting",
        location: "Green Valley Farm, California",
        status: "completed",
        metadata: "Method: Hand-harvested, Time: Early morning, Organic certified"
      },
      {
        step: "Washing & Sorting",
        location: "Processing Plant, Fresno",
        status: "completed",
        metadata: "Washing: Triple rinse, Sorting: Size and quality, Temperature: 4°C"
      },
      {
        step: "Quality Testing",
        location: "Quality Lab, Sacramento",
        status: "completed",
        metadata: "Pesticide test: Passed, Contamination: None, Freshness: 98%"
      },
      {
        step: "Packaging",
        location: "Packaging Unit, Stockton",
        status: "completed",
        metadata: "Package: Biodegradable, Cooling: Ice packs, Weight: 2kg"
      },
      {
        step: "Cold Storage",
        location: "Cold Storage Facility, Oakland",
        status: "completed",
        metadata: "Temperature: 2°C, Humidity: 90%, Storage time: 24 hours"
      },
      {
        step: "Distribution",
        location: "Distribution Center, San Francisco",
        status: "in progress",
        metadata: "Delivery: Same day, Store: 100 locations, Transport: Refrigerated"
      }
    ]
  }
];

async function addProducts() {
  try {
    console.log("Starting product initialization...");
    
    for (const product of testProducts) {
      try {
        // Register product on blockchain
        const timestamp = Math.floor(new Date(product.manufacturingDate).getTime() / 1000);
        
        // Generate QR code hash
        const qrData = {
          name: product.name,
          brand: product.brand,
          sku: product.sku,
          batch: product.batch,
          timestamp: Date.now()
        };
        
        const crypto = require('crypto');
        const qrHash = crypto.createHash('sha256')
          .update(JSON.stringify(qrData))
          .digest('hex');

        console.log(`Registering product: ${product.name}`);
        
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
        for (const checkpoint of product.journey) {
          console.log(`Adding checkpoint: ${checkpoint.step} for product ${productId}`);
          
          const checkpointTx = await contract.addCheckpoint(
            productId,
            checkpoint.step,
            checkpoint.location,
            checkpoint.status,
            checkpoint.metadata
          );
          await checkpointTx.wait();
        }
        
        console.log(`Product ${product.name} initialized successfully with ${product.journey.length} journey steps`);
        
      } catch (error) {
        console.error(`Error initializing product ${product.name}:`, error);
        // Continue with next product even if one fails
      }
    }
    
    console.log("Product initialization completed!");
    
  } catch (error) {
    console.error("Error in addProducts:", error);
    throw error;
  }
}

module.exports = {
  addProducts
}; 