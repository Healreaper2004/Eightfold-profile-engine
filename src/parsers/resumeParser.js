const normalizePhone = require("../normalizers/phoneNormalizer");
const normalizeSkills = require("../normalizers/skillNormalizer");
const normalizeDate = require("../normalizers/dateNormalizer");

const fs = require("fs");
const pdf = require("pdf-parse");

/**
 * Extract first email found
 */
function extractEmail(text) {
    const regex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
    const emails = text.match(regex);

    return emails ? [...new Set(emails)] : [];
}

/**
 * Extract phone number
 */
function extractPhone(text) {
    const regex = /(\+?\d[\d\s\-()]{8,}\d)/g;
    const phones = text.match(regex);

    return phones
        ? phones.map(phone => phone.trim())
        : [];
}

/**
 * Extract LinkedIn
 */
function extractLinkedIn(text) {

    const regex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|]+/i;

    const match = text.match(regex);

    return match ? match[0] : null;

}

/**
 * Extract GitHub
 */
function extractGithub(text) {

    const regex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|]+/i;

    const match = text.match(regex);

    return match ? match[0] : null;

}

/**
 * Very basic name extraction
 */
function extractName(text) {

    const lines = text
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    return lines.length ? lines[0] : null;

}

/**
 * Extract skills from dictionary
 */
function extractSkills(text) {

    const dictionary = [

        "Java",
        "JavaScript",
        "TypeScript",
        "Python",
        "Node.js",
        "React",
        "Express",
        "MongoDB",
        "MySQL",
        "SQL",
        "AWS",
        "Docker",
        "Git",
        "Spring Boot",
        "HTML",
        "CSS",
        "C",
        "C++"

    ];

    const lower = text.toLowerCase();

    return dictionary.filter(skill =>
        lower.includes(skill.toLowerCase())
    );

}

function extractExperience(text) {

    const experience = [];

    // Matches:
    // AI & Data Science TraineeJune 2025 - July 2025
    const regex = /([A-Za-z& ]+?)\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\s*-\s*(Present|January|February|March|April|May|June|July|August|September|October|November|December)\s*(\d{4})?/gi;

    let match;

    while ((match = regex.exec(text)) !== null) {

        const title = match[1].trim();

        const start = normalizeDate(`${match[2]} ${match[3]}`);

        let end = "Present";

        if (match[4].toLowerCase() !== "present") {

            end = normalizeDate(
                `${match[4]} ${match[5]}`
            );

        }

        experience.push({

            title,

            company: null,

            start_date: start,

            end_date: end

        });

    }

    return experience;
}

function extractEducation(text) {

    const education = [];

    const lines = text
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i];

        if (
            line.includes("B. Tech") ||
            line.includes("Bachelor") ||
            line.includes("Senior Secondary") ||
            line.includes("High School")
        ) {

            const previous =
                i > 0 ? lines[i - 1] : "";

            const dates = line.match(
                /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*[–-]\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i
            );

            let start = null;
            let end = null;

            if (dates) {

                const parts = dates[0].split(/[-–]/);

                start = normalizeDate(parts[0].trim());
                end = normalizeDate(parts[1].trim());

            }

            education.push({

                institution: previous,

                degree: line
                    .replace(/—.*/, "")
                    .replace(/CGPA:.*/, "")
                    .trim(),

                start_date: start,

                end_date: end

            });

        }

    }

    return education;

}

/**
 * Main Resume Parser
 */
async function parseResume(filePath) {

    const buffer =
        fs.readFileSync(filePath);

    const pdfData =
        await pdf(buffer);

    const text =
        pdfData.text;

    return {

        full_name:
            extractName(text),

        emails:
            extractEmail(text),

        phones: extractPhone(text)
            .map(normalizePhone)
            .filter(Boolean),

        links: {

            linkedin:
                extractLinkedIn(text),

            github:
                extractGithub(text)

        },

        skills:
            normalizeSkills(
                extractSkills(text)
            ),

        experience:
            extractExperience(text),

        education:
            extractEducation(text),

        source:
            "Resume",

        raw_text:
            text

    };

}

module.exports = parseResume;