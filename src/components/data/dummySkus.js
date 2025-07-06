const pad = (n, l = 4) => n.toString().padStart(l, "0");
export const dummyOrders = Array.from({ length: 78 }, (_, i) => {
  const n = i + 1;

  return {
    id: 10_000 + n,
    customer: `Customer ${pad(n)}`,
    total: (Math.random() * 1_000 + 20).toFixed(2),
    createdAt: new Date(Date.now() - n * 36e5 * 6 /* every 6 h */),
    status: ["New", "Delivered", "Cancelled"][n % 3],
  };
});


export const dummySkus = [
    { code: "SKU001", name: "Product A", price: 120.5 },
    { code: "SKU002", name: "Product B", price: 75 },
    { code: "SKU003", name: "Product C", price: 230.99 },
    { code: "SKU004", name: "Product D", price: 50 },
];
