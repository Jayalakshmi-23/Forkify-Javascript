import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
        this. _parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;

            const gotoPage = +btn.dataset.goto;
           
            handler(gotoPage);
        })
    }

    _generateMarkup(){
        const currPage = this._data.page;
        const numsPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
      

        // page 1 and there are other pages
        if(currPage === 1 && numsPages > 1){
            return this._nextBtn(currPage);
            
        }
        // last page 
        if(currPage === numsPages && numsPages > 1){
            return this._prevBtn(currPage);
            
        }
        // other pages
        if(currPage < numsPages){
            return `
            ${this._prevBtn(currPage)}
            ${this._nextBtn(currPage)}
            `
        }
        // page 1 and there are no other pages
        return "";
    }

    _prevBtn(currPage){
        return `<button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currPage - 1}</span>
    </button>`
    }
    _nextBtn(currPage){
        return `
        <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button> `
    }
}    

export default new PaginationView();