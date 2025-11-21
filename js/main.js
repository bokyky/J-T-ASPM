document.addEventListener('DOMContentLoaded', () => {

    const pixelBot = document.getElementById("pixel-bot");
    const juegoContenedor = document.getElementById("juego-contenedor");
    const mensajeJuego = document.getElementById("mensaje-juego");
    const puntuacionDisplay = document.getElementById("puntuacion");
    const suelo = document.getElementById("suelo");
    const nivelDisplay = document.getElementById("nivel");
    const nicknameDisplay = document.getElementById("nickname");

    let isJumping = false;
    let botBottom = 30;
    let score = 0;
    let gameOver = true;
    let obstacleInterval = null;

    const gameWidth = 900;

    let level = 1;
    let obstacleSpawnTime = 2000;

    const fondos = ['fondo1', 'fondo2', 'fondo3', 'fondo4'];

    // Pide NICKNAME
    const nickname = prompt("Ingresa tu nickname:");
    if (nicknameDisplay && nickname) {
        nicknameDisplay.textContent = "Jugador: " + nickname;
    }

    function jump() {
        if (isJumping || gameOver) return;
        isJumping = true;
        let jumpHeight = 150;
        let jumpSpeed = 10;
        let currentJumpHeight = 0;

        const upTimerId = setInterval(() => {
            if (currentJumpHeight >= jumpHeight) {
                clearInterval(upTimerId);

                const downTimerId = setInterval(() => {
                    if (botBottom <= 30) {
                        clearInterval(downTimerId);
                        botBottom = 30;
                        pixelBot.style.bottom = botBottom + 'px';
                        isJumping = false;
                    }
                    botBottom -= jumpSpeed;
                    pixelBot.style.bottom = botBottom + 'px';
                }, 20);
            }

            botBottom += jumpSpeed;
            currentJumpHeight += jumpSpeed;
            pixelBot.style.bottom = botBottom + 'px';
        }, 20);
    }

    function actualizarNivelYVelocidad() {

        const nuevoNivel = Math.floor(score / 5) + 1;

        if (nuevoNivel !== level) {
            level = nuevoNivel;

            obstacleSpawnTime = Math.max(700, 2000 - (level - 1) * 200);

            nivelDisplay.textContent = 'Nivel: ' + level;

            const indexFondo = (level - 1) % fondos.length;
            juegoContenedor.classList.remove(...fondos);
            juegoContenedor.classList.add(fondos[indexFondo]);

            if (!gameOver) {
                clearInterval(obstacleInterval);
                obstacleInterval = setInterval(generarObstaculo, obstacleSpawnTime);
            }
        }
    }

    function generarObstaculo() {
        if (gameOver) return;

        let obstaclePosition = gameWidth;
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstaculo');
        juegoContenedor.appendChild(obstacle);

        let obstacleSpeed = 10 + (level - 1) * 2;

        const moverObstaculo = setInterval(() => {

            if (obstaclePosition < -30) {
                clearInterval(moverObstaculo);
                obstacle.remove();

                score++;
                puntuacionDisplay.textContent = 'Puntuación: ' + score;

                actualizarNivelYVelocidad();
            }

            if (
                obstaclePosition > 50 &&
                obstaclePosition < 100 &&
                botBottom < 80
            ) {
                clearInterval(moverObstaculo);
                clearInterval(obstacleInterval);
                gameOver = true;

                mensajeJuego.textContent =
                    'GAME OVER, ' + (nickname || 'Jugador') +
                    '! Puntuación final: ' + score +
                    '\nPresiona ESPACIO para reiniciar';

                mensajeJuego.style.display = 'block';
                suelo.style.animationPlayState = 'pause';
            }

            obstaclePosition -= obstacleSpeed;
            obstacle.style.left = obstaclePosition + 'px';

        }, 20);
    }

    function iniciarJuego() {

        document.querySelectorAll('.obstaculo').forEach(obs => obs.remove());

        score = 0;
        level = 1;
        obstacleSpawnTime = 2000;
        botBottom = 30;

        puntuacionDisplay.textContent = 'Puntuación: 0';
        nivelDisplay.textContent = 'Nivel: 1';
        pixelBot.style.bottom = botBottom + 'px';

        juegoContenedor.classList.remove(...fondos);
        juegoContenedor.classList.add(fondos[0]);

        mensajeJuego.style.display = 'none';
        suelo.style.animationPlayState = 'running';

        gameOver = false;

        clearInterval(obstacleInterval);
        obstacleInterval = setInterval(generarObstaculo, obstacleSpawnTime);
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (gameOver) iniciarJuego();
            else jump();
        }
    });

    mensajeJuego.textContent =
        'Presiona ESPACIO para comenzar, ' + (nickname || 'Jugador');
    suelo.style.animationPlayState = 'pause';

});
