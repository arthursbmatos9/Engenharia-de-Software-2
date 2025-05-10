/**
 * Implementação do Padrão Strategy
 * 
 * O Strategy é um padrão comportamental que permite definir uma família de algoritmos,
 * encapsular cada um deles e torná-los intercambiáveis. O Strategy permite que o
 * algoritmo varie independentemente dos clientes que o utilizam.
 * 
 * Usamos o Strategy para implementar diferentes estratégias de ordenação e filtragem
 * de tarefas.
 */

/**
 * Interface da estratégia de ordenação
 */
class SortStrategy {
    sort(tasks) {
        throw new Error("Método sort() deve ser implementado pelas subclasses");
    }
    
    getName() {
        throw new Error("Método getName() deve ser implementado pelas subclasses");
    }
}

/**
 * Estratégia de ordenação por data de criação (mais recentes primeiro)
 */
class DateNewestFirstStrategy extends SortStrategy {
    sort(tasks) {
        return [...tasks].sort((a, b) => {
            return b.getCreatedAt().getTime() - a.getCreatedAt().getTime();
        });
    }
    
    getName() {
        return "Mais recentes primeiro";
    }
}

/**
 * Estratégia de ordenação por data de criação (mais antigas primeiro)
 */
class DateOldestFirstStrategy extends SortStrategy {
    sort(tasks) {
        return [...tasks].sort((a, b) => {
            return a.getCreatedAt().getTime() - b.getCreatedAt().getTime();
        });
    }
    
    getName() {
        return "Mais antigas primeiro";
    }
}

/**
 * Estratégia de ordenação alfabética (A-Z)
 */
class AlphabeticalAZStrategy extends SortStrategy {
    sort(tasks) {
        return [...tasks].sort((a, b) => {
            return a.getTitle().localeCompare(b.getTitle());
        });
    }
    
    getName() {
        return "Título (A-Z)";
    }
}

/**
 * Estratégia de ordenação alfabética (Z-A)
 */
class AlphabeticalZAStrategy extends SortStrategy {
    sort(tasks) {
        return [...tasks].sort((a, b) => {
            return b.getTitle().localeCompare(a.getTitle());
        });
    }
    
    getName() {
        return "Título (Z-A)";
    }
}

/**
 * Estratégia de ordenação por status (pendentes primeiro)
 */
class StatusPendingFirstStrategy extends SortStrategy {
    sort(tasks) {
        return [...tasks].sort((a, b) => {
            const statusOrder = {
                'Pendente': 0,
                'Em Andamento': 1,
                'Concluída': 2
            };
            
            return statusOrder[a.getStatus()] - statusOrder[b.getStatus()];
        });
    }
    
    getName() {
        return "Pendentes primeiro";
    }
}

/**
 * Estratégia de ordenação por status (concluídas primeiro)
 */
class StatusCompletedFirstStrategy extends SortStrategy {
    sort(tasks) {
        return [...tasks].sort((a, b) => {
            const statusOrder = {
                'Concluída': 0,
                'Em Andamento': 1,
                'Pendente': 2
            };
            
            return statusOrder[a.getStatus()] - statusOrder[b.getStatus()];
        });
    }
    
    getName() {
        return "Concluídas primeiro";
    }
}

/**
 * Estratégia de ordenação por tipo de tarefa
 */
class TaskTypeStrategy extends SortStrategy {
    sort(tasks) {
        return [...tasks].sort((a, b) => {
            return a.getType().localeCompare(b.getType());
        });
    }
    
    getName() {
        return "Tipo de tarefa";
    }
}

/**
 * Interface da estratégia de filtragem
 */
class FilterStrategy {
    filter(tasks) {
        throw new Error("Método filter() deve ser implementado pelas subclasses");
    }
    
    getName() {
        throw new Error("Método getName() deve ser implementado pelas subclasses");
    }
}

/**
 * Estratégia para mostrar todas as tarefas
 */
class ShowAllFilterStrategy extends FilterStrategy {
    filter(tasks) {
        return tasks;
    }
    
    getName() {
        return "Todas as tarefas";
    }
}

/**
 * Estratégia para filtrar tarefas pendentes
 */
class PendingFilterStrategy extends FilterStrategy {
    filter(tasks) {
        return tasks.filter(task => task.getStatus() === 'Pendente');
    }
    
    getName() {
        return "Pendentes";
    }
}

/**
 * Estratégia para filtrar tarefas em andamento
 */
