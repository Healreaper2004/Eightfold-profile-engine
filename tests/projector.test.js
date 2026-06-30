const test = require("node:test");
const assert = require("node:assert");
const project = require("../src/projection/projector");

test("projector - should project mapped fields successfully", () => {
    const profile = {
        full_name: "Ayush Arya",
        emails: ["ayush@gmail.com"],
        phones: ["+919876543210"],
        links: {
            github: "github.com/ayush"
        },
        overall_confidence: 0.87
    };

    const config = {
        fields: [
            { path: "name", from: "full_name" },
            { path: "email", from: "emails[0]" },
            { path: "github", from: "links.github" }
        ],
        include_confidence: true,
        on_missing: "null"
    };

    const result = project(profile, config);
    assert.deepStrictEqual(result, {
        name: "Ayush Arya",
        email: "ayush@gmail.com",
        github: "github.com/ayush",
        overall_confidence: 0.87
    });
});

test("projector - should handle on_missing: 'omit'", () => {
    const profile = {
        full_name: "Ayush Arya",
        emails: []
    };

    const config = {
        fields: [
            { path: "email", from: "emails[0]" }
        ],
        on_missing: "omit"
    };

    const result = project(profile, config);
    assert.deepStrictEqual(result, {});
});

test("projector - should handle on_missing: 'error'", () => {
    const profile = {
        full_name: "Ayush Arya",
        emails: []
    };

    const config = {
        fields: [
            { path: "email", from: "emails[0]" }
        ],
        on_missing: "error"
    };

    assert.throws(() => {
        project(profile, config);
    }, /Missing field: emails\[0\]/);
});

test("projector - should handle on_missing: 'null' as default", () => {
    const profile = {
        full_name: "Ayush Arya",
        emails: []
    };

    const config = {
        fields: [
            { path: "email", from: "emails[0]" }
        ]
    };

    const result = project(profile, config);
    assert.deepStrictEqual(result, {
        email: null
    });
});
