import {useService} from "bpmn-js-properties-panel";
import {getExpression, setExpression, updateElement} from "./Util";
import {SelectEntry} from "@bpmn-io/properties-panel";

export const Select = (props) => {
    const  { field, element, businessObject, bpmnFactory } = props;
    const modeling = useService('modeling');

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
        return updateElement(element, modeling, extensionElements);
    }

    return <SelectEntry
        id={field.id}
        element={element}
        description={field.description}
        label={field.label}
        getOptions={() => field.selectOptions}
        getValue={getValue}
        setValue={setValue}
        disabled={field.readOnly}
    />
}
