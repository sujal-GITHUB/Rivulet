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

    // Generate QR code hash
    const qrData = {
      name,
      brand,
      sku,
      batch,
      timestamp: Date.now()
    };
    
    const qrHash = crypto.createHash('sha256')
      .update(JSON.stringify(qrData))
      .digest('hex');

    const timestamp = Math.floor(new Date(manufacturingDate).getTime() / 1000);
    
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

// Add checkpoint to product journey
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
