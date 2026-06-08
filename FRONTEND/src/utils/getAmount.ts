// Utility to always get a number from coins, amount, or any value
export default function getAmount(val: any): number {
  if (val == null) return 0;
  if (typeof val === "object") {
    if ("amount" in val && typeof val.amount === "number") return val.amount;
    // fallback: if object has only one number property
    const num = Object.values(val).find((v) => typeof v === "number");
    return (num as number) || 0;
  }
  if (typeof val === "number") return val;
  const parsed = Number(val);
  return isNaN(parsed) ? 0 : parsed;
}
