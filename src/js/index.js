import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader,clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/likes';


/** Global state of the app
 * - search object
 * - current recipe object
 * - shopping list object
 * - liked recipes
 */
const state = {};

//local storage area
 let listStorage = [];

 /*SEARCH CONTROLLER
*/
const controlSearch = async() =>{
    //1- get the query from view
   const query = searchView.getInput();


    if(query){
        //2. make new search object and add to state
        state.search = new Search(query);
    }
    //3. prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try{
    //4. search for results
    await state.search.getResults();

    //5. render the results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
    }catch(err){
        clearLoader();
    }

}

elements.searchForm.addEventListener('submit', e =>{
e.preventDefault();
controlSearch();
});

elements.searchResPages.addEventListener('click', e =>{  //event delegation
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
         
    }

})
/*
RECIPE CONTROLLER
*/
const controlRecipe = async () => {
    //get id from url
const id = window.location.hash.replace('#','');
if(id){
    //prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    if(state.search) {
    //hightlight the selected recipe
        searchView.highlightSelected(id);
    }
    //create new recipe object
     state.recipe = new Recipe(id);

    try{

         //get the data of the recipe and parse the ingredients
        await state.recipe.getRecipe();

        state.recipe.parseIngredients();
         //calculate cooking and serving times
        state.recipe.calcTime();
        state.recipe.calcServings();
        //render recipe
        clearLoader();
        //render recipe on UI
        const isLikedAlready = (state.likes) ? state.likes.isLiked(id) : false;
        recipeView.renderRecipe(state.recipe, isLikedAlready);

    }catch(error){
        console.log(error);
        alert('Error processing recipe!');
    }
    
}
};

//LIST CONTROLLLER

const controlList = () => {
    //create a list if there is no list
    if (!state.list) state.list = new List();
    //add each ingredient to the list and UI
   
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
        
        //add to sotrage area
        listStorage.push(item);
        localStorage.setItem('shoppingList',JSON.stringify(listStorage));
        
        
    });

};

//LIKE CONTROLLER
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    //user not liked the current recipe 
    if(!state.likes.isLiked(currentID)){
        //add to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //toggle the like btn
            likesView.toggleLikeBtn(true);
        //add like to UI list
            likesView.renderLike(newLike);
         
        //user has liked the current recipe 
    }else{
        //remove from the state
        state.likes.deleteLike(currentID);
        //toggle the like btn
        likesView.toggleLikeBtn(false);

        //remove like from UI list
        likesView.deleteLike(currentID);


    }
}

//reading likes from local storage when page is loaded
window.addEventListener('load', () => {
    state.likes = new Likes();
    //restore likes
    //console.log(state.likes);
    state.likes.readStorage();
    //toggle the like btn
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //render the like
    state.likes.likes.forEach(like =>likesView.renderLike(like));
});

//handling delete and editting of list item
elements.shopping.addEventListener('click', e =>{
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //handle delete list item btn
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete state
        listStorage = state.list.deleteItem(id);
        localStorage.setItem('shoppingList',JSON.stringify(listStorage));
        //delete UI
        listView.deleteItem(id);

        //inc or dec count
    }else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
    //deleting manually added ingredient
    else if (e.target.matches('.ingredient__delete, .ingredient__delete *')){
        //delete from storage
        listStorage = listView.deleteItem(id);
        localStorage.setItem('shoppingList',JSON.stringify(listStorage));
        //delete from UI
        const index = state.list.items.findIndex(el => el.id === id);
        state.list.items.splice(index,1);

    }

});

//handling adding ingredient manually and clearing the list
elements.mainShoppingList.addEventListener('click', e =>{
    //clear the shopping list
    if (e.target.matches('.delete-all-items')){
        delete state.list;
        elements.shopping.innerHTML = '';
        localStorage.removeItem('shoppingList');
        listStorage=[];
    }
    //render ingredient input fields
    else if(e.target.matches('.add-shopping-item')){
        listView.showIngredientInputs('');
    }
    //remove ingredient input fields
    else if(e.target.matches('.remove-ingredient-btn, .remove-ingredient-btn *')){
        listView.clearIngredientInputs();
    }
    //adding ingredient to list
    else if(e.target.matches('.add-ingredient-btn, .add-ingredient-btn *')){
        //add to list
        let renderIngredient;
        if (!state.list){
             state.list = new List();
             renderIngredient = listView.renderIngredient();
             state.list.items.push(renderIngredient);
        }else{
            renderIngredient = listView.renderIngredient();
            state.list.items.push(renderIngredient);
               };
       
        listStorage.push(renderIngredient);
        localStorage.setItem('shoppingList',JSON.stringify(listStorage));
        
    }
});

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe)); //two different event attached to the same element. hashchange is for when we click a recipe and load is for keeping the results on the page if the page is refreshed

//recipe events
elements.recipe.addEventListener('click', e => {    
    //dec button
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    //inc button
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    //add to shopping list btn
    else if (e.target.matches('.recipe__btn--add,.recipe__btn--add *')){
        controlList();
      //add to favorites  
    }else if (e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
});

//removing error sign
window.addEventListener('click', e => {
    if(document.querySelector('.error-pop-up')){

        if((e.target.id !== 'error-img')){
            const el = document.querySelector('.error-pop-up');
           el.parentElement.removeChild(el);
        }
    }
 

});

//search term button
   elements.searchTerms.onclick = function () {   
        window.open( "https://forkify-api.herokuapp.com/phrases.html",'_blank');
     };