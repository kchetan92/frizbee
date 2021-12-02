
const boxContent = `
<p>Hello!!!</p>
<p>Last picture:</p>
<img id="last-pic" src="" />
`

export const modal = () => {
    const box = document.createElement("div");

    const init = () => {
        box.setAttribute("draggable", "true")
        box.innerHTML = boxContent;
        box.classList.add("modal");
        const dragHandler = (ev => {
            if (ev.screenX === 0 && ev.screenY === 0) return;
            box.style.left = ev.screenX + "px";
            box.style.top = ev.screenY + "px";
            box.style.right = "initial";
        })
        //box.setAttribute("ondrag", dragHandler);
        document.body.appendChild(box);
        box.addEventListener("drag", dragHandler)
    }

    const updateImage = (imgData) => {
        const img = box.querySelector("#last-pic");
        img.setAttribute("src", imgData)
    }

    return { init, updateImage }
}