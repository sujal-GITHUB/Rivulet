const contract = require("../config/blockchain");

// Fetch product by ID
exports.getProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const [details, journey] = await Promise.all([
      contract.getProductDetails(productId),
      contract.getProductJourney(productId),
    ]);

    const formattedJourney = journey.map(checkpoint => ({
      step: checkpoint.step,
      location: checkpoint.location,
      date: new Date(Number(checkpoint.timestamp) * 1000).toISOString().split('T')[0],
      status: checkpoint.status,
    }));

    const productData = {
      id: Number(details[0]),
      name: details[1],
      brand: details[2],
      sku: details[3],
      batch: details[4],
      origin: { farm: details[5], country: details[6] },
      manufacturing: {
        date: new Date(Number(details[7]) * 1000).toISOString().split('T')[0],
        certifications: ["USDA Organic", "Fair Trade", "ISO 22000"], // Static for now
      },
      journey: formattedJourney,
      sustainability: {
        carbonFootprint: 2.3,
        waterUsage: 45,
        recyclability: 95,
        overallScore: 8.7,
      },
      blockchain: {
        hash: "0x" + productId.toString(16).padStart(64, '0'),
        verified: true,
      },
    };

    res.json(productData);
  } catch (error) {
    console.error("Error fetching product:", error);
    if (error.message.includes("Product does not exist")) {
      return res.status(404).json({ msg: "Product not found." });
    }
    res.status(500).json({ msg: "Server error." });
  }
};

// Register a product
exports.registerProduct = async (req, res) => {
  try {
    const { name, brand, sku, batch, originFarm, originCountry, manufacturingDate } = req.body;

    const timestamp = Math.floor(new Date(manufacturingDate).getTime() / 1000);
    const tx = await contract.registerProduct(name, brand, sku, batch, originFarm, originCountry, timestamp);
    await tx.wait();

    const newProductId = await contract.productCount();
    res.status(201).json({ msg: "Registered successfully!", productId: Number(newProductId) });
  } catch (error) {
    console.error("Error registering product:", error);
    res.status(500).json({ msg: "Server error during registration." });
  }
};
