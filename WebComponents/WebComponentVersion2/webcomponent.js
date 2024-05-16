class UserInterface extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="container">
            <div class="container">
                <div class="button-container">
                    <button id="listButton">Listar</button>
                    <button id="createButton">Crear</button>
                    <button id="editButton">Editar</button>
                    <button id="deleteButton">Eliminar</button>
                </div>
                <table id="dataTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;

        this.listButton = this.querySelector('#listButton');
        this.createButton = this.querySelector('#createButton');
        this.editButton = this.querySelector('#editButton');
        this.deleteButton = this.querySelector('#deleteButton');
        this.otherButton = this.querySelector('#otherButton');
        this.dataTableBody = this.querySelector('#dataTable tbody');

        this.listButton.addEventListener('click', this.listAccounts.bind(this));
        this.createButton.addEventListener('click', this.createAccount.bind(this));
        this.editButton.addEventListener('click', this.editAccount.bind(this));
        this.deleteButton.addEventListener('click', this.deleteAccount.bind(this));
    }

    listAccounts() {
        fetch('data.php')
            .then(response => response.json())
            .then(data => {
                this.dataTableBody.innerHTML = '';
                data.forEach(account => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${account.id}</td>
                        <td>${account.username}</td>
                        <td>${account.saldo}</td>
                    `;
                    this.dataTableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error al obtener la lista de cuentas:', error));
    }

    createAccount() {
    }

    editAccount() {
    }

    deleteAccount() {
    }
}

customElements.define('user-interface', UserInterface);
