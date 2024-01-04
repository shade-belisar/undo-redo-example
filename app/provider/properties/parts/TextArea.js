import {useService} from "bpmn-js-properties-panel";
import {getExpression, setExpression, updateElement} from "./Util";
import {TextAreaEntry} from "@bpmn-io/properties-panel";

export const TextArea = (props) => {
    const  { field, element, businessObject, bpmnFactory } = props;
    const modeling = useService('modeling');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return getExpression(
            businessObject,
            field
        );
    };

    const setValue = value => {
        const extensionElements = setExpression(
            bpmnFactory,
            businessObject,
            field,
            value
        );
        return updateElement(element, modeling, extensionElements)
    }

    return <TextAreaEntry
        id={field.id}
        element={element}
        description={field.description}
        label={field.name}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
        disabled={field.readOnly}
    />
}
