import flatpickr from "flatpickr";
import { jsPlumb } from 'jsplumb/dist/js/jsplumb.js';
// import interact from 'interactjs';

const infoMenuButton = document.querySelector('#info-menu-btn');
const infoMenu = document.querySelector('#info-menu');
const body = document.querySelector('body');
const canvas = document.querySelector('#canvas');

body.addEventListener('click', (event) => {
    event.preventDefault();
    infoMenu.classList.contains('is-active') ? infoMenu.classList.remove('is-active') : null;
})
infoMenuButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    infoMenu.classList.contains('is-active') ? infoMenu.classList.remove('is-active') : infoMenu.classList.add('is-active');
})

jsPlumb.ready(function () {

    // this is the paint style for the connecting lines..
    var sourceEndpoint = {
        endpoint: "Dot",
        paintStyle: {
            stroke: "#7AB02C",
            fill: "transparent",
            radius: 4,
            strokeWidth: 1
        },
        isSource: true,
        isTarget: true,
        // connector: ["Flowchart", { gap: 15, stub: [50, 50], cornerRadius: 10 }],
        connector: ["Bezier", { curviness: 70 }],
        connectorStyle: {
            strokeWidth: 2,
            stroke: "#61B7CF",
            joinstyle: "round",
            outlineStroke: "white",
            outlineWidth: 2,
            dashstyle: '2 2'
        },
        hoverPaintStyle: {
            fill: "#216477",
            stroke: "#216477"
        },
        connectorHoverStyle: {
            strokeWidth: 3,
            stroke: "#216477",
            outlineWidth: 5,
            outlineStroke: "white"
        },
        maxConnections: -1,
        dragOptions: {},
        allowLoopback: false,
        connectorOverlays: [["Arrow", { location: 0.90, width: 10, height: 10 }]]
    }

    let i = 0;
    let currentDragPosition = { x: 0, y: 0 };

    jsPlumb.setContainer(canvas);
    jsPlumb.draggable(document.querySelectorAll('.element'), {
        clone: true,
        drag: function (e) {
            currentDragPosition.x = `${e.pos[0]}px`;
            currentDragPosition.y = `${e.pos[1]}px`;
        }
    });
    jsPlumb.droppable(canvas, {
        drop: function (e) {
            if (e.drag.el.classList.contains('element')) {
                const anchors = ["Top", "Bottom", "Left", "Right"];
                let droppedElement = e.drag.el.cloneNode(true);
                droppedElement.classList.remove('element');
                droppedElement.classList.add('absolute', 'node');
                droppedElement.id = 'node' + i++;
                droppedElement.style.left = currentDragPosition.x;
                droppedElement.style.top = currentDragPosition.y;
                canvas.append(droppedElement);
                jsPlumb.draggable(droppedElement, { containment: false });
                anchors.forEach((anchor => {
                    jsPlumb.addEndpoint(droppedElement, sourceEndpoint, { anchor });
                }))
                flatpickr(".flatpickr");
                // interact('.node')
                //     .resizable({
                //         edges: { right: true, bottom: true },
                //         modifiers: [
                //             // minimum size
                //             interact.modifiers.restrictSize({
                //                 min: { width: 125, height: 115 },
                //             }),
                //         ]
                //     })
                //     .on('resizemove', function (event) {
                //         var target = event.target;
                //         // update the element's style
                //         target.style.width = event.rect.width + 'px';
                //         target.style.height = event.rect.height + 'px';
                //         jsPlumb.revalidate(droppedElement);
                //     });
            }
            return true;
        },
        rank: 10
    });

    jsPlumb.bind("click", function (c) {
        jsPlumb.deleteConnection(c);
    });
});

flatpickr(".flatpickr");