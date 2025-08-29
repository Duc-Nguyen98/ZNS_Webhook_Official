const crypto = require('crypto');

function hashPhone(phone) {
  return crypto.createHash('sha256').update(phone).digest('hex');
}

const phone = '0902165865';
console.log(hashPhone(phone));
// -> in ra chuỗi hash 64 ký tự