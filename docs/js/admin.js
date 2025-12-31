// Admin Panel functionality
let adminData = { categories: [], items: [] };
let githubConfig = {
    token: null,
    username: null,
    repo: null
};

document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin();
});

function initializeAdmin() {
    const adminBtn = document.getElementById('adminBtn');
    const adminPanel = document.getElementById('adminPanel');
    const adminClose = document.querySelector('.admin-close');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Load GitHub config from localStorage
    loadGithubConfig();

    // Load data from content.json
    loadAdminData();

    // Admin button toggle
    adminBtn.addEventListener('click', () => {
        adminPanel.classList.add('active');
    });

    adminClose.addEventListener('click', () => {
        adminPanel.classList.remove('active');
    });

    // GitHub setup
    document.getElementById('saveGithubSetup').addEventListener('click', saveGithubConfig);
    document.getElementById('clearGithubSetup').addEventListener('click', clearGithubConfig);

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });

    // Form submissions
    document.getElementById('addItemForm').addEventListener('submit', addNewItem);
    document.getElementById('addCategoryForm').addEventListener('submit', addNewCategory);
    document.getElementById('copyJsonBtn').addEventListener('click', copyJsonToClipboard);
    document.getElementById('saveToGithub').addEventListener('click', saveToGithub);

    // Close panel when clicking outside
    adminPanel.addEventListener('click', (e) => {
        if (e.target === adminPanel) {
            adminPanel.classList.remove('active');
        }
    });
}

function loadAdminData() {
    fetch('data/content.json')
        .then(response => response.json())
        .then(data => {
            adminData.site = data.site;
            adminData.categories = data.categories;
            adminData.items = data.items;
            
            // Populate form and displays
            populateCategorySelect();
            displayExistingItems();
            displayExistingCategories();
            updateJsonExport();
        })
        .catch(error => console.error('Error loading data:', error));
}

function populateCategorySelect() {
    const select = document.getElementById('itemCategory');
    select.innerHTML = '<option value="">Select category...</option>';
    
    adminData.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = `${cat.icon} ${cat.name}`;
        select.appendChild(option);
    });
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update JSON export when switching to export tab
    if (tabName === 'export') {
        updateJsonExport();
    }
}

function addNewItem(e) {
    e.preventDefault();

    const newItem = {
        id: `item-${String(adminData.items.length + 1).padStart(3, '0')}`,
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        image: document.getElementById('itemImage').value,
        rarity: document.getElementById('itemRarity').value,
        description: document.getElementById('itemDescription').value,
        details: document.getElementById('itemDetails').value,
        traits: document.getElementById('itemTraits').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t),
        habitat: document.getElementById('itemHabitat').value
    };

    adminData.items.push(newItem);

    // Reset form
    e.target.reset();

    // Update displays
    displayExistingItems();
    updateJsonExport();

    alert('✅ Item added successfully! Don\'t forget to export and upload to GitHub.');
}

function addNewCategory(e) {
    e.preventDefault();

    const newCategory = {
        id: document.getElementById('categoryId').value,
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value,
        icon: document.getElementById('categoryIcon').value
    };

    // Check if category already exists
    if (adminData.categories.some(cat => cat.id === newCategory.id)) {
        alert('❌ Category ID already exists!');
        return;
    }

    adminData.categories.push(newCategory);

    // Reset form
    e.target.reset();

    // Update displays
    populateCategorySelect();
    displayExistingCategories();
    updateJsonExport();

    alert('✅ Category added successfully! Don\'t forget to export and upload to GitHub.');
}

