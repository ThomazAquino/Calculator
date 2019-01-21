class CalcController {

    constructor() {

        this._getLastOperation = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        //usando _ para referenciar private, pois um objeto nao deveria chamar um atributo privado
        this.initButtonEvents();
        this._currentDate;
        this.initKeyboard();
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

        this.setLastNumberToDisplay();
    }

    initKeyboard() {

        document.addEventListener('keyup', e => {
            console.log(e.key);  
        

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
                
                case 'Backspace':
                    this.clearEntry();
                    break;
                
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                
                case '.':
                case ',':
                this.addDot();
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
                    this.addOperation(parseInt(e.key));
                    break;
            }
        });
    }

    addEventListenerAll(element, events, fn) { // Make this to dont need pass multiple eventlisteners 
        events.split(' ').forEach(event => { // separate multiple events
            element.addEventListener(event, fn, false);
        })
    }

    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop(); // remove the last element of an array
        this.setLastNumberToDisplay();
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

    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {
            
            this.calc();
            
        }
    }

    getResult() {
        return eval(this._operation.join("")); // join the array in a string witchout coma, then eval
    }

    calc() {

        let last = '';

        this._lastOperator = this.getLastItem(); // false to get a operator

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) { // four itens in array Ex: 2 + 3 +
            
            last = this._operation.pop(); // remove last elemnt and keep on variable
            this._lastNumber = this.getResult();
            
        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);
            
            
        }
        console.log('_lastOperator', this._lastOperator);
        console.log('_lastNumber', this._lastNumber);

        let result = this.getResult(); 

        if (last == '%') {
            
            result = result / 100;

            this._operation = [result];

        } else {

            this._operation = [result];

            if (last) {
                this._operation.push(last);
            }
        }

        

        this.setLastNumberToDisplay();
        console.log(this._operation);
    }

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            } 
        }

        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        

        if (!lastNumber) { // if array is empty
            lastNumber = 0;
        }

        this.displayCalc = lastNumber;

    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) { // if last item is a signal

            if (this.isOperator(value)) { //if actual item is a operator
                
                this.setLastOperation(value); // change the last operator for the new operator

            }  else {
                this.pushOperation(value); //First thing in array
                this.setLastNumberToDisplay();
            }
        } else { // if last operation in array is a number

            if (this.isOperator(value)) { // if this new value is a operator

                this.pushOperation(value); // create a new item in array

            } else {

                let newValue = this.getLastOperation().toString() + value.toString(); // concat all values
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }

        }
        
        console.log(this._operation);
    }

    setError() {
        this.displayCalc = "ERROR!";
    }

    addDot () {
        
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) { // split last operation in array and search for '.'
            return; // scape of this method
        }

        if (this.isOperator(lastOperation) || !lastOperation) {

            this.pushOperation('0.');
        } else {

            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

        console.log("Ponto", lastOperation);
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
                this.calc();
                break;
            
            case 'ponto':
            this.addDot();
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