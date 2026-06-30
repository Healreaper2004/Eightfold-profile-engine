const fs = require("fs");

const parseRecruiterCSV =
    require("./parsers/recruiterParser");

const parseResume =
    require("./parsers/resumeParser");

const mergeProfiles =
    require("./merge/mergeProfiles");

const project =
    require("./projection/projector");

const validateSchema =
    require("./validators/schemaValidator");

async function main() {

    if (process.argv.includes("--help") || process.argv.includes("-h")) {
        console.log(`
Eightfold Profile Engine

Usage:
  node src/index.js [recruiter_csv_path] [resume_pdf_path] [config_json_path]

Options:
  --help, -h    Show usage instructions

Defaults:
  recruiter_csv_path:  ./input/recruiter.csv
  resume_pdf_path:     ./input/resume.pdf
  config_json_path:    ./config.json
`);
        process.exit(0);
    }

    try {

        /*
         * Command Line Arguments
         *
         * node src/index.js recruiter.csv resume.pdf config.json
         */

        const recruiterPath =
            process.argv[2] || "./input/recruiter.csv";

        const resumePath =
            process.argv[3] || "./input/resume.pdf";

        const configPath =
            process.argv[4] || "./config.json";

        console.log("\n========== INPUT FILES ==========\n");

        console.log("Recruiter CSV :", recruiterPath);
        console.log("Resume PDF    :", resumePath);
        console.log("Config JSON   :", configPath);

        /*
         * Validate input file existence
         */
        if (!fs.existsSync(recruiterPath)) {
            throw new Error(`Missing recruiter CSV file: File does not exist at "${recruiterPath}"`);
        }

        if (!fs.existsSync(resumePath)) {
            throw new Error(`Missing resume PDF file: File does not exist at "${resumePath}"`);
        }

        if (!fs.existsSync(configPath)) {
            throw new Error(`Missing config.json file: File does not exist at "${configPath}"`);
        }

        /*
         * Parse Recruiter CSV
         */
        let recruiterProfiles;
        try {
            recruiterProfiles = await parseRecruiterCSV(recruiterPath);
        } catch (err) {
            throw new Error(`Failed to parse recruiter CSV file "${recruiterPath}": ${err.message}`);
        }

        /*
         * Parse Resume
         */
        let resume;
        try {
            resume = await parseResume(resumePath);
        } catch (err) {
            throw new Error(`Invalid PDF: Failed to parse resume PDF file "${resumePath}". Detail: ${err.message}`);
        }

        console.log("\n========== RECRUITER PROFILE ==========\n");

        console.log(
            JSON.stringify(
                recruiterProfiles,
                null,
                4
            )
        );

        console.log("\n========== RESUME PROFILE ==========\n");

        console.log(
            JSON.stringify(
                resume,
                null,
                4
            )
        );

        /*
         * Merge Profiles
         */

        const merged =
            mergeProfiles(
                recruiterProfiles[0],
                resume
            );

        /*
         * Validate Canonical Profile
         */

        const validation =
            validateSchema(merged);

        console.log("\n========== VALIDATION ==========\n");

        if (validation.valid) {

            console.log("✅ Canonical Profile is VALID");

        } else {

            console.log("❌ Validation Failed");

            console.log(validation.errors);

            throw new Error(`Schema validation failed:\n${JSON.stringify(validation.errors, null, 2)}`);

        }

        console.log("\n========== CANONICAL PROFILE ==========\n");

        console.log(
            JSON.stringify(
                merged,
                null,
                4
            )
        );

        /*
         * Read Projection Config
         */
        let config;
        try {
            config = JSON.parse(
                fs.readFileSync(
                    configPath,
                    "utf8"
                )
            );
        } catch (err) {
            throw new Error(`Invalid config.json: Failed to parse config JSON file "${configPath}". Detail: ${err.message}`);
        }

        /*
         * Project Profile
         */

        const projected =
            project(
                merged,
                config
            );

        console.log("\n========== PROJECTED PROFILE ==========\n");

        console.log(
            JSON.stringify(
                projected,
                null,
                4
            )
        );

        /*
         * Save output files
         */
        try {
            if (!fs.existsSync("./output")) {
                fs.mkdirSync("./output", { recursive: true });
            }
            fs.writeFileSync("./output/canonical-profile.json", JSON.stringify(merged, null, 4));
            fs.writeFileSync("./output/projected-profile.json", JSON.stringify(projected, null, 4));
        } catch (err) {
            console.error("Warning: Failed to save output files: " + err.message);
        }

        console.log("\n========== PIPELINE COMPLETED ==========\n");

    } catch (err) {

        console.error("\n========== ERROR ==========\n");

        console.error(err.message);

        process.exit(1);

    }

}

main();