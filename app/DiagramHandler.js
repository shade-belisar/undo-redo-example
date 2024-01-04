import diagramXML from "../resources/newDiagram.bpmn";

export class DiagramHandler {

    constructor(modelerContainer, bpmnModeler) {
      this.modelerContainer = modelerContainer
      this.bpmnModeler = bpmnModeler
    }

    createNewDiagram() {
      this.openDiagram(diagramXML);
    }

    openDiagram(xml) {
        this.bpmnModeler.importXML(xml)
          .then(() => {
              this.modelerContainer
                .removeClass('with-error')
                .addClass('with-diagram');
          })
          .catch(err => {
              this.modelerContainer
                .removeClass('with-diagram')
                .addClass('with-error');
              this.modelerContainer.find('.error pre').text(err.message);

              console.error(err);
          })
    }
}
