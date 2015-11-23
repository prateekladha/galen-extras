
this.lastName = function (objectPattern) {
    var all = findAll(objectPattern);

    if (all.length > 0) {
        return all[all.length - 1].name;
    } else {
        throw new Error("Cannot find last element of " + objectPattern + ". Could find any elements");
    }
};

function _ruleRenderedInTable(rule, itemPattern, columns, verticalMargin, horizontalMargin) {
    var allItems = findAll(itemPattern);

    var currentColumn = 0;

    for (var i = 0; i < allItems.length - 1; i += 1) {
        if (currentColumn < columns - 1) {
            rule.addObjectSpecs(allItems[i].name, [
                "left-of " + allItems[i + 1].name + " " + horizontalMargin,
                "aligned horizontally all " + allItems[i + 1].name
            ]);
        }

        var j = i + columns;

        if (j < allItems.length) {
            rule.addObjectSpecs(allItems[i].name, [
                "above " + allItems[j].name + " " + verticalMargin,
                "aligned vertically all " + allItems[j].name
            ]);
        }

        currentColumn += 1;
        if (currentColumn === columns) {
            currentColumn = 0;
        }
    }
}

/**
 * This is a high-level spec for checking that elements are displayed in table layout
 * e.g.
 *
 *      | menuItem-* are rendered in 2 column table layout, with 0 to 4px margin
 */
rule("%{itemPattern} are rendered in %{columns: [0-9]+} column table layout, with %{margin} margin", function (objectName, parameters) {
    _ruleRenderedInTable(this, parameters.itemPattern, parseInt(columns), parameters.margin, parameters.margin);
});


/**
 * This is a high-level spec for checking that elements are displayed in table layout 
 * with different margins for vertical and horizontal sides
 * e.g.
 *
 *      | menuItem-* are rendered in 2 column table layout, with 0 to 4px vertical and 1px horizontal margin
 */
rule("%{itemPattern} are rendered in %{columns: [0-9]+} column table layout, with %{verticalMargin} vertical and %{horizontalMargin} horizontal margins", function (objectName, parameters) {
    _ruleRenderedInTable(this, parameters.itemPattern, parseInt(columns), parameters.verticalMargin, parameters.horizontalMargin);
});



function _applyRuleBodyForAllElements(rule, objectPattern, appliesConditionCallback) {
    var allElements = findAll(parameters.objectPattern);

    if (allElements.length > 0) {
        for (var i = 0; i < allElements.length - 1; i += 1) {
            if (!appliesConditionCallback(allElements[i])) {
                return;
            }
        }
        rule.doRuleBody();
    }
}


rule("if all %{objectPattern} are visible", function (objectName, parameters) {
    _applyRuleBodyForAllElements(this, parameters.objectPattern, function (element) {
        return element.isVisible();
    });
});


rule("if none of %{objectPattern} are visible", function (objectName, parameters) {
    _applyRuleBodyForAllElements(this, parameters.objectPattern, function (element) {
        return ! element.isVisible();
    });
});


rule("%{objectPattern} sides are inside %{containerObject} with %{margin} margin left and right", function (objectName, parameters) {
   var items = findAll(parameters.objectPattern);

    if (items.length > 0) {
        this.addObjectSpecs(items[0].name, ["inside " + parameters.containerObject + " " + parameters.margin + " left"]);
        this.addObjectSpecs(items[items.length - 1].name, ["inside " + parameters.containerObject + " " + parameters.margin + " right"]);
    } else {
        throw new Error("Couldn't find any items matching " + parameters.objectPattern);
    }
});