class UserInterface extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
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
        this.dataTableBody = this.querySelector('#dataTable tbody');

        this.listButton.addEventListener('click', this.listAccounts.bind(this));
        this.createButton.addEventListener('click', this.createAccount.bind(this));
        this.editButton.addEventListener('click', this.editAccount.bind(this));
        this.deleteButton.addEventListener('click', this.deleteAccount.bind(this));
    }

    async listAccounts() {
        try {
            const response = await fetch('database.php?action=list');
            const data = await response.json();
            this.renderAccounts(data);
        } catch (error) {
            console.error('Error al obtener la lista de cuentas:', error);
        }
    }

    async createAccount() {
        const username = prompt('Ingrese el nombre de usuario:');
        const saldo = parseFloat(prompt('Ingrese el saldo:'));
        if (!username || isNaN(saldo)) {
            alert('Nombre de usuario o saldo inválido.');
            return;
        }

        try {
            const response = await fetch('database.php?action=create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, saldo })
            });
            const data = await response.json();
            alert('Cuenta creada con ID: ' + data.id);
        } catch (error) {
            console.error('Error al crear la cuenta:', error);
        }
    }

    async editAccount() {
        const id = prompt('Ingrese el ID de la cuenta que desea editar:');
        const username = prompt('Ingrese el nuevo nombre de usuario:');
        const saldo = parseFloat(prompt('Ingrese el nuevo saldo:'));
        if (!id || !username || isNaN(saldo)) {
            alert('ID, nombre de usuario o saldo inválido.');
            return;
        }

        try {
            const response = await fetch(`database.php?action=edit&id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, saldo })
            });
            const data = await response.json();
            alert('Cuenta editada con cambios: ' + data.changes);
        } catch (error) {
            console.error('Error al editar la cuenta:', error);
        }
    }

    async deleteAccount() {
        const id = prompt('Ingrese el ID de la cuenta que desea eliminar:');
        if (!id) {
            alert('ID inválido.');
            return;
        }

        try {
            const response = await fetch(`database.php?action=delete&id=${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            alert('Cuenta eliminada con cambios: ' + data.changes);
        } catch (error) {
            console.error('Error al eliminar la cuenta:', error);
        }
    }

    renderAccounts(accounts) {
        this.dataTableBody.innerHTML = '';
        accounts.forEach(account => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${account.id}</td>
                <td>${account.username}</td>
                <td>${account.saldo}</td>
            `;
            this.dataTableBody.appendChild(row);
        });
    }
}

customElements.define('user-interface', UserInterface);
