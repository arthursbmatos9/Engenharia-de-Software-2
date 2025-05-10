/**
 * Classe base para todas as tarefas
 */
class Task {
    constructor(id, title, description) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = 'Pendente'; // Pendente, Em Andamento, concluída
        this.createdAt = new Date();
    }
    
    getId() {
        return this.id;
    }
    
    getTitle() {
        return this.title;
    }
    
    getDescription() {
        return this.description;
    }
    
    getStatus() {
        return this.status;
    }
    
    setStatus(status) {
        this.status = status;
    }
    
    getType() {
        return 'Tarefa Genérica';
    }
    
    getCreatedAt() {
        return this.createdAt;
    }
    
    // Método para obter representação visual da tarefa (usado na UI)
    getHtmlRepresentation() {
    return `
        <div class="list-group-item task-item">
            <div class="task-content">
                <h5>${this.getTitle()}</h5>
                <p>${this.getDescription()}</p>
                <span class="badge bg-info me-2">${this.getType()}</span>
                <span class="badge bg-secondary">${this.status}</span>
                <br><small>Criada em: ${this.createdAt.toLocaleString()}</small>
            </div>
            <div class="task-actions">
                <button class="btn btn-sm btn-outline-primary status-btn" data-task-id="${this.id}" data-status="Em Andamento">Em Andamento</button>
                <button class="btn btn-sm btn-outline-success status-btn" data-task-id="${this.id}" data-status="Concluída">Concluída</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-task-id="${this.id}">Excluir</button>
            </div>
        </div>
    `;
}
}

/**
 * Classe para tarefas pessoais
 */
class PersonalTask extends Task {
    getType() {
        return 'Pessoal';
    }
    
    getHtmlRepresentation() {
        const baseHtml = super.getHtmlRepresentation();
        return baseHtml.replace('list-group-item task-item', 'list-group-item task-item task-personal');
    }
}

/**
 * Classe para tarefas de trabalho
 */
class WorkTask extends Task {
    getType() {
        return 'Trabalho';
    }
    
    getHtmlRepresentation() {
        const baseHtml = super.getHtmlRepresentation();
        return baseHtml.replace('list-group-item task-item', 'list-group-item task-item task-work');
    }
}

/**
 * Classe para tarefas de estudo
 */
class StudyTask extends Task {
    getType() {
        return 'Estudo';
    }
    
    getHtmlRepresentation() {
        const baseHtml = super.getHtmlRepresentation();
        return baseHtml.replace('list-group-item task-item', 'list-group-item task-item task-study');
    }
}

class VolunteerTask extends Task {
    getType() {
        return 'Trabalho Voluntário'
    }

    getHtmlRepresentation() {
        const baseHtml = super.getHtmlRepresentation();
        return baseHtml.replace('list-group-item task-item', 'list-group-item task-item task-volunteer');
    }
}