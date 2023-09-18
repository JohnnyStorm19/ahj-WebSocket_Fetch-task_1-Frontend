export default class Message {
    constructor(options) {
        this.message = options.message;
        this.date = options.date;
    }
    getSendMessageMarkup() {
        return `
            <div class="message send-message">
                <div class="message-text">${this.message}</div>
                <footer class="message-footer">    
                    <span class="date">${this.date}</span>
                </footer>
            </div>
        `
    }

    getRecievedMessageMarkup(login) {
        return `
            <div class="message recieved-message">
                <header class="message-header">
                    <span class="login">${login}</span>
                </header>
                <div class="message-text">${this.message}</div>
                <footer class="message-footer">    
                    <span class="date">${this.date}</span>
                </footer>
            </div>
        `
    }
}