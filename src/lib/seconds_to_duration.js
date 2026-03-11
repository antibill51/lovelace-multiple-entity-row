// Source: https://github.com/home-assistant/frontend/blob/dev/src/common/datetime/seconds_to_duration.ts

const leftPad = (num) => (num < 10 ? `0${num}` : num);

export function secondsToDuration(d, options = {}) {
    let days = Math.floor(d / 86400);
    let h = Math.floor((d % 86400) / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);

    if (options.template) {
        let result = options.template;
        const hasDd = options.template.includes('dd');
        const hasHh = options.template.includes('hh');
        const hasMm = options.template.includes('mm');
        const hasSs = options.template.includes('ss');

        // Convert all time to the smallest visible unit, then redistribute to visible units
        // This handles all template combinations correctly (consecutive or not)
        let totalSeconds = days * 86400 + h * 3600 + m * 60 + s;

        // Reset all units
        days = h = m = s = 0;

        // Redistribute to visible units starting from largest
        if (hasDd) {
            days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
        }
        if (hasHh) {
            h = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
        }
        if (hasMm) {
            m = Math.floor(totalSeconds / 60);
            totalSeconds %= 60;
        }
        if (hasSs) {
            s = totalSeconds;
        }

        const padHours = hasDd;
        const padMinutes = hasHh || hasDd;
        const padSeconds = hasMm || hasHh || hasDd;
        result = result.replace(/dd/g, days.toString()); // No padding for days
        result = result.replace(/hh/g, padHours ? leftPad(h) : h.toString());
        result = result.replace(/mm/g, padMinutes ? leftPad(m) : m.toString());
        result = result.replace(/ss/g, padSeconds ? leftPad(s) : s.toString());
        // If all zero and not showing zero, return null
        if (!options.showZero && /^0+(:0+)*$/.test(result.replace(/:/g, ''))) {
            return null;
        }
        return result;
    }

    if (days > 0) {
        return `${days}:${leftPad(h)}:${leftPad(m)}:${leftPad(s)}`;
    }
    if (h > 0) {
        return `${h}:${leftPad(m)}:${leftPad(s)}`;
    }
    if (m > 0) {
        return `${m}:${leftPad(s)}`;
    }
    if (s > 0) {
        if (h === 0 && m === 0) {
            return `0:${leftPad(s)}`;
        }
        return '' + s;
    }

    // Handle zero duration display options (legacy, when no template)
    if (d === 0 && options.showZero) {
        return '0:00:00';
    }

    return null;
}
