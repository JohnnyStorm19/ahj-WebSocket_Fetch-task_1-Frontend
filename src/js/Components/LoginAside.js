export default class LoginAside {
    constructor(login, emodji) {
        this.login = login;
        this.emodji = emodji;
    }
    getLoginAsideMarkup() {
        return `
            <div class="user-preview-block">
                <span class="logo">${this.emodji}</span>
                <span class="nickname">${this.login}</span>
            </div>
        `
    }
}