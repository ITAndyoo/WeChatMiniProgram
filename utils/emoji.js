const regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
const regexDecode = /&(Gt|GT|ii);|&(gt|lt)(?!;)([=a-zA-Z0-9]?)|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+)/g;
const decodeMapNumeric = { '0': '\uFFFD', '128': '\u20AC', '130': '\u201A', '131': '\u0192', '132': '\u201E', '133': '\u2026', '134': '\u2020', '135': '\u2021', '136': '\u02C6', '137': '\u2030', '138': '\u0160', '139': '\u2039', '140': '\u0152', '142': '\u017D', '145': '\u2018', '146': '\u2019', '147': '\u201C', '148': '\u201D', '149': '\u2022', '150': '\u2013', '151': '\u2014', '152': '\u02DC', '153': '\u2122', '154': '\u0161', '155': '\u203A', '156': '\u0153', '158': '\u017E', '159': '\u0178' };
const invalidReferenceCodePoints = [1, 2, 3, 4, 5, 6, 7, 8, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 64976, 64977, 64978, 64979, 64980, 64981, 64982, 64983, 64984, 64985, 64986, 64987, 64988, 64989, 64990, 64991, 64992, 64993, 64994, 64995, 64996, 64997, 64998, 64999, 65000, 65001, 65002, 65003, 65004, 65005, 65006, 65007, 65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111];

const stringFromCharCode = String.fromCharCode;

const object = {};
const hasOwnProperty = object.hasOwnProperty;
const has = function (object, propertyName) {
    return hasOwnProperty.call(object, propertyName);
};

const contains = function (array, value) {
    let index = -1;
    const length = array.length;
    while (++index < length) {
        if (array[index] == value) {
            return true;
        }
    }
    return false;
};

const merge = function (options, defaults) {
    if (!options) {
        return defaults;
    }
    const result = {};
    let key;
    for (key in defaults) {
        // A `hasOwnProperty` check is not needed here, since only recognized
        // option names are used anyway. Any others are ignored.
        result[key] = has(options, key) ? options[key] : defaults[key];
    }
    return result;
};

const parseError = function (message) {
    throw Error('Parse error: ' + message);
};
const codePointToSymbol = function (codePoint, strict) {
    let output = '';
    if ((codePoint >= 0xD800 && codePoint <= 0xDFFF) || codePoint > 0x10FFFF) {
        if (strict) {
            parseError('character reference outside the permissible Unicode range');
        }
        return '\uFFFD';
    }
    if (has(decodeMapNumeric, codePoint)) {
        if (strict) {
            parseError('disallowed character reference');
        }
        return decodeMapNumeric[codePoint];
    }
    if (strict && contains(invalidReferenceCodePoints, codePoint)) {
        parseError('disallowed character reference');
    }
    if (codePoint > 0xFFFF) {
        codePoint -= 0x10000;
        output += stringFromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
        codePoint = 0xDC00 | codePoint & 0x3FF;
    }
    output += stringFromCharCode(codePoint);
    return output;
};

const decode = function (html, options) {
    options = merge(options, decode.options);
    const strict = options.strict;
    if (strict && regexInvalidEntity.test(html)) {
        parseError('malformed character reference');
    }
    return html.replace(regexDecode, function ($0, $1, $2, $3, $4, $5, $6, $7, $8) {
        let codePoint;
        let semicolon;
        let decDigits;
        let hexDigits;

        if ($4) {
            // Decode decimal escapes, e.g. `&#119558;`.
            decDigits = $4;
            semicolon = $5;
            if (strict && !semicolon) {
                parseError('character reference was not terminated by a semicolon');
            }
            codePoint = parseInt(decDigits, 10);
            return codePointToSymbol(codePoint, strict);
        }

        if ($6) {
            // Decode hexadecimal escapes, e.g. `&#x1D306;`.
            hexDigits = $6;
            semicolon = $7;
            if (strict && !semicolon) {
                parseError('character reference was not terminated by a semicolon');
            }
            codePoint = parseInt(hexDigits, 16);
            return codePointToSymbol(codePoint, strict);
        }

        // If we’re still here, `if ($7)` is implied; it’s an ambiguous
        // ampersand for sure. https://mths.be/notes/ambiguous-ampersands
        if (strict) {
            parseError(
                'named character reference was not terminated by a semicolon'
            );
        }
        return $0;
    });
};
decode.options = {
    'isAttributeValue': false,
    'strict': false
};
export default decode;