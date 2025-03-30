// Основной файл игры
import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
const game = new Game();

document.getElementById('start-btn').addEventListener('click', () => {
    game.start();
    document.getElementById('start-screen').classList.add('hidden');
});

document.getElementById('restart-btn').addEventListener('click', () => {
    game.restart();
    document.getElementById('game-over').classList.add('hidden');
});
});
