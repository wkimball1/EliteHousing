export default function balanceFormat(amount: string) {
  const balance = parseFloat(amount);

  // Format the amount as a dollar amount
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(balance);
  return formatted;
}
