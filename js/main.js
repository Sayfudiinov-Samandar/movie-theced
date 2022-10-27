//Move box array
let movieArray = JSON.parse(window.localStorage.getItem("array")) || [];


//Dom element
let elList = document.querySelector(".hero__list");
let elSearchForm = document.querySelector(".header-form");
let elSearchinput = document.querySelector(".search-input");

//Modal element
let elModal = document.querySelector(".modal");
let elModalTitle = elModal.querySelector(".modal__item-title");
let elModalIframe = elModal.querySelector(".modal__iframe");
let elModalStar = elModal.querySelector(".list__star");
let elModalYear = elModal.querySelector(".list__year");
let elModalStart = elModal.querySelector(".list__start-time");
let elModalCategories = elModal.querySelector(".modal__categories");
let elModalSummary = elModal.querySelector(".modal__summary");
let elModalImdbLink = elModal.querySelector(".modal__imdb-link");

//Dom year search element
const elStartYear=document.querySelector(".start-year")
const elEndYear=document.querySelector(".end-year")



// Categories btn
const elSelect = elSearchForm.querySelector(".form-select");
let selectFragment = new DocumentFragment();
let categoriesString = []

// Sort A-Z
let elSelectSortBy=document.querySelector(".sort_by");


let elListTemplate = document.querySelector(".list-temlpate").content;

function makeMovieBox(movieBox) {
    elList.innerHTML = ""
    let fragment = document.createDocumentFragment();
    movieBox.forEach(obj => {
        let listTemplaeClone = elListTemplate.cloneNode(true);

        listTemplaeClone.querySelector(".list__item-img").src = obj.youtubePoster
        listTemplaeClone.querySelector(".list__item-title").textContent = obj.title;
        listTemplaeClone.querySelector(".list__star").textContent = obj.imdbRating;
        listTemplaeClone.querySelector(".list__year").textContent = obj.year;
        listTemplaeClone.querySelector(".list__start-time").textContent = `${Math.trunc(obj.runtime/60)} hr ${obj.runtime % 60} min`
        listTemplaeClone.querySelector(".list__categories").textContent = obj.categories;
        listTemplaeClone.querySelector(".list__learn-more").textContent = "More info";
        listTemplaeClone.querySelector(".list__learn-more").dataset.titleMovie=obj.title;

        fragment.appendChild(listTemplaeClone);
    });
    elList.appendChild(fragment);
}

function showModal(item){
    let movieArray=movies.find(elm=>{
        return elm.title==item
    })
    elModalTitle.textContent = movieArray.title;
    elModalIframe.src = `https://www.youtube-nocookie.com/embed/${movieArray.youtubeId}`
    elModalStar.textContent = movieArray.imdbrating
    elModalYear.textContent = movieArray.year
    elModalStart.textContent = `${Math.trunc(movieArray.runtime/60)} hr ${movieArray.runtime % 60} min`
    elModalCategories.textContent = movieArray.categories
    elModalSummary.textContent = movieArray.summary
    elModalImdbLink.textContent = "Show in Imdb"
    elModalImdbLink.href = movieArray.imdbPage
}

elList.addEventListener("click",function(evt){
    if (evt.target.matches(".list__learn-more")) {
        showModal(evt.target.dataset.titleMovie)
    } 
})

function filetSearchInfo(item){
    return movies.filter(elm=>{
        let findMovies=elm.title.match(item) && (elSelect.value=="All" || elm.categories.includes(elSelect.value)) && (elStartYear.value==""||elm.year>=Number(elStartYear.value)) &&(elEndYear.value=="" || elm.year<=Number(elEndYear.value))


        return findMovies
    })
}

function getVategoriesForSelect(){
    movies.forEach(item=>{
        let categoriesMovie=item.categories;
        categoriesMovie.forEach(elm=>{
            if (!categoriesString.includes(elm)) {
                categoriesString.push(elm)
            }
        })
    })
}

function showCategoriesSelect(){
    categoriesString.forEach(elm=>{
        let eloption=document.createElement("option");
        eloption.textContent=elm;
        eloption.value=elm
        selectFragment.appendChild(eloption)
    })
    elSelect.appendChild(selectFragment)
}

function sortBy(array, whichBy) {
    if (whichBy=="a-z") {
        array.sort((a,b)=> a.title.charCodeAt(0) - b.title.charCodeAt(0))
    }else if(whichBy=="z-a"){
        array.sort((a,b)=> b.title.charCodeAt(0) - a.title.charCodeAt(0))
    }else if(whichBy=="strat"){
        array.sort((a,b)=> b.year - a.year)
    }else if(whichBy=="end"){
        array.sort((a,b)=> a.year - b.year)
    }
}

elSearchForm.addEventListener("submit" ,function(evt){
    evt.preventDefault();
    let searchInputValue = new RegExp(elSearchinput.value.trim(), 'gi');
    let searchmovieFilter=filetSearchInfo(searchInputValue)
    
    if (searchmovieFilter.length > 0) {

        sortBy(searchmovieFilter, elSelectSortBy.value)
        makeMovieBox(searchmovieFilter)    
    }else{
        alert("Sorry I can't find your movie")
    }
})

getVategoriesForSelect()
showCategoriesSelect()
makeMovieBox(movies.slice(0, 50))