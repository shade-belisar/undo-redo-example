export const setExpressionValue = (elem, value, bpmnFactory) => {
    delete elem.string;
    delete elem.expression;
    let valueToSet = value
    if (value === undefined) {
        valueToSet = ""
    }
    if (typeof value === "string" && value.includes("${")) {
        elem.expression = bpmnFactory.create("activiti:Expression", {
            text: "" + valueToSet,
        });
    } else {
        elem.string = bpmnFactory.create("activiti:String", {
            text: "" + valueToSet,
        });
    }
}

export const getExpression = (businessObject, field) => {
    const property = field.id;
    const defaultValue = field.default;
    if (field.directProperty) {
        const moduleProperty = businessObject[property]
        if (moduleProperty) {
            return moduleProperty;
        }
        return defaultValue;
    }

    const elem = businessObject.extensionElements?.values.find((e) => {
        return e.$type === "activiti:Field" && e.name === property;
    });
    if (!elem) {
        return defaultValue;
    }

    if (elem.expression) {
        return elem.expression.text;
    } else if (elem.string) {
        return elem.string.text;
    } else {
        return defaultValue;
    }
}

export const setExpression = (bpmnFactory, businessObject, field, value) => {
    const property = field.id;
    if (field.directProperty) {
        return {
            [property]: value
        }
    }

    let extensionElements = getExtensionElements(bpmnFactory, businessObject);
    if (!extensionElements) {
        extensionElements = bpmnFactory.create("bpmn:ExtensionElements");
    }
    let elem = extensionElements.get("values").find((e) => {
        return e.$type === "activiti:Field" && e.name === property;
    });
    if (!elem) {
        elem = bpmnFactory.create("activiti:Field", {
            name: property,
        });
        extensionElements.get("values").push(elem);
    }
    setExpressionValue(elem, value, bpmnFactory)
    return extensionElements
}

export const createListener = (businessObject, bpmnFactory) => {
    let extensionElements = getExtensionElements(bpmnFactory, businessObject);
    if (!extensionElements) {
        extensionElements = bpmnFactory.create("bpmn:ExtensionElements");
    }
    let listener = extensionElements.get("values").find((e) => {
        return e.$type === "activiti:ExecutionListener";
    });
    if (!listener) {
        listener = bpmnFactory.create("activiti:ExecutionListener");
        extensionElements.get("values").push(listener);
    }
    return {extensionElements, listener}
}

export const getExtensionElements = (bpmnFactory, businessObject) => {
    const extensionElements = businessObject.extensionElements;
    const preexistingValues = extensionElements ? extensionElements.get('values') : [];
    return bpmnFactory.create('bpmn:ExtensionElements', { values: preexistingValues });
}

export const updateElement = (element, modeling, extensionElements) => {
    element = element.labelTarget || element;
    console.log("Updating " + JSON.stringify(element))
    console.log(JSON.stringify(extensionElements))
    return modeling.updateProperties(element, { extensionElements });
}
