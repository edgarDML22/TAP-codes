window.onload = function() {
    var canvas = document.getElementById("myCanvas1");
    var ctx = canvas.getContext("2d");

    let drawing = false;
    let currentTool = "pencil"; // Estado inicial: lápiz
    let selectedButton = document.getElementById("pencil").parentElement; // Seleccionar el botón de lápiz por defecto
    selectedButton.classList.add("selected");
    const sizeSliderRow = document.getElementById("sizeSliderRow");
    const sizeRange = document.getElementById("sizeRange");
    const sizeValue = document.getElementById("sizeValue");
    let shapeSize = parseInt(sizeRange.value);

    ///////////////////////////////////////////////////////////////////////////////////////////

    // Historial del canvas
    let history = [];
    let historyIndex = -1;

    // Función para guardar el estado del canvas en el historial
    function saveCanvasState() {
        historyIndex++;
        if (historyIndex < history.length) {
            history.length = historyIndex; // Eliminar estados futuros
        }
        history.push(canvas.toDataURL());
    }

    // Función para restaurar el estado del canvas desde el historial
    function restoreCanvasState(index) {
        if (index >= 0 && index < history.length) {
            let img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
                ctx.drawImage(img, 0, 0); // Restaurar la imagen
            };
            img.src = history[index];
        }
    }

    // Funciones para retroceder y avanzar
    document.addEventListener("keydown", function(e) {
        if (e.ctrlKey) {
            if (e.key === "z") {
                undo();
                e.preventDefault(); // Evitar el comportamiento predeterminado del navegador
            } else if (e.key === "y") {
                redo();
                e.preventDefault(); // Evitar el comportamiento predeterminado del navegador
            }
        }
    });

    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            restoreCanvasState(historyIndex);
        }
    }

    function redo() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            restoreCanvasState(historyIndex);
        }
    }
    // Event listeners para los botones retroceder y avanzar
    document.getElementById("back_arrow").addEventListener("click", undo);
    document.getElementById("front_arrow").addEventListener("click", redo);

    sizeRange.addEventListener("input", function() {
        shapeSize = parseInt(this.value);
        sizeValue.textContent = this.value;
    });

    ///////////////////////////////////////////////////////////////////////////////////////////


    // Selector de color
    const colorPicker = document.getElementById("colorPicker");
    let currentColor = colorPicker.value;
    ctx.strokeStyle = currentColor; // Establecer el color inicial
    ctx.fillStyle = currentColor; // Establecer el color inicial

    // Event listener para el selector de color
    colorPicker.addEventListener("input", function() {
        currentColor = this.value;
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
    });

    ///////////////////////////////////////////////////////////////////////////////////////////


    // Selector de color de fondo
    let isBackgroundColorMode = false;
    // Event listener para el botón de la cubeta
    document.getElementById("back_color").parentElement.addEventListener("click", function() {
        isBackgroundColorMode = !isBackgroundColorMode;
        if (isBackgroundColorMode) {
            selectedButton.classList.remove("selected");
            this.classList.add("selected");
            selectedButton = this;
        } else {
            selectedButton.classList.remove("selected");
            document.getElementById("pencil").parentElement.classList.add("selected");
            selectedButton = document.getElementById("pencil").parentElement;
        }
    });

    canvas.addEventListener("click", function(e) {
        if (isBackgroundColorMode) {
            canvas.style.backgroundColor = currentColor;
            isBackgroundColorMode = false;
            selectedButton.classList.remove("selected");
            document.getElementById("pencil").parentElement.classList.add("selected");
            selectedButton = document.getElementById("pencil").parentElement;
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////


    // Grosor del trazo
    const lineWidthSliderRow = document.getElementById("lineWidthSliderRow");
    const lineWidthRange = document.getElementById("lineWidthRange");
    const lineWidthValue = document.getElementById("lineWidthValue");
    let lineWidth = parseInt(lineWidthRange.value);

    // Event listener para el clic en el deslizador
    sizeSliderRow.addEventListener("click", function() {
        sizeValue.classList.add("selected");
    });

    // Event listener para el grosor del trazo
    lineWidthRange.addEventListener("input", function() {
        lineWidth = parseInt(this.value);
        lineWidthValue.textContent = this.value;
        ctx.lineWidth = lineWidth; // Actualizar el grosor del trazo
    });

    // Event listener para el clic en el deslizador de tamaño
    sizeSliderRow.addEventListener("click", function() {
        sizeValue.classList.add("selected");
    });

    // Event listener para el clic en el deslizador de grosor
    lineWidthSliderRow.addEventListener("click", function() {
        lineWidthValue.classList.add("selected");
    });

    // Event listener para el mouseover en el deslizador
    sizeSliderRow.addEventListener("mouseover", function() {
        sizeValue.classList.add("selected");
    });

    // Event listener para el mouseout en el deslizador
    sizeSliderRow.addEventListener("mouseout", function() {
        // No remover la clase 'selected' aquí, se mantiene hasta cambiar la herramienta
    });

    ///////////////////////////////////////////////////////////////////////////////////////////

    function handleButtonClick(e) {
        const button = e.currentTarget;
        if (selectedButton && selectedButton !== button) {
            selectedButton.classList.remove("selected");
        }
        button.classList.add("selected");
        selectedButton = button;
        if (button.querySelector("img")) {
            currentTool = button.querySelector("img").id;
            if (currentTool === "circle" || currentTool === "square" || currentTool === "triangle") {
                sizeSliderRow.style.display = "table-row";
                lineWidthSliderRow.style.display = "none";
                sizeValue.classList.add("selected");
                lineWidthValue.classList.remove("selected");
            } else if (currentTool === "grosor_selector") {
                lineWidthSliderRow.style.display = "table-row";
                sizeSliderRow.style.display = "none";
                lineWidthValue.classList.add("selected");
                sizeValue.classList.remove("selected");
            } else {
                sizeSliderRow.style.display = "none";
                lineWidthSliderRow.style.display = "none";
                sizeValue.classList.remove("selected");
                lineWidthValue.classList.remove("selected");
            }
        }
    }

    const buttons = document.querySelectorAll(".table1 td");
    buttons.forEach(button => {
        button.addEventListener("click", handleButtonClick);
    });

    // Función para obtener las coordenadas del mouse en el canvas
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left - window.scrollX,
            y: e.clientY - rect.top - window.scrollY
        };
    }

    // Actualizar el tamaño de la figura cuando el rango cambia
    document.getElementById("sizeRange").addEventListener("input", function(e) {
        shapeSize = e.target.value; // Asignamos el valor del rango a shapeSize
    });

    let lineStartX, lineStartY; // Variables para la línea

    canvas.addEventListener("mousedown", function(e) {
        const pos = getMousePos(e);
        drawing = true;
        ctx.strokeStyle = currentColor; // Establecer el color al inicio del dibujo
        ctx.fillStyle = currentColor; // Establecer el color al inicio del dibujo
        switch (currentTool) {
            case "pencil":
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                break;
            case "eraser":
                ctx.clearRect(pos.x - 10, pos.y - 10, 20, 20); // Borrar un área pequeña
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, shapeSize, 0, 2 * Math.PI); // Dibujar un círculo
                ctx.stroke();
                drawing = false;
                break;
            case "square":
                ctx.beginPath();
                ctx.rect(pos.x - shapeSize, pos.y - shapeSize, shapeSize * 2, shapeSize * 2); // Dibujar un cuadrado
                ctx.stroke();
                drawing = false;
                break;
            case "triangle":
                const side = shapeSize * 2; // Lado del triángulo igual al lado del cuadrado
                const height = -(Math.sqrt(side**2 - (side/2)**2)); // Altura del triángulo equilátero
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y + height / 2); // Vértice superior
                ctx.lineTo(pos.x - side/2, pos.y - height/2); // Vértice inferior derecho
                ctx.lineTo(pos.x + side/2, pos.y - height/2); // Vértice inferior izquierdo
                ctx.closePath();
                ctx.stroke();
                drawing = false;
                break;
            case "line": // Manejo de la herramienta línea
                lineStartX = pos.x;
                lineStartY = pos.y;
                break;
        }
        saveCanvasState(); // Guardar el estado del canvas antes de cada cambio
    });

    canvas.addEventListener("mousemove", function(e) {
        if (drawing) {
            const pos = getMousePos(e);
            switch (currentTool) {
                case "pencil":
                    ctx.lineTo(pos.x, pos.y);
                    ctx.stroke();
                    break;
                case "eraser":
                    ctx.clearRect(pos.x - 10, pos.y - 10, 20, 20); // Borrar un área pequeña
                    break;
            }
        }
    });

    canvas.addEventListener("mouseup", function(e) {
        if (currentTool === "line" && drawing) {
            const pos = getMousePos(e);
            ctx.beginPath();
            ctx.moveTo(lineStartX, lineStartY);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            saveCanvasState();
        }
        drawing = false;
        ctx.closePath();
    });

    canvas.addEventListener("mouseleave", function() {
        drawing = false;
    });
};