function displayExistingItems() {
    const list = document.getElementById('itemsList');
    list.innerHTML = '';

    if (adminData.items.length === 0) {
        list.innerHTML = '<p style="color: var(--text-dark);">No items yet. Add one above!</p>';
        return;
    }

    adminData.items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Rarity:</strong> ${item.rarity}</p>
                <p><strong>Image:</strong> ${item.image}</p>
            </div>
            <div class="item-actions">
                <button class="btn-delete" onclick="deleteItem(${index})">Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function displayExistingCategories() {
    const list = document.getElementById('categoriesList');
    list.innerHTML = '';

    if (adminData.categories.length === 0) {
        list.innerHTML = '<p style="color: var(--text-dark);">No categories yet. Add one above!</p>';
        return;
    }

    adminData.categories.forEach((cat, index) => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-info">
                <h4>${cat.icon} ${cat.name}</h4>
                <p><strong>ID:</strong> ${cat.id}</p>
                <p><strong>Description:</strong> ${cat.description}</p>
            </div>
            <div class="category-actions">
                <button class="btn-delete" onclick="deleteCategory(${index})">Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function deleteItem(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        adminData.items.splice(index, 1);
        displayExistingItems();
        updateJsonExport();
    }
}

function deleteCategory(index) {
    if (confirm('Are you sure you want to delete this category?')) {
        const categoryId = adminData.categories[index].id;
        
        // Check if any items use this category
        const itemsInCategory = adminData.items.filter(item => item.category === categoryId);
        if (itemsInCategory.length > 0) {
            alert(`❌ Cannot delete! ${itemsInCategory.length} item(s) still use this category.`);
            return;
        }

        adminData.categories.splice(index, 1);
        populateCategorySelect();
        displayExistingCategories();
        updateJsonExport();
    }
}

function updateJsonExport() {
    const exportData = {
        site: adminData.site,
        categories: adminData.categories,
        items: adminData.items
    };

    const jsonText = document.getElementById('jsonExport');
    jsonText.value = JSON.stringify(exportData, null, 2);
}

function copyJsonToClipboard() {
    const jsonText = document.getElementById('jsonExport');
    
    jsonText.select();
    document.execCommand('copy');

    const btn = document.getElementById('copyJsonBtn');
    const originalText = btn.textContent;
    btn.textContent = '✅ Copied!';

    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

// GitHub Configuration Functions
function loadGithubConfig() {
    const saved = localStorage.getItem('ecopediaGithubConfig');
    if (saved) {
        githubConfig = JSON.parse(saved);
        document.getElementById('githubToken').value = githubConfig.token || '';
        document.getElementById('githubUsername').value = githubConfig.username || '';
        document.getElementById('githubRepo').value = githubConfig.repo || '';
    }
}

function saveGithubConfig() {
    const token = document.getElementById('githubToken').value;
    const username = document.getElementById('githubUsername').value;
    const repo = document.getElementById('githubRepo').value;

    if (!token || !username || !repo) {
        showStatus('setupStatus', 'error', '❌ Please fill in all fields');
        return;
    }

    githubConfig = { token, username, repo };
    localStorage.setItem('ecopediaGithubConfig', JSON.stringify(githubConfig));
    showStatus('setupStatus', 'success', '✅ GitHub settings saved! You can now save directly to GitHub.');
}

function clearGithubConfig() {
    if (confirm('Are you sure? You will need to re-enter your token.')) {
        localStorage.removeItem('ecopediaGithubConfig');
        githubConfig = { token: null, username: null, repo: null };
        document.getElementById('githubToken').value = '';
        document.getElementById('githubUsername').value = '';
        document.getElementById('githubRepo').value = '';
        showStatus('setupStatus', 'success', '✅ GitHub settings cleared.');
    }
}

async function saveToGithub() {
    if (!githubConfig.token || !githubConfig.username || !githubConfig.repo) {
        alert('❌ Please set up GitHub credentials first (in the GitHub Setup section)');
        return;
    }

    const commitMessage = document.getElementById('commitMessage').value || 'Update Ecopedia content';
    const statusDiv = document.getElementById('saveStatus');
    
    try {
        showStatus('saveStatus', 'error', '⏳ Saving to GitHub...');

        const exportData = {
            site: adminData.site,
            categories: adminData.categories,
            items: adminData.items
        };

        const jsonContent = JSON.stringify(exportData, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(jsonContent)));

        // Get current file SHA (needed for GitHub API)
        const getShaResponse = await fetch(
            `https://api.github.com/repos/${githubConfig.username}/${githubConfig.repo}/contents/docs/data/content.json`,
            {
                headers: {
                    'Authorization': `token ${githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (!getShaResponse.ok && getShaResponse.status !== 404) {
            throw new Error(`GitHub API error: ${getShaResponse.statusText}`);
        }

        let sha = null;
        if (getShaResponse.ok) {
            const fileData = await getShaResponse.json();
            sha = fileData.sha;
        }

        // Update or create the file
        const updateResponse = await fetch(
            `https://api.github.com/repos/${githubConfig.username}/${githubConfig.repo}/contents/docs/data/content.json`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: commitMessage,
                    content: encodedContent,
                    sha: sha,
                    branch: 'main'
                })
            }
        );

        if (!updateResponse.ok) {
            const error = await updateResponse.json();
            throw new Error(error.message || `GitHub API error: ${updateResponse.statusText}`);
        }

        showStatus('saveStatus', 'success', '✅ Successfully saved to GitHub! Your changes will be live in 1-2 minutes.');
        document.getElementById('commitMessage').value = '';

    } catch (error) {
        console.error('Error saving to GitHub:', error);
        showStatus('saveStatus', 'error', `❌ Error: ${error.message}`);
    }
}

function showStatus(elementId, type, message) {
    const element = document.getElementById(elementId);
    element.className = type;
    element.textContent = message;
    element.style.display = 'block';
}
