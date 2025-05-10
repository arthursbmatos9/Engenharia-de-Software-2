/**
 * Implementação do Padrão Singleton
 * 
 * O Singleton é um padrão criacional que garante que uma classe tenha apenas
 * uma instância e fornece um ponto de acesso global a essa instância.
 * Neste caso, usamos para gerenciar configurações do sistema.
 */
class ConfigurationManager {
    constructor() {
        // Verificar se já existe uma instância
        if (ConfigurationManager.instance) {
            return ConfigurationManager.instance;
        }
        
        // Configurações padrão do sistema
        this.config = {
            theme: 'light',           // tema da interface: 'light' ou 'dark'
            language: 'pt-BR',         // idioma da interface
            showCompletedTasks: true,  // mostrar tarefas concluídas
            autoSave: true,            // salvar alterações automaticamente
            notificationTimeout: 3000, // tempo que notificações ficam na tela (ms)
            maxNotificationsHistory: 10, // máximo de notificações no histórico
            defaultTaskColor: 'blue',  // cor padrão para novas tarefas
            defaultTaskType: 'personal', // tipo padrão para novas tarefas
            sidebarCollapsed: false    // estado da barra lateral
        };
        
        // Guardar a instância única
        ConfigurationManager.instance = this;
    }
    
    // Obter uma configuração específica
    getConfig(key) {
        return this.config[key];
    }
    
    // Definir uma configuração específica
    setConfig(key, value) {
        if (key in this.config) {
            this.config[key] = value;
            // Emitir evento de mudança de configuração
            this.notifyConfigChange(key, value);
            return true;
        }
        return false;
    }
    
    // Obter todas as configurações
    getAllConfig() {
        return {...this.config}; // Retornar uma cópia para evitar modificações diretas
    }
    
    // Redefinir todas as configurações para o padrão
    resetToDefaults() {
        this.config = {
            theme: 'light',
            language: 'pt-BR',
            showCompletedTasks: true,
            autoSave: true,
            notificationTimeout: 3000,
            maxNotificationsHistory: 10,
            defaultTaskColor: 'blue',
            defaultTaskType: 'personal',
            sidebarCollapsed: false
        };
        
        // Notificar sobre a redefinição de todas as configurações
        this.notifyConfigChange('all', null);
    }
    
    // Aplicar configurações ao sistema
    applyConfig() {
        // Aplicar tema
        if (this.config.theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        
        // Aplicar outras configurações visuais e comportamentais
        document.documentElement.setAttribute('lang', this.config.language);
        
        // Exemplo de aplicação da configuração de timeout para os toasts
        const toastElements = document.querySelectorAll('.toast');
        toastElements.forEach(toastEl => {
            const bsToast = bootstrap.Toast.getInstance(toastEl);
            if (bsToast) {
                bsToast.dispose();
            }
            new bootstrap.Toast(toastEl, {
                delay: this.config.notificationTimeout
            });
        });
    }
    
    // Notificar sobre mudanças na configuração
    notifyConfigChange(key, value) {
        // Criar e disparar um evento customizado
        const event = new CustomEvent('configChanged', {
            detail: { key, value }
        });
        document.dispatchEvent(event);
        
        // Aplicar configurações atualizadas
        this.applyConfig();
    }
}

// Instância global única
const configManager = new ConfigurationManager();