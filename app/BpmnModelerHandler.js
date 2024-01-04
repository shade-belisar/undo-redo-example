import BpmnModeler from "bpmn-js/lib/Modeler";
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from "bpmn-js-properties-panel";
import customPalette from "./provider/palette";
import customPropertiesProviderModule from "./provider/properties";
import customModdleDescriptor from "./descriptors/desc.json";

export class BpmnModelerHandler {
    constructor() {
        this.bpmnModeler = new BpmnModeler({
            container: '#js-canvas',
            propertiesPanel: {
                parent: '#js-properties-panel',
                layout: {
                    groups: {
                        details: {
                            open: true
                        },
                        modules: {
                            open: true
                        }
                    }
                }
            },
            keyboard: {
                bindTo: document,
            },
            additionalModules: [
                BpmnPropertiesPanelModule,
                BpmnPropertiesProviderModule,
                customPalette,
                customPropertiesProviderModule
            ],
            moddleExtensions: {
                activiti: customModdleDescriptor
            }
        });
    }
}
