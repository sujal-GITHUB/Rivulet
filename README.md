# Rivulet: Advanced Blockchain-Powered Supply Chain Traceability

**Rivulet** is a comprehensive full-stack decentralized application (dApp) that provides transparent and immutable tracking of products throughout their supply chain journey. By leveraging Solidity smart contracts on the Ethereum blockchain, it offers verifiable proof of a product's origin, journey, certifications, and authenticity.

---

## 🚀 Advanced Features

### 🔐 Role-Based Access Control
- **Manufacturer**: Register products, add manufacturing checkpoints, manage product lifecycle
- **Logistics Partner**: Track shipments, add transport checkpoints, monitor delivery status
- **Certifier**: Add third-party certifications, verify product standards, manage compliance
- **Admin**: Manage users, oversee system logs, control access permissions

### 📱 QR Code Generation & Scanning
- **Unique QR Codes**: Each product gets a cryptographically signed QR code
- **Mobile-Optimized Scanning**: Responsive QR scanner for mobile devices
- **Blockchain Verification**: QR codes link directly to immutable blockchain records
- **Authenticity Verification**: Cryptographic validation of product authenticity

### 🔗 Blockchain Integration
- **Smart Contract Security**: Role-based permissions enforced on-chain
- **Immutable Records**: All product events permanently stored on blockchain
- **Cryptographic Verification**: SHA-256 hashing for authenticity validation
- **Real-time Updates**: Live blockchain data synchronization

### 📊 Product Lifecycle Management
- **Complete Journey Tracking**: From harvest to final delivery
- **Certification Management**: Third-party certifications with expiry tracking
- **Metadata Support**: Temperature, humidity, and environmental data
- **Timeline Visualization**: Interactive product journey timeline

### 🛡️ Authenticity Verification
- **Cryptographic Validation**: Verify product authenticity using blockchain hashes
- **QR Code Security**: Tamper-proof QR codes with blockchain verification
- **Real-time Alerts**: Immediate notification of authenticity issues
- **Audit Trail**: Complete blockchain audit trail for compliance

---

## 🧩 Technology Stack

### 🔗 Smart Contract (Blockchain Layer)
- **Solidity**: Advanced smart contracts with role-based access control
- **Hardhat**: Ethereum development environment with testing framework
- **Ethers.js**: Blockchain interaction and transaction management
- **Sepolia Testnet**: Production-ready test network deployment

### 🗄️ Backend (Server Layer)
- **Node.js**: High-performance JavaScript runtime
- **Express.js**: RESTful API with role-based authentication
- **JWT Authentication**: Secure token-based user sessions
- **QR Code Generation**: Dynamic QR code creation with blockchain data
- **Crypto Integration**: SHA-256 hashing for authenticity verification

### 🖥️ Frontend (Client Layer)
- **React.js**: Modern component-based UI architecture
- **Tailwind CSS**: Utility-first responsive design system
- **QR Code Scanning**: Real-time camera-based QR code reading
- **Mobile Optimization**: Responsive design for mobile devices
- **Role-Based UI**: Dynamic interfaces based on user permissions

---

## 📁 Enhanced Project Structure

```plaintext
blockchain-traceability-app/
├── backend/
│   ├── controllers/
│   │   ├── productController.js    # Product management
│   │   ├── authController.js       # Authentication & roles
│   │   └── qrController.js        # QR code generation/scanning
│   ├── routes/
│   │   └── productRoutes.js       # API endpoints
│   ├── config/
│   │   └── blockchain.js          # Contract integration
│   └── server.js                  # Express server
├── contracts/
│   └── ProductTracker.sol         # Enhanced smart contract
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      # Role-based dashboard
│   │   │   ├── QRCodeScanner.jsx  # Mobile QR scanner
│   │   │   ├── Login.jsx          # Authentication
│   │   │   ├── Register.jsx       # User registration
│   │   │   └── ...                # Other components
│   │   └── App.jsx                # Main application
│   └── package.json
├── scripts/
│   └── deploy.js                  # Contract deployment
└── README.md
```

---

## 🚀 Setup and Installation

### 1. Clone and Configure
```bash
git clone <your-repository-url>
cd blockchain-traceability-app
```

### 2. Environment Configuration
Create `.env` file in root directory:
```env
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY"
PRIVATE_KEY="YOUR_METAMASK_ACCOUNT_PRIVATE_KEY"
JWT_SECRET="your-super-secret-jwt-key"
CONTRACT_ADDRESS="0x..." # Will be generated after deployment
```

### 3. Install Dependencies
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 4. Deploy Smart Contract
```bash
# Compile and deploy
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. Start Application
```bash
# Terminal 1: Backend Server
cd backend
npm start

