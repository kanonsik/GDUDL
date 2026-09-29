import routes from './routes.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },
    // Добавили управление состоянием выпадающего меню Lists
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
        // Закрывать меню при клике в любое другое место экрана
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

// Автоматически закрывать выпадающее меню при переходе на любую страницу
router.afterEach(() => {
    store.closeMenu();
});

app.use(router);

app.mount('#app');
