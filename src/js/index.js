import axios from 'axios';
import Notiflix from 'notiflix';
import PixabayApiService from './pixabay-api';
// import hitsTpl from 'hits.hps'

const pixabayService = new PixabayApiService();

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(e) {
  e.preventDefault();

  pixabayService.query = e.currentTarget.elements.searchQuery.value;
  pixabayService.resetPage();
  pixabayService.fetchPixabay().then(makeMarkup);
}

function onLoadMore() {
  pixabayService.fetchPixabay().then(makeMarkup);
}

function makeMarkup(hits) {
  console.log(hits)
  const markup = `
  <div class="photo-card">
        <img
          src="${hits.webformatURL}"
          alt="${hits.tags}"
          loading="lazy"
          width=""
        />
        <div class="info">
          <p class="info-item">
            <b class="main-text">Likes</b>
            <span class="lower-text">${hits.likes}</span>
          </p>
          <p class="info-item">
            <b class="main-text">Views</b>
            <span class="lower-text">${hits.views}</span>
          </p>
          <p class="info-item">
            <b class="main-text">Comments</b>
            <span class="lower-text">${hits.comments}</span>
          </p>
          <p class="info-item">
            <b class="main-text">Downloads</b>
            <span class="lower-text">${hits.downloads}</span>
          </p>
        </div>
      </div>
    `;
  return refs.galleryBox.insertAdjacentHTML('beforeend', markup);
}
