import '../../css/chatApp.css';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';
import Message from './Message';
import LoginAside from './LoginAside';

export default class ChatApp {
    constructor(parentEl, login, responseObj = {}) {
        this.parentEl = parentEl;
        this.login = login;
        this.responseObj = responseObj;
        this.ws = new WebSocket('ws://localhost:7070');
    }
    static getChatAppMarkup() {
        return `
            <div class="wrapper">
                <aside class="users-preview-container"></aside>
                <div class="chat-container">
                    <div class="messages-container"></div>
                    <form class="chat-form">
                        <input type="text" class="type-message" placeholder="Type your message here..." required/>
                        <button type="submit" class="send-btn">Отправить</button>
                    </form>
                    <span class="aside-menu-toggler"></span>
                </div>
            </div>
        `
    }

    init() {
        const markup = ChatApp.getChatAppMarkup();
        this.parentEl.insertAdjacentHTML('beforeend', markup);

        this.sendMessageBtn = document.querySelector('.send-btn');
        this.messagesContainer = document.querySelector('.messages-container');
        this.inputMessage = document.querySelector('.type-message');
        this.formMessage = document.querySelector('.chat-form');
        this.usersPreviewContainer = document.querySelector('.users-preview-container');
        this.asideMenuToggler = document.querySelector('.aside-menu-toggler');

        // отрисуем сообщения для тех, кто подключился не сразу
        if (this.responseObj.messages && this.responseObj.messages.length) {
            this.responseObj.messages.forEach(messageObj => {
                this.renderMessages(messageObj);
            })
        }
        this.addListeners();  
        this.addWebSocketListeners();
    }
    
    addListeners = () => {
        this.formMessage.addEventListener('submit', this.onSubmit);
        this.asideMenuToggler.addEventListener('click', this.toggleAsideMenu);
    } 

    renderMessages = (messageObj) => {
            let messageMarkup;
            let messageEl = new Message(messageObj);
            let scrollY = this.messagesContainer.scrollHeight;

            // if (this.login === messageObj.login) {
            //     messageMarkup = messageEl.getSendMessageMarkup();
            // } else {
            //     messageMarkup = messageEl.getRecievedMessageMarkup(messageObj.login);
            // }
            this.login === messageObj.login 
            ? messageMarkup = messageEl.getSendMessageMarkup()
            : messageMarkup = messageEl.getRecievedMessageMarkup(messageObj.login);

            this.messagesContainer.insertAdjacentHTML('beforeend', messageMarkup);
            this.messagesContainer.scrollTo(0, scrollY);
    }

    renderAsideLogin = (login, emodji) => {
        let loginEl = new LoginAside(login, emodji);
        let loginMarkup = loginEl.getLoginAsideMarkup();

        this.usersPreviewContainer.insertAdjacentHTML('beforeend', loginMarkup);
    }

    addWebSocketListeners = () => {
        this.ws.addEventListener('open', (e) => {
            console.log('Соединение с сервером установлено', e);
        });

        this.ws.addEventListener('message', (e) => {
            const response = JSON.parse(e.data);
            if (response.message) {
                this.renderMessages(response.message);
            }
            if (response.loginData) {
                [...this.usersPreviewContainer.children].forEach(el => el.remove());
                response.loginData.forEach(loginObj => {
                    this.renderAsideLogin(loginObj.login, loginObj.emodji);
                }) 
            }
        });

        this.ws.addEventListener('close', (e) => {
            console.log('Соединение закрыто', e);
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        const message = this.inputMessage.value;

        if (!message) return;

        const messageObj = { message: message, login: this.login, date: dayjs().format('DD.MM.YYYY HH:mm') };
        this.ws.send(JSON.stringify(messageObj));
        this.inputMessage.value = '';
    }

    toggleAsideMenu = () => {
        this.usersPreviewContainer.classList.toggle('inactive');
        this.asideMenuToggler.classList.toggle('toggler-off');
    }
}