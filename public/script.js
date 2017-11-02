$(function(){
    var evaluateAnswer = 0;
    
    //Para crear el ejercicio...
    var generateEquation = function() {
        var $comparison = +$("#comparison").val();
        var $boolean = +$("#boolean").val();
        var $amount = +$("#amount").val();
        var answer = $("#answer");
        var equation = {
            print : {
                operators : {
                    comparison : [">", ">=", "<", "<=", "==", "!="], 
                    boolean : ["AND", "OR"]
                }, 
                text : ""
            },
            evaluate : {
                operators : {
                    comparison : [">", ">=", "<", "<=", "===", "!=="], 
                    boolean : ["&&", "||"]
                }, 
                text : ""
            }
        };
        var valueNumbers = [];
        var process = true;
        if(!$comparison && !$boolean) {
            swal({
                title: "Error",
                text: "Debes escoger al menos un tipo de operador", 
                type : "error"
            });
            process = false;
        }

        if(process) {
            var parenthesis = {
                open : false, 
                close : false
            };
            var typeOperators = ["comparison", "boolean"];
            var txtInstruction = "";
            for(var i = 1; i <= $amount; i++) {
                //Se obtienen valores de 1 hasta 100..
                var numberValue = Math.floor((Math.random() * 100) + 1) * (Math.floor((Math.random() * 2)) ? -1 : 1);
                //Guarda los valores para representarlos en letras...
                valueNumbers.push(numberValue);
                if(!parenthesis.open) {
                    var haveNot = $boolean ? Math.floor((Math.random() * 2)) : 0;
                    var haveParenthesis = Math.floor((Math.random() * 2));
                    if(haveNot || haveParenthesis) {
                        equation.evaluate.text += (haveNot ? "!" : "") + "(";
                        equation.print.text += (haveNot ? "<em style='color: #e91e63;'>NOT</em>" : "") + "<span style='color:blue;'>(</span>";
                        parenthesis.open = true;
                        parenthesis.close = false;
                    }
                } else {
                    parenthesis.close = Math.floor((Math.random() * 2));
                }
                //Si ha arrojado que el operador es NOT...
                equation.evaluate.text += numberValue;
                equation.print.text += String.fromCharCode(64 + i);
                txtInstruction += "<li><b>"+(String.fromCharCode(64 + i))+"</b> = "+(numberValue)+"</li>"
                if(parenthesis.open && parenthesis.close) {
                    equation.evaluate.text += ")";
                    equation.print.text += "<span style='color:blue;'>)</span>";
                    parenthesis.open = false;
                }
                if(i < $amount) {
                    var operator = $comparison && $boolean ? 
                                   Math.floor((Math.random() * 2)) : $comparison ? 0 : 1;
                    var operators = equation.evaluate.operators[typeOperators[operator]];
                    var printOperators = equation.print.operators[typeOperators[operator]];
                    var valOperator = Math.floor((Math.random() * operators.length));
                    equation.evaluate.text += " " + operators[valOperator] + " ";
                    equation.print.text += " <em style='color:"+(operator ? "#e91e63" : "#009688")+"'>" + printOperators[valOperator] + "</em> ";
                } else {
                    if(parenthesis.open && !parenthesis.close) {
                        equation.evaluate.text += ")";
                        equation.print.text += "<span style='color:blue;'>)</span>";
                    }
                }
            } 

            //Para evaluar la ecuación y obtener la respuesta...
            evaluateAnswer = eval(equation.evaluate.text);
            answer.append($("<option />").val("selected").text("Respuesta"));
            if(!(typeof(evaluateAnswer) === "boolean")){
                for(var i = 0; i < valueNumbers.length; i++) {
                    answer.append($("<option />").val(valueNumbers[i]).text(
                        String.fromCharCode(i + 65) + " = " + valueNumbers[i]
                    ));
                }
            } else {
                answer
                .append($("<option />").val("false").text("FALSE"))
                .append($("<option />").val("true").text("TRUE"));
            }            
            txtInstruction = "<h4>Dado que: </h4> <ul>" + txtInstruction + "</ul><b>¿Cuál sería la respuesta?</b>";
            $("#instruction").html(txtInstruction);
            $("#equation").html(equation.print.text);

            console.clear();
            console.log("Respuesta 😋");
            console.log("%c " + equation.evaluate.text + " = " + evaluateAnswer, 'background: red; color: white');
        }
    };

    $("#answer").change(function(e) {
        if($(this).val() !== "selected") {
            var answerSelected = $(this).val();
            var checkAnswer = false;
            if((typeof(evaluateAnswer) === "boolean")){
                checkAnswer = JSON.parse(answerSelected) === evaluateAnswer;
            } else {
                checkAnswer = +answerSelected === evaluateAnswer;
            }
            swal({
                title: checkAnswer ? "CORRECTO" : "INCORRECTO",
                text: checkAnswer ? "Respuesta correcta :)" : "Tu resuesta es incorrecta :(", 
                type : checkAnswer ? "success" : "error"
            });
        }
    });

    $("#generate").click(function(e){
        $("#answer")
        .attr("disabled", false)
        .empty();
        generateEquation();
    });
});