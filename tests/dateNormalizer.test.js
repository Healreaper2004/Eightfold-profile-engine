const test = require("node:test");
const assert = require("node:assert");
const normalizeDate = require("../src/normalizers/dateNormalizer");

test("dateNormalizer - should return null on null/empty/invalid inputs", () => {
    assert.strictEqual(normalizeDate(null), null);
    assert.strictEqual(normalizeDate(undefined), null);
    assert.strictEqual(normalizeDate(""), null);
    assert.strictEqual(normalizeDate("Invalid Date"), null);
});

test("dateNormalizer - should normalize 4-digit years to YYYY-01", () => {
    assert.strictEqual(normalizeDate("2025"), "2025-01");
    assert.strictEqual(normalizeDate(" 1999 "), "1999-01");
});

test("dateNormalizer - should normalize month and year to YYYY-MM", () => {
    assert.strictEqual(normalizeDate("June 2025"), "2025-06");
    assert.strictEqual(normalizeDate("Jan 2020"), "2020-01");
    assert.strictEqual(normalizeDate("december 1995"), "1995-12");
});

test("dateNormalizer - should handle lowercase/uppercase case insensitively", () => {
    assert.strictEqual(normalizeDate("february 2021"), "2021-02");
    assert.strictEqual(normalizeDate("MARCH 2022"), "2022-03");
});
