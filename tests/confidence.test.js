const test = require("node:test");
const assert = require("node:assert");
const { SOURCE_CONFIDENCE, confidenceFor } = require("../src/merge/confidence");

test("confidence - should map correct confidence values for known sources", () => {
    assert.strictEqual(confidenceFor("Recruiter CSV"), 0.95);
    assert.strictEqual(confidenceFor("Resume"), 0.85);
    assert.strictEqual(confidenceFor("LinkedIn"), 0.80);
    assert.strictEqual(confidenceFor("GitHub"), 0.75);
    assert.strictEqual(confidenceFor("ATS"), 0.90);
});

test("confidence - should return default 0.50 for unknown sources", () => {
    assert.strictEqual(confidenceFor("Unknown Source"), 0.50);
    assert.strictEqual(confidenceFor(null), 0.50);
    assert.strictEqual(confidenceFor(undefined), 0.50);
});
