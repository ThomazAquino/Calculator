class CalcController {

    constructor() {
        //using _ to refer private
        this._getLastOperation = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._currentDate;
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._audioOnOff = false; // default audio is off
        this._audio = new Audio('click.mp3'); // Class of Web API, is not native on js
        
        this.initButtonEvents();
        this.initKeyboard();
        this.initialize();
    }


    initialize() {

        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipBoard()

        document.querySelectorAll('.btn-ac').forEach(btn => { //there is 2 svg with this class the button and the text
            
            btn.addEventListener('dblclick', e => { //listenner the doble click in this buttons
                
                this.toggleAudio();
            });
        });
    }

    toggleAudio() { // just reverse the variable to turn on and off

        if (this._audioOnOff) {
            this._audioOnOff = false;
        } else {
            this._audioOnOff = true;
        }
    }

    playAudio() {

        if (this._audioOnOff) {
            this._audio.currentTime = 0; // set the time to 0, for in case of faster clics, need to restar audio and play again
            this._audio.play();
        }
    }

    copyToClipboard() { // I need make this method because the calculator uses SVG instead inputs

        let input = document.createElement('input'); // create a input

        input.value = this.displayCalc; // Set the actual value to the input

        document.body.appendChild(input); // apendchield insert into the body

        input.select(); // select the value of input

        document.execCommand("Copy"); //copy the value of input to operationmal system

        input.remove(); // remove the iinput of the screen after copy the content
    }

    pasteFromClipBoard() {

        document.addEventListener('paste', e => { // native event named pasted
          
            let text = e.clipboardData.getData('Text'); // obtain the data

            if (isNaN(text)) { // check if the value of clipboard is a number
                return;
            } else {
                this.displayCalc = parseFloat(text); // put the clipboard value into display
            }
        });
    }

    initKeyboard() {


        document.addEventListener('keyup', e => {
            this.playAudio();
        
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
                
                case 'c':
                    if (e.ctrlKey) { // If control was hold
                        this.copyToClipboard();
                    }
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
        try {
            return eval(this._operation.join("")); // join the array in a string witchout coma, then eval
        } catch (e) {
            setTimeout(() => { // because if array is empty display calc will be 0
                this.setError();
            }, 1);
        }
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
    }

    execBtn(value) {

        this.playAudio();

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

        if (value.toString().length > 10 ) { // limits the calc to 10 catacters
            this.setError();
            return;
        }
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