document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('user-form');
    const userList = document.getElementById('user-list');
    const form = document.getElementById('form');
    const tbody = document.querySelector('tbody');
    const btnAddUser = document.getElementById('btnAddUser');
    const btnViewUsers = document.getElementById('btnViewUsers');
    const assuntoInput = document.getElementById('assunto');
    const assuntoList = document.getElementById('assuntoList');
    const papelInput = document.getElementById('papel');
    const papelList = document.getElementById('papelList');
    let id;

    const getUsersFromStorage = () => JSON.parse(localStorage.getItem('users')) || [];
    const setUsersToStorage = users => localStorage.setItem('users', JSON.stringify(users));

    btnAddUser.addEventListener('click', () => {
        userForm.classList.remove('hidden');
        userList.classList.add('hidden');
        form.reset();
        id = null;
    });

    btnViewUsers.addEventListener('click', () => {
        userForm.classList.add('hidden');
        userList.classList.remove('hidden');
        loadUsers();
    });

    assuntoInput.addEventListener('click', () => {
        assuntoList.style.display = assuntoList.style.display === 'block' ? 'none' : 'block';
    });

    window.selecionarAssunto = function(assunto) {
        assuntoInput.value = assunto;
        assuntoList.style.display = 'none';
    };

    window.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown')) {
            assuntoList.style.display = 'none';
        }
    });

    papelInput.addEventListener('click', () => {
        papelList.style.display = papelList.style.display === 'block' ? 'none' : 'block';
    });

    window.selecionarPapel = function(papel) {
        papelInput.value = papel;
        papelList.style.display = 'none';
    };

    window.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown')) {
            papelList.style.display = 'none';
        }
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
    
        const user = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            email: document.getElementById('email').value,
            cep: document.getElementById('cep').value,
            assunto: document.getElementById('assunto').value,
            papel: document.getElementById('papel').value,
            outro: document.getElementById('outro').value,
        };
    
        if (validateForm()) {
            
            let users = getUsersFromStorage();
    
            if (id === null) {
                users.push(user);
            } else {
                users[id] = user;
            }
    
            setUsersToStorage(users);
         
            form.reset();
    
            alert('Usuário salvo com sucesso!');
            userForm.classList.add('hidden');
            userList.classList.remove('hidden');
            loadUsers();
    
        } else {
            alert('Por favor, corrija os erros no formulário.');
        }
    });

    function validateForm() {
        
        const nome = document.getElementById('nome').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const email = document.getElementById('email').value.trim();
        const cep = document.getElementById('cep').value.trim();
        const assunto = document.getElementById('assunto').value.trim();
        const papel = document.getElementById('papel').value.trim();
    
        const cpfRegex = /^\d{11}$/; 
        const cepRegex = /^\d{8}$/; 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ~]+(?: [A-Za-zÀ-ÖØ-öø-ÿ~]+)*$/;
    
        function showError(elemento, mensagem) {
            const errorSpan = elemento.nextElementSibling;
            errorSpan.textContent = mensagem;
        }
    
        const errors = {};
    
        if (!nome) {
            errors.nome = 'O campo "Nome" é obrigatório.';
        }else if (!nomeRegex.test(nome)) {
            errors.nome = 'O nome deve conter apenas letras, espaços, e o caractere "~".';
        }
        if (!cpf) {
            errors.cpf = 'O campo "CPF" é obrigatório.';
        } else if (!cpfRegex.test(cpf)) {
            errors.cpf = 'O CPF deve conter exatamente 11 dígitos numéricos.';
        }
        if (!email) {
            errors.email = 'O campo "Email" é obrigatório.';
        } else if (!emailRegex.test(email)) {
            errors.email = 'O email informado é inválido.';
        }
        if (!cep) {
            errors.cep = 'O campo "CEP" é obrigatório.';
        } else if (!cepRegex.test(cep)) {
            errors.cep = 'O CEP deve conter exatamente 8 dígitos numéricos.';
        }
        if (!assunto) {
            errors.assunto = 'O campo "Assunto" é obrigatório.';
        }
        if (!papel) {
            errors.assunto = 'O campo "Papel" é obrigatório.';
        }
    
        for (const campo in errors) {
            showError(document.getElementById(campo), errors[campo]);
        }
    
        return Object.keys(errors).length === 0;
    }

    function loadUsers() {
        let users = getUsersFromStorage();
        tbody.innerHTML = '';
        users.forEach((user, index) => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.nome}</td>
                <td>${user.cpf}</td>
                <td>${user.email}</td>
                <td>${user.cep}</td>
                <td>${user.assunto}</td>
                <td>${user.papel}</td>
                <td>${user.outro}</td>
                <td class="acao">
                    <button class="btn-editar" onclick="editUser(${index})" title="Editar usuário">
                        <i class='bx bx-edit'></i> Editar
                    </button>
                    <button class="btn-excluir" onclick="deleteUser(${index})" title="Excluir usuário">
                        <i class='bx bx-trash'></i> Excluir
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.editUser = index => {
        let users = getUsersFromStorage();
        const user = users[index];
        document.getElementById('nome').value = user.nome;
        document.getElementById('cpf').value = user.cpf;
        document.getElementById('email').value = user.email;
        document.getElementById('cep').value = user.cep;
        document.getElementById('assunto').value = user.assunto;
        document.getElementById('papel').value = user.papel;
        document.getElementById('outro').value = user.outro;
        id = index;
        userForm.classList.remove('hidden');
        userList.classList.add('hidden');
    };

    window.deleteUser = index => {
        let users = getUsersFromStorage();
        users.splice(index, 1);
        setUsersToStorage(users);
        loadUsers();
    };
});
