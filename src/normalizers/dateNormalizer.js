const months = {
    january: "01",
    jan: "01",
    february: "02",
    feb: "02",
    march: "03",
    mar: "03",
    april: "04",
    apr: "04",
    may: "05",
    june: "06",
    jun: "06",
    july: "07",
    jul: "07",
    august: "08",
    aug: "08",
    september: "09",
    sep: "09",
    october: "10",
    oct: "10",
    november: "11",
    nov: "11",
    december: "12",
    dec: "12"
};

function normalizeDate(date) {

    if (!date) return null;

    date = date.trim();

    // Example: 2025
    if (/^\d{4}$/.test(date)) {
        return `${date}-01`;
    }

    // Example: June 2025
    const match = date.match(/^([A-Za-z]+)\s+(\d{4})$/);

    if (match) {

        const month = months[match[1].toLowerCase()];

        if (month) {
            return `${match[2]}-${month}`;
        }

    }

    return null;
}

module.exports = normalizeDate;