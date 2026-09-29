import { store } from "../main.js";
import { embed } from "../util.js";
import { fetchUpcomingList } from "../content.js";

import Spinner from "../components/Spinner.js";

export default {
    components: { Spinner },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list && list.length > 0">
                    <tr v-for="(level, i) in list" :key="i">
                        <td class="rank">
                            <p class="type-label-lg">?</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level.name }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
                <div v-else style="padding: 2rem; text-align: center;">
                    <p class="type-label-lg">No upcoming levels documented.</p>
                </div>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    
                    <div style="display: flex; gap: 2rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                        <div v-if="level.author">
                            <div class="type-title-sm" style="text-transform: uppercase; font-size: 0.75rem; color: #555; font-weight: 600;">Publisher</div>
                            <p class="type-label-lg" style="margin: 0.2rem 0 0 0;">{{ level.author }}</p>
                        </div>
                        <div v-if="level.verifier">
                            <div class="type-title-sm" style="text-transform: uppercase; font-size: 0.75rem; color: #555; font-weight: 600;">First Victor</div>
                            <p class="type-label-lg" style="margin: 0.2rem 0 0 0;">{{ level.verifier }}</p>
                        </div>
                        <div v-if="level.creators && level.creators.length > 0">
                            <div class="type-title-sm" style="text-transform: uppercase; font-size: 0.75rem; color: #555; font-weight: 600;">Creators</div>
                            <p class="type-label-lg" style="margin: 0.2rem 0 0 0;">{{ level.creators.join(', ') }}</p>
                        </div>
                    </div>
                    
                    <iframe v-if="video" class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id || 'N/A' }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || 'Free to Copy' }}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="og">
                        <p class="type-label-md">Website made by <a href="https://youtube.com" target="_blank">kanonsik</a></p>
                    </div>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        loading: true,
        selected: 0,
        store
    }),
    computed: {
        // Ошибка исправлена: синтаксис приведен к стабильному оригинальному стандарту
        level() {
            return this.list[this.selected] || null;
        },
        video() {
            return (this.level && this.level.verification && this.level.verification !== '-') ? embed(this.level.verification) : null;
        }
    },
    async mounted() {
        const [list] = await fetchUpcomingList();
        if (list) {
            this.list = list;
        }
        this.loading = false;
    }
};
