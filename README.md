# Eightfold Profile Engine

A Node.js-based profile aggregation engine that ingests structured and unstructured candidate information from multiple sources, normalizes the extracted data, merges conflicting information into a canonical profile, validates the output, and generates configurable client-specific views using a runtime projection layer.

---

# Project Overview

The Eightfold Profile Engine combines candidate information from multiple data sources into a single canonical profile.

The engine supports:

* Recruiter CSV Parsing
* Resume PDF Parsing
* Data Normalization
* Profile Merging
* Confidence Scoring
* Provenance Tracking
* JSON Schema Validation
* Runtime Configurable Projection
* CLI-based Execution

The project demonstrates a complete ETL (Extract → Transform → Load) pipeline for candidate profile aggregation.

---

# Features

## Parsing

* Recruiter CSV Parser
* Resume PDF Parser
* Email Extraction
* Phone Extraction
* GitHub Extraction
* LinkedIn Extraction
* Skills Extraction
* Experience Extraction
* Education Extraction

---

## Normalization

* Phone Number Normalization (E.164)
* Skill Normalization
* Date Normalization

---

## Profile Aggregation

* Canonical Profile Generation
* Duplicate Removal
* Merge Strategy
* Confidence Scoring
* Provenance Tracking

---

## Validation

* JSON Schema Validation using AJV

---

## Runtime Projection

The engine supports configurable output formats using `config.json`.

Without modifying any parser or merge logic, users can define custom output schemas for different downstream applications.

---

# Architecture

```
Recruiter CSV
        │
        ▼
 Recruiter Parser
        │
Resume PDF
        ▼
 Resume Parser
        │
        ▼
 Normalizers
        │
        ▼
 Merge Engine
        │
        ▼
 Canonical Profile
        │
        ▼
 Schema Validator
        │
        ▼
 Projection Layer
        │
        ▼
 Client Specific Output
```

---

# Project Structure

```
eightfold-profile-engine/

│
├── input/
│   ├── recruiter.csv
│   └── resume.pdf
│
├── output/
│   ├── canonical-profile.json
│   └── projected-profile.json
│
├── src/
│   ├── merge/
│   ├── normalizers/
│   ├── parsers/
│   ├── projection/
│   ├── schema/
│   └── validators/
│
├── tests/
│   ├── confidence.test.js
│   ├── dateNormalizer.test.js
│   ├── mergeProfiles.test.js
│   ├── phoneNormalizer.test.js
│   ├── projector.test.js
│   ├── schemaValidator.test.js
│   └── skillNormalizer.test.js
│
├── .gitignore
├── config.json
├── package.json
├── DESIGN_DOCUMENT.md
└── README.md
```

---

# Installation

Clone the repository

```
git clone <repository-url>
```

Install dependencies

```
npm install
```

---

# Input Files

The engine expects:

```
Recruiter CSV
Resume PDF
Projection Config (JSON)
```

Default folder:

```
input/
```

---

# Running the Project

Using default inputs

```
node src/index.js
```

Using custom files

```
node src/index.js ./input/recruiter.csv ./input/resume.pdf ./config.json
```

Show usage instructions and help

```
node src/index.js -h
```
or
```
node src/index.js --help
```

Clean outputs

```
npm run clean
```

Run tests

```
npm test
```

### Pipeline Output Screenshot

![Pipeline Output](file:///C:/Users/dpsay/.gemini/antigravity-ide/brain/c6af227b-25a5-4b7f-814b-f7ed6699c58a/terminal_output_1782832027792.png)

---

# Canonical Profile

The canonical profile contains

* Candidate Information
* Emails
* Phones
* Links
* Skills
* Experience
* Education
* Provenance
* Overall Confidence

---

# Merge Strategy

The merge engine combines candidate data from multiple sources.

Rules followed:

* Remove duplicate emails
* Remove duplicate phone numbers
* Normalize phone numbers
* Normalize skills
* Preserve provenance for every field
* Calculate overall confidence

---

# Confidence Scoring

Each data source contributes a confidence score.

Example:

| Source        | Confidence |
| ------------- | ---------: |
| Recruiter CSV |       0.95 |
| Resume        |       0.85 |

The overall profile confidence is calculated using the average confidence across all provenance records.

---

# Provenance Tracking

Every extracted field records:

* Source
* Extraction Method
* Confidence
* Timestamp

Example

```
{
    field: "skills[0]",
    source: "Resume",
    method: "Dictionary Matching",
    confidence: 0.85
}
```

---

# Runtime Projection

Client-specific output is generated using `config.json`.

Example

```
{
  "path": "email",
  "from": "emails[0]"
}
```

This allows different clients to receive different profile structures without modifying the application logic.

---

# Sample Output

The application generates

* Recruiter Profile
* Resume Profile
* Canonical Profile
* Projected Profile

---

# Assumptions

* Resume contains extractable text.
* Recruiter CSV follows the expected format.
* Skills are matched against a predefined dictionary.
* Dates follow common month-year formats.
* Invalid phone numbers are ignored during normalization.

---

# Future Improvements

* LinkedIn Profile API Integration
* GitHub Repository Analysis
* OCR Support for Image-based Resumes
* AI-based Skill Extraction
* Machine Learning Confidence Scoring
* Multi-language Resume Support

---

# Author

Ayush Arya

B.Tech Computer Science Engineering
