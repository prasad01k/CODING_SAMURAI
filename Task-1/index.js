const display = document.getElementById('display')

function appendtodisplay(input){    
    display.value += input;
}

function calc(){
    try{
        display.value = eval(display.value);
    }
    catch(error){
        display.value = "Error";
    }
}

function del(){
    display.value = display.value.slice(0, -1);
}

function clears(){
    display.value = "";
}