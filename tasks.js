// Tasks Page Logic

let currentEditingTask = null;

// Modal Controls
const modal = document.getElementById('taskModal');
const addTaskBtn = document.getElementById('addTaskBtn');
const closeModalBtn = document.getElementById('closeModal');
const taskForm = document.getElementById('taskForm');

addTaskBtn.addEventListener('click', () => {
    currentEditingTask = null;
    document.getElementById('modalTitle').textContent = 'Создать задачу';
    taskForm.reset();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
});

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
});

// Form Submit
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        categoryId: parseInt(document.getElementById('taskCategory').value) || null,
        priority: document.getElementById('taskPriority').value
    };

    if (currentEditingTask) {
        await updateTask(currentEditingTask.id, taskData);
    } else {
        await addTask(taskData);
    }

    modal.classList.add('hidden');
    modal.classList.remove('flex');
    loadTasks();
});

// Load Categories into Dropdowns
async function loadCategoriesIntoSelects() {
    const categories = await getCategories();
    const selects = [
        document.getElementById('taskCategory'),
        document.getElementById('filterCategory')
    ];

    selects.forEach(select => {
        const isFilter = select.id === 'filterCategory';
        select.innerHTML = isFilter ? '<option value="">Все категории</option>' : '<option value="">Выберите категорию</option>';

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.icon} ${cat.name}`;
            select.appendChild(option);
        });
    });
}

// Load and Display Tasks
async function loadTasks() {
    const tasks = await getTasks();
    const categories = await getCategories();
    const container = document.getElementById('tasksContainer');

    // Apply filters
    const categoryFilter = document.getElementById('filterCategory').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();

    let filteredTasks = tasks.filter(t => !t.completed);

    if (categoryFilter) {
        filteredTasks = filteredTasks.filter(t => t.categoryId === parseInt(categoryFilter));
    }
    if (priorityFilter) {
        filteredTasks = filteredTasks.filter(t => t.priority === priorityFilter);
    }
    if (searchQuery) {
        filteredTasks = filteredTasks.filter(t =>
            t.title.toLowerCase().includes(searchQuery) ||
            (t.description && t.description.toLowerCase().includes(searchQuery))
        );
    }

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">📝</div>
                <p class="text-gray-600 text-lg">Задачи не найдены</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredTasks.map(task => {
        const category = categories.find(c => c.id === task.categoryId);
        return `
            <div class="task-card" data-task-id="${task.id}">
                <div class="flex items-start justify-between mb-3">
                    <span class="badge ${getPriorityClass(task.priority)}">
                        ${getPriorityText(task.priority)}
                    </span>
                    <div class="flex gap-2">
                        <button onclick="editTask(${task.id})" class="text-blue-500 hover:text-blue-700 text-xl">
                            ✏️
                        </button>
                        <button onclick="completeTask(${task.id})" class="text-green-500 hover:text-green-700 text-xl">
                            ✅
                        </button>
                        <button onclick="deleteTaskById(${task.id})" class="delete-btn text-red-500 hover:text-red-700 text-xl">
                            🗑️
                        </button>
                    </div>
                </div>
                <h4 class="text-lg font-bold text-gray-800 mb-2">
                    ${task.title}
                </h4>
                <p class="text-gray-600 text-sm mb-3">
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

// Task Actions
async function editTask(taskId) {
    const tasks = await getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    currentEditingTask = task;
    document.getElementById('modalTitle').textContent = 'Редактировать задачу';
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskCategory').value = task.categoryId || '';
    document.getElementById('taskPriority').value = task.priority;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

async function completeTask(taskId) {
    await toggleTaskComplete(taskId);
    loadTasks();
}

async function deleteTaskById(taskId) {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        await deleteTask(taskId);
        loadTasks();
    }
}

// Filters
document.getElementById('filterCategory').addEventListener('change', loadTasks);
document.getElementById('filterPriority').addEventListener('change', loadTasks);
document.getElementById('searchInput').addEventListener('input', loadTasks);
document.getElementById('clearFilters').addEventListener('click', () => {
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterPriority').value = '';
    document.getElementById('searchInput').value = '';
    loadTasks();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCategoriesIntoSelects();
    loadTasks();
});
