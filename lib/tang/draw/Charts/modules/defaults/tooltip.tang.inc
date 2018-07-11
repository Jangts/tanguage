/*!
 * tanguage framework source code
 *
 * class draw/Charts/typeExtend
 *
 * Date: 2015-09-04
 */
;
{
    show: true,
    type: 'item',
    zIndex: 0,
    triggerOn: ["mousemove", "touchstart", "touchmove"],
    triggerOff: ["mouseout"],
    onTrigger: null,

    backgroundColor: 'rgba(0,0,0,0.8)',
    borderColor: '#333',
    borderWidth: 0,
    padding: 5,
    formatter: '<%if (label){%><%=label%> : <%}%><%= value %>',
    axisFormatter: '<%= itemLabel %> : <%= value %>',
    caretSize: 8,
    cornerRadius: 6,
    xOffset: 10,
    textStyle: {
        color: '#fff',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontFamily: '\'Microsoft YaHei\', \'Hiragino Sans\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
        fontSize: 14,
    },
    titleFormatter: '<%= titleLabel%>',
    titleStyle: {
        color: '#fff',
        fontStyle: 'normal',
        fontWeight: 'blod',
        fontFamily: '\'Microsoft YaHei\', \'Hiragino Sans\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
        fontSize: 14,
    },
    strictHover: false,
    legendBackgroundColor: '#fff'
}