import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

import { createImage } from "./util";
import { modules } from "../../index";
import ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";

/**
 * A provider for quick service task production
 */
export default function CustomPaletteProvider(
    palette,
    create,
    bpmnFactory,
    moddle,
    translate
) {
    this._create = create;
    this._elementFactory = new ElementFactory(
        bpmnFactory,
        moddle,
        translate
    );

    palette.registerProvider(this);
}

CustomPaletteProvider.$inject = [
    "palette",
    "create",
    "bpmnFactory",
    "moddle",
    "translate",
];

CustomPaletteProvider.prototype.getPaletteEntries = function () {
    let actions = {},
        create = this._create,
        elementFactory = this._elementFactory;

    elementFactory = this._elementFactory;
    create = this._create;
    const bpmnFactory = this._elementFactory._bpmnFactory;

    for (let m in modules) {
        let module = modules[m];

        let factory = function startCreate(event) {
            const serviceTask = elementFactory.createShape({
                name: "test",
                type: "bpmn:ServiceTask",
            });

            const businessObject = getBusinessObject(serviceTask);

            businessObject.name = module.name;

            businessObject.async = "true";
            businessObject.delegateExpression = module.delegate;
            if (module.triggerable) {
                businessObject.triggerable = "true";
            }

            let extensionElements = bpmnFactory.create("bpmn:ExtensionElements");
            businessObject.extensionElements = extensionElements;

            for (let f in module.fields) {
                let field = module.fields[f];

                let elem = bpmnFactory.create("activiti:Field", {
                    name: field.id,
                });
                extensionElements.get('values').push(elem);
                let def = field.default ? field.default : "";
                if (def.includes("${")) {
                    elem.expression = bpmnFactory.create("activiti:Expression", {
                        text: def,
                    });
                } else {
                    elem.string = bpmnFactory.create("activiti:String", {
                        text: def,
                    });
                }
            }

            create.start(event, serviceTask);
        };

        let group = "modules";

        actions[module.id] = {
            group: group,
            className: module.id,
            name: module.name,
            imageUrl: createImage(module.name),
            customEntry: true,
            action: {
                dragstart: factory,
                click: factory,
            },
        };
    }

    return actions;
};
