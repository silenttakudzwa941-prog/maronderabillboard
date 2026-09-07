async function main() {
  const response = await fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      advertiserId: "test-advertiser-001",

      packageId: "starter",
      packageName: "Starter",

      billboardPrice: 5,
      socialMediaTotal: 10,
      campaignManagementFee: 5,
      totalPrice: 20,

      paymentMethod: "ecocash",
      paymentReference: "TEST-12345",
    }),
  });

  const data = await response.json();

  console.log("Status:", response.status);
  console.log(JSON.stringify(data, null, 2));
}

main().catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});