class InProgressFilterStrategy extends FilterStrategy {
    filter(tasks) {
        return tasks.filter(task => task.getStatus() === 'Em Andamento');
    }
    
    getName() {
        return "Em andamento";
    }
}

/**
 * Estratégia para filtrar tarefas concluídas
 */
class CompletedFilterStrategy extends FilterStrategy {
    filter(tasks) {
        return tasks.filter(task => task.getStatus() === 'Concluída');
    }
    
    getName() {
        return "Concluídas";
    }
}

/**
 * Estratégia para filtrar por tipo de tarefa
 */
class TypeFilterStrategy extends FilterStrategy {
    constructor(type) {
        super();
        this.type = type;
    }
    
    filter(tasks) {
        return tasks.filter(task => task.getType() === this.type);
    }
    
    getName() {
        return `Tipo: ${this.type}`;
    }
}

/**
 * Estratégia para filtrar por texto de pesquisa
 */
class SearchFilterStrategy extends FilterStrategy {
    constructor(searchText) {
        super();
        this.searchText = searchText.toLowerCase();
    }
    
    filter(tasks) {
        return tasks.filter(task => {
            const title = task.getTitle().toLowerCase();
            const description = task.getDescription().toLowerCase();
            return title.includes(this.searchText) || description.includes(this.searchText);
        });
    }
    
    getName() {
        return `Pesquisa: "${this.searchText}"`;
    }
}

/**
 * Contexto que utiliza as estratégias para ordenar e filtrar tarefas
 */
class TaskSorterFilterer {
    constructor() {
        // Estratégias de ordenação disponíveis
        this.sortStrategies = {
            'date-newest': new DateNewestFirstStrategy(),
            'date-oldest': new DateOldestFirstStrategy(),
            'alpha-az': new AlphabeticalAZStrategy(),
            'alpha-za': new AlphabeticalZAStrategy(),
            'status-pending': new StatusPendingFirstStrategy(),
            'status-complete': new StatusCompletedFirstStrategy(),
            'type': new TaskTypeStrategy()
        };
        
        // Estratégias de filtragem disponíveis
        this.filterStrategies = {
            'all': new ShowAllFilterStrategy(),
            'pending': new PendingFilterStrategy(),
            'in-progress': new InProgressFilterStrategy(),
            'completed': new CompletedFilterStrategy()
        };
        
        // Estratégias padrão
        this.currentSortStrategy = this.sortStrategies['date-newest'];
        this.currentFilterStrategy = this.filterStrategies['all'];
    }
    
    // Definir estratégia de ordenação
    setSortStrategy(strategyKey) {
        if (this.sortStrategies[strategyKey]) {
            this.currentSortStrategy = this.sortStrategies[strategyKey];
            return true;
        }
        return false;
    }
    
    // Definir estratégia de filtragem
    setFilterStrategy(strategyKey) {
        if (this.filterStrategies[strategyKey]) {
            this.currentFilterStrategy = this.filterStrategies[strategyKey];
            return true;
        } else if (strategyKey.startsWith('type:')) {
            const type = strategyKey.split(':')[1];
            this.currentFilterStrategy = new TypeFilterStrategy(type);
            return true;
        } else if (strategyKey.startsWith('search:')) {
            const searchText = strategyKey.split(':')[1];
            this.currentFilterStrategy = new SearchFilterStrategy(searchText);
            return true;
        }
        return false;
    }
    
    // Processar as tarefas com as estratégias atuais
    process(tasks) {
        // Primeiro filtra, depois ordena
        const filteredTasks = this.currentFilterStrategy.filter(tasks);
        return this.currentSortStrategy.sort(filteredTasks);
    }
    
    // Obter todas as estratégias de ordenação disponíveis
    getAvailableSortStrategies() {
        return Object.entries(this.sortStrategies).map(([key, strategy]) => {
            return {
                key,
                name: strategy.getName()
            };
        });
    }
    
    // Obter todas as estratégias de filtragem disponíveis
    getAvailableFilterStrategies() {
        return Object.entries(this.filterStrategies).map(([key, strategy]) => {
            return {
                key,
                name: strategy.getName()
            };
        });
    }
    
    // Obter informações sobre as estratégias atuais
    getCurrentStrategiesInfo() {
        return {
            sort: {
                name: this.currentSortStrategy.getName()
            },
            filter: {
                name: this.currentFilterStrategy.getName()
            }
        };
    }
}