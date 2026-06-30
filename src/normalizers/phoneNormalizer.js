function normalizePhone(phone) {
    if (!phone) return null;

    // Convert to string and remove all non-digit characters
    let digits = String(phone).replace(/\D/g, "");

    // Indian mobile number (10 digits)
    if (digits.length === 10) {
        digits = "91" + digits;
    }

    // Already has country code (91XXXXXXXXXX)
    if (digits.length === 12 && digits.startsWith("91")) {
        return "+" + digits;
    }

    // Invalid number
    return null;
}

module.exports = normalizePhone;