// Completed Tasks Page Logic

async function loadCompletedStats() {
    const tasks = await getTasks();
    const completedTasks = tasks.filter(t => t.completed);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const completedToday = completedTasks.filter(t => {
        const completedDate = new Date(t.completedAt);
        return completedDate >= today;
    }).length;

    const completedWeek = completedTasks.filter(t => {
        const completedDate = new Date(t.completedAt);
        return completedDate >= weekAgo;
    }).length;

    document.getElementById('completedCount').textContent = completedTasks.length;
    document.getElementById('completedToday').textContent = completedToday;
    document.getElementById('completedWeek').textContent = completedWeek;
}

async function loadCompletedTasks() {
    const tasks = await getTasks();
    const categories = await getCategories();
    const container = document.getElementById('completedTasksContainer');

    const completedTasks = tasks
        .filter(t => t.completed)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    if (completedTasks.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">🎯</div>
                <p class="text-gray-600 text-lg">У вас пока нет завершенных задач</p>
                <a href="tasks.html" class="btn btn-primary mt-4 inline-block">Перейти к задачам</a>
            </div>
        `;
        return;
    }

    container.innerHTML = completedTasks.map(task => {
        const category = categories.find(c => c.id === task.categoryId);
        return `
            <div class="task-card completed">
                <div class="flex items-start justify-between mb-3">
                    <span class="badge bg-green-500 text-white">
                        ✅ Завершено
                    </span>
                    <button onclick="uncompleteTask(${task.id})" class="text-blue-500 hover:text-blue-700 text-xl" title="Вернуть в активные">
                        ↩️
                    </button>
                </div>
                <h4 class="text-lg font-bold text-gray-800 mb-2 line-through">
                    ${task.title}
                </h4>
                <p class="text-gray-600 text-sm mb-3">
                    ${task.description || 'Нет описания'}
                </p>
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <span>${category ? category.icon + ' ' + category.name : '📋 Без категории'}</span>
                    <span>✅ ${formatDate(task.completedAt)}</span>
                </div>
            </div>
        `;
    }).join('');
}

async function uncompleteTask(taskId) {
    await toggleTaskComplete(taskId);
    loadCompletedStats();
    loadCompletedTasks();
}

async function clearAllCompleted() {
    if (confirm('Вы уверены, что хотите удалить все завершенные задачи? Это действие нельзя отменить.')) {
        const tasks = await getTasks();
        const activeTasks = tasks.filter(t => !t.completed);
        await localforage.setItem('tasks', activeTasks);
        loadCompletedStats();
        loadCompletedTasks();
    }
}

document.getElementById('clearCompleted').addEventListener('click', clearAllCompleted);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCompletedStats();
    loadCompletedTasks();
});
