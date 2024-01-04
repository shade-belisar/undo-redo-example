import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
import { TextAreaEntry } from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";
import { createListener, setExpressionValue, updateElement } from "./Util";
import { ConditionProps } from "./ConditionProps";

const extractListener = (businessObject) => {
    const extensionElements = businessObject.extensionElements;
    if (!extensionElements) {
        return "";
    }
    const listener = extensionElements.values.find((e) => {
        return e.$type === "activiti:ExecutionListener";
    });
    if (!listener) {
        return;
    }
    return listener
}

const getListener = (businessObject, property) => {
    const listener = extractListener(businessObject)
    if (listener) {
        return listener.get(property);
    }
    return "";
}

const getExpression = (businessObject, property) => {
    const listener = extractListener(businessObject)
    if (!listener) {
        return "";
    }
    const elem = listener.get("fields").find((e) => {
        return e.$type === "activiti:Field" && e.name === property;
    });
    if (!elem) {
        return "";
    }

    if (elem.expression) {
        return elem.expression.text;
    } else if (elem.string) {
        return elem.string.text;
    } else {
        return "";
    }
}

const setListener = (bpmnFactory, businessObject, property, value) => {
    const {extensionElements, listener} = createListener(businessObject, bpmnFactory)
    listener[property] = value;
    return extensionElements
}

const setExpression = (bpmnFactory, businessObject, property, value) => {
    const {extensionElements, listener} = createListener(businessObject, bpmnFactory)
    let elem = listener.get("fields").find((e) => {
        return e.$type === "activiti:Field" && e.name === property;
    });
    if (!elem) {
        elem = bpmnFactory.create("activiti:Field", {
            name: property,
        });
        listener.get("fields").push(elem);
    }
    setExpressionValue(elem, value, bpmnFactory);
    return extensionElements
}

const TextAreaExpression = props => {
    const { id, label, element, businessObject, bpmnFactory } = props;
    const modeling = useService('modeling');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return getExpression(businessObject, id)
    }

    const setValue = value => {
        const extensionElements = setExpression(bpmnFactory, businessObject, id, value)
        return updateElement(element, modeling, extensionElements)
    }

    return <TextAreaEntry
        id={id}
        label={label}
        element={element}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />
}

const TextAreaListener = props => {
    const { id, label, element, businessObject, bpmnFactory } = props;
    const modeling = useService('modeling');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return getListener(businessObject, id)
    }

    const setValue = value => {
        const extensionElements = setListener(bpmnFactory, businessObject, id, value)
        return updateElement(element, modeling, extensionElements)
    }

    return <TextAreaEntry
        id={id}
        label={label}
        element={element}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />
}

export default function (element, bpmnFactory) {
    let properties = [...ConditionProps({element})]
    const businessObject = getBusinessObject(element);

    if (is(element, "bpmn:Process")) {
        properties.push({
            id: "endpoints",
            label: "Endpoints",
            element,
            businessObject,
            bpmnFactory,
            component: TextAreaExpression
        })
        properties.push({
            id: "event",
            label: "Event",
            element,
            businessObject,
            bpmnFactory,
            component: TextAreaListener
        })
        properties.push({
            id: "class",
            label: "Class",
            element,
            businessObject,
            bpmnFactory,
            component: TextAreaListener
        })
    }
    return properties
}
