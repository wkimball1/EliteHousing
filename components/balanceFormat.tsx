export default function balanceFormat(amount: string) {
  const balance = Number(amount) / 100;

  // Format the amount as a dollar amount
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(balance);
  return formatted;
}
