// Source: https://github.com/home-assistant/frontend/blob/dev/src/common/datetime/seconds_to_duration.ts

const leftPad = (num) => (num < 10 ? `0${num}` : num);

export function secondsToDuration(d, options = {}) {
    const days = Math.floor(d / 86400);
    const h = Math.floor((d % 86400) / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    if (options.template) {
        let result = options.template;
        result = result.replace(/dd/g, leftPad(days));
        result = result.replace(/hh/g, leftPad(h));
        result = result.replace(/mm/g, leftPad(m));
        result = result.replace(/ss/g, leftPad(s));
        // Remove leading zeros if not showing zero
        if (!options.showZero && result.startsWith('00:')) {
            result = result.substring(3);
        }
        if (!options.showZero && result.startsWith('00:') && !result.includes(':')) {
            result = result.substring(3);
        }
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

    // Handle zero duration display options
    if (d === 0 && options.showZero) {
        if (options.showZero === 'hours') {
            return '0:00:00';
        } else if (options.showZero === 'minutes') {
            return '0:00';
        } else if (options.showZero === 'seconds' || options.showZero === true) {
            return '0';
        }
    }

    return null;
}
