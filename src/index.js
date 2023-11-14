import './css/styles.css';
// import axios from 'axios';
import Notiflix from 'notiflix';
import PixabayApiService from './pixabay-api';

const pixabayService = new PixabayApiService();

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  searchBtn: document.querySelector('.search-btn'),
};

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.searchForm.addEventListener('input', e => {
  const input = e.currentTarget.elements.searchQuery.value;
  if (input !== '') {
    refs.searchBtn.disabled = false;
  } else {
    refs.searchBtn.disabled = true;
  }
});

function onSubmit(e) {
  e.preventDefault();
  pixabayService.query = e.currentTarget.elements.searchQuery.value;
  pixabayService.resetPage();
  pixabayService.fetchPixabay().then(hits => {
    if (hits.length === 0) {
      clearGalleryBox();
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    clearGalleryBox();
    makeMarkup(hits);
  });
}

function onLoadMore() {
  pixabayService.fetchPixabay().then(makeMarkup);
}

function clearGalleryBox() {
  refs.galleryBox.innerHTML = '';
}

function makeMarkup(hits) {
  console.log(hits);
  hits.forEach(element => {
    const markup = `
  <div class="photo-card">
        <img
          src="${element.webformatURL}"
          alt="${element.tags}"
          loading="lazy"
        />
        <div class="info">
          <p class="info-item">
            <b class="main-text">Likes</b>
            <span class="lower-text">${element.likes}</span>
          </p>
          <p class="info-item">
            <b class="main-text">Views</b>
            <span class="lower-text">${element.views}</span>
          </p>
          <p class="info-item">
            <b class="main-text">Comments</b>
            <span class="lower-text">${element.comments}</span>
          </p>
          <p class="info-item">
            <b class="main-text">Downloads</b>
            <span class="lower-text">${element.downloads}</span>
          </p>
        </div>
      </div>
    `;
    refs.galleryBox.insertAdjacentHTML('beforeend', markup);
  });
}
