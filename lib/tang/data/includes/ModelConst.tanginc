/*!
 * tanguage framework source code
 *
 * class .data.Uploader
 *
 * Date 2017-04-06
 */
;
const formatter = {
    'any'() {
        return {
            base: 'any',
            type: 'any',
            default: attributes.default || ''
        }
    },
    'scala'() {
        return {
            base: 'any',
            type: 'scala',
            length: attributes.length || 0,
            default: attributes.default || '',
            range: attributes.range || null
        }
    },
    'string'(attributes) {
        return {
            base: 'string',
            type: 'string',
            length: attributes.length || 0,
            default: attributes.default || '',
            range: attributes.range || null
        };
    },
    'bool'(attributes) {
        return {
            base: 'bool',
            default: !!attributes.default
        };
    },
    'string not null': notNullFormatter,
    'int': normalFormatter,
    'int not null': notNullFormatter,
    'number': normalFormatter,
    'number not null': notNullFormatter,
    'fulldate': timeFormatter,
    'dayofyear': timeFormatter,
    'month': timeFormatter,
    'timeofday': timeFormatter,
    'hourminute': timeFormatter,
    'datetime': timeFormatter
};