import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreButton = document.querySelector(".load-more");
let currentPage = 1;
let currentQuery = "";

const apiKey = "38960521-7c95dc72765cd5ee1793ac79f"; 

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value;
  if (searchQuery.trim() !== "") {
    currentQuery = searchQuery;
    currentPage = 1;
    fetchImages(currentQuery, currentPage);
  }
});

loadMoreButton.addEventListener("click", () => {
  currentPage++;
  fetchImages(currentQuery, currentPage);
});

function fetchImages(query, page) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.hits.length === 0) {
        showNoResultsMessage();
        return;
      }

      if (page === 1) {
        gallery.innerHTML = "";
      }

      data.hits.forEach((image) => {
        const card = createImageCard(image);
        gallery.appendChild(card);
      });

      if (data.totalHits <= page * 40) {
        hideLoadMoreButton();
        showEndOfResultsMessage();
      } else {
        showLoadMoreButton();
      }

      refreshLightbox();
      scrollToNextImages();
    })
    .catch((error) => console.error("Error fetching images:", error));
}

function createImageCard(image) {
  const card = document.createElement("div");
  card.className = "photo-card";

  const img = document.createElement("img");
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = "lazy";
  card.appendChild(img);

  const info = document.createElement("div");
  info.className = "info";
  const infoItems = ["Likes", "Views", "Comments", "Downloads"];
  infoItems.forEach((item) => {
    const p = document.createElement("p");
    p.className = "info-item";
    p.innerHTML = `<b>${item}:</b> ${image[item.toLowerCase()]}`;
    info.appendChild(p);
  });

  card.appendChild(info);

  return card;
}

function showNoResultsMessage() {
  gallery.innerHTML = "";
  const message = document.createElement("p");
  message.className = "no-results";
  message.textContent = "Sorry, there are no images matching your search query. Please try again.";
  gallery.appendChild(message);
}

function showLoadMoreButton() {
  loadMoreButton.style.display = "block";
}

function hideLoadMoreButton() {
  loadMoreButton.style.display = "none";
}

function showEndOfResultsMessage() {
  const message = document.createElement("p");
  message.className = "end-of-results";
  message.textContent = "We're sorry, but you've reached the end of search results.";
  gallery.appendChild(message);
}

function refreshLightbox() {
  const lightbox = new SimpleLightbox(".gallery a");
  lightbox.refresh();
}

function scrollToNextImages() {
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

