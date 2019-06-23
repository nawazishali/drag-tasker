import flatpickr from "flatpickr";
import dragula from 'dragula';

const infoMenuButton = document.querySelector('#info-menu-btn');
const infoMenu = document.querySelector('#info-menu');
const body = document.querySelector('body');
const taskCanvas = document.querySelector('.task-canvas');

let createElementFromHTML = (htmlString) => {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

let addTaskContainer = () => {
    return taskCanvas.appendChild(createElementFromHTML(`
    <div class="card task-container">
        <div class="card-content columns"></div>
    </div>
    `));
}

body.addEventListener('click', (event) => {
    event.preventDefault();
    infoMenu.classList.contains('is-active') ? infoMenu.classList.remove('is-active') : null;
})
infoMenuButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    infoMenu.classList.contains('is-active') ? infoMenu.classList.remove('is-active') : infoMenu.classList.add('is-active');
})

let drake = dragula([
    document.querySelector('.draggable-options-container'),
    document.querySelector('.task-container .card-content'),
    document.querySelector('.assignee-container')
], {
        copy: function (el, source) {
            return source.classList.contains('draggable-options-container') || source.classList.contains('assignee-container');
        },
        accepts: function (el, target, source) {
            flatpickr(".flatpickr");
            return !target.classList.contains('draggable-options-container');
        },
        moves: function (el, container) {
            return !el.classList.contains('disable-drag');
        }
    })
    .on('drag', (el, container) => {
        if (el.classList.contains('task-input') && !container.classList.contains('card-content')) {
            drake.containers.push(addTaskContainer().childNodes[1]);
        }
    })
    .on('dragend', (el, container) => {
        drake.containers = drake.containers.filter((elem) => {
            if (elem) {
                return elem.childNodes.length;
            }
        })

        taskCanvas.childNodes.forEach((elem) => {
            if (elem && elem.classList && elem.classList.contains('task-container')) {
                if (!elem.childNodes[1].childNodes.length) elem.remove();
            }
        })
    })
    .on('drop', (el, target, source) => {
        if (el.classList.contains('assignee-input')) el.classList.add('card');
        if (target && target.classList && target.classList.contains('card-content')) {
            let duplicate = false;
            target.childNodes.forEach((child, index, self) => {
                let arr = Array.from(self);
                let duplicateIndex = arr.findIndex((elem) => elem.classList.contains(el.classList[1]));
                if (duplicateIndex >= 0 && duplicateIndex !== index && el.classList[1] === child.classList[1]) duplicate = true;
            });
            if (duplicate || ((target == source) && el.classList.contains('task-input'))) {
                drake.cancel('revert');
            }
            duplicate = false;
        }
    })

flatpickr(".flatpickr");