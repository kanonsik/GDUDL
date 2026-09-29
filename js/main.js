// Прямой импорт зависимостей внутрь модуля (Бронебойный фикс ошибки Vue is not defined)
import 'https://cloudflare.com';
import 'https://cloudflare.com';
import routes from './routes.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },
    menuOpen: false,
    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
        this.menuOpen = false;
    }
});

const app = Vue.createApp({
    data: () => ({ store }),
    mounted() {
        document.addEventListener('click', (e) => {
            const dropdown = document.querySelector('.nav__dropdown-container');
            if (dropdown && !dropdown.contains(e.target)) {
                this.store.closeMenu();
            }
        });
    }
});

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

router.afterEach(() => {
    store.closeMenu();
});

app.use(router);
app.mount('#app');
