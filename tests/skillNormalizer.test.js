const test = require("node:test");
const assert = require("node:assert");
const normalizeSkills = require("../src/normalizers/skillNormalizer");

test("skillNormalizer - should handle empty arrays", () => {
    assert.deepStrictEqual(normalizeSkills([]), []);
    assert.deepStrictEqual(normalizeSkills(undefined), []);
});

test("skillNormalizer - should map known synonyms correctly", () => {
    assert.deepStrictEqual(normalizeSkills(["js", "javascript"]), ["JavaScript"]);
    assert.deepStrictEqual(normalizeSkills(["node.js", "react.js"]), ["Node.js", "React"]);
    assert.deepStrictEqual(normalizeSkills(["html5", "css3"]), ["CSS", "HTML"]);
});

test("skillNormalizer - should preserve unrecognized skills", () => {
    assert.deepStrictEqual(normalizeSkills(["Docker", "Python"]), ["Docker", "Python"]);
    assert.deepStrictEqual(normalizeSkills(["UnknownSkill", "javascript"]), ["JavaScript", "UnknownSkill"]);
});

test("skillNormalizer - should sort outputs alphabetically", () => {
    const input = ["React", "Java", "Python"];
    const expected = [...input].sort();
    assert.deepStrictEqual(normalizeSkills(input), expected);
});
