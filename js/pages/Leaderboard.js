import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                <div class="board-container">
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">
                                    <span class="type-label-lg">{{ ientry.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container">
                    <div class="player">
                        <h1 style="text-align: left;">#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3 style="text-align: left; margin-bottom: 2.5rem;">{{ entry.total }}</h3>
                        
                        <!-- Блок Hardest Level (Исправлен, отображается слева) -->
                        <template v-if="hardestLevel">
                            <h2 style="text-align: left; margin-bottom: 0.8rem;">Hardest Level</h2>
                            <div style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: 3rem;">
                                <a class="type-label-lg" target="_blank" :href="hardestLevel.link">{{ hardestLevel.level }}</a>
                            </div>
                        </template>

                        <!-- Горизонтальный блок First Victor (По центру, без номеров позиций, точки черные) -->
                        <div v-if="entry.verified.length > 0" style="margin-bottom: 3rem;">
                            <h2 style="text-align: center; margin-bottom: 1.2rem;">First Victor ({{ entry.verified.length}})</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.6rem 1rem; justify-content: center; align-items: center; padding: 0 1rem;">
                                <div v-for="(score, idx) in entry.verified" :key="'v-'+idx" style="display: flex; gap: 0.4rem; align-items: center;">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                    <span v-if="idx < entry.verified.length - 1" style="color: #000; margin-left: 0.6rem; font-weight: bold;">•</span>
                                </div>
                            </div>
                        </div>

                        <!-- Горизонтальный блок Completed (По центру, без номеров позиций, точки черные) -->
                        <div v-if="entry.completed.length > 0" style="margin-bottom: 3rem;">
                            <h2 style="text-align: center; margin-bottom: 1.2rem;">Completed ({{ entry.completed.length }})</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.6rem 1rem; justify-content: center; align-items: center; padding: 0 1rem;">
                                <div v-for="(score, idx) in entry.completed" :key="'c-'+idx" style="display: flex; gap: 0.4rem; align-items: center;">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                    <span v-if="idx < entry.completed.length - 1" style="color: #000; margin-left: 0.6rem; font-weight: bold;">•</span>
                                </div>
                            </div>
                        </div>

                        <!-- Горизонтальный блок Progressed (По центру, без номеров позиций, точки черные) -->
                        <div v-if="entry.progressed.length > 0" style="margin-bottom: 3rem;">
                            <h2 style="text-align: center; margin-bottom: 1.2rem;">Progressed ({{entry.progressed.length}})</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.6rem 1rem; justify-content: center; align-items: center; padding: 0 1rem;">
                                <div v-for="(score, idx) in entry.progressed" :key="'p-'+idx" style="display: flex; gap: 0.4rem; align-items: center;">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.percent }}% {{ score.level }}</a>
                                    <span v-if="idx < entry.progressed.length - 1" style="color: #000; margin-left: 0.6rem; font-weight: bold;">•</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
        hardestLevel() {
            if (!this.entry) return null;

            const allPassed = [
                ...(this.entry.verified || []),
                ...(this.entry.completed || [])
            ];

            if (allPassed.length === 0) return null;

            // Надежный поиск объекта с минимальным значением поля rank
            let minLevel = allPassed[0];
            for (let i = 1; i < allPassed.length; i++) {
                if (Number(allPassed[i].rank) < Number(minLevel.rank)) {
                    minLevel = allPassed[i];
                }
            }
            return minLevel;
        }
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = leaderboard;
        this.err = err;
        this.loading = false;
    },
    methods: {
        localize,
    },
};
