import assert from 'node:assert/strict';
const base = process.env.BASE_URL || 'http://localhost:8080';
const get = async path => { const r = await fetch(base + path); assert.equal(r.status, 200, path); return r.json(); };
assert.equal((await get('/api/health')).status, 'ok');
const products = (await get('/api/products')).items;
assert.equal(products.length, 8);
assert.deepEqual(products.map(p => p.lowestPrice), products.map(p => p.lowestPrice).sort((a,b) => a-b));
const filtered = (await get('/api/products?q=josera&animal=Hund&category=Trockenfutter')).items;
assert.equal(filtered.length, 1);
assert.equal(filtered[0].brand, 'Josera');
assert.equal((await get('/api/products?q=zzzz')).items.length, 0);
assert.equal((await get('/api/products/1')).offers.length, 3);
assert.equal((await fetch(base + '/api/products/999')).status, 404);
for (const path of ['/api/products?sort=invalid', '/api/products?q[]=invalid']) assert.equal((await fetch(base + path)).status, 400);
for (const path of ['/', '/produkte/1']) { const r = await fetch(base + path); assert.equal(r.status, 200); assert.match(await r.text(), /id="root"/); }
console.log('API, filters, sorting, errors and SPA deep links passed.');
