function createEmptyProfile() {
    return {
        candidate_id: null,

        full_name: null,

        emails: [],

        phones: [],

        location: {
            city: null,
            region: null,
            country: null
        },

        links: {
            linkedin: null,
            github: null,
            portfolio: null,
            other: []
        },

        headline: null,

        years_experience: null,

        skills: [
        {
            name: "",
            confidence: 0,
            sources: []
        }
        ],

        experience: [
            {
                company: "",
                title: "",
                employment_type: "",
                location: "",
                start_date: null,
                end_date: null,
                currently_working: false,
                summary: "",
                confidence: 0,
                sources: []
            }
        ],

        education: [
            {
                institution: "",
                degree: "",
                field_of_study: "",
                start_year: null,
                end_year: null,
                grade: "",
                confidence: 0,
                sources: []
            }
        ],

        provenance: [],

        overall_confidence: 0
    };
}

module.exports = createEmptyProfile;