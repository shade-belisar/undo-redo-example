import {forEach, isArray} from "min-dash";

import {attr as domAttr, classes as domClasses, clear as domClear, domify, query as domQuery,} from "min-dom";

/**
 * Custom palette to add the module section buttons.
 */
export default class CustomPalette {
    constructor(create, elementFactory, palette) {
        this.create = create;
        this.elementFactory = elementFactory;

        palette.registerProvider(this);

        palette._update = function () {
            const entriesContainer = domQuery(".djs-palette-entries", this._container),
                entries = (this._entries = this.getEntries());

            domClear(entriesContainer);

            forEach(entries, function (entry, id) {
                const grouping = entry.group || "default";

                let container = domQuery(
                    "[data-group=" + grouping + "]",
                    entriesContainer
                );
                if (!container) {
                    container = domify('<div class="group" data-group="' + grouping + '"></div>');
                    entriesContainer.appendChild(container);
                }

                const html =
                    entry.html ||
                    (entry.separator
                        ? '<hr class="separator" />'
                        : '<div class="entry" draggable="true"></div>');

                const control = domify(html);
                entriesContainer.appendChild(control);

                if (!entry.separator) {
                    domAttr(control, "data-action", id);

                    if (entry.title) {
                        domAttr(control, "title", entry.title);
                    }

                    if (entry.name) {
                        domAttr(control, "data-name", entry.name);
                    }

                    if (entry.className) {
                        addClasses(control, entry.className);
                    }

                    if (entry.customEntry) {
                        addClasses(control, "customEntry")
                    }

                    if (entry.imageUrl) {
                        control.appendChild(domify('<img src="' + entry.imageUrl + '" alt="' + entry.name + '">'));
                    }
                }
            });

            // open after update
            this.open();
        };
    }

    getPaletteEntries() {
    }
}

function addClasses(element, classNames) {
    const classes = domClasses(element);

    const actualClassNames = isArray(classNames)
        ? classNames
        : classNames.split(/\s+/g);
    actualClassNames.forEach(function (cls) {
        classes.add(cls);
    });
}

CustomPalette.$inject = ["create", "elementFactory", "palette"];
