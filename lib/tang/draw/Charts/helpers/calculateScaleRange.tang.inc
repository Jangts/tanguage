/*!
 * tanguage framework source code
 *
 * extend_static_methods draw/Charts/util
 *
 * Date: 2015-09-04
 */
;
public calculateScaleRange = (valuesArray, drawingSize, textSize, startFromZero, integersOnly, isXoA, isPolar) {
    if (isPolar && isXoA) {
        var minSteps = 4,
            maxSteps = Math.floor((Math.PI * drawingSize * 2) / (textSize * 1.5)),
            skipFitting = (minSteps >= maxSteps);
    } else {
        var minSteps = 2,
            maxSteps = Math.floor(drawingSize / (textSize * 1.5)),
            skipFitting = (minSteps >= maxSteps);
    }

    var minValue = arr.min(valuesArray),
        maxValue = arr.max(valuesArray);

    if (maxValue === minValue) {
        maxValue += 0.5;
        if (minValue >= 0.5 && !startFromZero) {
            minValue -= 0.5;
        } else {
            maxValue += 0.5;
        }
    }

    var valueRange = Math.abs(maxValue - minValue),
        rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange),
        graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
        graphMin = (startFromZero) ? 0 : Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
        graphRange = graphMax - graphMin,
        stepValue = Math.pow(10, rangeOrderOfMagnitude),
        numberOfSteps = Math.round(graphRange / stepValue);

    while ((numberOfSteps > maxSteps || (numberOfSteps * 2) < maxSteps) && !skipFitting) {
        if (numberOfSteps > maxSteps) {
            stepValue *= 2;
            numberOfSteps = Math.round(graphRange / stepValue);
            // Don't ever deal with a decimal number of steps - cancel fitting and just use the minimum number of steps.
            if (numberOfSteps % 1 !== 0) {
                skipFitting = true;
            }
        } else {
            //If user has declared ints only, and the step value isn't a decimal
            if (integersOnly && rangeOrderOfMagnitude >= 0) {
                //If the user has said integers only, we need to check that making the scale more granular wouldn't make it a float
                if (stepValue / 2 % 1 === 0) {
                    stepValue /= 2;
                    numberOfSteps = Math.round(graphRange / stepValue);
                } else {
                    break;
                }
            } else {
                stepValue /= 2;
                numberOfSteps = Math.round(graphRange / stepValue);
            }
        }
    }

    if (skipFitting) {
        numberOfSteps = minSteps;
        stepValue = graphRange / numberOfSteps;
    }

    if (isPolar) {
        return [numberOfSteps, stepValue];
    }

    if (isXoA) {
        return {
            xSteps: numberOfSteps,
            xStepValue: stepValue,
            minX: graphMin,
            maxX: graphMin + (numberOfSteps * stepValue)
        };
    }

    return {
        ySteps: numberOfSteps,
        yStepValue: stepValue,
        minY: graphMin,
        maxY: graphMin + (numberOfSteps * stepValue)
    };
};