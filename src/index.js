import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import PixabayApiService from './pixabay-api';

let gallery = new SimpleLightbox('.gallery a');
const pixabayService = new PixabayApiService();

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  searchBtn: document.querySelector('.search-btn'),
  noMoreResalt: document.querySelector('.no-more-resalts'),
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
  pixabayService.fetchPixabay().then(data => {
    console.log(data)
    if (data.hits.length === 0) {
      hideNoMoreResaltsText();
      hideLoadBtn();
      clearGalleryBox();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      hideNoMoreResaltsText();
      showLoadBtn();
      enableLoadBtn();
      clearGalleryBox();
      makeMarkup(data);
    }
  });
}

function onLoadMore() {
  disableLoadBtn();
  pixabayService.fetchPixabay().then(data => {
    console.log(data)
    if (data.hits.length === 0) {
      showNoMoreResaltsText();
      hideLoadBtn();
    } else {
      gallery.refresh();
      enableLoadBtn();
      makeMarkup(data);
    }
  });
}

function clearGalleryBox() {
  refs.galleryBox.innerHTML = '';
}

function showLoadBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function enableLoadBtn() {
  refs.loadMoreBtn.disabled = false;
  refs.loadMoreBtn.textContent = 'Load more';
}

function disableLoadBtn() {
  refs.loadMoreBtn.disabled = true;
  refs.loadMoreBtn.textContent = 'Loading...';
  const markup = `<span class="loader"></span>`;
  refs.loadMoreBtn.insertAdjacentHTML('afterbegin', markup)
}

function showNoMoreResaltsText() {
  refs.noMoreResalt.classList.remove('is-hidden');
}

function hideNoMoreResaltsText() {
  refs.noMoreResalt.classList.add('is-hidden');
}

function makeMarkup(data) {
  data.hits.forEach(element => {
    const markup = `
  <div class="photo-card">
  <a class="gallery__link" href="${element.largeImageURL}">
        <img
          src="${element.webformatURL}"
          alt="${element.tags}"
          loading="lazy"
        />
        </a>
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
  let gallery = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
}
