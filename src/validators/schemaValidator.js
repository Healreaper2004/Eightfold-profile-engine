const Ajv = require("ajv");

const ajv = new Ajv({
    allErrors: true
});

const schema = {

    type: "object",

    required: [
        "full_name",
        "emails",
        "phones"
    ],

    properties: {

        candidate_id: {
            type: ["string", "null"]
        },

        full_name: {
            type: "string"
        },

        emails: {
            type: "array",
            items: {
                type: "string"
            }
        },

        phones: {
            type: "array",
            items: {
                type: "string"
            }
        },

        location: {
            type: "object",
            properties: {
                city: { type: ["string", "null"] },
                region: { type: ["string", "null"] },
                country: { type: ["string", "null"] }
            },
            additionalProperties: false
        },

        links: {
            type: "object",
            properties: {
                linkedin: { type: ["string", "null"] },
                github: { type: ["string", "null"] },
                portfolio: { type: ["string", "null"] },
                other: {
                    type: "array",
                    items: { type: "string" }
                }
            },
            additionalProperties: false
        },

        headline: {
            type: [
                "string",
                "null"
            ]
        },

        current_company: {
            type: [
                "string",
                "null"
            ]
        },

        years_experience: {
            type: [
                "number",
                "null"
            ]
        },

        skills: {
            type: "array",
            items: {
                type: "object",
                required: ["name", "confidence", "sources"],
                properties: {
                    name: { type: "string" },
                    confidence: { type: "number" },
                    sources: {
                        type: "array",
                        items: { type: "string" }
                    }
                }
            }
        },

        experience: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    company: { type: ["string", "null"] },
                    title: { type: ["string", "null"] },
                    employment_type: { type: ["string", "null"] },
                    location: { type: ["string", "null"] },
                    start_date: { type: ["string", "null"] },
                    end_date: { type: ["string", "null"] },
                    currently_working: { type: ["boolean", "null"] },
                    summary: { type: ["string", "null"] },
                    confidence: { type: ["number", "null"] },
                    sources: {
                        type: "array",
                        items: { type: "string" }
                    }
                }
            }
        },

        education: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    institution: { type: ["string", "null"] },
                    degree: { type: ["string", "null"] },
                    field_of_study: { type: ["string", "null"] },
                    start_date: { type: ["string", "null"] },
                    end_date: { type: ["string", "null"] },
                    start_year: { type: ["number", "null"] },
                    end_year: { type: ["number", "null"] },
                    grade: { type: ["string", "null"] },
                    confidence: { type: ["number", "null"] },
                    sources: {
                        type: "array",
                        items: { type: "string" }
                    }
                }
            }
        },

        provenance: {
            type: "array",
            items: {
                type: "object",
                required: ["field", "value", "source", "confidence"],
                properties: {
                    field: { type: "string" },
                    value: {},
                    source: { type: "string" },
                    confidence: { type: "number" },
                    method: { type: "string" },
                    timestamp: { type: "string" }
                }
            }
        },

        overall_confidence: {
            type: "number"
        }

    }

};

const validate = ajv.compile(schema);

module.exports = function(profile){

    const valid = validate(profile);

    return {

        valid,

        errors: validate.errors

    };

};