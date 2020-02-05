import {elements} from './base';
import uniqid from 'uniqid';

export const renderItem = item => {
const markup = 
`
<li class="shopping__item" data-itemid = ${item.id}>
    <div class="shopping__count">
        <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
        <p>${item.unit}</p>
    </div>
    <p class="shopping__description">${item.ingredient}</p>
    <button class="shopping__delete btn-tiny">
        <svg>
            <use href="img/icons.svg#icon-circle-with-cross"></use>
        </svg>
    </button>
</li>

`;
elements.shopping.insertAdjacentHTML('beforeend',markup);
} 

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    item.parentElement.removeChild(item);
    //remove from storage
    const storage = JSON.parse(localStorage.getItem('shoppingList'));
        const index2 = storage.findIndex(el => el.id === id);
        storage.splice(index2,1);
        return storage;
}
export const showIngredientInputs = () =>{
    elements.addIngredientBtn.disabled = true;
    const markup = `
    <div class="manual-ingredient-inputs">
        <button class="btn-tiny remove-ingredient-btn">
        <svg>
            <use href="img/icons.svg#icon-circle-with-cross"></use>
        </svg>
        </button>
        <input type="number" class="count-input" placeholder ="portion" min="1">
        <select class="unit-input">
            <option value="tbsp" selected>tbsp</option> 
            <option value="oz">oz</option>
            <option value="tsp">tsp</option>
            <option value="cup">cup</option>
            <option value="pound">pound</option>
            <option value="kg">kg</option>
            <option value="g">g</option>   
        </select>
        <input type="text" class = "ingredient-input" placeholder = "description">
        <button class="btn-tiny add-ingredient-btn">
            <svg>
             <use href="img/icons.svg#icon-circle-with-plus"></use>
            </svg>
         </button>         
    </div>
    `;
    document.querySelector('.btn-list').insertAdjacentHTML('afterend', markup);
}

export const clearIngredientInputs = () =>{
const ingredientInputs = document.querySelector('.manual-ingredient-inputs');
  ingredientInputs.parentElement.removeChild(ingredientInputs);   
  elements.addIngredientBtn.disabled = false;

}

export const renderIngredient = () => {
    const ingredient = {
        id: uniqid(),
        count: parseInt(document.querySelector('.count-input').value),
        unit: document.querySelector('.unit-input').value,
        ingredient: document.querySelector('.ingredient-input').value
    };   
    
    const markup = 
`
<li class="shopping__item" data-itemId = ${ingredient.id}>
    <div class="shopping__count">
        <input type="number" min="1" value="${ingredient.count}" step="${ingredient.count}" class="shopping__count-extra-value">
        <p>${ingredient.unit}</p>
    </div>
    <p class="shopping__description">${ingredient.ingredient}</p>
    <button class="ingredient__delete btn-tiny">
        <svg>
            <use href="img/icons.svg#icon-circle-with-cross"></use>
        </svg>
    </button>
</li>

`;
elements.shopping.insertAdjacentHTML('afterbegin', markup);
const el = document.querySelector('.manual-ingredient-inputs');
el.parentElement.removeChild(el);
elements.addIngredientBtn.disabled = false;

return ingredient;
}

