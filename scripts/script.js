function changeColor(e) {
    if (isPenDown) {
        switch (brushMode) {
            case 'pen':
                e.target.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--brush-color");
                break;
            case 'eraser':
                e.target.style.backgroundColor = "";
                e.target.setAttribute("is-gaying", 'false');
                break;
            case 'rainbow-pen':
                e.target.style.backgroundColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
                break;
            case 'mouse-pointer':
                break;
        }
    }
}

function resizeCanvas(newSize = canvasSize) {
    canvasSize = newSize;
    pixels = [];
    canvas.innerHTML = "";
    document.documentElement.style.setProperty("--canvas-size", canvasSize);
    for (let i = 0; i < canvasSize; i++) {
        for (let j = 0; j < canvasSize; j++) {
            newPixel = document.createElement("div");

            newPixel.setAttribute("data-row", i);
            newPixel.setAttribute("data-column", j);

            newPixel.addEventListener("mouseover", changeColor);

            if (gridLinesOn) {
                newPixel.classList.add("div-border");
            }

            pixels.push(newPixel);
            canvas.appendChild(newPixel);
        }
    }
    return canvasSize;
}

function clearCanvas() {
    pixels.forEach(pixel => {
        pixel.style.backgroundColor = "";
    });
}

function startPen(e) {
    if (e.button === 0) {
        isPenDown = true;
    }
}
function endPen(e) {
    if (e.button === 0) {
        isPenDown = false;
    }
}

function toggleGridLines() {
    if (gridLinesOn) {
        gridLinesButton.classList.remove("active-tool");
        pixels.forEach((pixel) => {
            pixel.classList.remove("div-border");
        });
        gridLinesOn = false;
    }
    else {
        gridLinesButton.classList.add("active-tool");
        pixels.forEach((pixel) => {
            pixel.classList.add("div-border");
        });
        gridLinesOn = true;
    }
}

function changePenColor(e) {
    document.documentElement.style.setProperty("--brush-color", e.target.value);
}

function activateBrushMode(e) {
    let selectedModeOption = e.target;
    if (selectedModeOption.tagName !== "DIV") {
        selectedModeOption = e.target.parentElement;
    }
    console.log(selectedModeOption.tagName);
    brushMode = selectedModeOption.getAttribute("data-mode");
    brushModeOptions.forEach((modeButton) => {
        modeButton.classList.remove("active-tool");
    });
    selectedModeOption.classList.add("active-tool");
}

let pixels = [];
let isPenDown = true;
let gridLinesOn = false;
let canvasSize = 10;
let brushMode = 'pen';

const canvas = document.querySelector("div#canvas");
document.addEventListener("mousedown", endPen);
document.addEventListener("mouseup", startPen);

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", clearCanvas);

const colorPicker = document.querySelector("#color-input");
colorPicker.addEventListener("input", changePenColor);

const gridLinesButton = document.querySelector("#grid-button");
gridLinesButton.addEventListener("click", toggleGridLines);

const brushModeOptions = document.querySelectorAll(".brush-mode-option")
brushModeOptions.forEach((button) => {
    button.addEventListener("click", activateBrushMode, {capture: true});
});

const canvasSizePicker = document.querySelector("#canvas-size-picker");
const canvasSizeDisplay = document.querySelector("#canvas-size-display");
canvasSizePicker.value = canvasSize;
canvasSizeDisplay.textContent = `${canvasSize}x${canvasSize}`;
canvasSizePicker.addEventListener("change", e => {
    resizeCanvas(e.target.value);
});
canvasSizePicker.addEventListener("input", (e) => {
    canvasSizeDisplay.textContent = `${e.target.value}x${e.target.value}`;
});


resizeCanvas();
