// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductTracker {
    address public owner;
    uint256 public productCount;

    struct Checkpoint {
        string step;
        string location;
        uint256 timestamp;
        string status;
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
        Checkpoint[] journey;
        bool isInitialized;
    }

    mapping(uint256 => Product) public products;

    event ProductRegistered(uint256 indexed productId, string name, string brand);
    event CheckpointAdded(uint256 indexed productId, string step, string location);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier productExists(uint256 _productId) {
        require(products[_productId].isInitialized, "Product does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerProduct(
        string memory _name,
        string memory _brand,
        string memory _sku,
        string memory _batch,
        string memory _originFarm,
        string memory _originCountry,
        uint256 _manufacturingDate
    ) public onlyOwner {
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
        newProduct.isInitialized = true;

        emit ProductRegistered(newProductId, _name, _brand);
    }

    function addCheckpoint(
        uint256 _productId,
        string memory _step,
        string memory _location,
        string memory _status
    ) public onlyOwner productExists(_productId) {
        Checkpoint memory newCheckpoint = Checkpoint({
            step: _step,
            location: _location,
            timestamp: block.timestamp,
            status: _status
        });

        products[_productId].journey.push(newCheckpoint);

        emit CheckpointAdded(_productId, _step, _location);
    }

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
            uint256
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
            p.manufacturingDate
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
}
