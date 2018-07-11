/*!
 * tanguage framework source code
 *
 * static data
 *
 * Date 2017-04-06
 */
;
const sqlengine = {
    parse(json, ops) {
        var o = { fields: ["*"], from: "json", where: "", orderby: [], order: "asc", limit: [] };
        for (i in ops) o[i] = ops[i];

        var result = [];
        result = sqlengine.returnFilter(json, o);
        result = sqlengine.returnOrderBy(result, o.orderby, o.order);
        result = sqlengine.returnLimit(result, o.limit);

        return result;
    },
    returnFilter(json, jsonsql_o) {

        var jsonsql_scope = eval(jsonsql_o.from);
        var jsonsql_result = [];
        var jsonsql_rc = 0;

        if (jsonsql_o.where == "")
            jsonsql_o.where = "true";

        for (var jsonsql_i in jsonsql_scope) {
            with (jsonsql_scope[jsonsql_i]) {
                if (eval(jsonsql_o.where)) {
                    jsonsql_result[jsonsql_rc++] = sqlengine.returnFields(jsonsql_scope[jsonsql_i], jsonsql_o.fields);
                }
            }
        }

        return jsonsql_result;
    },
    returnFields(scope, fields) {
        if (fields.length == 0)
            fields = ["*"];

        if (fields[0] == "*")
            return scope;

        var returnobj = {};
        for (var i in fields)
            returnobj[fields[i]] = scope[fields[i]];

        return returnobj;
    },
    returnOrderBy(result, orderby, order) {
        if (orderby.length == 0)
            return result;

        result.sort(function (a, b) {
            switch (order.toLowerCase()) {
                case "desc":
                    return (eval('a.' + orderby[0] + ' < b.' + orderby[0])) ? 1 : -1;
                case "asc":
                    return (eval('a.' + orderby[0] + ' > b.' + orderby[0])) ? 1 : -1;
                case "descnum":
                    return (eval('a.' + orderby[0] + ' - b.' + orderby[0]));
                case "ascnum":
                    return (eval('b.' + orderby[0] + ' - a.' + orderby[0]));
            }
        });
        return result;
    },
    returnLimit(result, limit) {
        switch (limit.length) {
            case 0:
                return result;
            case 1:
                return result.splice(0, limit[0]);
            case 2:
                return result.splice(limit[0] - 1, limit[1]);
        }
    }
};