var ball = document.getElementById('ball');
var rod1 = document.getElementById('topRod');
var rod2 = document.getElementById('bottomRod');

//Variables for storing
const storeName = "PPName";
const storeScore = "PPhighestScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";


let score,
    highestScore,
    motion,
    rod,
    ballSpeedX = 2,
    ballSpeedY = 2;

let gameOn = false;

let windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;


//Displaying alert with maximum score(At start)
(function () {
    rod = localStorage.getItem(storeName);
    highestScore = localStorage.getItem(storeScore);

    if (rod === "null" || highestScore === "null") {
        alert("This is the your first time. LET'S START");
        highestScore = 0;
        rod = "Rod1"
    } else {
        alert(rod + " has highest score of " + highestScore * 100);
    }

    resetBoard(rod);
})();


//Resetting the board to initial position
function resetBoard(rodName) {
    //placing elements at the centre
    rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + 'px';
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';


    // Lossing player gets the ball
    if (rodName === rod2Name) {
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + 'px';
        ballSpeedY = 2;
    } else if (rodName === rod1Name) {
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + 'px';
        ballSpeedY = -2;
    }

    score = 0;
    gameOn = false;

}


//Storing the highestScore and winner
function storeWin(rod, score) {

    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem(storeName, rod);
        localStorage.setItem(storeScore, highestScore);
    }

    clearInterval(motion);
    resetBoard(rod);

    alert(rod + " wins with a score of " + (score * 100) + ". Max score is: " + 
        (highestScore * 100));

}



window.addEventListener('keypress', function (event) {
    let rodSpeed = 20;

    let rodRect = rod1.getBoundingClientRect();

    //moving right
    if (event.code === "KeyD" && ((rodRect.x + rodRect.width) < window.innerWidth)) {
        rod1.style.left = (rodRect.x) + rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    } 
    //moving left
    else if (event.code === "KeyA" && (rodRect.x > 0)) {
        rod1.style.left = (rodRect.x) - rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    }

    //Starting the game when 'ENTER' key is pressed
    if (event.code === "Enter") {

        if (!gameOn) {
            gameOn = true;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;


            motion = setInterval(function () {
                // Move ball 
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                let rod1X = rod1.getBoundingClientRect().x;
                let rod2X = rod2.getBoundingClientRect().x;

                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';


                if ((ballX + ballDia) > windowWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX; // Reverses the direction
                }

                // It specifies the center of the ball on the viewport
                let ballPos = ballX + ballDia / 2;

                // Check for Rod 1
                if (ballY <= rod1Height) {
                    ballSpeedY = -ballSpeedY; // Reverses the direction
                    score++;

                    // Check if the game ends
                    if ((ballPos < rod1X) || (ballPos > (rod1X + rod1Width))) {
                        storeWin(rod2Name, score);
                    }
                }

                // Check for Rod 2
                else if ((ballY + ballDia) >= (windowHeight - rod2Height)) {
                    ballSpeedY = -ballSpeedY; // Reverses the direction
                    score++;

                    // Check if the game ends
                    if ((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))) {
                        storeWin(rod1Name, score);
                    }
                }

            }, 10);

        }
    }

});