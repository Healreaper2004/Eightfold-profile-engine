/**
 * Read nested value from object
 * Example:
 * getValue(profile,"links.github")
 * getValue(profile,"emails[0]")
 */

function getValue(obj, path) {

    path = path.replace(/\[(\d+)\]/g, ".$1");

    return path
        .split(".")
        .reduce((curr, key) => {

            if (curr == null)
                return undefined;

            return curr[key];

        }, obj);

}

/**
 * Runtime projection
 */

function project(profile, config) {

    const output = {};

    config.fields.forEach(field => {

        const from = field.from || field.path;

        let value = getValue(profile, from);

        if (value === undefined) {

            switch (config.on_missing) {

                case "omit":
                    return;

                case "error":
                    throw new Error(`Missing field: ${from}`);

                default:
                    value = null;

            }

        }

        output[field.path] = value;

    });

    if (config.include_confidence) {

        output.overall_confidence =
            profile.overall_confidence;

    }

    return output;

}

module.exports = project;