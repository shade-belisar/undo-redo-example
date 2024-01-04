import $ from 'jquery';

import '../styles/app.less';
import { DiagramHandler } from "./DiagramHandler";
import { BpmnModelerHandler } from "./BpmnModelerHandler";

// Base Elements
const modelerContainer = $('#js-drop-zone');

let bpmnModelerHandler;
let diagramHandler;

export let modules;

function showError(message) {
    modelerContainer
        .removeClass('with-diagram')
        .addClass('with-error');
    modelerContainer.find('.error pre').text(message);
    modelerContainer.show()
}

// bootstrap diagram functions
$(async function () {
    if (window.location.protocol === "file:") {
        showError("The modeler cannot be run from a local file system. Please host it via a web server such as Apache or Nginx.")
        return
    }

    let response
    try {
        response = await fetch("./Modules.json")
    } catch (e) {
        showError("Error while fetching Modules.json at: " + e)
        return
    }
    modules = await response.json()

    bpmnModelerHandler = new BpmnModelerHandler()
    diagramHandler = new DiagramHandler(modelerContainer, bpmnModelerHandler.bpmnModeler)

    document
      .querySelector(".djs-palette")
      .addEventListener("mousewheel", (event) => {
          event.stopPropagation();
      });

    modelerContainer.show()

    diagramHandler.createNewDiagram()
});
