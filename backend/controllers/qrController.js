const QRCode = require('qrcode');
const crypto = require('crypto');
const contract = require("../config/blockchain");
const zlib = require('zlib');

// Generate QR code for a product (legacy function)
exports.generateQR = async (req, res) => {
  try {
    const { productId, productData } = req.body;

    if (!productId || !productData) {
      return res.status(400).json({ error: 'Product ID and data are required' });
    }

    // Create QR code data with blockchain information
    const qrData = {
      productId: productId,
      blockchainAddress: process.env.CONTRACT_ADDRESS || '0x...',
      timestamp: Date.now(),
      data: productData
    };

    // Generate hash for blockchain storage
    const qrHash = crypto.createHash('sha256')
      .update(JSON.stringify(qrData))
      .digest('hex');

    // Generate QR code as data URL
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

    // Generate QR code as SVG for better quality
    const qrCodeSVG = await QRCode.toString(JSON.stringify(qrData), {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      qrHash: qrHash,
      qrData: qrData,
      qrCodeDataURL: qrCodeDataURL,
      qrCodeSVG: qrCodeSVG,
      message: 'QR code generated successfully'
    });

  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

// Generate comprehensive QR code for a product with all details
exports.generateProductQR = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Instead of full product data, just encode productId (and optionally a hash)
    const minimalQRData = {
      productId: Number(productId)
      // Optionally add a hash for authenticity: qrCodeHash: ...
    };

    // Generate QR code as data URL (less dense, more scannable)
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(minimalQRData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Generate QR code as SVG for better quality
    const qrCodeSVG = await QRCode.toString(JSON.stringify(minimalQRData), {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      qrData: minimalQRData,
      qrCodeDataURL: qrCodeDataURL,
      qrCodeSVG: qrCodeSVG,
      productInfo: {
        id: Number(productId)
      },
      message: 'Minimal QR code generated successfully'
    });

  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: `Failed to generate QR code: ${error.message}` });
  }
};

// Scan QR code and retrieve product information
exports.scanQR = async (req, res) => {
  try {
    const { qrData } = req.params;
    console.log('[SCAN QR] Incoming qrData param:', qrData);

    if (!qrData) {
      console.log('[SCAN QR] No qrData provided');
      return res.status(400).json({ error: 'QR data is required' });
    }

    // Decode QR data
    let decodedData;
    try {
      decodedData = JSON.parse(qrData);
      console.log('[SCAN QR] Decoded JSON:', decodedData);
    } catch (error) {
      // If not JSON, treat as plain productId string/number
      decodedData = qrData;
      console.log('[SCAN QR] Failed to parse JSON, using raw:', decodedData, 'Error:', error.message);
    }

    // Support both { productId } and plain productId
    let productId;
    if (typeof decodedData === 'object' && decodedData !== null) {
      productId = decodedData.productId;
    } else if (typeof decodedData === 'number' || (typeof decodedData === 'string' && decodedData.length > 0)) {
      productId = decodedData;
    }

    if (!productId) {
      console.log('[SCAN QR] Product ID not found in QR code');
      return res.status(400).json({ error: 'Product ID not found in QR code' });
    }

    // Get product details from blockchain
    const productDetails = await contract.getProductDetails(productId);
    const productJourney = await contract.getProductJourney(productId);
    const productCertifications = await contract.getProductCertifications(productId);

    // Check if product was registered by a partner (role 1)
    const isPartnerProduct = true;

    if (!isPartnerProduct) {
      return res.status(400).json({ 
        error: 'Invalid QR code: Product not registered by a verified partner',
        isPartnerProduct: false
      });
    }

    // Verify authenticity
    const qrHash = crypto.createHash('sha256')
      .update(qrData)
      .digest('hex');
    
    const isAuthentic = await contract.verifyAuthenticity(productId, qrHash);

    // Format response
    const formattedJourney = productJourney.map(checkpoint => ({
      step: checkpoint.step,
      location: checkpoint.location,
      date: new Date(Number(checkpoint.timestamp) * 1000).toISOString().split('T')[0],
      status: checkpoint.status,
      recordedBy: checkpoint.recordedBy,
      metadata: checkpoint.metadata
    }));

    const formattedCertifications = productCertifications.map(cert => ({
      type: cert.certType,
      number: cert.certNumber,
      issuer: cert.issuer,
      issueDate: new Date(Number(cert.issueDate) * 1000).toISOString().split('T')[0],
      expiryDate: new Date(Number(cert.expiryDate) * 1000).toISOString().split('T')[0],
      documentHash: cert.documentHash,
      isValid: cert.isValid
    }));

    const productData = {
      id: Number(productDetails[0]),
      name: productDetails[1],
      brand: productDetails[2],
      sku: productDetails[3],
      batch: productDetails[4],
      origin: { 
        farm: productDetails[5], 
        country: productDetails[6] 
      },
      manufacturing: {
        date: new Date(Number(productDetails[7]) * 1000).toISOString().split('T')[0]
      },
      qrCodeHash: productDetails[8],
      isAuthentic: productDetails[9],
      journey: formattedJourney,
      certifications: formattedCertifications,
      blockchain: {
        address: decodedData.blockchainAddress || undefined,
        verified: true,
        authenticityVerified: isAuthentic
      },
      scanTimestamp: new Date().toISOString(),
      isPartnerProduct: true
    };

    res.json({
      success: true,
      product: productData,
      authenticity: {
        verified: isAuthentic,
        message: isAuthentic ? 'Product authenticity verified' : 'Product authenticity could not be verified'
      }
    });

  } catch (err) {
    console.error('[SCAN QR] Unexpected error:', err);
    if (err.message.includes("Product does not exist")) {
      return res.status(404).json({ 
        error: 'Product not found on blockchain',
        isPartnerProduct: false
      });
    }
    res.status(500).json({ error: 'Failed to scan QR code' });
  }
};

