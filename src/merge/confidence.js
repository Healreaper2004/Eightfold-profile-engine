const SOURCE_CONFIDENCE = {

    "Recruiter CSV": 0.95,

    "Resume": 0.85,

    "LinkedIn": 0.80,

    "GitHub": 0.75,

    "ATS": 0.90

};

function confidenceFor(source) {
    return SOURCE_CONFIDENCE[source] || 0.50;
}

module.exports = {
    SOURCE_CONFIDENCE,
    confidenceFor
};