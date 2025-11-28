export const getCategoryIdFromName = (categoryName, categoriesList) => {
  const category = categoriesList.find((cat) => cat.name === categoryName);
  return category ? `${category.id}` : null;
};

export const formatVND = (amount) => {
  if (amount === null || amount === undefined) return "0 ₫";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

