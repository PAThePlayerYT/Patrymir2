document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startGameBtn = document.getElementById('startGameBtn');
    const scoreDisplay = document.getElementById('score');

    const gridSize = 20; // Rozmiar pojedynczego segmentu węża/jedzenia
    const tileCount = canvas.width / gridSize; // Ilość kafelków w rzędzie/kolumnie

    let snake = [
        { x: 10, y: 10 } // Początkowa pozycja głowy węża
    ];
    let food = {};
    let dx = 0; // Kierunek ruchu X (prawo: 1, lewo: -1, brak: 0)
    let dy = 0; // Kierunek ruchu Y (góra: -1, dół: 1, brak: 0)
    let score = 0;
    let gameInterval;
    let gameSpeed = 150; // Szybkość gry w milisekundach (mniejsza wartość = szybciej)
    let isGameOver = true;

    /**
     * Rysuje pojedynczy segment na canvasie.
     * @param {number} x - Pozycja X segmentu.
     * @param {number} y - Pozycja Y segmentu.
     * @param {string} color - Kolor segmentu.
     */
    function drawSegment(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
        ctx.strokeStyle = 'black'; // Dodanie obramowania dla lepszej widoczności
        ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
    }

    /**
     * Generuje losową pozycję dla jedzenia, upewniając się, że nie koliduje z wężem.
     */
    function generateFood() {
        let newFoodX, newFoodY;
        let collisionWithSnake;
        do {
            newFoodX = Math.floor(Math.random() * tileCount);
            newFoodY = Math.floor(Math.random() * tileCount);
            collisionWithSnake = snake.some(segment => segment.x === newFoodX && segment.y === newFoodY);
        } while (collisionWithSnake);

        food = { x: newFoodX, y: newFoodY };
    }

    /**
     * Rysuje węża na canvasie.
     */
    function drawSnake() {
        snake.forEach((segment, index) => {
            drawSegment(segment.x, segment.y, index === 0 ? 'green' : 'lime'); // Głowa zielona, reszta jasnozielona
        });
    }

    /**
     * Rysuje jedzenie na canvasie.
     */
    function drawFood() {
        drawSegment(food.x, food.y, 'red');
    }

    /**
     * Czyści cały canvas.
     */
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * Aktualizuje stan gry (ruch węża, kolizje, jedzenie).
     */
    function updateGame() {
        if (isGameOver) return;

        clearCanvas();
        drawFood();

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Sprawdzenie kolizji ze ścianami
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            endGame();
            return;
        }

        // Sprawdzenie kolizji z własnym ciałem
        if (snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }

        snake.unshift(head); // Dodaj nową głowę na początek węża

        // Sprawdzenie, czy wąż zjadł jedzenie
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreDisplay.textContent = score;
            generateFood(); // Generuj nowe jedzenie
            // Opcjonalnie: zwiększ szybkość gry
            if (gameSpeed > 50) {
                gameSpeed -= 5; // Zwiększ szybkość o 5ms
                clearInterval(gameInterval);
                gameInterval = setInterval(updateGame, gameSpeed);
            }
        } else {
            snake.pop(); // Usuń ostatni segment, jeśli jedzenie nie zostało zjedzone
        }

        drawSnake();
    }

    /**
     * Kończy grę i wyświetla komunikat.
     */
    function endGame() {
        isGameOver = true;
        clearInterval(gameInterval);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Koniec Gry! Wynik: ' + score, canvas.width / 2, canvas.height / 2);
        startGameBtn.textContent = 'Zagraj Ponownie';
        startGameBtn.disabled = false;
    }

    /**
     * Inicjalizuje nową grę.
     */
    function initializeGame() {
        snake = [
            { x: 10, y: 10 }
        ];
        dx = 0;
        dy = 0;
        score = 0;
        scoreDisplay.textContent = score;
        gameSpeed = 150;
        isGameOver = false;
        generateFood();
        clearCanvas();
        drawSnake();
        drawFood();

        if (gameInterval) {
            clearInterval(gameInterval);
        }
        gameInterval = setInterval(updateGame, gameSpeed);
        startGameBtn.textContent = 'Restart Gry';
        startGameBtn.disabled = true;
    }

    /**
     * Obsługuje naciśnięcia klawiszy do sterowania wężem.
     * @param {KeyboardEvent} event - Obiekt zdarzenia klawiatury.
     */
    function handleKeyPress(event) {
        // Zapobiegaj ruchowi w przeciwnym kierunku
        const keyPressed = event.key;
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingLeft = dx === -1;
        const goingRight = dx === 1;

        if (keyPressed === 'ArrowLeft' && !goingRight) {
            dx = -1;
            dy = 0;
        }
        if (keyPressed === 'ArrowUp' && !goingDown) {
            dx = 0;
            dy = -1;
        }
        if (keyPressed === 'ArrowRight' && !goingLeft) {
            dx = 1;
            dy = 0;
        }
        if (keyPressed === 'ArrowDown' && !goingUp) {
            dx = 0;
            dy = 1;
        }
    }

    // Nasłuchiwanie zdarzeń
    startGameBtn.addEventListener('click', initializeGame);
    document.addEventListener('keydown', handleKeyPress);

    // Pierwsze rysowanie po załadowaniu strony
    clearCanvas();
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Naciśnij "Start Gry" aby rozpocząć', canvas.width / 2, canvas.height / 2);
});
