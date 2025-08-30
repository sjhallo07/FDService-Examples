import fs from 'fs';
import path from 'path';

const PURCHASES_FILE = path.resolve('backend/purchases.json');

function readPurchases() {
  if (!fs.existsSync(PURCHASES_FILE)) return [];
  return JSON.parse(fs.readFileSync(PURCHASES_FILE, 'utf8'));
}

function writePurchases(purchases) {
  fs.writeFileSync(PURCHASES_FILE, JSON.stringify(purchases, null, 2));
}

function addPurchase(purchase) {
  const purchases = readPurchases();
  purchases.push(purchase);
  writePurchases(purchases);
}

function getPurchasesByUser(userId) {
  const purchases = readPurchases();
  return purchases.filter(p => p.userId === userId);
}

export default {
  addPurchase,
  getPurchasesByUser,
};
