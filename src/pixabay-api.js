import axios from 'axios';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

    async fetchPixabay() {
    console.log(this);
    const API_URL = 'https://pixabay.com/api/';
    const API_KEY = '40638542-671402e9a996bdf1173ac4708';
    const url = `${API_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    return await axios
      .get(url)
      .then(response => response.data)
      .then(data => {
        this.incrementPage();
        // console.log(data.hits)
        return data.hits;
      })
      .catch(error => console.log(error));
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
