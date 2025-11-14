let selected = null;
const page1 = document.getElementById("card1");
const defaultText = document.getElementById("defaultText");

enableDrag(defaultText);
enableResize(defaultText, defaultText.querySelector(".resize-handle"));
selectBox(defaultText);

document.getElementById("addTextBtn").addEventListener("click", () => {
    const box = document.createElement("div");
    box.className = "text-box";
    box.contentEditable = true;
    box.style.left = "40px";
    box.style.top = "60px";
    box.style.fontSize = "20px";
    box.innerText = "New Text";

    const handle = document.createElement("div");
    handle.className = "resize-handle";
    box.appendChild(handle);

    page1.appendChild(box);
    enableDrag(box);
    enableResize(box, handle);
    selectBox(box);
});

document.getElementById("addImageBtn").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = () => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.className = "image-box";
            img.style.left = "50px";
            img.style.top = "150px";
            page1.appendChild(img);
            enableDrag(img);
            enableResize(img);
            selectBox(img);
        };
        reader.readAsDataURL(file);
    };
});

function selectBox(box) {
    document.querySelectorAll(".text-box, .image-box").forEach(el => el.classList.remove("selected"));
    selected = box;
    selected.classList.add("selected");
    updateToolbarValues();
}

function enableDrag(box) {
    box.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("resize-handle")) return;
        selectBox(box);

        let startX = e.clientX;
        let startY = e.clientY;
        let origLeft = parseInt(box.style.left || 0);
        let origTop = parseInt(box.style.top || 0);

        function move(ev) {
            box.style.left = origLeft + (ev.clientX - startX) + "px";
            box.style.top = origTop + (ev.clientY - startY) + "px";
        }

        function stop() {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", stop);
        }

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", stop);
    });
}

function enableResize(box, handle = null) {
    if (!handle) handle = box;
    const resizeHandle = handle.querySelector ? handle.querySelector(".resize-handle") : null;
    (resizeHandle || handle).addEventListener("mousedown", (e) => {
        e.stopPropagation();
        selectBox(box);

        let startX = e.clientX;
        let startWidth = box.offsetWidth;
        let startFont = parseFloat(window.getComputedStyle(box).fontSize) || 20;

        function resize(ev) {
            const diff = ev.clientX - startX;
            if (box.tagName === "IMG") {
                box.style.width = Math.max(50, startWidth + diff) + "px";
                box.style.height = "auto";
            } else {
                box.style.fontSize = Math.max(10, startFont + diff * 0.2) + "px";
            }
            updateToolbarValues();
        }

        function stopResize() {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResize);
        }

        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);
    });
}

function updateToolbarValues() {
    if (!selected) return;
    if (selected.classList.contains("text-box")) {
        document.getElementById("fontSize").value = parseInt(selected.style.fontSize);
        document.getElementById("fontFamily").value = selected.style.fontFamily || "Arial";
        document.getElementById("textColor").value = selected.style.color || "#000000";
        document.getElementById("letterSpacing").value = selected.style.letterSpacing?.replace("px","") || 0;
        document.getElementById("lineHeight").value = selected.style.lineHeight || 1;
        document.getElementById("opacityRange").value = selected.style.opacity || 1;
    }
}

document.getElementById("fontSize").oninput = e => selected && selected.classList.contains("text-box") && (selected.style.fontSize = e.target.value + "px");
document.getElementById("fontFamily").oninput = e => selected && selected.classList.contains("text-box") && (selected.style.fontFamily = e.target.value);
document.getElementById("textColor").oninput = e => selected && selected.classList.contains("text-box") && (selected.style.color = e.target.value);
document.getElementById("letterSpacing").oninput = e => selected && selected.classList.contains("text-box") && (selected.style.letterSpacing = e.target.value + "px");
document.getElementById("lineHeight").oninput = e => selected && selected.classList.contains("text-box") && (selected.style.lineHeight = e.target.value);
document.getElementById("opacityRange").oninput = e => selected && (selected.style.opacity = e.target.value);

document.getElementById("boldBtn").onclick = () => toggleStyle("fontWeight", "bold");
document.getElementById("italicBtn").onclick = () => toggleStyle("fontStyle", "italic");
document.getElementById("underlineBtn").onclick = () => toggleStyle("textDecoration", "underline");
document.getElementById("alignSelect").onchange = e => selected && selected.classList.contains("text-box") && (selected.style.textAlign = e.target.value);

function toggleStyle(property, value) {
    if (!selected || !selected.classList.contains("text-box")) return;
    selected.style[property] = selected.style[property] === value ? "normal" : value;
}

document.getElementById("deleteBtn").onclick = () => {
    if (selected) {
        selected.remove();
        selected = null;
    }
};
