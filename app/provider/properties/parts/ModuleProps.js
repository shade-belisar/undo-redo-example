import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
import { isSelectEntryEdited, isTextAreaEntryEdited } from "@bpmn-io/properties-panel";
import { Checkbox } from "./Checkbox";
import { Select } from "./Select";
import { TextArea } from "./TextArea";
import { modules } from "../../../index";

function serviceTaskFields(module, businessObject, bpmnFactory, properties, element) {

    properties.push({
        id: "delegateExpression",
        field: {
            id: "delegateExpression",
            type: "text",
            name: "Delegate Expression",
            description: "Delegate Expression, die das Modul eindeutig identifiziert.",
            directProperty: true,
            readOnly: true
        },
        element,
        businessObject,
        bpmnFactory,
        component: TextArea,
        isEdited: isTextAreaEntryEdited
    })

    // add fields
    for (let f in module.fields) {
        let field = module.fields[f];

        if (field.type === "text") {
            // textbox
            properties.push({
                id: field.id,
                field,
                element,
                businessObject,
                bpmnFactory,
                component: TextArea,
                isEdited: isTextAreaEntryEdited
            })
        } else if (field.type === "select") {
            properties.push({
                id: field.id,
                field,
                element,
                businessObject,
                bpmnFactory,
                component: Select,
                isEdited: isSelectEntryEdited
            })
        } else if (field.type === "checkbox") {
            properties.push({
                id: field.id,
                field,
                element,
                businessObject,
                bpmnFactory,
                component: Checkbox
            })
        }
    }
}

export default function (element, bpmnFactory) {

    let properties = []
    const businessObject = getBusinessObject(element);

    let module = modules.find(
        (m) => businessObject.delegateExpression === m.delegate
    );

    if (module == null) {
        return properties;
    }

    if (is(element, "bpmn:ServiceTask")) {
        serviceTaskFields(module, businessObject, bpmnFactory, properties, element);
    }

    return properties;
}
