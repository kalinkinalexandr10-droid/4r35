// Categories Page Logic

const categoryModal = document.getElementById('categoryModal');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const closeCategoryModalBtn = document.getElementById('closeCategoryModal');
const categoryForm = document.getElementById('categoryForm');
let selectedColor = '#3b82f6';

// Modal Controls
addCategoryBtn.addEventListener('click', () => {
    categoryForm.reset();
    selectedColor = '#3b82f6';
    updateColorSelection();
    categoryModal.classList.remove('hidden');
    categoryModal.classList.add('flex');
});

closeCategoryModalBtn.addEventListener('click', () => {
    categoryModal.classList.add('hidden');
    categoryModal.classList.remove('flex');
});

categoryModal.addEventListener('click', (e) => {
    if (e.target === categoryModal) {
        categoryModal.classList.add('hidden');
        categoryModal.classList.remove('flex');
    }
});

// Color Selection
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        selectedColor = btn.dataset.color;
        document.getElementById('categoryColor').value = selectedColor;
        updateColorSelection();
    });
});

function updateColorSelection() {
    document.querySelectorAll('.color-btn').forEach(btn => {
        if (btn.dataset.color === selectedColor) {
            btn.style.transform = 'scale(1.2)';
            btn.style.boxShadow = '0 0 0 3px white, 0 0 0 5px ' + selectedColor;
        } else {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
        }
    });
}

// Form Submit
categoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const categoryData = {
        name: document.getElementById('categoryName').value,
        icon: document.getElementById('categoryIcon').value,
        color: selectedColor
    };

    await addCategory(categoryData);
    categoryModal.classList.add('hidden');
    categoryModal.classList.remove('flex');
    loadCategories();
});

// Load and Display Categories
async function loadCategories() {
    const categories = await getCategories();
    const tasks = await getTasks();
    const container = document.getElementById('categoriesContainer');

    container.innerHTML = categories.map(category => {
        const taskCount = tasks.filter(t => t.categoryId === category.id && !t.completed).length;
        return `
            <div class="category-card" style="border-color: ${category.color};">
                <div class="text-5xl mb-4">${category.icon}</div>
                <h4 class="text-lg font-bold text-gray-800 mb-2">${category.name}</h4>
                <div class="text-3xl font-bold mb-2" style="color: ${category.color};">
                    ${taskCount}
                </div>
                <p class="text-gray-600 text-sm">
                    ${taskCount === 1 ? 'задача' : taskCount > 4 ? 'задач' : 'задачи'}
                </p>
            </div>
        `;
    }).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateColorSelection();
    loadCategories();
});
