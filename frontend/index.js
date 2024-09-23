import { backend } from 'declarations/backend';

const shoppingList = document.getElementById('shopping-list');
const addItemForm = document.getElementById('add-item-form');
const newItemInput = document.getElementById('new-item-input');
const suggestionList = document.getElementById('suggestion-list');

async function loadItems() {
  const items = await backend.getItems();
  shoppingList.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="${item.completed ? 'completed' : ''}">${item.text}</span>
      <div>
        <button class="toggle-btn" data-id="${item.id}">
          <i class="fas ${item.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
        </button>
        <button class="delete-btn" data-id="${item.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    shoppingList.appendChild(li);
  });
}

async function loadSuggestions(suggestions) {
  suggestionList.innerHTML = '';
  suggestions.forEach(suggestion => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${suggestion}</span>
      <button class="add-suggestion-btn" data-suggestion="${suggestion}">
        <i class="fas fa-plus"></i>
      </button>
    `;
    suggestionList.appendChild(li);
  });
}

addItemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = newItemInput.value.trim();
  if (text) {
    const result = await backend.addItem(text);
    newItemInput.value = '';
    await loadItems();
    loadSuggestions(result.suggestions);
  }
});

shoppingList.addEventListener('click', async (e) => {
  if (e.target.closest('.toggle-btn')) {
    const id = parseInt(e.target.closest('.toggle-btn').dataset.id);
    await backend.toggleItem(id);
    await loadItems();
  } else if (e.target.closest('.delete-btn')) {
    const id = parseInt(e.target.closest('.delete-btn').dataset.id);
    await backend.deleteItem(id);
    await loadItems();
    const suggestions = await backend.getSuggestions();
    loadSuggestions(suggestions);
  }
});

suggestionList.addEventListener('click', async (e) => {
  if (e.target.closest('.add-suggestion-btn')) {
    const suggestion = e.target.closest('.add-suggestion-btn').dataset.suggestion;
    const result = await backend.addItem(suggestion);
    await loadItems();
    loadSuggestions(result.suggestions);
  }
});

window.addEventListener('load', async () => {
  await loadItems();
  const suggestions = await backend.getSuggestions();
  loadSuggestions(suggestions);
});
