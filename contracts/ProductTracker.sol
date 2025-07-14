// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductTracker {
    address public owner;
    uint256 public productCount;

    // Role management
    enum Role { NONE, MANUFACTURER, LOGISTICS_PARTNER, CERTIFIER, ADMIN, CUSTOMER }
    
    mapping(address => Role) public userRoles;
    mapping(address => bool) public authorizedUsers;
    
    // Product structures
    struct Certification {
        string certType;
        string certNumber;
        string issuer;
        uint256 issueDate;
        uint256 expiryDate;
        string documentHash; // IPFS hash of the certification document
        bool isValid;
    }

    struct Checkpoint {
        string step;
        string location;
        uint256 timestamp;
        string status;
        address recordedBy;
        string metadata; // Additional data like temperature, humidity, etc.
    }

    struct Product {
        uint256 id;
        string name;
        string brand;
        string sku;
        string batch;
        string originFarm;
        string originCountry;
        uint256 manufacturingDate;
        string qrCodeHash; // Hash of the QR code data
        Checkpoint[] journey;
        Certification[] certifications;
        bool isInitialized;
        bool isAuthentic;
        string authenticityHash; // Cryptographic hash for verification
    }

    mapping(uint256 => Product) public products;
    mapping(string => uint256) public qrCodeToProduct; // QR code hash to product ID mapping

    // Events
    event ProductRegistered(uint256 indexed productId, string name, string brand, string qrCodeHash);
    event CheckpointAdded(uint256 indexed productId, string step, string location, address recordedBy);
    event CertificationAdded(uint256 indexed productId, string certType, string certNumber);
    event UserRoleUpdated(address indexed user, Role role);
    event AuthenticityVerified(uint256 indexed productId, bool isAuthentic);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyRole(Role role) {
        require(userRoles[msg.sender] == role || msg.sender == owner, "Insufficient role");
        _;
    }

    modifier productExists(uint256 _productId) {
        require(products[_productId].isInitialized, "Product does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
        userRoles[msg.sender] = Role.ADMIN;
        authorizedUsers[msg.sender] = true;
    }

    // Role management functions
    function addUser(address _user, Role _role) public onlyOwner {
        userRoles[_user] = _role;
        authorizedUsers[_user] = true;
        emit UserRoleUpdated(_user, _role);
    }

    function removeUser(address _user) public onlyOwner {
        userRoles[_user] = Role.NONE;
        authorizedUsers[_user] = false;
        emit UserRoleUpdated(_user, Role.NONE);
    }

    function updateUserRole(address _user, Role _role) public onlyOwner {
        userRoles[_user] = _role;
        emit UserRoleUpdated(_user, _role);
    }

    // Product registration with QR code
    function registerProduct(
        string memory _name,
        string memory _brand,
        string memory _sku,
        string memory _batch,
        string memory _originFarm,
        string memory _originCountry,
        uint256 _manufacturingDate,
        string memory _qrCodeHash
    ) public onlyRole(Role.MANUFACTURER) {
        require(bytes(_qrCodeHash).length > 0, "QR code hash required");
        require(qrCodeToProduct[_qrCodeHash] == 0, "QR code already in use");

        productCount++;
        uint256 newProductId = productCount;

        Product storage newProduct = products[newProductId];
        newProduct.id = newProductId;
        newProduct.name = _name;
        newProduct.brand = _brand;
        newProduct.sku = _sku;
        newProduct.batch = _batch;
        newProduct.originFarm = _originFarm;
        newProduct.originCountry = _originCountry;
        newProduct.manufacturingDate = _manufacturingDate;
        newProduct.qrCodeHash = _qrCodeHash;
        newProduct.isInitialized = true;
        newProduct.isAuthentic = true;
        newProduct.authenticityHash = _generateAuthenticityHash(newProductId, _qrCodeHash);

        qrCodeToProduct[_qrCodeHash] = newProductId;

        emit ProductRegistered(newProductId, _name, _brand, _qrCodeHash);
    }

    // Add checkpoint with role-based access
    function addCheckpoint(
        uint256 _productId,
        string memory _step,
        string memory _location,
        string memory _status,
        string memory _metadata
    ) public onlyAuthorized productExists(_productId) {
        // Logistics partners can add transport checkpoints
        // Manufacturers can add manufacturing checkpoints
        // Admins can add any checkpoint
        require(
            userRoles[msg.sender] == Role.LOGISTICS_PARTNER ||
            userRoles[msg.sender] == Role.MANUFACTURER ||
            userRoles[msg.sender] == Role.ADMIN ||
            msg.sender == owner,
            "Insufficient permissions for checkpoint"
        );

        Checkpoint memory newCheckpoint = Checkpoint({
            step: _step,
            location: _location,
            timestamp: block.timestamp,
            status: _status,
            recordedBy: msg.sender,
            metadata: _metadata
        });

        products[_productId].journey.push(newCheckpoint);

        emit CheckpointAdded(_productId, _step, _location, msg.sender);
    }

    // Add certification (only certifiers and admins)
    function addCertification(
        uint256 _productId,
        string memory _certType,
        string memory _certNumber,
        string memory _issuer,
        uint256 _issueDate,
        uint256 _expiryDate,
        string memory _documentHash
    ) public onlyRole(Role.CERTIFIER) productExists(_productId) {
        Certification memory newCert = Certification({
            certType: _certType,
            certNumber: _certNumber,
            issuer: _issuer,
            issueDate: _issueDate,
            expiryDate: _expiryDate,
            documentHash: _documentHash,
            isValid: true
        });

        products[_productId].certifications.push(newCert);

        emit CertificationAdded(_productId, _certType, _certNumber);
    }

    // Verify product authenticity
    function verifyAuthenticity(uint256 _productId, string memory _qrCodeHash) 
        public view productExists(_productId) returns (bool) {
        Product storage product = products[_productId];
        
        // Check if QR code matches
        if (keccak256(abi.encodePacked(_qrCodeHash)) != keccak256(abi.encodePacked(product.qrCodeHash))) {
            return false;
        }

        // Check if authenticity hash matches
        string memory expectedHash = _generateAuthenticityHash(_productId, _qrCodeHash);
        if (keccak256(abi.encodePacked(expectedHash)) != keccak256(abi.encodePacked(product.authenticityHash))) {
            return false;
        }

        return product.isAuthentic;
    }

    // Get product by QR code
    function getProductByQRCode(string memory _qrCodeHash) 
        public view returns (uint256) {
        return qrCodeToProduct[_qrCodeHash];
    }

    // Get product details
    function getProductDetails(uint256 _productId)
        public
        view
        productExists(_productId)
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            string memory,
            bool
        )
    {
        Product storage p = products[_productId];
        return (
            p.id,
            p.name,
            p.brand,
            p.sku,
            p.batch,
            p.originFarm,
            p.originCountry,
            p.manufacturingDate,
            p.qrCodeHash,
            p.isAuthentic
        );
    }

    function getProductJourney(uint256 _productId)
        public
        view
        productExists(_productId)
        returns (Checkpoint[] memory)
    {
        return products[_productId].journey;
    }

    function getProductCertifications(uint256 _productId)
        public
        view
        productExists(_productId)
        returns (Certification[] memory)
    {
        return products[_productId].certifications;
    }

    // Internal function to generate authenticity hash
    function _generateAuthenticityHash(uint256 _productId, string memory _qrCodeHash) 
        internal pure returns (string memory) {
        return string(abi.encodePacked(
            "AUTH_",
            _uint2str(_productId),
            "_",
            _qrCodeHash
        ));
    }

    // Helper function to convert uint256 to string
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (_i != 0) {
            k -= 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    // Get user role
    function getUserRole(address _user) public view returns (Role) {
        return userRoles[_user];
    }

    // Check if user is authorized
    function isAuthorized(address _user) public view returns (bool) {
        return authorizedUsers[_user] || _user == owner;
    }
}
