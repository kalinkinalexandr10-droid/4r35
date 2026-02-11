// Global App Logic and LocalForage Setup

// Configure LocalForage
localforage.config({
    name: 'TaskMasterDB',
    storeName: 'tasks'
});

// Initialize database
async function initDB() {
    try {
        const tasks = await localforage.getItem('tasks');
        if (!tasks) {
            await localforage.setItem('tasks', []);
        }
        const categories = await localforage.getItem('categories');
        if (!categories) {
            await localforage.setItem('categories', [
                { id: 1, name: 'Работа', icon: '💼', color: '#3b82f6' },
                { id: 2, name: 'Личное', icon: '🏠', color: '#10b981' },
                { id: 3, name: 'Покупки', icon: '🛒', color: '#f59e0b' },
                { id: 4, name: 'Здоровье', icon: '❤️', color: '#ef4444' }
            ]);
        }
    } catch (error) {
        console.error('Failed to initialize DB:', error);
    }
}

// Task CRUD Operations
async function getTasks() {
    try {
        return await localforage.getItem('tasks') || [];
    } catch (error) {
        console.error('Failed to get tasks:', error);
        return [];
    }
}

async function addTask(task) {
    try {
        const tasks = await getTasks();
        task.id = Date.now();
        task.createdAt = new Date().toISOString();
        task.completed = false;
        tasks.push(task);
        await localforage.setItem('tasks', tasks);
        return task;
    } catch (error) {
        console.error('Failed to add task:', error);
        return null;
    }
}

async function updateTask(taskId, updates) {
    try {
        const tasks = await getTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            await localforage.setItem('tasks', tasks);
            return tasks[index];
        }
        return null;
    } catch (error) {
        console.error('Failed to update task:', error);
        return null;
    }
}

async function deleteTask(taskId) {
    try {
        const tasks = await getTasks();
        const filtered = tasks.filter(t => t.id !== taskId);
        await localforage.setItem('tasks', filtered);
        return true;
    } catch (error) {
        console.error('Failed to delete task:', error);
        return false;
    }
}

async function toggleTaskComplete(taskId) {
    try {
        const tasks = await getTasks();
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            await localforage.setItem('tasks', tasks);
            return task;
        }
        return null;
    } catch (error) {
        console.error('Failed to toggle task:', error);
        return null;
    }
}

// Category Operations
async function getCategories() {
    try {
        return await localforage.getItem('categories') || [];
    } catch (error) {
        console.error('Failed to get categories:', error);
        return [];
    }
}

async function addCategory(category) {
    try {
        const categories = await getCategories();
        category.id = Date.now();
        categories.push(category);
        await localforage.setItem('categories', categories);
        return category;
    } catch (error) {
        console.error('Failed to add category:', error);
        return null;
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

function getPriorityClass(priority) {
    const classes = {
        'high': 'priority-high',
        'medium': 'priority-medium',
        'low': 'priority-low'
    };
    return classes[priority] || 'priority-low';
}

function getPriorityText(priority) {
    const texts = {
        'high': 'Высокая',
        'medium': 'Средняя',
        'low': 'Низкая'
    };
    return texts[priority] || 'Низкая';
}

// Set active navigation link
function setActiveNav(pageName) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === pageName) {
            link.classList.add('active');
        }
    });
}

// Initialize on page load
initDB();
