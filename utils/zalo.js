const { formatTimestamp } = require('./format');

function extractZaloData(body) {
  const isPhone = /^84\d{8,11}$/.test(body.recipient?.id || "");
  return {
    source: isPhone ? "phone" : "user_id",
    phone: isPhone ? body.recipient.id : null,
    user_id_by_app: body.user_id_by_app || null,
    receiver_device: body.receiver_device || null,
    timestamp: body.timestamp ? formatTimestamp(body.timestamp) : null,
    link_href: body.user_id_by_app ? `https://zalo.me/${body.user_id_by_app}` : null,
  };
}

module.exports = { extractZaloData };
