const QRCode = require('qrcode');
const crypto = require('crypto');
const contract = require("../config/blockchain");

// Generate QR code for a product
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

// Scan QR code and retrieve product information
exports.scanQR = async (req, res) => {
  try {
    const { qrData } = req.params;

    if (!qrData) {
      return res.status(400).json({ error: 'QR data is required' });
    }

    // Decode QR data
    let decodedData;
    try {
      decodedData = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid QR code data' });
    }

    const { productId, blockchainAddress } = decodedData;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID not found in QR code' });
    }

    // Get product details from blockchain
    const productDetails = await contract.getProductDetails(productId);
    const productJourney = await contract.getProductJourney(productId);
    const productCertifications = await contract.getProductCertifications(productId);

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
        address: blockchainAddress,
        verified: true,
        authenticityVerified: isAuthentic
      },
      scanTimestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      product: productData,
      authenticity: {
        verified: isAuthentic,
        message: isAuthentic ? 'Product authenticity verified' : 'Product authenticity could not be verified'
      }
    });

  } catch (error) {
    console.error('QR scan error:', error);
    if (error.message.includes("Product does not exist")) {
      return res.status(404).json({ error: 'Product not found on blockchain' });
    }
    res.status(500).json({ error: 'Failed to scan QR code' });
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