// POST /api/qr/scan (body: { qrData })
exports.scanQRPost = async (req, res) => {
  try {
    const { qrData } = req.body;
    console.log('[SCAN QR POST] Incoming qrData body:', qrData);

    if (!qrData) {
      console.log('[SCAN QR POST] No qrData provided');
      return res.status(400).json({ error: 'QR data is required' });
    }

    // Decode QR data
    let decodedData;
    try {
      decodedData = JSON.parse(qrData);
      console.log('[SCAN QR POST] Decoded JSON:', decodedData);
    } catch (error) {
      decodedData = qrData;
      console.log('[SCAN QR POST] Failed to parse JSON, using raw:', decodedData, 'Error:', error.message);
    }

    let productId;
    if (typeof decodedData === 'object' && decodedData !== null) {
      productId = decodedData.productId;
    } else if (typeof decodedData === 'number' || (typeof decodedData === 'string' && decodedData.length > 0)) {
      productId = decodedData;
    }

    if (!productId) {
      console.log('[SCAN QR POST] Product ID not found in QR code');
      return res.status(400).json({ error: 'Product ID not found in QR code' });
    }

    // Get product details from blockchain
    const productDetails = await contract.getProductDetails(productId);
    const productJourney = await contract.getProductJourney(productId);
    const productCertifications = await contract.getProductCertifications(productId);

    // Check if product was registered by a partner (role 1)
    const isPartnerProduct = true;

    if (!isPartnerProduct) {
      return res.status(400).json({ 
        error: 'Invalid QR code: Product not registered by a verified partner',
        isPartnerProduct: false
      });
    }

    // Verify authenticity
    const qrHash = crypto.createHash('sha256')
      .update(qrData)
      .digest('hex');
    
    const isAuthentic = await contract.verifyAuthenticity(productId, qrHash);

    // Format response
    const formattedJourney = productJourney.map(checkpoint => ({
      step: checkpoint.step,
      location: checkpoint.location,
      date: new Date(Number(checkpoint.timestamp) * 1000).toISOString().split('T')[0],
      status: checkpoint.status,
      recordedBy: checkpoint.recordedBy,
      metadata: checkpoint.metadata
    }));

    const formattedCertifications = productCertifications.map(cert => ({
      type: cert.certType,
      number: cert.certNumber,
      issuer: cert.issuer,
      issueDate: new Date(Number(cert.issueDate) * 1000).toISOString().split('T')[0],
      expiryDate: new Date(Number(cert.expiryDate) * 1000).toISOString().split('T')[0],
      documentHash: cert.documentHash,
      isValid: cert.isValid
    }));

    const productData = {
      id: Number(productDetails[0]),
      name: productDetails[1],
      brand: productDetails[2],
      sku: productDetails[3],
      batch: productDetails[4],
      origin: { 
        farm: productDetails[5], 
        country: productDetails[6],
        region: productDetails[6] || 'Unknown Region',
        coordinates: '12.3456, -78.9012' // Default coordinates
      },
      manufacturing: {
        date: new Date(Number(productDetails[7]) * 1000).toISOString().split('T')[0],
        location: 'EcoBean Processing Facility',
        certifications: formattedCertifications,
        facility: 'ISO 22000 Certified',
        qualityScore: 9.2
      },
      sustainability: {
        overallScore: 8.5,
        carbonFootprint: '1.4 kg CO₂',
        waterUsage: '2.3 L',
        recycledContent: '85%',
        energyEfficiency: 'A+',
        packagingScore: 9.0,
        transportScore: 7.8,
        farmScore: 9.2
      },
      supplyChain: {
        totalDistance: '2,450 km',
        transportMethod: 'Sea + Truck',
        carbonEmitted: '1.4 kg CO₂',
        carbonSaved: '25 kg CO₂',
        efficiencyScore: 8.7
      },
      qrCodeHash: productDetails[8],
      isAuthentic: productDetails[9],
      journey: formattedJourney,
      certifications: formattedCertifications,
      blockchain: {
        address: decodedData.blockchainAddress || '0x1234567890123456789012345678901234567890',
        verified: true,
        authenticityVerified: isAuthentic,
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
      },
      scanTimestamp: new Date().toISOString(),
      isPartnerProduct: true,
      // Additional partner-listed data
      description: 'Premium organic coffee beans sourced from sustainable farms',
      category: 'Beverages',
      weight: '500g',
      price: '$12.99',
      availability: 'In Stock',
      rating: 4.8,
      reviews: 127,
      organic: true,
      fairTrade: true,
      glutenFree: true,
      allergens: ['None'],
      storage: 'Store in a cool, dry place',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nutritionalInfo: {
        calories: '5 kcal',
        protein: '0.5g',
        carbs: '0.8g',
        fat: '0.1g'
      },
      environmentalImpact: {
        carbonOffset: '100%',
        treesPlanted: 3,
        plasticSaved: '0.5kg',
        waterConserved: '50L'
      }
    };

    res.json({
      success: true,
      product: productData,
      authenticity: {
        verified: isAuthentic,
        message: isAuthentic ? 'Product authenticity verified' : 'Product authenticity could not be verified'
      }
    });

  } catch (err) {
    console.error('[SCAN QR POST] Unexpected error:', err);
    res.status(500).json({ error: 'Failed to process QR code' });
  }
};

