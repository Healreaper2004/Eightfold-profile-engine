const fs = require("fs");
const csv = require("csv-parser");

function parseRecruiterCSV(filePath) {
  return new Promise((resolve, reject) => {
    const candidates = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        candidates.push({
          full_name: row.name?.trim() || null,
          emails: row.email ? [row.email.trim()] : [],
          phones: row.phone ? [row.phone.trim()] : [],
          current_company: row.current_company?.trim() || null,
          title: row.title?.trim() || null,
          source: "Recruiter CSV",
        });
      })
      .on("end", () => resolve(candidates))
      .on("error", reject);
  });
}

module.exports = parseRecruiterCSV;