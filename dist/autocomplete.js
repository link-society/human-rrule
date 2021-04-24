"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autocomplete = exports.defaultSuggestor = exports.freq = exports.weekStart = exports.byWeekDay = exports.day = exports.byMonth = exports.month = exports.byMonthDay = exports.monthDay = exports.ByYearDay = exports.yearDay = exports.byWeekNo = exports.weekNo = exports.ext = exports.byTime = exports.and = exports.until = exports.time = exports.count = exports.durations = exports.opt = exports.rec = exports.seq = exports.digits = exports.plural = exports.choice = exports.toSuggestors = exports.toSuggestor = exports.same = void 0;
const pluralize_1 = __importDefault(require("pluralize"));
const suggestionResult = (suggestion, count = 1) => [{
        suggestion,
        count
    }];
const errorResult = (error, count = 1) => [{
        suggestion: '',
        error,
        count
    }];
const countResult = (count = 1) => [{
        suggestion: '',
        count
    }];
const findFinished = (suggestors) => suggestors.find(({ suggestion, error }) => !(suggestion || error));
const incCount = (count, suggestResults) => suggestResults.map(suggestResult => ({ ...suggestResult, count: suggestResult.count + count }));
const same = (name) => {
    if (!name) {
        throw new Error('Missing token');
    }
    return (...exps) => {
        const [exp] = exps;
        if (name.startsWith(exp)) {
            const remainder = name.substring(exp.length);
            if (remainder) {
                return suggestionResult(remainder, 1);
            }
            return countResult();
        }
        return errorResult(`${exp} wrong token. Expected ${name}`);
    };
};
exports.same = same;
const toSuggestor = (token) => typeof token === 'string' ? exports.same(token) : token;
exports.toSuggestor = toSuggestor;
const toSuggestors = (...tokens) => tokens.map(exports.toSuggestor);
exports.toSuggestors = toSuggestors;
const choice = (...tokens) => {
    const suggestors = exports.toSuggestors(...tokens);
    if (suggestors.length < 2) {
        throw new Error(`At least 2 suggestors expected, found ${suggestors.length}`);
    }
    return (...exps) => {
        const suggestResult = suggestors.flatMap(suggestor => suggestor(...exps));
        const suggestions = suggestResult.filter(sr => !sr.error);
        if (suggestions.length === 0) {
            return errorResult('Unexpected token');
        }
        return suggestions;
    };
};
exports.choice = choice;
const plural = (name) => exports.choice(name, pluralize_1.default(name));
exports.plural = plural;
const digits = (maxValue, suffix) => (...exps) => {
    const [exp] = exps;
    const digitsRegexp = /(?<digits>\d+)(?<expSuffix>.*)/;
    const matched = exp.match(digitsRegexp);
    if (matched === null || matched.groups === undefined || !matched.groups.digits) {
        return errorResult(`Digits expected. ${exp} found`);
    }
    const { digits, expSuffix } = matched.groups;
    if (digits) {
        const value = parseInt(digits, 10);
        if (isNaN(value)) {
            return errorResult(`Digits %d${suffix} expected. Found ${exp}`);
        }
        else if (maxValue && value > maxValue) {
            return errorResult(`Too big number found ${value}. Expected lower than ${maxValue}`);
        }
        if (suffix) {
            return exports.same(suffix)(expSuffix);
        }
        else if (expSuffix) {
            return errorResult(`No suffix expected. ${expSuffix} found`);
        }
        return countResult(1);
    }
    return errorResult(`Digits %d${suffix} expected. Found ${exp}`);
};
exports.digits = digits;
const seq = (...tokens) => (...exps) => {
    const suggestors = exports.toSuggestors(...tokens);
    const expsLength = exps.length;
    const [suggestor, ...nextSuggestors] = suggestors;
    if (suggestor) {
        const suggestorResults = suggestor(...exps);
        const optional = suggestorResults.length === 1 && suggestorResults[0].count === 0 ? suggestorResults[0] : null;
        const finished = findFinished(suggestorResults);
        const next = optional || finished;
        const count = finished ? finished.count : 0;
        if (next) {
            if (nextSuggestors.length > 0) {
                return incCount(count, exports.seq(...nextSuggestors)(...exps.slice(count)));
            }
        }
        return suggestorResults;
    }
    return [];
};
exports.seq = seq;
const rec = (...tokens) => (...exps) => {
    const suggestors = exports.toSuggestors(...tokens);
    let result = exports.seq(...suggestors)(...exps);
    const finished = findFinished(result);
    if (finished) {
        let { count } = finished;
        while (finished) {
            const nextResults = exports.seq(...suggestors)(...exps.slice(count));
            const nextFinished = findFinished(nextResults);
            if (nextFinished) {
                count += nextFinished.count;
                result = nextResults.map(suggestResult => ({ ...suggestResult, count: suggestResult.count + count }));
            }
            else {
                result = incCount(count, nextResults);
                break;
            }
        }
    }
    return result;
};
exports.rec = rec;
const opt = (token) => (...exps) => {
    const suggestor = exports.toSuggestor(token);
    const results = suggestor(...exps);
    const result = results.filter(({ error }) => !error);
    return result.length > 0 ? result : errorResult('Optional not met', 0);
};
exports.opt = opt;
exports.durations = exports.choice(...[
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year'
].map(exports.plural));
exports.count = exports.seq(exports.same('for'), exports.digits(), exports.plural('time'));
exports.time = exports.seq(exports.opt(exports.digits(2, 'h')), exports.opt(exports.digits(2, 'm')), exports.opt(exports.digits(2, 's')));
exports.until = exports.seq(exports.same('until'), exports.same('month'), exports.digits(0, ','), exports.digits(4), exports.opt(exports.rec(exports.same('at'), exports.time)));
exports.and = exports.choice(exports.same(','), exports.same('and'));
exports.byTime = exports.seq(exports.same('at'), exports.time, exports.opt(exports.rec(exports.and, exports.time)));
exports.ext = exports.choice(exports.same('st'), exports.same('nd'), exports.same('rd'), exports.same('th'));
exports.weekNo = exports.seq(exports.digits(), exports.ext);
exports.byWeekNo = exports.seq(exports.same('on'), exports.same('the'), exports.weekNo, exports.opt(exports.rec(exports.and, exports.weekNo)));
exports.yearDay = exports.seq(exports.digits(), exports.ext);
exports.ByYearDay = exports.seq(exports.same('on'), exports.same('the'), exports.yearDay, exports.opt(exports.rec(exports.and, exports.yearDay)));
exports.monthDay = exports.seq(exports.digits(), exports.ext);
exports.byMonthDay = exports.seq(exports.same('the'), exports.monthDay, exports.opt(exports.rec(exports.and, exports.monthDay)));
exports.month = exports.choice(...[
    'january',
    'february',
    'mars',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
].map(exports.same));
exports.byMonth = exports.seq(exports.same('in'), exports.month, exports.opt(exports.rec(exports.and, exports.month)));
exports.day = exports.choice(...[
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
].map(exports.same));
exports.byWeekDay = exports.seq(exports.same('on'), exports.day, exports.opt(exports.rec(exports.and, exports.day)));
exports.weekStart = exports.seq(exports.same('starting'), exports.same('the'), exports.same('week'), exports.same('on'), exports.day);
exports.freq = exports.seq(exports.same('every'), exports.opt(exports.digits()), exports.durations);
exports.defaultSuggestor = exports.seq(exports.freq, exports.opt(exports.weekStart), exports.opt(exports.byWeekDay), exports.opt(exports.byMonth), exports.opt(exports.byMonthDay), exports.opt(exports.ByYearDay), exports.opt(exports.byWeekNo), exports.opt(exports.byTime), exports.opt(exports.until), exports.opt(exports.count));
const autocomplete = (exp, token = exports.defaultSuggestor) => {
    const suggestor = exports.toSuggestor(token);
    const suggestions = suggestor(...exp.split(/\s+/gm));
    return suggestions.filter(({ suggestion }) => !!suggestion).map(({ suggestion }) => suggestion);
};
exports.autocomplete = autocomplete;
//# sourceMappingURL=autocomplete.js.map