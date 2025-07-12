const { expect } = require("chai");

describe("ProductTracker", function () {
  let ProductTracker, tracker, owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    ProductTracker = await ethers.getContractFactory("ProductTracker");
    tracker = await ProductTracker.deploy();
    await tracker.deployed();
  });

  it("should register a product", async () => {
    await tracker.registerProduct(
      "Test Product",
      "BrandX",
      "SKU123",
      "BATCH1",
      "FarmA",
      "CountryB",
      Math.floor(Date.now() / 1000)
    );

    const details = await tracker.getProductDetails(1);
    expect(details[1]).to.equal("Test Product");
    expect(details[2]).to.equal("BrandX");
  });

  it("should add a checkpoint", async () => {
    await tracker.registerProduct(
      "Test Product",
      "BrandX",
      "SKU123",
      "BATCH1",
      "FarmA",
      "CountryB",
      Math.floor(Date.now() / 1000)
    );

    await tracker.addCheckpoint(1, "Harvested", "FarmA", "verified");

    const journey = await tracker.getProductJourney(1);
    expect(journey[0].step).to.equal("Harvested");
  });
});
