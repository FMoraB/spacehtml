// URLs de las APIs
const API_URLS = {
    users: 'https://csrent-ynff.onrender.com/users',
    spaces: 'https://csrent-ynff.onrender.com/space',
    reservations: 'https://csrent-ynff.onrender.com/reservations'
};

// Variables globales
let currentEditingUser = null;
let currentEditingSpace = null;
let currentEditingReservation = null;

// Función para mostrar módulos
function showModule(module) {
    // Ocultar todos los módulos
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    // Mostrar el módulo seleccionado
    document.getElementById(module).classList.add('active');
    event.target.classList.add('active');
    
    // Cargar datos según el módulo
    switch(module) {
        case 'users':
            loadUsers();
            break;
        case 'spaces':
            loadSpaces();
            break;
        case 'reservations':
            loadReservations();
            loadUsersForSelect();
            loadSpacesForSelect();
            break;
    }
}

// Función para mostrar mensajes
function showMessage(message, type = 'success') {
    const container = document.getElementById('message-container');
    container.innerHTML = `<div class="message ${type}">${message}</div>`;
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Función para mostrar loading
function showLoading(containerId) {
    document.getElementById(containerId).innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            Cargando datos...
        </div>
    `;
}

// CRUD para USUARIOS
async function submitUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData);
    
    try {
        const method = currentEditingUser ? 'PUT' : 'POST';
        const url = currentEditingUser ? 
            `${API_URLS.users}/${currentEditingUser}` : 
            API_URLS.users;
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const action = currentEditingUser ? 'actualizado' : 'creado';
            showMessage(`Usuario ${action} exitosamente`);
            resetUserForm();
            loadUsers();
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        showMessage(`Error al procesar usuario: ${error.message}`, 'error');
    }
}

async function loadUsers() {
    showLoading('usersList');
    try {
        const response = await fetch(API_URLS.users);
        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        document.getElementById('usersList').innerHTML = `
            <div class="message error">Error al cargar usuarios: ${error.message}</div>
        `;
    }
}

function displayUsers(users) {
    const container = document.getElementById('usersList');
    if (!users || users.length === 0) {
        container.innerHTML = '<div class="message">No hay usuarios registrados</div>';
        return;
    }

    container.innerHTML = users.map(user => `
        <div class="data-item">
            <div class="item-header">
                <div class="item-title">${user.name}</div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-warning" onclick="editUser(${user.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Eliminar</button>
                </div>
            </div>
            <div class="item-details">
                <strong>Email:</strong> ${user.email}<br>
                <strong>Teléfono:</strong> ${user.phone || 'No especificado'}<br>
                <strong>Rol:</strong> ${user.role}
            </div>
        </div>
    `).join('');
}

function editUser(id) {
    fetch(`${API_URLS.users}/${id}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPhone').value = user.phone || '';
            document.getElementById('userRole').value = user.role;
            document.getElementById('userSubmitBtn').textContent = 'Actualizar Usuario';
            currentEditingUser = id;
        })
        .catch(error => showMessage(`Error al cargar usuario: ${error.message}`, 'error'));
}

async function deleteUser(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        try {
            const response = await fetch(`${API_URLS.users}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                showMessage('Usuario eliminado exitosamente');
                loadUsers();
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            showMessage(`Error al eliminar usuario: ${error.message}`, 'error');
        }
    }
}

function resetUserForm() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userSubmitBtn').textContent = 'Crear Usuario';
    currentEditingUser = null;
}

// CRUD para ESPACIOS
async function submitSpace(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const spaceData = Object.fromEntries(formData);
    
    try {
        const method = currentEditingSpace ? 'PUT' : 'POST';
        const url = currentEditingSpace ? 
            `${API_URLS.spaces}/${currentEditingSpace}` : 
            API_URLS.spaces;
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(spaceData)
        });

        if (response.ok) {
            const action = currentEditingSpace ? 'actualizado' : 'creado';
            showMessage(`Espacio ${action} exitosamente`);
            resetSpaceForm();
            loadSpaces();
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        showMessage(`Error al procesar espacio: ${error.message}`, 'error');
    }
}

async function loadSpaces() {
    showLoading('spacesList');
    try {
        const response = await fetch(API_URLS.spaces);
        if (response.ok) {
            const spaces = await response.json();
            displaySpaces(spaces);
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        document.getElementById('spacesList').innerHTML = `
            <div class="message error">Error al cargar espacios: ${error.message}</div>
        `;
    }
}

function displaySpaces(spaces) {
    const container = document.getElementById('spacesList');
    if (!spaces || spaces.length === 0) {
        container.innerHTML = '<div class="message">No hay espacios registrados</div>';
        return;
    }

    container.innerHTML = spaces.map(space => `
        <div class="data-item">
            <div class="item-header">
                <div class="item-title">${space.name}</div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-warning" onclick="editSpace(${space.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSpace(${space.id})">Eliminar</button>
                </div>
            </div>
            <div class="item-details">
                <strong>Tipo:</strong> ${space.type}<br>
                <strong>Capacidad:</strong> ${space.capacity} personas<br>
                <strong>Ubicación:</strong> ${space.location}<br>
                <strong>Descripción:</strong> ${space.description || 'No especificada'}
            </div>
        </div>
    `).join('');
}

function editSpace(id) {
    fetch(`${API_URLS.spaces}/${id}`)
        .then(response => response.json())
        .then(space => {
            document.getElementById('spaceId').value = space.id;
            document.getElementById('spaceName').value = space.name;
            document.getElementById('spaceCapacity').value = space.capacity;
            document.getElementById('spaceType').value = space.type;
            document.getElementById('spaceLocation').value = space.location;
            document.getElementById('spaceDescription').value = space.description || '';
            document.getElementById('spaceSubmitBtn').textContent = 'Actualizar Espacio';
            currentEditingSpace = id;
        })
        .catch(error => showMessage(`Error al cargar espacio: ${error.message}`, 'error'));
}

async function deleteSpace(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este espacio?')) {
        try {
            const response = await fetch(`${API_URLS.spaces}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                showMessage('Espacio eliminado exitosamente');
                loadSpaces();
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            showMessage(`Error al eliminar espacio: ${error.message}`, 'error');
        }
    }
}

function resetSpaceForm() {
    document.getElementById('spaceForm').reset();
    document.getElementById('spaceId').value = '';
    document.getElementById('spaceSubmitBtn').textContent = 'Crear Espacio';
    currentEditingSpace = null;
}

// CRUD para RESERVACIONES
async function submitReservation(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const reservationData = Object.fromEntries(formData);
    
    try {
        const method = currentEditingReservation ? 'PUT' : 'POST';
        const url = currentEditingReservation ? 
            `${API_URLS.reservations}/${currentEditingReservation}` : 
            API_URLS.reservations;
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData)
        });

        if (response.ok) {
            const action = currentEditingReservation ? 'actualizada' : 'creada';
            showMessage(`Reservación ${action} exitosamente`);
            resetReservationForm();
            loadReservations();
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        showMessage(`Error al procesar reservación: ${error.message}`, 'error');
    }
}

async function loadReservations() {
            showLoading('reservationsList');
            try {
                const response = await fetch(API_URLS.reservations);
                if (response.ok) {
                    const reservations = await response.json();
                    displayReservations(reservations);
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                document.getElementById('reservationsList').innerHTML = `
                    <div class="message error">Error al cargar reservaciones: ${error.message}</div>
                `;
            }
        }

        function displayReservations(reservations) {
            const container = document.getElementById('reservationsList');
            if (!reservations || reservations.length === 0) {
                container.innerHTML = '<div class="message">No hay reservaciones registradas</div>';
                return;
            }

            container.innerHTML = reservations.map(reservation => `
                <div class="data-item">
                    <div class="item-header">
                        <div class="item-title">Reservación #${reservation.id}</div>
                        <div class="item-actions">
                            <button class="btn btn-sm btn-warning" onclick="editReservation(${reservation.id})">Editar</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteReservation(${reservation.id})">Eliminar</button>
                        </div>
                    </div>
                    <div class="item-details">
                        <strong>Usuario ID:</strong> ${reservation.userId}<br>
                        <strong>Espacio ID:</strong> ${reservation.spaceId}<br>
                        <strong>Fecha:</strong> ${reservation.date}<br>
                        <strong>Hora:</strong> ${reservation.startTime} - ${reservation.endTime}<br>
                        <strong>Estado:</strong> ${reservation.status}<br>
                        <strong>Propósito:</strong> ${reservation.purpose || 'No especificado'}
                    </div>
                </div>
            `).join('');
        }

        function editReservation(id) {
            fetch(`${API_URLS.reservations}/${id}`)
                .then(response => response.json())
                .then(reservation => {
                    document.getElementById('reservationId').value = reservation.id;
                    document.getElementById('reservationUserId').value = reservation.userId;
                    document.getElementById('reservationSpaceId').value = reservation.spaceId;
                    document.getElementById('reservationDate').value = reservation.date;
                    document.getElementById('reservationTime').value = reservation.startTime;
                    document.getElementById('reservationEndTime').value = reservation.endTime;
                    document.getElementById('reservationStatus').value = reservation.status;
                    document.getElementById('reservationPurpose').value = reservation.purpose || '';
                    document.getElementById('reservationSubmitBtn').textContent = 'Actualizar Reservación';
                    currentEditingReservation = id;
                })
                .catch(error => showMessage(`Error al cargar reservación: ${error.message}`, 'error'));
        }

        async function deleteReservation(id) {
            if (confirm('¿Estás seguro de que quieres eliminar esta reservación?')) {
                try {
                    const response = await fetch(`${API_URLS.reservations}/${id}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        showMessage('Reservación eliminada exitosamente');
                        loadReservations();
                    } else {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
                } catch (error) {
                    showMessage(`Error al eliminar reservación: ${error.message}`, 'error');
                }
            }
        }

        function resetReservationForm() {
            document.getElementById('reservationForm').reset();
            document.getElementById('reservationId').value = '';
            document.getElementById('reservationSubmitBtn').textContent = 'Crear Reservación';
            currentEditingReservation = null;
        }

        // Funciones auxiliares para cargar selects
        async function loadUsersForSelect() {
            try {
                const response = await fetch(API_URLS.users);
                if (response.ok) {
                    const users = await response.json();
                    const select = document.getElementById('reservationUserId');
                    select.innerHTML = '<option value="">Seleccionar usuario</option>';
                    users.forEach(user => {
                        select.innerHTML += `<option value="${user.id}">${user.name} (${user.email})</option>`;
                    });
                }
            } catch (error) {
                console.error('Error al cargar usuarios para select:', error);
            }
        }

        async function loadSpacesForSelect() {
            try {
                const response = await fetch(API_URLS.spaces);
                if (response.ok) {
                    const spaces = await response.json();
                    const select = document.getElementById('reservationSpaceId');
                    select.innerHTML = '<option value="">Seleccionar espacio</option>';
                    spaces.forEach(space => {
                        select.innerHTML += `<option value="${space.id}">${space.name} (${space.type})</option>`;
                    });
                }
            } catch (error) {
                console.error('Error al cargar espacios para select:', error);
            }
        }

        document.getElementById('userForm').addEventListener('submit', submitUser);
        document.getElementById('spaceForm').addEventListener('submit', submitSpace);
        document.getElementById('reservationForm').addEventListener('submit', submitReservation);

        // Inicializar la aplicación
        document.addEventListener('DOMContentLoaded', function() {
            loadUsers();
            
            // Establecer fecha mínima para reservaciones (hoy)
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('reservationDate').min = today;
        });