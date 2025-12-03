// Supabase Integration for Early Bird Form
// Este archivo maneja el envío del formulario a Supabase

let supabaseClient = null;

// Inicializar Supabase
async function initSupabase() {
    if (typeof supabase === 'undefined') {
        console.error('Supabase JS library no está cargada. Asegúrate de incluir el script de Supabase.');
        return false;
    }
    
    try {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        return true;
    } catch (error) {
        console.error('Error inicializando Supabase:', error);
        return false;
    }
}

// Manejar el envío del formulario
async function handleEarlyBirdSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();
    
    if (!email) {
        showMessage('Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Deshabilitar botón durante el envío
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    
    try {
        // Inicializar Supabase si no está inicializado
        if (!supabaseClient) {
            const initialized = await initSupabase();
            if (!initialized) {
                throw new Error('No se pudo inicializar Supabase');
            }
        }
        
        // Insertar en Supabase
        const { data, error } = await supabaseClient
            .from(TABLE_NAME)
            .insert([
                {
                    email: email,
                    created_at: new Date().toISOString(),
                    source: 'landing_page'
                }
            ])
            .select();
        
        if (error) {
            // Si el error es por duplicado, mostrar mensaje amigable
            if (error.code === '23505') {
                showMessage('¡Ya estás registrado! Te notificaremos cuando estemos listos.', 'success');
            } else {
                throw error;
            }
        } else {
            showMessage('¡Gracias! Te notificaremos cuando estemos listos.', 'success');
            emailInput.value = ''; // Limpiar el campo
        }
    } catch (error) {
        console.error('Error al enviar formulario:', error);
        showMessage('Hubo un error. Por favor intenta de nuevo más tarde.', 'error');
    } finally {
        // Restaurar botón
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// Mostrar mensaje de feedback
function showMessage(message, type = 'success') {
    // Remover mensajes anteriores
    const existingMessage = document.getElementById('form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const form = document.querySelector('#early-bird-form') || document.querySelector('#early-bird form');
    const messageDiv = document.createElement('div');
    messageDiv.id = 'form-message';
    messageDiv.className = `mt-4 p-3 rounded-lg text-sm ${
        type === 'success' 
            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
            : 'bg-red-500/10 text-red-500 border border-red-500/20'
    }`;
    messageDiv.textContent = message;
    
    form.appendChild(messageDiv);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.3s';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#early-bird-form') || document.querySelector('#early-bird form');
    if (form) {
        form.addEventListener('submit', handleEarlyBirdSubmit);
    }
    
    // Cargar Supabase si está disponible
    if (typeof supabase !== 'undefined') {
        initSupabase();
    }
});

