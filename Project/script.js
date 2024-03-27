const apiKey = 'df7ec2d30e7df7fcbf94abe0d7e0b666'; // Ваш ключ API TMDb
const apiUrl = 'https://api.themoviedb.org/3';

let slideIndex = 2;
const header = document.getElementById('header');
const slidesContainer = document.getElementById('slides');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');


async function getMovies() {
  const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
  const data = await response.json();
  return data.results;
}



async function showSlides() {
  const movies = await getMovies();
  slidesContainer.innerHTML = '';

  movies.forEach((movie,index) => {
    const slide = document.createElement('div');
    slide.classList.add('slide');
    slide.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${movie.poster_path}')`;
    if (index === slideIndex) {
      slide.classList.add('selected');
    }
    slidesContainer.appendChild(slide);
  });

  updateHeaderBackground(movies[slideIndex].backdrop_path);
  updateSlideAnimation();
  updateMovieInfo(movies[slideIndex].original_title, movies[slideIndex].overview, movies[slideIndex].popularity, movies[slideIndex].status, movies[slideIndex].homepage)

  slideInterval = setInterval(nextSlide, 10000);
}

function updateMovieInfo(title, overview, popu, status, url) {
  const movieTitleElement = document.getElementById('title');
  const movieOverviewElement = document.getElementById('about');
  const moviePopuElement=document.getElementById('popu');
  const statusElement=document.getElementById('status');
  const linkElement=document.getElementById('link-movie');
  movieTitleElement.textContent = title;
  movieOverviewElement.textContent = overview;
  moviePopuElement.textContent="Popularity: "+popu;
  statusElement.textContent="Status: "+status;
  linkElement.href=url;
}

function updateSlideAnimation() {
  const slides = document.querySelectorAll('.slide');
  slides.forEach((slide, index) => {
    slide.style.transitionDelay = `${index * 0.1}s`;
    slide.style.opacity = 1;
  });
}

function updateHeaderBackground(posterPath) {
  header.style.backgroundImage = `url('https://image.tmdb.org/t/p/w1280${posterPath}')`;
}

function handleSlideClick(event) {
  const clickedSlide = event.target.closest('.slide');
  clearInterval(slideInterval);
  if (clickedSlide) {
    const clickedIndex = Array.from(slidesContainer.children).indexOf(clickedSlide);
    if (clickedIndex !== -1) {
      slideIndex = clickedIndex;
      showSlides();
    }
  }
}

function prevSlide() {
  if (slideIndex === 0) {
    slideIndex = slidesContainer.children.length - 1;
  } else {
    slideIndex--;
  }
  clearInterval(slideInterval);
  showSlides();
}

function nextSlide() {
  if (slideIndex === slidesContainer.children.length - 1) {
    slideIndex = 0;
  } else {
    slideIndex++;
  }
  clearInterval(slideInterval);
  showSlides();
}

searchButton.addEventListener('click', async function(event) {
  event.preventDefault();
  const searchText = searchInput.value.trim();

  if (searchText !== '') {
    const foundMovies = await searchMovie(searchText);    
    if (foundMovies!=-1) {
      slideIndex = foundMovies;
      showSlides();
      clearInterval(slideInterval);
    } else {
      alert('Фильм не найден. Попробуйте другой запрос.');
    }
  } else {
    alert('Введите текст для поиска.');
  }
});
async function searchMovie(searchText) {
  const movies = await getMovies();
  const foundMovie = movies.find(movie => movie.original_title.toLowerCase() === searchText.toLowerCase());

  if (foundMovie) {
    return movies.indexOf(foundMovie);
  } else {
    return -1;
  }
}


showSlides();