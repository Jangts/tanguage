/*!
 * tanguage framework source code
 *
 * class draw/Charts
 *
 * Date: 2015-09-04
 */
;
{
    show: true,
    zIndex: 0,
    center: ['50%', '50%'],
    radius: '75%',
    shape: 'polygon',
    splitArea: {
        show: true,
        areaStyle: {
            color: null
        }
    },
    axisLine: {
        show: true,
        onZero: false,
        lineStyle: {
            color: "rgba(0,0,0,.2)",
            width: 1
        }
    },
    splitNumber: 5,
    splitLine: {
        show: true,
        lineStyle: {
            color: "rgba(0,0,0,.1)",
            width: 1
        }
    },
    axisLabel: {
        show: true,
        formatter: "<%=value%>",
        textStyle: {
            fontFamily: "'Microsoft YaHei', 'Hiragino Sans'",
            fontSize: 12,
            fontStyle: "normal",
            fontColor: "#666"
        }
    },
    indicator: []
}