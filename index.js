const form = document.querySelector('#form');
const search = document.querySelector('#search');
const result = document.querySelector('#result');
const more = document.querySelector('#more');

const apiURL_movieList = 'https://www.omdbapi.com/?apikey=ac72a227&s='
const apiURL_movieSingle = 'https://www.omdbapi.com/?apikey=ac72a227&i='

form.addEventListener('submit', e => {
    e.preventDefault();
    const searchMovie = search.value.trim();
    if(!searchMovie) alert('Please type in a search movie');
    else getList(searchMovie);
})

async function getList(title) {
    const res = await fetch(`${apiURL_movieList}${title}`);
    const data = await res.json();

    result.innerHTML = `
    <ul class="movies">${data.Search
        .filter(t => (t.Type === 'movie' || t.Type === 'series'))
        .map(movie => `
        <li>
            <img class="imgPoster" src=${movie.Poster} alt="${movie.Title}" width="100px">
            <span>${movie.Title} (${movie.Year})</span>
            <button class="btn" data-movietitle="${movie.imdbID}">Get info</button> 
        </li>`)
        .join('')}
    </ul>
    
    `;

    // if (data.totalResults / 10 > 1.0) {
    //     console.log(`${data.totalResults / 10} pages`);
    //     more.innerHTML = `
    //     ${data.totalResults > 10 ? `<button class="btn" onclick="getMoreMovies('${apiURL_movieList}${title}&page=${page}}')">Next</button>` : ''}
    //     `;   
    // } else {
    //     more.innerHTML = '';
    // }
}    


result.addEventListener('click', e => {
    const clickedEl = e.target;
    if (clickedEl.tagName === 'BUTTON') {
      const movieName = clickedEl.getAttribute('data-movietitle');
      getMovie(movieName);
    }
});

async function getMovie(movie) {
    const res = await fetch(`${apiURL_movieSingle}${movie}`);
    const data = await res.json();
  
    result.innerHTML = `
        <div class="box box0">
            <h1 class="title">${data.Title}</h1>
            
        </div>    
        <div class="box box1">
            <img src=${data.Poster}>
        </div>
        <div class="box box1">
            <ul class="movies">
                ${data.Type === 'series' ? `<p class="runtime">(TV Series - ${data.Runtime})</p>` : `<p class="runtime">(${data.Runtime})</p>` } 
                <li><b>${data.Plot}</b></li>
                ${data.Director === 'N/A' ? '' : `<li>Director: ${data.Director}</li>`}
                <li>Cast: ${data.Actors}</li>
                <li>Year: ${data.Year} (Released on ${data.Released})</li>
                <li>Genre: ${data.Genre}</li>
                <li>Country: ${data.Country}</li>
                ${data.totalSeasons ? `<li>Seasons: ${data.totalSeasons}</li>` : ''}
                <li><a href="https://imdb.com/title/${data.imdbID}" target="_blank"><img class="imdb" src="https://www.iconninja.com/files/627/873/110/imdb-icon.png"></a></li>
            </ul>
        </div>    
    `;
}