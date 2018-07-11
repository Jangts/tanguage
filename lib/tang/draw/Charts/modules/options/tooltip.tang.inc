/*!
 * tanguage framework source code
 *
 * class draw/Charts/typeExtend
 *
 * Date: 2015-09-04
 */
;
{
    showTooltips: (tooltip.show == true),
    zIndex: tooltip.zIndex,
    customTooltips: tooltip.onTrigger,

    tooltipFillColor: tooltip.backgroundColor,

    tooltipFontFamily: tooltip.textStyle.fontFamily,
    tooltipFontSize: tooltip.textStyle.fontSize,
    tooltipFontStyle: tooltip.textStyle.fontStyle,
    tooltipFontWeight: tooltip.textStyle.fontWeight,
    tooltipFontColor: tooltip.textStyle.color,

    tooltipTitleFontFamily: tooltip.titleStyle.fontFamily,
    tooltipTitleFontSize: tooltip.titleStyle.fontSize,
    tooltipTitleFontStyle: tooltip.titleStyle.fontStyle,
    tooltipTitleFontWeight: tooltip.titleStyle.fontWeight,
    tooltipTitleFontColor: tooltip.titleStyle.color,

    tooltipTemplate: tooltip.formatter,
    multiTooltipTemplate: tooltip.axisFormatter,
    tooltipTitleTemplate: tooltip.titleFormatter,

    tooltipXPadding: _.util.isArr(tooltip.padding) ? tooltip.padding[0] : (_.util.isNumeric(tooltip.padding) ? parseFloat(tooltip.padding) : 5),
    tooltipYPadding: _.util.isArr(tooltip.padding) ? tooltip.padding[1] : (_.util.isNumeric(tooltip.padding) ? parseFloat(tooltip.padding) : 5),

    tooltipCaretSize: tooltip.caretSize,
    tooltipCornerRadius: tooltip.cornerRadius,
    tooltipXOffset: tooltip.xOffset,

    multiTooltipKeyBackground: tooltip.legendBackgroundColor,
}