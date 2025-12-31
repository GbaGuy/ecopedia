// Admin Panel functionality
let adminData = { categories: [], items: [] };
let githubConfig = {
    token: null,
    username: null,
    repo: null
};
let isShareMode = false;
let sharedData = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check if this is a share link
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get('share');
    
    if (shareId) {
        loadSharedData(shareId);
    } else {
        initializeAdmin();
    }
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
    document.getElementById('generateShareLink').addEventListener('click', generateShareLink);
    document.getElementById('copyShareLink')?.addEventListener('click', copyShareLink);

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

// Share Link Functions
function generateShareLink() {
    try {
        const exportData = {
            site: adminData.site,
            categories: adminData.categories,
            items: adminData.items
        };

        // Create a unique ID based on timestamp
        const shareId = 'share_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Compress and encode the data
        const jsonString = JSON.stringify(exportData);
        const compressed = btoa(jsonString); // Simple base64 encoding
        
        // Store in sessionStorage (expires when browser closes)
        sessionStorage.setItem(shareId, compressed);
        
        // Generate the share link
        const currentUrl = window.location.origin + window.location.pathname;
        const shareLink = `${currentUrl}?share=${shareId}`;
        
        // Display the share link
        document.getElementById('shareLink').value = shareLink;
        document.getElementById('shareLinkBox').style.display = 'block';
        
        showStatus('shareStatus', 'success', `✅ Share link generated! Valid for this browser session.`);
        
    } catch (error) {
        showStatus('shareStatus', 'error', `❌ Error generating share link: ${error.message}`);
    }
}

function copyShareLink() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    document.execCommand('copy');
    
    const btn = document.getElementById('copyShareLink');
    const originalText = btn.textContent;
    btn.textContent = '✅ Copied!';
    
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

function loadSharedData(shareId) {
    try {
        const compressed = sessionStorage.getItem(shareId);
        
        if (!compressed) {
            alert('❌ Share link expired or invalid. Share links are only valid for the current browser session.');
            window.location.href = window.location.pathname;
            return;
        }
        
        const jsonString = atob(compressed);
        const sharedData = JSON.parse(jsonString);
        
        adminData = sharedData;
        isShareMode = true;
        
        initializeAdmin();
        
        // Show banner that this is shared mode
        const banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff9800;
            color: white;
            padding: 0.8rem;
            text-align: center;
            font-weight: 600;
            z-index: 1000;
            border-bottom: 3px solid #f57c00;
        `;
        banner.innerHTML = `
            🔗 <strong>SHARE MODE:</strong> You're editing in shared mode. 
            Changes won't be saved unless the original owner clicks "Save to GitHub".
            <button onclick="this.parentElement.style.display='none'" style="float: right; background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">×</button>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
        
        // Disable GitHub save button in share mode
        const saveBtn = document.getElementById('saveToGithub');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.title = 'Not available in share mode';
            saveBtn.style.opacity = '0.5';
        }
        
    } catch (error) {
        alert('❌ Error loading shared data: ' + error.message);
        window.location.href = window.location.pathname;
    }
}
