class CalcController {

    constructor() {
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        //usando _ para referenciar private, pois um objeto nao deveria chamar um atributo privado
        this.initButtonEvents();
        this._currentDate;
        this.initialize();
    }

    initialize() {
        //this._displayCalcEl.innerHTML = "test";
        //this._dateEl.innerHTML = "DATA";
        //this._timeEl.innerHTML = "HORA";

        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
    }

    addEventListenerAll(element, events, fn) { // Make this to dont need pass multiple eventlisteners 
        events.split(' ').forEach(event => { // separate multiple events
            element.addEventListener(event, fn, false);
        })
    }

    clearAll() {
        this._operation = [];
    }

    clearEntry() {
        this._operation.pop();
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1]; // last item of the array
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value; // change last operator
    }

    isOperator(value) {
        if (['+', '-', '*', '%', '/'].indexOf(value) > -1) {
            return true;
        } else {
            return false;
        }
    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) { // if last item is a signal

            if (this.isOperator(value)) { //if actual item is a operator
                
                this.setLastOperation(value); // change the last operator for the new operator

            } else if (isNaN(value)) {
                //outra coisa
                console.log(value);
            } else {
                this._operation.push(value); //First thing in array
            }
        } else { // if last operation in array is a number
            let newValue = this.getLastOperation().toString() + value.toString(); // concat all values
            this.setLastOperation(parseInt(newValue));
        }
        
        console.log(this._operation);
    }

    setError() {
        this.displayCalc = "ERROR!";
    }

    execBtn(value) {

        switch (value) {

            case 'ac':
                this.clearAll();
                break;
            
            case 'ce':
                this.clearEntry();
                break;
            
            case 'soma':
                this.addOperation('+');
                break;
            
            case 'subtracao':
                this.addOperation('-');
                break;
            
            case 'divisao':
                this.addOperation('/');
                break;
            
            case 'multiplicacao':
                this.addOperation('*');
                break;
            
            case 'porcento':
                this.addOperation('%');
                break;
            
            case 'igual':
                this.soma();
                break;
            
            case 'ponto':
            this.addOperation('.');
                break;
            
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            
            default:
                this.setError();
            
            
        }
    }

    initButtonEvents() {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g"); // Select buttons and text buttons

        buttons.forEach((btn, index) => { // forEach in all buttons

            this.addEventListenerAll(btn, 'click drag', e => { // EventListener in all buttons

                let textBtn = btn.className.baseVal.replace("btn-", ""); // bring the buttons class name without "btn-"
                //console.log(typeof(textBtn));
                this.execBtn(textBtn);
            });
        
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        });

    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {day: "2-digit", month: "long", year: "numeric"});
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    //displayTime
    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    //displayDate
    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    //displayCalc
    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }
    //currentDate
    get currentDate() {
        return new Date;
    }

    set currentDate(value) {
        this._currentDate = value;
    }
} 