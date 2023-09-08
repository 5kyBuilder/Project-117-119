var gameIsOver = false;
var skipe = false;

var gameStart = false;

var counter = 0;
var score = 0;

var sketches = ["ladder", "cactus", "compass", "parachute", "popsicle"]

var sketch = "";

localStorage.setItem("high_score", 1000)

function preload()
{
    classifier = ml5.imageClassifier("DoodleNet");
    random = Math.floor(Math.random() * (sketches.length - 1));

    sketch = sketches[random];

    document.getElementById("sketch").innerHTML = "Sketch To Be Drawn: " + sketch;

    console.log(sketch);
}

function setup()
{
    canvas = createCanvas(500, 280);
    canvas.center();
    background("white");
    canvas.mouseReleased(classifyCanvas);

    synth = window.speechSynthesis;
}

function canvas_clear()
{
    background("white");
}

function classifyCanvas()
{
    if(gameStart){
        classifier.classify(canvas, gotResult);
    }
}

function gotResult(err, results)
{
    if(err)
    {
        console.error(err)
    }else{
        console.log(results);

        document.getElementById("object").innerHTML = "Guess: " + results[0].label;
        document.getElementById("accuracy").innerHTML = "Accuracy: " + Math.round(results[0].confidence * 100) + "%";

        if(results[0].label == sketch){
            gameIsOver = true;
        }

        utterThis = new SpeechSynthesisUtterance(results[0].label);
        synth.speak(utterThis);
    }
}

function skip()
{
    if(!gameStart){
        found = false

        counter = 0;
    
        do{
        random = Math.floor(Math.random() * (sketches.length - 1));

        if(sketches[random] == sketch){
            found = false
        }else{    
            found = true
        }

        }while(!found)

        sketch = sketches[random];

        document.getElementById("sketch").innerHTML = "Sketch To Be Drawn: " + sketch;

        console.log(sketch);
    }else{
        gameIsOver = true;
        skipe = true;
    }
    
}

function start_game()
{
    gameStart = true;
}

function draw()
{
    if(gameStart){
        if(!gameIsOver){
            document.getElementById("timer").innerHTML = "Time: " + (counter/70).toFixed(2);
            counter++;
        }else{
            
            console.log(counter);
    
            if(!skipe){
                utterThis = new SpeechSynthesisUtterance("Congratulations!, You guessed it right!");
                synth.speak(utterThis);
    
                score += 10;

                console.log((counter/70).toFixed(2));

                if(localStorage.getItem("high_score") > Math.round((counter/70).toFixed(2)))
                {
                    localStorage.setItem("high_score", (counter/70).toFixed(2));
                    console.log(localStorage.getItem("high_score"));
                    document.getElementById("high_score").innerHTML = "Lowest Time: " + localStorage.getItem("high_score");
                }
                counter = 0;
            }else{
                skipe = false;
    
                score -= 3;
    
                if(score <= 0)
                {
                    score = 0;
                }
            }
    
            document.getElementById("score").innerHTML = "Score: " + score;
    
            background("white")
    
            gameIsOver = false;
            gameStart = false;
        }
    
        stroke("purple");
    
        strokeWeight(13);
    
        if(mouseIsPressed)
        {
            line(pmouseX, pmouseY, mouseX, mouseY);
        }
    }
}