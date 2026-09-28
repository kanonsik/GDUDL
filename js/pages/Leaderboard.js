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
                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ entry.total }}</h3>
                        
                        <!-- Блок Hardest Level (Один самый сложный) -->
                        <template v-if="hardestLevel">
                            <h2>Hardest Level</h2>
                            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1.5rem;">
                                <p style="margin: 0; font-weight: bold; color: #555;">#{{ hardestLevel.rank }}</p>
                                <a class="type-label-lg" target="_blank" :href="hardestLevel.link">{{ hardestLevel.level }}</a>
                            </div>
                        </template>

                        <!-- Горизонтальный блок First Victor без баллов -->
                        <div v-if="entry.verified.length > 0" style="margin-bottom: 1.5rem;">
                            <h2>First Victor ({{ entry.verified.length}})</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; align-items: center;">
                                <div v-for="(score, idx) in entry.verified" :key="'v-'+idx" style="display: flex; gap: 0.4rem; align-items: center;">
                                    <p style="margin: 0; font-weight: bold; color: #777;">#{{ score.rank }}</p>
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                    <!-- Разделитель между уровнями -->
                                    <span v-if="idx < entry.verified.length - 1" style="color: #ccc; margin-left: 0.6rem;">•</span>
                                </div>
                            </div>
                        </div>

                        <!-- Горизонтальный блок Completed без баллов -->
                        <div v-if="entry.completed.length > 0" style="margin-bottom: 1.5rem;">
                            <h2>Completed ({{ entry.completed.length }})</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; align-items: center;">
                                <div v-for="(score, idx) in entry.completed" :key="'c-'+idx" style="display: flex; gap: 0.4rem; align-items: center;">
                                    <p style="margin: 0; font-weight: bold; color: #777;">#{{ score.rank }}</p>
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                    <!-- Разделитель между уровнями -->
                                    <span v-if="idx < entry.completed.length - 1" style="color: #ccc; margin-left: 0.6rem;">•</span>
                                </div>
                            </div>
                        </div>

                        <!-- Горизонтальный блок Progressed без баллов -->
                        <div v-if="entry.progressed.length > 0" style="margin-bottom: 1.5rem;">
                            <h2>Progressed ({{entry.progressed.length}})</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; align-items: center;">
                                <div v-for="(score, idx) in entry.progressed" :key="'p-'+idx" style="display: flex; gap: 0.4rem; align-items: center;">
                                    <p style="margin: 0; font-weight: bold; color: #777;">#{{ score.rank }}</p>
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.percent }}% {{ score.level }}</a>
                                    <!-- Разделитель между уровнями -->
                                    <span v-if="idx < entry.progressed.length - 1" style="color: #ccc; margin-left: 0.6rem;">•</span>
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

            return allPassed.reduce((minLevel, currentLevel) => {
                return (Number(currentLevel.rank) < Number(minLevel.rank)) ? currentLevel : minLevel;
            }, allPassed[0]);
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
