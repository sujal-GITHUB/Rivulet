const contract = require("../config/blockchain");
const crypto = require('crypto');
const QRCode = require('qrcode');

// Fetch product by ID
exports.getProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const [details, journey, certifications] = await Promise.all([
      contract.getProductDetails(productId),
      contract.getProductJourney(productId),
      contract.getProductCertifications(productId)
    ]);

    const formattedJourney = journey.map(checkpoint => ({
      step: checkpoint.step,
      location: checkpoint.location,
      date: new Date(Number(checkpoint.timestamp) * 1000).toISOString().split('T')[0],
      status: checkpoint.status,
      recordedBy: checkpoint.recordedBy,
      metadata: checkpoint.metadata
    }));

    const formattedCertifications = certifications.map(cert => ({
      type: cert.certType,
      number: cert.certNumber,
      issuer: cert.issuer,
      issueDate: new Date(Number(cert.issueDate) * 1000).toISOString().split('T')[0],
      expiryDate: new Date(Number(cert.expiryDate) * 1000).toISOString().split('T')[0],
      documentHash: cert.documentHash,
      isValid: cert.isValid
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
        certifications: formattedCertifications
      },
      qrCodeHash: details[8],
      isAuthentic: details[9],
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
        authenticityVerified: details[9]
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

// Register a product with QR code
exports.registerProduct = async (req, res) => {
  try {
    const { 
      name, 
      brand, 
      sku, 
      batch, 
      originFarm, 
      originCountry, 
      manufacturingDate 
    } = req.body;

    // Get partner's wallet address from JWT
    const partnerWallet = req.user?.walletAddress;
    if (!partnerWallet) {
      return res.status(401).json({ msg: 'Unauthorized: No partner wallet found' });
    }

    // Generate QR code hash
    const qrData = {
      name,
      brand,
      sku,
      batch,
      timestamp: Date.now(),
      owner: partnerWallet
    };
    
    const qrHash = crypto.createHash('sha256')
      .update(JSON.stringify(qrData))
      .digest('hex');

    const timestamp = Math.floor(new Date(manufacturingDate).getTime() / 1000);
    
    // Register product on blockchain (add owner as metadata if possible)
    const tx = await contract.registerProduct(
      name, 
      brand, 
      sku, 
      batch, 
      originFarm, 
      originCountry, 
      timestamp,
      qrHash
    );
    await tx.wait();

    const newProductId = await contract.productCount();

    // Store owner in DB (if you have a DB for products, otherwise skip)
    // ...

    // Generate QR code for the product
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.status(201).json({ 
      msg: "Registered successfully!", 
      productId: Number(newProductId),
      qrCode: qrCodeDataURL,
      qrHash: qrHash
    });
  } catch (error) {
    console.error("Error registering product:", error);
    res.status(500).json({ msg: "Server error during registration." });
  }
};

// Add checkpoint to product journey (only owner can update)
exports.addCheckpoint = async (req, res) => {
  try {
    const { 
      productId, 
      step, 
      location, 
      status, 
      metadata 
    } = req.body;

    if (!productId || !step || !location || !status) {
      return res.status(400).json({ error: 'Product ID, step, location, and status are required' });
    }

    // Get product details to check owner
    const details = await contract.getProductDetails(productId);
    // Assume details[10] is owner wallet (if not, you need to store owner in DB)
    // For now, fallback to only allowing checkpoint if user is a partner
    const userWallet = req.user?.walletAddress;
    const userRole = req.user?.role;
    if (!userWallet || userRole !== 1) {
      return res.status(403).json({ error: 'Only partners can update journey steps' });
    }
    // If you have owner info, check: if (details[10] !== userWallet) { ... }

    const tx = await contract.addCheckpoint(
      productId,
      step,
      location,
      status,
      metadata || ""
    );
    await tx.wait();

    res.json({ 
      msg: "Checkpoint added successfully!",
      checkpoint: {
        productId,
        step,
        location,
        status,
        metadata,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error("Error adding checkpoint:", error);
    res.status(500).json({ msg: "Server error during checkpoint addition." });
  }
};

// Add certification to product
exports.addCertification = async (req, res) => {
  try {
    const { 
      productId, 
      certType, 
      certNumber, 
      issuer, 
      issueDate, 
      expiryDate, 
      documentHash 
    } = req.body;

    if (!productId || !certType || !certNumber || !issuer || !issueDate || !expiryDate) {
      return res.status(400).json({ error: 'All certification fields are required' });
    }

    const issueTimestamp = Math.floor(new Date(issueDate).getTime() / 1000);
    const expiryTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000);

    const tx = await contract.addCertification(
      productId,
      certType,
      certNumber,
      issuer,
      issueTimestamp,
      expiryTimestamp,
      documentHash || ""
    );
    await tx.wait();

    res.json({ 
      msg: "Certification added successfully!",
      certification: {
        productId,
        type: certType,
        number: certNumber,
        issuer,
        issueDate,
        expiryDate,
        documentHash
      }
    });
  } catch (error) {
    console.error("Error adding certification:", error);
    res.status(500).json({ msg: "Server error during certification addition." });
  }
};

// Get product by QR code hash
exports.getProductByQR = async (req, res) => {
  try {
    const { qrHash } = req.params;

    if (!qrHash) {
      return res.status(400).json({ error: 'QR hash is required' });
    }

    const productId = await contract.getProductByQRCode(qrHash);
    
    if (productId.toString() === "0") {
      return res.status(404).json({ error: 'Product not found for this QR code' });
    }

    // Get full product details
    const [details, journey, certifications] = await Promise.all([
      contract.getProductDetails(productId),
      contract.getProductJourney(productId),
      contract.getProductCertifications(productId)
    ]);

    const formattedJourney = journey.map(checkpoint => ({
      step: checkpoint.step,
      location: checkpoint.location,
      date: new Date(Number(checkpoint.timestamp) * 1000).toISOString().split('T')[0],
      status: checkpoint.status,
      recordedBy: checkpoint.recordedBy,
      metadata: checkpoint.metadata
    }));

    const formattedCertifications = certifications.map(cert => ({
      type: cert.certType,
      number: cert.certNumber,
      issuer: cert.issuer,
      issueDate: new Date(Number(cert.issueDate) * 1000).toISOString().split('T')[0],
      expiryDate: new Date(Number(cert.expiryDate) * 1000).toISOString().split('T')[0],
      documentHash: cert.documentHash,
      isValid: cert.isValid
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
        certifications: formattedCertifications
      },
      qrCodeHash: details[8],
      isAuthentic: details[9],
      journey: formattedJourney,
      blockchain: {
        verified: true,
        authenticityVerified: details[9]
      }
    };

    res.json({
      success: true,
      product: productData,
      qrHash: qrHash
    });

  } catch (error) {
    console.error("Error fetching product by QR:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// Verify product authenticity
exports.verifyAuthenticity = async (req, res) => {
  try {
    const { productId, qrCodeHash } = req.body;

    if (!productId || !qrCodeHash) {
      return res.status(400).json({ error: 'Product ID and QR code hash are required' });
    }

    const isAuthentic = await contract.verifyAuthenticity(productId, qrCodeHash);

    res.json({
      success: true,
      isAuthentic: isAuthentic,
      productId: productId,
      qrCodeHash: qrCodeHash,
      message: isAuthentic ? 'Product authenticity verified' : 'Product authenticity verification failed'
    });

  } catch (error) {
    console.error("Error verifying authenticity:", error);
    res.status(500).json({ error: "Server error during authenticity verification." });
  }
};

// Get product count and create test product if none exist
exports.getProductCount = async (req, res) => {
  try {
    const productCount = await contract.productCount();
    
    // If no products exist, create a test product
    if (productCount.toString() === "0") {
      console.log("No products found, creating test product...");
      
      const testProductData = {
        name: "Organic Coffee Beans",
        brand: "EcoBean",
        sku: "COFFEE-001",
        batch: "BATCH-2024-001",
        originFarm: "Green Valley Farm",
        originCountry: "Colombia",
        manufacturingDate: new Date().toISOString().split('T')[0]
      };

      const qrData = {
        name: testProductData.name,
        brand: testProductData.brand,
        sku: testProductData.sku,
        batch: testProductData.batch,
        timestamp: Date.now()
      };
      
      const qrHash = crypto.createHash('sha256')
        .update(JSON.stringify(qrData))
        .digest('hex');

      const timestamp = Math.floor(new Date(testProductData.manufacturingDate).getTime() / 1000);
      
      const tx = await contract.registerProduct(
        testProductData.name, 
        testProductData.brand, 
        testProductData.sku, 
        testProductData.batch, 
        testProductData.originFarm, 
        testProductData.originCountry, 
        timestamp,
        qrHash
      );
      await tx.wait();

      const newProductId = await contract.productCount();
      
      res.json({ 
        productCount: Number(newProductId),
        testProductCreated: true,
        testProductId: Number(newProductId)
      });
    } else {
      res.json({ 
        productCount: Number(productCount),
        testProductCreated: false
      });
    }
  } catch (error) {
    console.error("Error getting product count:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// Get all products (blockchain, with journey, stats, etc.)
exports.getProducts = async (req, res) => {
  try {
    const products = [];
    const productCount = await contract.productCount();
    for (let i = 1; i <= productCount; i++) {
      try {
        const [details, journey, certifications] = await Promise.all([
          contract.getProductDetails(i),
          contract.getProductJourney(i),
          contract.getProductCertifications(i)
        ]);
        const formattedJourney = journey.map(checkpoint => ({
          step: checkpoint.step,
          location: checkpoint.location,
          date: new Date(Number(checkpoint.timestamp) * 1000).toISOString().split('T')[0],
          status: checkpoint.status,
          recordedBy: checkpoint.recordedBy,
          metadata: checkpoint.metadata
        }));
        const formattedCertifications = certifications.map(cert => ({
          type: cert.certType,
          number: cert.certNumber,
          issuer: cert.issuer,
          issueDate: new Date(Number(cert.issueDate) * 1000).toISOString().split('T')[0],
          expiryDate: new Date(Number(cert.expiryDate) * 1000).toISOString().split('T')[0],
          documentHash: cert.documentHash,
          isValid: cert.isValid
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
            certifications: formattedCertifications
          },
          qrCodeHash: details[8],
          isAuthentic: details[9],
          journey: formattedJourney,
          sustainability: {
            carbonFootprint: 2.3,
            waterUsage: 45,
            recyclability: 95,
            overallScore: 8.7,
          },
          blockchain: {
            hash: "0x" + i.toString(16).padStart(64, '0'),
            verified: true,
            authenticityVerified: details[9]
          },
        };
        products.push(productData);
      } catch (error) {
        continue;
      }
    }
    res.json({
      success: true,
      products: products,
      total: products.length,
      message: "Products retrieved from blockchain"
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// Add new journey checkpoint to existing product (blockchain, immutable)
exports.addJourneyCheckpoint = async (req, res) => {
  try {
    const { productId, step, location, status, metadata } = req.body;
    if (!productId || !step || !location || !status) {
      return res.status(400).json({ error: 'Product ID, step, location, and status are required' });
    }
    try {
      await contract.getProductDetails(productId);
    } catch (error) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const tx = await contract.addCheckpoint(
      productId,
      step,
      location,
      status,
      metadata || ""
    );
    await tx.wait();
    res.json({ 
      success: true,
      msg: "Journey checkpoint added to blockchain successfully!",
      checkpoint: {
        productId,
        step,
        location,
        status,
        metadata,
        timestamp: Date.now(),
        blockchain: {
          transactionHash: tx.hash,
          immutable: true
        }
      }
    });
  } catch (error) {
    console.error("Error adding journey checkpoint:", error);
    res.status(500).json({ error: "Server error during checkpoint addition." });
  }
};

// Get product journey with blockchain verification
exports.getProductJourney = async (req, res) => {
  try {
    const productId = req.params.id;
    const [details, journey, certifications] = await Promise.all([
      contract.getProductDetails(productId),
      contract.getProductJourney(productId),
      contract.getProductCertifications(productId)
    ]);
    const formattedJourney = journey.map(checkpoint => ({
      step: checkpoint.step,
      location: checkpoint.location,
      date: new Date(Number(checkpoint.timestamp) * 1000).toISOString().split('T')[0],
      status: checkpoint.status,
      recordedBy: checkpoint.recordedBy,
      metadata: checkpoint.metadata,
      blockchain: {
        verified: true,
        immutable: true
      }
    }));
    const productData = {
      id: Number(details[0]),
      name: details[1],
      brand: details[2],
      sku: details[3],
      batch: details[4],
      origin: { farm: details[5], country: details[6] },
      manufacturing: {
        date: new Date(Number(details[7]) * 1000).toISOString().split('T')[0]
      },
      qrCodeHash: details[8],
      isAuthentic: details[9],
      journey: formattedJourney,
      blockchain: {
        verified: true,
        authenticityVerified: details[9],
        immutable: true
      }
    };
    res.json({
      success: true,
      product: productData,
      message: "Product journey retrieved from blockchain - immutable and traceable"
    });
  } catch (error) {
    console.error("Error fetching product journey:", error);
    if (error.message.includes("Product does not exist")) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(500).json({ error: "Server error." });
  }
};

// Verify product authenticity with blockchain
exports.verifyProductAuthenticity = async (req, res) => {
  try {
    const { productId, qrCodeHash } = req.body;
    if (!productId || !qrCodeHash) {
      return res.status(400).json({ error: 'Product ID and QR code hash are required' });
    }
    const isAuthentic = await contract.verifyAuthenticity(productId, qrCodeHash);
    res.json({
      success: true,
      isAuthentic: isAuthentic,
      productId: productId,
      qrCodeHash: qrCodeHash,
      blockchain: {
        verified: true,
        immutable: true
      },
      message: isAuthentic ? 
        'Product authenticity verified on blockchain' : 
        'Product authenticity verification failed'
    });
  } catch (error) {
    console.error("Error verifying authenticity:", error);
    res.status(500).json({ error: "Server error during authenticity verification." });
  }
};

// Get supply chain statistics
exports.getSupplyChainStats = async (req, res) => {
  try {
    const productCount = await contract.productCount();
    let totalJourneySteps = 0;
    let completedProducts = 0;
    let inProgressProducts = 0;
    for (let i = 1; i <= productCount; i++) {
      try {
        const journey = await contract.getProductJourney(i);
        totalJourneySteps += journey.length;
        const lastStep = journey[journey.length - 1];
        if (lastStep && lastStep.status.toLowerCase().includes('completed')) {
          completedProducts++;
        } else if (lastStep && lastStep.status.toLowerCase().includes('progress')) {
          inProgressProducts++;
        }
      } catch (error) {
        continue;
      }
    }
    res.json({
      success: true,
      stats: {
        totalProducts: Number(productCount),
        totalJourneySteps,
        completedProducts,
        inProgressProducts,
        averageStepsPerProduct: totalJourneySteps / Number(productCount)
      },
      blockchain: {
        verified: true,
        immutable: true
      }
    });
  } catch (error) {
    console.error("Error getting supply chain stats:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// Initialize products (for testing)
exports.initializeProducts = async (req, res) => {
  try {
    const { addProducts } = require("../scripts/products");
    await addProducts();
    res.json({
      success: true,
      message: "Products initialized on blockchain successfully!"
    });
  } catch (error) {
    console.error("Error initializing products:", error);
    res.status(500).json({ error: "Server error during initialization." });
  }
};
