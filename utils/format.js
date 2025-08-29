function formatTimestamp(ts) {
  const date = new Date(Number(ts));
  return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}
module.exports = { formatTimestamp };
