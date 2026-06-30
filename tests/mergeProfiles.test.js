const test = require("node:test");
const assert = require("node:assert");
const mergeProfiles = require("../src/merge/mergeProfiles");

test("mergeProfiles - should merge recruiter and resume correctly", () => {
    const recruiter = {
        full_name: "CSV Name",
        emails: ["csv@gmail.com"],
        phones: ["9876543210"],
        current_company: "Google",
        title: "Software Engineer",
        source: "Recruiter CSV"
    };

    const resume = {
        full_name: "Resume Name",
        emails: ["resume@gmail.com", "csv@gmail.com"],
        phones: ["918986145487"],
        links: {
            linkedin: "linkedin.com/in/test",
            github: "github.com/test",
            portfolio: "portfolio.com/test",
            other: ["other1.com", "other2.com"]
        },
        skills: ["JavaScript", "Python"],
        experience: [
            { title: "Trainee", company: "Meta", start_date: "2025-06", end_date: "2025-07" }
        ],
        education: [
            { institution: "VIT", degree: "B.Tech", start_date: "2022-09", end_date: "2026-06" }
        ],
        source: "Resume"
    };

    const result = mergeProfiles(recruiter, resume);

    // Name preference
    assert.strictEqual(result.full_name, "Resume Name");

    // Emails unique
    assert.deepStrictEqual(result.emails, ["csv@gmail.com", "resume@gmail.com"]);

    // Phones unique & normalized
    assert.deepStrictEqual(result.phones, ["+919876543210", "+918986145487"]);

    // Company & Headline
    assert.strictEqual(result.current_company, "Google");
    assert.strictEqual(result.headline, "Software Engineer");

    // Links
    assert.strictEqual(result.links.linkedin, "linkedin.com/in/test");
    assert.strictEqual(result.links.github, "github.com/test");
    assert.strictEqual(result.links.portfolio, "portfolio.com/test");
    assert.deepStrictEqual(result.links.other, ["other1.com", "other2.com"]);

    // Skills sorted
    assert.deepStrictEqual(result.skills, [
        { name: "JavaScript", confidence: 0.85, sources: ["Resume"] },
        { name: "Python", confidence: 0.85, sources: ["Resume"] }
    ]);

    // Experience & Education
    assert.strictEqual(result.experience.length, 1);
    assert.strictEqual(result.education.length, 1);

    // Provenance check
    const githubProv = result.provenance.find(p => p.field === "links.github");
    assert.ok(githubProv, "links.github provenance should exist");
    assert.strictEqual(githubProv.value, "github.com/test");
    assert.strictEqual(githubProv.source, "Resume");

    const portfolioProv = result.provenance.find(p => p.field === "links.portfolio");
    assert.ok(portfolioProv, "links.portfolio provenance should exist");
    assert.strictEqual(portfolioProv.value, "portfolio.com/test");

    const otherProv = result.provenance.find(p => p.field === "links.other[0]");
    assert.ok(otherProv, "links.other[0] provenance should exist");
    assert.strictEqual(otherProv.value, "other1.com");

    const phoneProv = result.provenance.find(p => p.field === "phones[0]");
    assert.ok(phoneProv, "phones[0] provenance should exist");

    // Overall confidence calculated
    assert.ok(result.overall_confidence > 0);
});

test("mergeProfiles - should handle recruiter profile with missing emails safely without throwing", () => {
    const recruiter = {
        full_name: "CSV Name",
        phones: ["9876543210"],
        source: "Recruiter CSV"
    };

    const resume = {
        full_name: "Resume Name",
        emails: ["resume@gmail.com"],
        source: "Resume"
    };

    assert.doesNotThrow(() => {
        mergeProfiles(recruiter, resume);
    });
});
