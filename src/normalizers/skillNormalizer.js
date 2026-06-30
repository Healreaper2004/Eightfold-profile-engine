const skillMap = {

    "js": "JavaScript",
    "javascript": "JavaScript",

    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",

    "reactjs": "React",
    "react.js": "React",

    "mongodb": "MongoDB",

    "mysql": "MySQL",

    "expressjs": "Express",
    "express.js": "Express",

    "html5": "HTML",
    "css3": "CSS"

};

function normalizeSkills(skills = []) {

    const result = [];

    for (let skill of skills) {

        skill = skill.trim();

        const lower =
            skill.toLowerCase();

        if (skillMap[lower]) {

            result.push(skillMap[lower]);

        } else {

            result.push(skill);

        }

    }

    return [...new Set(result)].sort();

}

module.exports = normalizeSkills;