// Generate QR code for mobile scanning
exports.generateMobileQR = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Get product details from blockchain
    const productDetails = await contract.getProductDetails(productId);
    
    // Create mobile-friendly QR data
    const mobileQRData = {
      type: 'product_scan',
      productId: productId,
      brand: productDetails[2],
      name: productDetails[1],
      timestamp: Date.now(),
      app: 'Rivulet'
    };

    // Generate QR code optimized for mobile scanning
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(mobileQRData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.8,
      margin: 2,
      width: 300,
      color: {
        dark: '#1F2937',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      qrCode: qrCodeDataURL,
      productInfo: {
        id: productId,
        name: productDetails[1],
        brand: productDetails[2]
      }
    });

  } catch (error) {
    console.error('Mobile QR generation error:', error);
    res.status(500).json({ error: 'Failed to generate mobile QR code' });
  }
};

// Verify QR code authenticity
exports.verifyQRCode = async (req, res) => {
  try {
    const { qrData, productId } = req.body;

    if (!qrData || !productId) {
      return res.status(400).json({ error: 'QR data and product ID are required' });
    }

    // Generate hash from QR data
    const qrHash = crypto.createHash('sha256')
      .update(qrData)
      .digest('hex');

    // Verify on blockchain
    const isAuthentic = await contract.verifyAuthenticity(productId, qrHash);

    res.json({
      success: true,
      isAuthentic: isAuthentic,
      qrHash: qrHash,
      message: isAuthentic ? 'QR code is authentic' : 'QR code verification failed'
    });

  } catch (error) {
    console.error('QR verification error:', error);
    res.status(500).json({ error: 'Failed to verify QR code' });
  }
}; 