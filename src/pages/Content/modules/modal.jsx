
import React from 'react';
import { render } from 'react-dom';
import { ModalPage } from "./ModalPage";

const boxContent = `
<div draggable="true" id="container" class="modal">
    <p>Hello!!!</p>
    <p>Last picture:</p>
    <img id="last-pic" src="" />
    <p id="image-count">Image count: 0</p>
</div>
`

const styles = `
<style>
* {
    all:initial
}
:root {
    --grey8: #1f1f1f
}

.modal {
    height: 300px;
    width: 200px;
    position: fixed;
    top: 10px;
    right: 10px;

    z-index: 300;
}

.modal img {
    width: 100%;
    height: auto;
}

.modal.hide {
    opacity: 0;
}
</style>
`

// const template = document.createElement('template');
// template.innerHTML = styles + boxContent;

// class FrizbeeModal extends HTMLDivElement {
//     constructor() {
//         super();
//         this.attachShadow({ mode: "open" });
//         this.shadowRoot.appendChild(template.content.cloneNode(true));
//         this.imgNode = this.shadowRoot.querySelector("#last-pic");
//         this.container = this.shadowRoot.querySelector("#container");

//         const dragHandler = (ev => {
//             if (ev.screenX === 0 && ev.screenY === 0) return;
//             //offset with half of height and width
//             box.style.left = ev.screenX - 100 + "px";
//             box.style.top = ev.screenY - 150 + "px";
//             box.style.right = "initial";
//         })
//         this.container.addEventListener("drag", dragHandler);
//     }

//     updateImage(imgData) {
//         this.imgNode.setAttribute("src", imgData);
//     }

//     hideModal() {
//         this.container.classList.add("hide");
//     }

//     showModal() {
//         this.container.classList.remove("hide");
//     }
// }

// (() => {
//     window.customElements.define("frizbee-modal", FrizbeeModal);
// })()

export const modal = () => {
    const box = document.createElement("div");
    let container = null;

    const init = () => {
        document.body.appendChild(box);
        box.attachShadow({ mode: "open" });
        box.shadowRoot.innerHTML = styles + boxContent;

        container = box.shadowRoot.querySelector("#container");

        // box.setAttribute("draggable", "true")
        // box.innerHTML = boxContent;
        // box.classList.add("modal");
        const dragHandler = (ev => {
            if (ev.screenX === 0 && ev.screenY === 0) return;
            //offset with half of height and width
            box.style.left = ev.screenX - 100 + "px";
            box.style.top = ev.screenY - 150 + "px";
            box.style.right = "initial";
        })

        //box.setAttribute("ondrag", dragHandler);
        //document.body.appendChild(box);
        container.addEventListener("drag", dragHandler)
        render(<ModalPage />, container);
    }

    const updateImage = (imgData) => {
        const img = box.shadowRoot.querySelector("#last-pic");
        img.setAttribute("src", imgData)
    }

    const hideModal = () => {
        container.classList.add("hide");
    }

    const showModal = () => {
        container.classList.remove("hide")
    }

    const updateImageCount = (num) => {
        const pTag = box.querySelector("#image-count");
        if (pTag) pTag.innerText = "Image Count: " + num;
    }



    return { init, updateImage, hideModal, showModal, updateImageCount }
}