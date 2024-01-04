import {useService} from "bpmn-js-properties-panel";
import {getExpression, setExpression, updateElement} from "./Util";
import {CheckboxEntry} from "@bpmn-io/properties-panel";

export const Checkbox = (props) => {
    const  { field, element, businessObject, bpmnFactory } = props;
    const modeling = useService('modeling');

    const getValue = () => {
        let val = getExpression(
            businessObject,
            field
        );
        return val === "true";
    }

    const setValue = value => {
        const extensionElements = setExpression(
            bpmnFactory,
            businessObject,
            field,
            value ? "true" : "false"
        );
        return updateElement(element, modeling, extensionElements)
    }

    return <CheckboxEntry
        id={field.id}
        element={element}
        description={field.description}
        label={field.label}
        getValue={getValue}
        setValue={setValue}
        disabled={field.readOnly}
    />
}
