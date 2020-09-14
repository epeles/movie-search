import 'regenerator-runtime/runtime';

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
    else {
        getList(searchMovie);
    }
})

async function getList(title) {    
    const res = await fetch(`${apiURL_movieList}${title}`);
    const data = await res.json();
    
    result.innerHTML = `
    <ul class="movies">${data.Search
        .filter(t => (t.Poster !== 'N/A' && t.Type === 'movie' || t.Poster !== 'N/A' && t.Type === 'series'))
        .map(movie => `
        <li>
            <img class="imgPoster" src=${movie.Poster} alt="${movie.Title}" width="100px">
            <span>${movie.Title} (${movie.Year})</span>
            <button class="btn" data-movietitle="${movie.imdbID}">Get info</button> 
        </li>`)
        .join('')}
    </ul>    
    `;
}    
 
result.addEventListener('click', e => {
    const clickedEl = e.target;
    if (clickedEl.tagName === 'BUTTON') {
      const movieName = clickedEl.getAttribute('data-movietitle');
      getMovie(movieName);
      form.reset();
    }
});

async function getMovie(movie) {
    const res = await fetch(`${apiURL_movieSingle}${movie}`);
    const data = await res.json();
    
    result.innerHTML = `
        <div class="box box0">
            <h1 class="title">${data.Title} 
            ${data.Type === 'series' ? `<p class="runtime">(TV Series - ${data.Runtime})</p>` : `<p class="runtime">(${data.Runtime})</p>` }
            </h1>
        </div>    
        <div class="box box1">
            <img class="poster" src=${data.Poster} alt="${data.Poster}">
        </div>
        <div class="box box1">
            <ul class="movies">
                <li><b>${data.Plot}</b></li>
                ${data.Director === 'N/A' ? '' : `<li>Director: ${data.Director}</li>`}
                <li>Cast: ${data.Actors}</li>
                <li>Year: ${data.Year} (Released on ${data.Released})</li>
                <li>Genre: ${data.Genre}</li>
                <li>Country: ${data.Country}</li>
                ${data.totalSeasons ? `<li>Seasons: ${data.totalSeasons}</li>` : ''}
                <li class="rating">IMDb Rating: <span class="${getClassByRate(data.imdbRating)}">${data.imdbRating}</span></li>
                <li><a href="https://imdb.com/title/${data.imdbID}" target="_blank"><img class="imdb" src="https://www.iconninja.com/files/627/873/110/imdb-icon.png" data-toggle="tooltip" data-html="true" title="More info about ${data.Title} on IMDb"></a></li>
            </ul>
        </div>    
    `;   
}

function getClassByRate(vote) {
    if (vote >= 8) return "green";
    else if (vote >= 5) return "orange";
    else return "red";
}
