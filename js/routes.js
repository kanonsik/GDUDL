import List from './pages/List.js';
import Future from './pages/Future.js'; // Добавили импорт страницы будущего топа
import Leaderboard from './pages/Leaderboard.js';
import Roulette from './pages/Roulette.js';

export default [
    { path: '/', component: List },
    { path: '/future', component: Future }, // Зарегистрировали новый путь в роутере
    { path: '/leaderboard', component: Leaderboard },
    { path: '/roulette', component: Roulette },
];
