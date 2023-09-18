import '../../../css/addModal.css';
import ChatAPI from '../ChatAPI';


export default class AddModal {
    constructor(parentEl, url) {
        this.parentEl = parentEl;
        this.chatApi = new ChatAPI(url);

        this.onLoginCallback = [];
    }
    static getAddModalMarkup() {
        return `
            <div class="modal modal-add">
                <form class="modal-add-form">
                    <h3 class="modal-title">Войти в чат</h3>
                    <div class="inputs-wrapper">
                        <label class="input-name">Ваш никнейм
                            <input class="nickname-input" type="text" required></input>
                        </label>
                    </div>
                    <div class="buttons-wrapper">
                        <button type="button" class="close-modal-btn">Отмена</button>
                        <button type="submit" class="ok-modal-btn">Ок</button>
                    </div>
                    <span class="error"></span>
                </form>
            </div>
        `
    }

    init() {
        const markup = AddModal.getAddModalMarkup();
        this.parentEl.insertAdjacentHTML('beforeend', markup);
        this.addListeners();
    }

    addListeners() {
        const modalContainer = this.parentEl.querySelector('.modal-add');
        const form = modalContainer.querySelector('.modal-add-form');
        const nicknameInputEl = form.querySelector('.nickname-input');
        
        const closeBtn = modalContainer.querySelector('.close-modal-btn');

        closeBtn.addEventListener('click', () => this.closeModal(modalContainer)); 
        form.addEventListener('submit', (e) => this.onSubmit(e, nicknameInputEl));
        nicknameInputEl.addEventListener('input', () => this.removeError(modalContainer));
    }

    closeModal(container) {
        container.remove();
    }
    removeError(container) {
        const errorEl = container.querySelector('.error-active');
        if (errorEl) {
            errorEl.classList.remove('error-active');
        }
    }

    addOnLoginListener(callback) {
        this.onLoginCallback.push(callback);
    }

    onSubmit(event, inputEl) {
        event.preventDefault();
        const login = inputEl.value;

        this.onLoginCallback.forEach(callback => callback.call(null, login));
    }
}