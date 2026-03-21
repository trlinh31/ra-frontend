export const formatNumberVN = (amount: number | string) => {
  const value = typeof amount === "string" ? Number(amount) : amount;

  return new Intl.NumberFormat("vi-VN").format(value);
};
