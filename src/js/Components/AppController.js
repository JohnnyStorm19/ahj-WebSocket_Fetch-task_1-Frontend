import ChatAPI from './ChatAPI';
import ChatApp from './ChatApp';
import AddModal from './modals/addModal';

export default class AppController {
    constructor(container) {
        this.container = container;
        this.apiUrl = 'http://localhost:7070';
        this.chatApi = new ChatAPI(this.apiUrl);
        this.chatApp;
    }

    addLoginWindow() {
        this.addModal();
    }

    addModal() {
        this.addModalEl = new AddModal(this.container, this.apiUrl);
        
        this.closeAllModals();
        this.addModalEl.init();

        this.addModalEl.addOnLoginListener(this.onLogin.bind(this));
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');

        if (!modals.length) return;
        
        [...modals].forEach(modal => modal.remove());
    }

    async onLogin(login) {
        const response = await this.chatApi.add(login);

        if (response.error) {
            const container = document.querySelector('.modal');
            const errorEl = container.querySelector('.error');
            errorEl.textContent = response.error;
            errorEl.classList.add('error-active');
            return;
        }
        
        this.chatApp = new ChatApp(this.container, login, response);
        this.closeAllModals();
        this.chatApp.init();
    }
}