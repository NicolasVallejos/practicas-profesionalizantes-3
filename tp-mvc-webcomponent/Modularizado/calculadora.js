class CalculatorComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Crear elementos y agregar al Shadow DOM
        const wrapper = document.createElement('div');
        
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', 'calculator.css');
        this.shadowRoot.appendChild(styleLink);
        
        const table = document.createElement('table');
        wrapper.appendChild(table);

        // Crear la fila de la pantalla
        const displayRow = document.createElement('tr');
        const displayCell = document.createElement('td');
        displayCell.setAttribute('colspan', '4');
        this.display = document.createElement('input');
        this.display.className = 'displayResult';
        this.display.id = 'display';
        this.display.type = 'text';
        this.display.value = '';
        this.display.disabled = true;
        displayCell.appendChild(this.display);
        displayRow.appendChild(displayCell);
        table.appendChild(displayRow);

        // Definición de botones
        const buttons = [
            ['7', '8', '9', '+'],
            ['4', '5', '6', '-'],
            ['3', '2', '1', 'x'],
            ['0', '.', '=', '/'],
        ];

        buttons.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                const button = document.createElement('button');
                button.textContent = value;
                button.className = this.getButtonClass(value);
                button.id = `button${value}`;
                button.addEventListener('click', () => this.onButtonClick(value));
                td.appendChild(button);
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        // Fila del botón de borrar
        const clearRow = document.createElement('tr');
        const clearCell = document.createElement('td');
        clearCell.setAttribute('colspan', '4');
        const clearButton = document.createElement('button');
        clearButton.textContent = 'BORRAR';
        clearButton.className = 'clearButton';
        clearButton.id = 'buttonClear';
        clearButton.addEventListener('click', () => this.clearDisplay());
        clearCell.appendChild(clearButton);
        clearRow.appendChild(clearCell);
        table.appendChild(clearRow);

        this.shadowRoot.appendChild(wrapper);
    }

    getButtonClass(value) {
        if (!isNaN(value) || value === '.') return 'numberButton';
        if (value === '=') return 'calculateButton';
        if (value === 'BORRAR') return 'clearButton';
        return 'operatorButton';
    }

    onButtonClick(value) {
        if (value === '=') {
            this.calculate();
        } else {
            this.appendToDisplay(value);
        }
    }

    appendToDisplay(value) {
        if (value === 'x') value = '*';
        this.display.value += value;
    }

    calculate() {
        try {
            this.display.value = eval(this.display.value);
        } catch {
            this.display.value = 'Error';
        }
    }

    clearDisplay() {
        this.display.value = '';
    }
}

customElements.define('calculator-component', CalculatorComponent);
