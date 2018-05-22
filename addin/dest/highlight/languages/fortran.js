/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:18:02 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../'
], function (pandora, root, imports, undefined) {
	_.highlight.languages.fortran = {
		'quoted-number': {
			pattern: /[BOZ](['"])[A-F0-9]+\1/i,
			alias: 'number'
		},
		'string': {
			pattern: /(?:\w+_)?(['"])(?:\1\1|&(?:\r\n?|\n)(?:\s*!.+(?:\r\n?|\n))?|(?!\1).)*(?:\1|&)/,
			inside: {
				'comment': {
					pattern: /(&(?:\r\n?|\n)\s*)!.*/,
					lookbehind: true
				}
			}
		},
		'comment': /!.*/,
		'boolean': /\.(?:TRUE|FALSE)\.(?:_\w+)?/i,
		'number': /(?:\b|[+-])(?:\d+(?:\.\d*)?|\.\d+)(?:[ED][+-]?\d+)?(?:_\w+)?/i,
		'keyword': [
			/\b(?:INTEGER|REAL|DOUBLE ?PRECISION|COMPLEX|CHARACTER|LOGICAL)\b/i,
			/\b(?:END ?)?(?:BLOCK ?DATA|DO|FILE|FORALL|FUNCTION|IF|INTERFACE|MODULE(?! PROCEDURE)|PROGRAM|SELECT|SUBROUTINE|TYPE|WHERE)\b/i,
			/\b(?:ALLOCATABLE|ALLOCATE|BACKSPACE|CALL|CASE|CLOSE|COMMON|CONTAINS|CONTINUE|CYCLE|DATA|DEALLOCATE|DIMENSION|DO|END|EQUIVALENCE|EXIT|EXTERNAL|FORMAT|GO ?TO|IMPLICIT(?: NONE)?|INQUIRE|INTENT|INTRINSIC|MODULE PROCEDURE|NAMELIST|NULLIFY|OPEN|OPTIONAL|PARAMETER|POINTER|PRINT|PRIVATE|PUBLIC|READ|RETURN|REWIND|SAVE|SELECT|STOP|TARGET|WHILE|WRITE)\b/i,
			/\b(?:ASSIGNMENT|DEFAULT|ELEMENTAL|ELSE|ELSEWHERE|ELSEIF|ENTRY|IN|INCLUDE|INOUT|KIND|NULL|ONLY|OPERATOR|OUT|PURE|RECURSIVE|RESULT|SEQUENCE|STAT|THEN|USE)\b/i
		],
		'operator': [
			/\*\*|\/\/|=>|[=\/]=|[<>]=?|::|[+\-*=%]|\.(?:EQ|NE|LT|LE|GT|GE|NOT|AND|OR|EQV|NEQV)\.|\.[A-Z]+\./i,
			{
				pattern: /(^|(?!\().)\/(?!\))/,
				lookbehind: true
			}
		],
		'punctuation': /\(\/|\/\)|[(),;:&]/
	};
}, true);
//# sourceMappingURL=fortran.js.map