import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  TextFieldEntry,
  isTextFieldEntryEdited
} from '@bpmn-io/properties-panel';

import { useService } from "bpmn-js-properties-panel";


/**
 * @typedef { import('@bpmn-io/properties-panel').EntryDefinition } Entry
 */

/**
 * @returns {Array<Entry>} entries
 */
export function MultiInstanceProps(props) {
  const {
    element
  } = props;

  let entries = props.entries || [];

  if (!isMultiInstanceSupported(element)) {
    return entries;
  }

  console.log(entries)

  removeObjectWithId(entries, "loopCardinality")
  removeObjectWithId(entries, "completionCondition")

  console.log(entries)

  entries.push(
    {
      id: 'collection',
      component: Collection,
      isEdited: isTextFieldEntryEdited
    },
    {
      id: 'elementVariable',
      component: ElementVariable,
      isEdited: isTextFieldEntryEdited
    });

  return entries;
}

function Collection(props) {
  const { element } = props;

  const debounce = useService('debounceInput');
  const commandStack = useService('commandStack');
  const translate = useService('translate');

  const loopCharacteristics = getLoopCharacteristics(element);

  const getValue = () => {
    return getCollection(element);
  };

  const setValue = (value) => {
    return commandStack.execute(
      'element.updateModdleProperties',
      {
        element,
        moddleElement: loopCharacteristics,
        properties: {
          'activiti:collection': value
        }
      }
    );
  };

  return TextFieldEntry({
    element,
    id: 'collection',
    label: translate('Collection'),
    getValue,
    setValue,
    debounce
  });
}

function ElementVariable(props) {
  const { element } = props;

  const debounce = useService('debounceInput');
  const commandStack = useService('commandStack');
  const translate = useService('translate');

  const loopCharacteristics = getLoopCharacteristics(element);

  const getValue = () => {
    return getElementVariable(element);
  };

  const setValue = (value) => {
    return commandStack.execute(
      'element.updateModdleProperties',
      {
        element,
        moddleElement: loopCharacteristics,
        properties: {
          'activiti:elementVariable': value
        }
      }
    );
  };

  return TextFieldEntry({
    element,
    id: 'elementVariable',
    label: translate('Element Variable'),
    getValue,
    setValue,
    debounce
  });
}


// helper ////////////////////////////

// generic ///////////////////////////

/**
 * isMultiInstanceSupported - check whether given element supports camunda specific props
 * for multiInstance (ref. <camunda:Cllectable>).
 *
 * @param {djs.model.Base} element
 * @return {boolean}
 */
function isMultiInstanceSupported(element) {
  const loopCharacteristics = getLoopCharacteristics(element);
  return !!loopCharacteristics && is(loopCharacteristics, 'activiti:Collectable');
}

/**
 * getProperty - get a property value of the loop characteristics.
 *
 * @param {djs.model.Base} element
 * @param {string} propertyName
 *
 * @return {any} the property value
 */
function getProperty(element, propertyName) {
  var loopCharacteristics = getLoopCharacteristics(element);
  return loopCharacteristics && loopCharacteristics.get(propertyName);
}

/**
 * getLoopCharacteristics - get loopCharacteristics of a given element.
 *
 * @param {djs.model.Base} element
 * @return {ModdleElement<bpmn:MultiInstanceLoopCharacteristics> | undefined}
 */
function getLoopCharacteristics(element) {
  const bo = getBusinessObject(element);
  return bo.loopCharacteristics;
}

// collection

/**
 * getCollection - get the 'camunda:collection' attribute value of the loop characteristics.
 *
 * @param {djs.model.Base} element
 *
 * @return {string} the 'camunda:collection' value
 */
function getCollection(element) {
  return getProperty(element, 'activiti:collection');
}

// elementVariable

/**
 * getElementVariable - get the 'camunda:elementVariable' attribute value of the loop characteristics.
 *
 * @param {djs.model.Base} element
 *
 * @return {string} the 'camunda:elementVariable' value
 */
function getElementVariable(element) {
  return getProperty(element, 'activiti:elementVariable');
}

function removeObjectWithId(arr, id) {
  const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
  arr.splice(objWithIdIndex, 1);

  return arr;
}
