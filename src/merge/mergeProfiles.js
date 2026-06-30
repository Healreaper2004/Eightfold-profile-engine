const createCanonicalProfile = require("../schema/canonicalSchema");
const normalizePhone = require("../normalizers/phoneNormalizer");
const { confidenceFor } = require("./confidence");

/**
 * Remove duplicates and null values
 */
function unique(arr = []) {
    return [...new Set(arr.filter(Boolean))];
}

/**
 * Add provenance entry
 */
function addProvenance(
    profile,
    field,
    value,
    source,
    method = "Merge Engine"
) {

    profile.provenance.push({

        field,

        value,

        source,

        method,

        confidence: confidenceFor(source),

        timestamp: new Date().toISOString()

    });
}

/**
 * Calculate overall confidence
 */
function calculateOverallConfidence(profile) {

    if (profile.provenance.length === 0) {
        profile.overall_confidence = 0;
        return;
    }

    const total = profile.provenance.reduce(
        (sum, item) => sum + item.confidence,
        0
    );

    profile.overall_confidence = Number(
        (total / profile.provenance.length).toFixed(2)
    );
}



/**
 * Merge recruiter profile and resume profile
 */
function mergeProfiles(recruiter, resume) {

    const profile = createCanonicalProfile();

    /* ----------------------------
       Full Name
    ----------------------------- */

    profile.full_name =
        resume.full_name ||
        recruiter.full_name;

    if (profile.full_name) {
        addProvenance(
            profile,
            "full_name",
            profile.full_name,
            resume.full_name
                ? "Resume"
                : "Recruiter CSV"
        );
    }

    /* ----------------------------
       Emails
    ----------------------------- */

    profile.emails = unique([
        ...(recruiter.emails || []),
        ...(resume.emails || [])
    ]);

    profile.emails.forEach((email, index) => {

        addProvenance(

            profile,

            `emails[${index}]`,

            email,

            (recruiter.emails || []).includes(email)
                ? "Recruiter CSV"
                : "Resume",

            "Regex Extraction"

        );

    });

    /* ----------------------------
    Phones
    ----------------------------- */

    const recruiterPhones = (recruiter.phones || [])
        .map(normalizePhone)
        .filter(Boolean);

    const resumePhones = (resume.phones || [])
        .map(normalizePhone)
        .filter(Boolean);

    profile.phones = unique([
        ...recruiterPhones,
        ...resumePhones
    ]);

    profile.phones.forEach((phone, index) => {

        addProvenance(
            profile,
            `phones[${index}]`,
            phone,
            recruiterPhones.includes(phone)
                ? "Recruiter CSV"
                : "Resume"
        );

    });

    /* ----------------------------
       Company
    ----------------------------- */

    profile.current_company =
        recruiter.current_company ||
        null;

    if (profile.current_company) {

        addProvenance(

            profile,

            "current_company",

            profile.current_company,

            "Recruiter CSV"

        );

    }

    /* ----------------------------
       Headline
    ----------------------------- */

    profile.headline =
        recruiter.title ||
        null;

    if (profile.headline) {

        addProvenance(

            profile,

            "headline",

            profile.headline,

            "Recruiter CSV"

        );

    }

    /* ----------------------------
       Links
    ----------------------------- */

    profile.links = {

        linkedin:
            resume.links?.linkedin || null,

        github:
            resume.links?.github || null,

        portfolio:
            resume.links?.portfolio || null,

        other:
            resume.links?.other || []

    };

    if (profile.links.linkedin) {

        addProvenance(
            profile,
            "links.linkedin",
            profile.links.linkedin,
            "Resume",
            "Regex Extraction"
        );

    }

    if (profile.links.github) {

        addProvenance(
            profile,
            "links.github",
            profile.links.github,
            "Resume"
        );

    }

    if (profile.links.portfolio) {

        addProvenance(
            profile,
            "links.portfolio",
            profile.links.portfolio,
            "Resume"
        );

    }

    if (profile.links.other && profile.links.other.length > 0) {

        profile.links.other.forEach((link, index) => {

            addProvenance(
                profile,
                `links.other[${index}]`,
                link,
                "Resume"
            );

        });

    }

    /* ----------------------------
       Skills
    ----------------------------- */

    const uniqueSkills = unique([
        ...(resume.skills || [])
    ]).sort();

    profile.skills = uniqueSkills.map(skill => ({
        name: skill,
        confidence: confidenceFor("Resume"),
        sources: ["Resume"]
    }));

    profile.skills.forEach((skillObj, index) => {

        addProvenance(

            profile,

            `skills[${index}].name`,

            skillObj.name,

            "Resume",

            "Dictionary Matching"

        );

    });

    /* ----------------------------
       Experience
    ----------------------------- */

    profile.experience = [
        ...(resume.experience || [])
    ];

    if (profile.experience.length) {

        addProvenance(

            profile,

            "experience",

            profile.experience,

            "Resume",

            "Section Parsing"

        );

    }

    /* ----------------------------
       Education
    ----------------------------- */

    profile.education = [
        ...(resume.education || [])
    ];

    if (profile.education.length) {

        addProvenance(

            profile,

            "education",

            profile.education,

            "Resume",

            "Section Parsing"

        );

    }

    /* ----------------------------
       Overall Confidence
    ----------------------------- */
    calculateOverallConfidence(profile);

    return profile;
}

module.exports = mergeProfiles;