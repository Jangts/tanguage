/*!
 * tanguage framework source code
 *
 * class draw/Charts
 *
 * Date: 2015-09-04
 */
;
{
    status: 6,
    ranges: ranges,
    splitNumber: radar.splitNumber,
    backgroundColors: radar.splitArea.show && radar.splitArea.areaStyle.color,

    display: (radar.show == true),
    hasBar: false,
    hasScatter: false,
    instance: this,
    ctx: this.getLayer(radar.zIndex).getContext("2d"),
    radius: style.radius,
    xCenter: style.x,
    yCenter: style.y,

    angleAxisMax: labels.length,
    angleAxisMin: 0,
    angleAxisShow: (radar.axisLine.show == true),
    angleAxisLineShow: (radar.axisLine.show == true),
    angleAxisLineWidth: radar.axisLine.lineStyle.width,
    angleAxisLineColor: radar.axisLine.lineStyle.color,

    angleSplitLineShow: (radar.splitLine.show == true),
    angleSplitLineArc: (radar.shape === 'circle'),
    angleSplitLineWidth: radar.splitLine.lineStyle.width,
    angleSplitLineColor: radar.splitLine.lineStyle.color,

    angleLabelsShow: (radar.axisLabel.show == true),
    angleLabelFontColor: radar.axisLabel.textStyle.fontColor,
    angleLabelFontSize: radar.axisLabel.textStyle.fontSize,
    angleLabelFontStyle: radar.axisLabel.textStyle.fontStyle,
    angleLabelFontFamily: radar.axisLabel.textStyle.fontFamily,

    angleLabels: labels,
    angleTemplateString: radar.axisLabel.formatter,
    angleOnZero: true,
    angleBeginAtZero: true,
    angleIntegersOnly: true,

    radiusAxisMax: null,
    radiusAxisMin: 0,
    radiusAxisShow: (radar.splitLine.show == true),
    radiusAxisLineShow: (radar.axisLine.show == true),
    radiusAxisLineWidth: radar.axisLine.lineStyle.width,
    radiusAxisLineColor: radar.axisLine.lineStyle.color,

    radiusSplitLineShow: (radar.splitLine.show == true),
    radiusSplitLineWidth: radar.splitLine.lineStyle.width,
    radiusSplitLineColor: radar.splitLine.lineStyle.color,

    radiusLabelsShow: false,
    radiusLabelFontColor: radar.axisLabel.textStyle.fontColor,
    radiusLabelFontSize: radar.axisLabel.textStyle.fontSize,
    radiusLabelFontStyle: radar.axisLabel.textStyle.fontSize,
    radiusLabelFontFamily: radar.axisLabel.textStyle.fontFamily,

    radiusLabels: [],
    radiusTemplateString: radar.axisLabel.formatter,
    radiusOnZero: true,
    radiusBeginAtZero: true,
    radiusIntegersOnly: true
}