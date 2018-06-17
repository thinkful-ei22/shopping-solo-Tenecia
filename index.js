'use strict';

const STORE = {
  items: [
    { name: 'apples', checked: false, edit: false },
    { name: 'oranges', checked: false, edit: false },
    { name: 'milk', checked: true, edit: false },
    { name: 'bread', checked: false, edit: false }
  ],
  hidechecked: false,
  searchTerm: null,
};

/*            Render Shopping List In Dom   */


function generateItemElement(item, itemIndex) {
  const checkedItem = item.checked ? 'shopping-item__checked' : '';
  const checkButtton = item.checked ? 'uncheck' : 'check';
 
  // initial shopping list render
    
  let itemHTML = (
    `<span class="shopping-item js-shopping-item ${checkedItem}">
      ${item.name}
    </span>
    <div class="shopping-item-controls">
    <button type="button" class="shopping-item-toggle js-toggle-checked">
      <span class="button-label">${checkButtton}</span>
    </button>
    <button type="button" class="shopping-item-edit js-toggle-edit">
      <span class="button-label">edit</span>
    </button>
    <button type="button" class="shopping-item-delete js-delete-item">
      <span class="button-label">delete</span>
    </button>
  </div>`
  );
  
  // Editing Render
  
  if (item.edit) {
    itemHTML = (
      `<form id="js-edit-form">
        <input
          type="text"
          id="name"
          class="js-updated-name shopping-item"
          name="name"
          value="${item.name}"
          aria-label="Rename ${item.name}"
        >
        <div class="shopping-item-controls">
          <button type="button"class="shopping-item-cancel-edit js-toggle-edit">
            <span class="button-label">cancel</span>
          </button>
          <button type="submit" class="shopping-item-save-edit js-save-edit">
            <span class="button-label">save</span>
          </button>
        </div>
      </form>`
    );
  }
  
  return (
    `<li class="js-item-index-element" data-item-index="${itemIndex}">
      ${itemHTML}
    </li>`
  );
}

function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  
  const items = STORE.items.filter(listRender);
  const shoppingListItemsString = generateShoppingItemsString(items);
  const itemNoun = items.length === 1 ? 'item' : 'items';
  
  // update DOM
  $('.js-list-count').text(`${items.length} ${itemNoun}`);
  // Render the list
  $('.js-shopping-list').html(shoppingListItemsString);
}

// Check render
function listRender(item){
  const { hidechecked, searchTerm } = STORE;

  // Checks to see if checked items should be hidden
  if (hidechecked && item.checked) {
    return false;
  }

  // Checks for search items
  if (searchTerm) {
    return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
  }
  return true;

}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating the list.');
  
  return shoppingList.map(generateItemElement).join('');
}

/*           Event  Functions           */


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list.`);


  STORE.items.push({
    name: itemName,
    checked: false,
    edit: false,
  });
}
    
function handleNewItemSubmit() {
  $('#js-shopping-list-form').on('submit', function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
    
}


function deleteListItem(itemIndex) {
  console.log(`Deleting item at index ${itemIndex} from shopping list.`);
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-delete-item', function(event) {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
}

function editItemName(itemIndex, newItem) {
  const currentItem = STORE.items[itemIndex];
  if (currentItem.name === newItem) {
    console.error('Please enter a new item!');
    return;
  } 
  console.log(`Changed ${currentItem.name} to ${newItem}`);
  STORE.items[itemIndex].name = newItem;
}

function handleToggleEditItem() {
  $('.js-shopping-list').on('click', '.js-toggle-edit', function(event) {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleItemEditing(itemIndex);
    renderShoppingList();
  });
}

function handleEditItem() {
  $('.js-shopping-list').on('submit', '#js-edit-form', function(event) {
    event.preventDefault();
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    const updateditemName = $('.js-updated-name').val();
    editItemName(itemIndex, updateditemName);
    toggleItemEditing(itemIndex);
    renderShoppingList();
  });
}

function toggleItemEditing(itemIndex) {  
  console.log(`Toggling editing property for item at index ${itemIndex}.`);
  STORE.items.map((item, idx) => {
    item.edit = (idx === itemIndex ? !item.edit : false);
  });  
}

function toggleCheckedForListItem(itemIndex) {
  console.log(`Toggling checked property for item at index ${itemIndex}.`);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-toggle-checked', function(event) {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function updateSearchTerm(term) {
  STORE.searchTerm = term;
}

function handleSearchItemSubmit() {
  $('#js-search-form').on('submit', function(event) {
    event.preventDefault();
    const term = $('.js-search-term').val();
    updateSearchTerm(term);
    renderShoppingList();
  });
}
// Check render
function listRender(item){
  const { hidechecked, searchTerm } = STORE;
  if (hidechecked && item.checked) {
    return false;
  }
  if (searchTerm) {
    return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
  }
  return true;

}

function toggleCheckedVisibility() {
  STORE.hidechecked = !STORE.hidechecked;
}

function handleToggleCheckedVisibility() {
  $('#js-search-form').on('change', '.js-toggle-checked', function(event) {
    toggleCheckedVisibility();
    renderShoppingList();
  });
}



/*       Handle Event Functions   */
function getItemIndexFromElement(elem) {
  return $(elem)
    .closest('.js-item-index-element')
    .data('item-index');
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleSearchItemSubmit();
  handleToggleCheckedVisibility();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleEditItem();
  handleEditItem();
}

$(handleShoppingList);

