/*!
 * tanguage framework source code
 *
 * class draw/Charts
 *
 * Date: 2015-09-04
 */
;
{
    name: '',
    zIndex: 0,
    showPoint: true,
    itemStyle: {
        normal: {
            color: null,
            radius: 3,
            borderColor: null,
            borderWidth: 1
        },
        emphasis: {
            color: null,
            radius: 4,
            borderColor: null,
            borderWidth: 1
        }
    },
    lineStyle: {
        type: 'solid', //'dashed', 'dotted'
        borderColor: null,
        borderWidth: 2
    },
    showArea: false,
    areaStyle: {
        color: null,
    },
    hitDetectionRadius: 10,
    data: []
}