# Terminal 2: Frontend Development
cd frontend
npm run dev
```

---

## 🔐 User Registration & Roles

### Register New Users
1. Navigate to `/register`
2. Fill in user details including Ethereum wallet address
3. Select appropriate role:
   - **Manufacturer**: Can register products and add manufacturing data
   - **Logistics Partner**: Can track shipments and add transport events
   - **Certifier**: Can add certifications and verify standards
   - **Admin**: Can manage users and system settings

### Role-Based Permissions
Each role has specific blockchain permissions enforced by smart contracts:
- **Manufacturers** can only register products and add manufacturing checkpoints
- **Logistics Partners** can only add transport-related checkpoints
- **Certifiers** can only add certification data
- **Admins** have full system access

---

## 📱 QR Code Features

### Generate QR Codes
```bash
# Register a product (automatically generates QR code)
curl -X POST http://localhost:3001/api/register \
-H "Content-Type: application/json" \
-d '{
    "name": "Organic Quinoa Premium",
    "brand": "Nature'\''s Best",
    "sku": "WM-ORG-QUI-001",
    "batch": "LOT2024-Q3-847",
    "originFarm": "Andean Organic Co-op",
    "originCountry": "Peru",
    "manufacturingDate": "2024-06-15"
}'
```

### Scan QR Codes
1. Use the mobile-optimized QR scanner
2. Point camera at product QR code
3. Real-time blockchain verification
4. Instant authenticity validation

### QR Code Security
- Each QR code contains cryptographically signed data
- Blockchain hash verification prevents tampering
- Real-time authenticity checks
- Complete audit trail

---

## 🔍 Product Traceability

### Complete Journey Tracking
1. **Product Registration**: Manufacturer registers product with QR code
2. **Manufacturing Checkpoints**: Production milestones recorded
3. **Transport Events**: Logistics partners add shipment data
4. **Certification**: Third-party certifiers add compliance data
5. **Final Delivery**: Complete journey visible to consumers

### Blockchain Verification
- All checkpoints stored immutably on blockchain
- Cryptographic signatures prevent tampering
- Real-time authenticity verification
- Complete audit trail for compliance

---

## 🛡️ Authenticity Verification

### Cryptographic Validation
- SHA-256 hashing of product data
- Blockchain-stored authenticity hashes
- Real-time verification against QR codes
- Immediate alerts for tampered products

### Security Features
- **Immutable Records**: All data stored on blockchain
- **Role-Based Access**: Smart contract enforced permissions
- **Cryptographic Signatures**: Tamper-proof data integrity
- **Real-time Alerts**: Instant notification of issues

---

## 📊 Dashboard Features

### Role-Based Dashboards
- **Manufacturer Dashboard**: Product management and registration
- **Logistics Dashboard**: Shipment tracking and transport events
- **Certifier Dashboard**: Certification management and compliance
- **Admin Dashboard**: User management and system oversight

### Real-time Analytics
- Product count and status tracking
- Journey completion percentages
- Certification compliance rates
- Blockchain transaction monitoring

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Product Management
- `POST /api/register` - Register new product
- `GET /api/product/:id` - Get product details
- `POST /api/checkpoint` - Add journey checkpoint
- `POST /api/certification` - Add certification

### QR Code Operations
- `POST /api/qr/generate` - Generate QR code
- `GET /api/qr/scan/:qrData` - Scan QR code
- `POST /api/verify-authenticity` - Verify authenticity

### User Management
- `POST /api/users/add` - Add user (admin only)
- `PUT /api/users/role` - Update user role (admin only)
- `DELETE /api/users/:address` - Remove user (admin only)

---

## 🚀 Deployment

### Smart Contract Deployment
```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Production Deployment
1. **Backend**: Deploy to cloud platform (AWS, Heroku, etc.)
2. **Frontend**: Build and deploy to CDN
3. **Database**: Set up production database
4. **Environment**: Configure production environment variables

---

## 🔒 Security Considerations

### Smart Contract Security
- Role-based access control enforced on-chain
- Input validation and error handling
- Reentrancy protection
- Gas optimization

### API Security
- JWT token authentication
- Role-based endpoint protection
- Input sanitization
- Rate limiting

### Data Integrity
- Cryptographic hashing for authenticity
- Blockchain immutability
- Real-time verification
- Complete audit trails

---

## 📈 Future Enhancements

### Planned Features
- **IoT Integration**: Real-time sensor data from products
- **AI Analytics**: Predictive supply chain insights
- **Mobile App**: Native iOS/Android applications
- **Multi-chain Support**: Ethereum, Polygon, Solana
- **Advanced Analytics**: Machine learning for fraud detection

### Scalability Improvements
- **Layer 2 Solutions**: Polygon, Arbitrum for lower costs
- **IPFS Integration**: Decentralized file storage
- **Microservices**: Backend service decomposition
- **Caching**: Redis for performance optimization

---

## 📄 License

This project is for educational and demonstration purposes. Please verify licenses and smart contract security before deploying to production environments.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

---

## 📞 Support

For questions or support, please open an issue in the repository or contact the development team.

**Rivulet** - Building transparent, trustworthy supply chains with blockchain technology.
