const test = require("node:test");
const assert = require("node:assert");
const validateSchema = require("../src/validators/schemaValidator");

test("schemaValidator - should validate a valid canonical profile", () => {
    const profile = {
        candidate_id: "123",
        full_name: "Ayush Arya",
        emails: ["ayush@gmail.com"],
        phones: ["+919876543210"],
        location: {
            city: "Vellore",
            region: "Tamil Nadu",
            country: "India"
        },
        links: {
            linkedin: "linkedin.com/in/ayush",
            github: "github.com/ayush",
            portfolio: null,
            other: []
        },
        headline: "SDE",
        current_company: "Google",
        years_experience: 3,
        skills: [
            { name: "Java", confidence: 0.85, sources: ["Resume"] },
            { name: "JavaScript", confidence: 0.85, sources: ["Resume"] }
        ],
        experience: [
            { company: "Google", title: "SDE", start_date: "2025-06", end_date: "Present", sources: ["Resume"] }
        ],
        education: [
            { institution: "VIT", degree: "B.Tech", start_date: "2022-09", end_date: "2026-06", sources: ["Resume"] }
        ],
        provenance: [
            { field: "full_name", value: "Ayush Arya", source: "Resume", confidence: 0.85, method: "Merge Engine", timestamp: "2026-06-30" }
        ],
        overall_confidence: 0.85
    };

    const result = validateSchema(profile);
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.errors, null);
});

test("schemaValidator - should fail if required fields are missing", () => {
    const invalidProfile = {
        emails: [],
        phones: []
    };

    const result = validateSchema(invalidProfile);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.length > 0);
});
