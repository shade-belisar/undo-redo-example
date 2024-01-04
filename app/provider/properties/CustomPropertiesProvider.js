// Import your custom property entries.
// The entry is a text input field with logic attached to create,
// update and delete the "custom property".
import DetailsProps from "./parts/DetailsProps";
import ModuleProps from "./parts/ModuleProps";
import { MultiInstanceProps } from "./properties/MultiInstanceProps";

const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 * @param bpmnFactory
 */
export default function CustomPropertiesProvider(propertiesPanel, translate, bpmnFactory) {
    // API ////////

    /**
     * Return the groups provided for the given element.
     *
     * @param {DiagramElement} element
     *
     * @return {(Object[]) => (Object[])} groups middleware
     */
    this.getGroups = (element) => {

        /**
         * We return a middleware that modifies
         * the existing groups.
         *
         * @param {Object[]} groups
         *
         * @return {Object[]} modified groups
         */
        return (groups) => {

            addGroup(groups, 'modules', 'Module', ModuleProps(element, bpmnFactory))
            addGroup(groups, 'details', 'Details', DetailsProps(element, bpmnFactory))

            updateMultiInstanceGroup(groups, element);

            return groups;
        }
    };

    const addGroup = (groups, id, label, entries) => {
        if (entries.length === 0) {
            return;
        }

        const group = {
            id,
            label,
            entries
        }

        groups.push(group)
    }

    const updateMultiInstanceGroup = (groups, element) => {
        const multiInstanceGroup = groups.find(g => g.id === 'multiInstance');

        if (!multiInstanceGroup) {
            return;
        }

        const { entries } = multiInstanceGroup;

        MultiInstanceProps({ element, entries });
    }


    // registration ////////

    // Register our custom module properties provider.
    // Use a lower priority to ensure it is loaded after
    // the basic BPMN properties.
    propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

CustomPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'bpmnFactory'];
