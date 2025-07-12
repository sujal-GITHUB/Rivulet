# Rivulet: Blockchain-Powered Supply Chain Traceability

**Rivulet** is a full-stack decentralized application (dApp) that provides transparent and immutable tracking of products throughout their supply chain journey. By leveraging a Solidity smart contract on the Ethereum blockchain, it offers consumers and stakeholders verifiable proof of a product's origin, journey, and certifications.

---

## 🚀 Features

- **QR Code Scanning Simulation**: A user-friendly interface to simulate scanning a product's QR code.
- **Blockchain Verification**: Each product's data is fetched directly from an on-chain smart contract, ensuring data integrity.
- **Detailed Product Overview**: Displays key product information, including brand, origin, and sustainability scores.
- **Immutable Journey Tracking**: Visualizes every step of the supply chain, from _Harvested_ to _In-Store_, with each checkpoint verified on the blockchain.
- **Certification Display**: Shows relevant certifications like _USDA Organic_ and _Fair Trade_.
- **Gamification**: Users earn points for scanning products, encouraging engagement.
- **Modern & Responsive UI**: Built with React and Tailwind CSS for a seamless experience on any device.

---

## 🧩 Technology Stack

This project is composed of three main parts: a smart contract, a backend server, and a frontend client.

### 🔗 Smart Contract (Blockchain Layer)

- **Solidity**: Language for writing the smart contract.
- **Hardhat**: Ethereum development environment for compiling, deploying, and testing.
- **Sepolia Testnet**: The target network for deployment.

### 🗄️ Backend (Server Layer)

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for creating the API.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.
- **dotenv**: For managing environment variables.

### 🖥️ Frontend (Client Layer)

- **React.js**: JavaScript library for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Lucide React**: For beautiful and consistent icons.

---

## 📁 Project Structure

```plaintext
blockchain-traceability-app/
├── backend/
│   ├── node_modules/
│   ├── contract-data.json  # Generated after deployment
│   ├── package.json
│   └── server.js           # Express API server
├── contracts/
│   └── ProductTracker.sol  # Solidity smart contract
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── App.js          # Main React component
│   └── package.json
├── scripts/
│   └── deploy.js           # Hardhat deployment script
├── .env                    # (You need to create this)
├── hardhat.config.js
└── package.json
```
---

## Setup and Installation

###  Clone the Repository
```
git clone <your-repository-url>
cd blockchain-traceability-app
```

### Configure Environment Variables
```
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY"
PRIVATE_KEY="YOUR_METAMASK_ACCOUNT_PRIVATE_KEY"
```

### Install Root Dependencies & Hardhat
```
npm install
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
```

### Deploy the Smart Contract
Make sure your MetaMask account has SepoliaETH for gas fees. You can get test ETH from sepoliafaucet.com.

```
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```
This will:

- Deploy the contract.
- Print the contract address.
- Create backend/contract-data.json containing the contract address and ABI.

### Set Up the Backend
```
cd backend
npm install
```

### Set Up the Frontend
```
cd ../frontend
npm install
```

### Running the Application
Use two separate terminals:

Terminal 1: Start Backend Server
```
cd backend
node server.js
```

Backend: http://localhost:3001

Terminal 2: Start Frontend React App
```
cd frontend
npm start
```

Frontend: http://localhost:3000

---

## Registering Your First Product

Before scanning a product, register one using cURL or Postman:
```
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

This registers Product #1. Now you can click "Scan Product #1" in the web app to see it in action!

---

## License

This project is for educational purposes. Please verify licenses and smart contract security before deploying to a production environment.
