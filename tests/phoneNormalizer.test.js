const test = require("node:test");
const assert = require("node:assert");
const normalizePhone = require("../src/normalizers/phoneNormalizer");

test("phoneNormalizer - should return null on null/empty inputs", () => {
    assert.strictEqual(normalizePhone(null), null);
    assert.strictEqual(normalizePhone(undefined), null);
    assert.strictEqual(normalizePhone(""), null);
});

test("phoneNormalizer - should normalize 10 digit Indian mobile numbers", () => {
    assert.strictEqual(normalizePhone("9876543210"), "+919876543210");
});

test("phoneNormalizer - should normalize numbers with +91 country code and spaces/hyphens", () => {
    assert.strictEqual(normalizePhone("+91 98765 43210"), "+919876543210");
    assert.strictEqual(normalizePhone("+91-98765-43210"), "+919876543210");
    assert.strictEqual(normalizePhone("919876543210"), "+919876543210");
});

test("phoneNormalizer - should return null for invalid phone numbers", () => {
    assert.strictEqual(normalizePhone("12345"), null);
    assert.strictEqual(normalizePhone("abcdefghij"), null);
});
