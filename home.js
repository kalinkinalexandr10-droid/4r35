// Home Page Specific Logic

async function loadStats() {
    const tasks = await getTasks();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('activeTasks').textContent = activeTasks;
}

async function loadRecentTasks() {
    const tasks = await getTasks();
    const categories = await getCategories();
    const container = document.getElementById('recentTasksContainer');

    // Get 6 most recent tasks
    const recentTasks = tasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

    if (recentTasks.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">📝</div>
                <p class="text-gray-600 text-lg">У вас пока нет задач</p>
                <a href="tasks.html" class="btn btn-primary mt-4 inline-block">Создать первую задачу</a>
            </div>
        `;
        return;
    }

    container.innerHTML = recentTasks.map(task => {
        const category = categories.find(c => c.id === task.categoryId);
        return `
            <div class="task-card ${task.completed ? 'completed' : ''}">
                <div class="flex items-start justify-between mb-3">
                    <span class="badge ${getPriorityClass(task.priority)}">
                        ${getPriorityText(task.priority)}
                    </span>
                    ${task.completed ? '<span class="text-2xl">✅</span>' : ''}
                </div>
                <h4 class="text-lg font-bold text-gray-800 mb-2 ${task.completed ? 'line-through' : ''}">
                    ${task.title}
                </h4>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                    ${task.description || 'Нет описания'}
                </p>
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <span>${category ? category.icon + ' ' + category.name : '📋 Без категории'}</span>
                    <span>${formatDate(task.createdAt)}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadRecentTasks();
});
