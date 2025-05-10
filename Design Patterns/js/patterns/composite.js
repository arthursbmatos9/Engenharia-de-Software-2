/**
 * Implementação do Padrão Composite
 * 
 * O Composite é um padrão estrutural que permite compor objetos em estruturas
 * de árvore para representar hierarquias parte-todo. Permite que os clientes
 * tratem objetos individuais e composições de objetos de maneira uniforme.
 * 
 * Usamos o Composite para criar grupos de tarefas e subgrupos hierárquicos.
 */

/**
 * Componente - Interface comum para todas as classes na composição
 */
class TaskComponent {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }
    
    getId() {
        return this.id;
    }
    
    getTitle() {
        return this.title;
    }
    
    setTitle(title) {
        this.title = title;
    }
    
    // Métodos a serem implementados pelas subclasses
    add(component) {
        throw new Error("Método add() deve ser implementado pelas subclasses");
    }
    
    remove(id) {
        throw new Error("Método remove() deve ser implementado pelas subclasses");
    }
    
    getChild(id) {
        throw new Error("Método getChild() deve ser implementado pelas subclasses");
    }
    
    isComposite() {
        return false;
    }
    
    // Renderizar representação HTML
    getHtmlRepresentation() {
        throw new Error("Método getHtmlRepresentation() deve ser implementado pelas subclasses");
    }
    
    // Método para calcular o número total de tarefas
    getTaskCount() {
        throw new Error("Método getTaskCount() deve ser implementado pelas subclasses");
    }
}

/**
 * Folha - Representa as tarefas individuais
 * Adaptação da classe Task existente para trabalhar com o padrão Composite
 */
class TaskLeaf extends TaskComponent {
    constructor(task) {
        super(task.getId(), task.getTitle());
        this.task = task;
    }
    
    // Os métodos de composição não fazem nada nas folhas
    add(component) {
        return false; // Não é possível adicionar a uma folha
    }
    
    remove(id) {
        return false; // Não é possível remover de uma folha
    }
    
    getChild(id) {
        return null; // Uma folha não tem filhos
    }
    
    isComposite() {
        return false;
    }
    
    // Delegar outros métodos para a tarefa real
    getDescription() {
        return this.task.getDescription();
    }
    
    getStatus() {
        return this.task.getStatus();
    }
    
    setStatus(status) {
        this.task.setStatus(status);
    }
    
    getType() {
        return this.task.getType();
    }
    
    getCreatedAt() {
        return this.task.getCreatedAt();
    }
    
    // Método para obter a representação HTML da tarefa
    getHtmlRepresentation() {
        return this.task.getHtmlRepresentation();
    }
    
    // Uma folha conta como 1 tarefa
    getTaskCount() {
        return 1;
    }
    
    // Método para obter a tarefa real
    getTask() {
        return this.task;
    }
}

/**
 * Composite - Representa grupos de tarefas
 */
class TaskGroup extends TaskComponent {
    constructor(id, title, color = 'primary') {
        super(id, title);
        this.children = []; // Lista de componentes filhos (tarefas ou subgrupos)
        this.color = color; // Cor do grupo (bootstrap color)
        this.expanded = true; // Estado de expansão do grupo
        this.createdAt = new Date();
    }
    
    // Adicionar um componente ao grupo
    add(component) {
        this.children.push(component);
        return true;
    }
    
    // Remover um componente do grupo pelo ID
    remove(id) {
        const initialLength = this.children.length;
        this.children = this.children.filter(child => child.getId() !== id);
        
        // Se nenhum filho foi removido diretamente, tente remover dos subgrupos
        if (this.children.length === initialLength) {
            for (const child of this.children) {
                if (child.isComposite() && child.remove(id)) {
                    return true;
                }
            }
            return false;
        }
        
        return true;
    }
    
    // Obter um componente filho pelo ID (recursivo)
    getChild(id) {
        // Verificar filhos diretos primeiro
        for (const child of this.children) {
            if (child.getId() === id) {
                return child;
            }
            
            // Se o filho for um grupo, verificar seus filhos
            if (child.isComposite()) {
                const result = child.getChild(id);
                if (result) {
                    return result;
                }
            }
        }
        
        return null;
    }
    
    // Este é um grupo, então é um composite
    isComposite() {
        return true;
    }
    
    // Alternar o estado de expansão do grupo
    toggleExpanded() {
        this.expanded = !this.expanded;
    }
    
    // Obter a representação HTML do grupo e seus filhos
    getHtmlRepresentation() {
        const expandIcon = this.expanded ? '▼' : '►';
        const displayStyle = this.expanded ? 'block' : 'none';
        
        let html = `
            <div class="list-group-item task-group bg-light" id="group-${this.id}">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-1">
                        <span class="toggle-group-btn" data-group-id="${this.id}">${expandIcon}</span>
                        <span class="badge bg-${this.color} me-2">${this.getTaskCount()}</span>
                        ${this.title}
                    </h5>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary add-task-to-group-btn" data-group-id="${this.id}">
                            Adicionar Tarefa
                        </button>
                        <button class="btn btn-sm btn-outline-success add-subgroup-btn" data-group-id="${this.id}">
                            Adicionar Subgrupo
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-group-btn" data-group-id="${this.id}">
                            Excluir Grupo
                        </button>
                    </div>
                </div>
                <small>Criado em: ${this.createdAt.toLocaleString()}</small>
                <div class="group-children mt-3" style="display: ${displayStyle}; padding-left: 20px;">
        `;
        
        // Adicionar representação de todos os filhos
        if (this.children.length === 0) {
            html += `<div class="text-muted">Este grupo está vazio</div>`;
        } else {
            this.children.forEach(child => {
                html += child.getHtmlRepresentation();
            });
        }
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }
    
    // Calcular o número total de tarefas no grupo e subgrupos
    getTaskCount() {
        return this.children.reduce((total, child) => {
            return total + child.getTaskCount();
        }, 0);
    }
    
    // Obter todos os itens folha (tarefas) neste grupo e subgrupos
    getAllLeaves() {
        let leaves = [];
        
        this.children.forEach(child => {
            if (child.isComposite()) {
                leaves = leaves.concat(child.getAllLeaves());
            } else {
                leaves.push(child);
            }
        });
        
        return leaves;
    }
    
    // Marcar todas as tarefas deste grupo com um status específico
    setGroupStatus(status) {
        this.getAllLeaves().forEach(leaf => {
            leaf.setStatus(status);
        });
    }
}

/**
 * Factory para criar e gerenciar grupos de tarefas
 */
class TaskGroupFactory {
    static lastGroupId = 0;
    
    // Criar um novo grupo de tarefas
    static createGroup(title, color = 'primary') {
        return new TaskGroup(++TaskGroupFactory.lastGroupId, title, color);
    }
    
    // Criar um grupo a partir de um filtro aplicado às tarefas existentes
    static createGroupFromFilter(title, tasks, filterFn, color = 'primary') {
        const group = this.createGroup(title, color);
        
        tasks.filter(filterFn).forEach(task => {
            group.add(new TaskLeaf(task));
        });
        
        return group;
    }
}