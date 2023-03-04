// import icons from '../img/icons.svg';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarks.js';
import addRecipeView from './views/addRecipeView.js';
import {MODAL_CLOSE_SEC} from './config.js'

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';


// if(module.hot){
//   module.hot.accept();
// }


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipes = async function(){
  try{

    const id = window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner()

    //  update results view to mark selected search results 
    resultView.update(model.getSearchResults());
    
    //  loading recipe
    await model.loadRecipe(id);
    
    //  rendering recipe
    recipeView.render(model.state.recipe);
    
    // const recipeView = new recipeView(model.state.recipe)
    bookmarksView.update(model.state.bookmarks)

  } catch(err) {
    recipeView.renderError();
  }

};


const controlSearchResults = async function(){
  try{

    resultView.renderSpinner();

    // get search query
    const query = searchView.getQuery();
    if(!query) return;

    // load search results
    await model.loadSearchResult(query);

    // render results
    resultView.render(model.getSearchResults());
    
    // render initial pagination buttons
    paginationView.render(model.state.search);
    

  } catch(err) {
    console.log(err);
  }
}

const controlPagination = function(gotoPage){
  resultView.render(model.getSearchResults(gotoPage));
  paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  // update the recipe servings
  model.updateServings(newServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
  // recipeView.render(model.state.recipe);
}

const controlAddBookmark = function(){
  //  ADD or REMOVE bookmark
  if(!model.state.recipe.bookmarked){
    model.addBookMark(model.state.recipe);
  }
  else{
    model.removeBookMark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);

  // Render bookmarks 
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe) {
  try{
    // Show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    
    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // Chnage ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);


    //close form
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  }catch(err){
    console.log(err);
    addRecipeView.render(err.message)
  }
  location.reload(); 
}


const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookMark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();


