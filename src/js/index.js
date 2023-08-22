import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import fetchImages from "./getPhoto.js"; 

const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreButton = document.querySelector(".load-more");
const lightbox = new SimpleLightbox(".gallery a");
let currentPage = 1;
let currentQuery = "";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value;
  if (searchQuery.trim() !== "") {
    currentQuery = searchQuery;
    currentPage = 1;

    try {
      const data = await fetchImages(currentQuery, currentPage);
      handleImageData(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      Notiflix.Notify.failure('Error fetching images');
    }
  }
});

loadMoreButton.addEventListener("click", async () => {
  currentPage++;
  try {
    const data = await fetchImages(currentQuery, currentPage);
    handleImageData(data);
  } catch (error) {
    console.error("Error fetching images:", error);
    Notiflix.Notify.failure('Error fetching images');
  }
});

function handleImageData(data) {
  if (data.hits.length === 0) {
    hideLoadMoreButton();
    showEndOfResultsMessage();
  } else {
    if (currentPage === 1) {
      clearGallery();
    }
    data.hits.forEach(image => {
      const card = createImageCard(image);
      gallery.appendChild(card);
    });
    refreshLightbox();
    if (currentPage === 1) {
      showLoadMoreButton();
    }
  }
}

function clearGallery() {
  gallery.innerHTML = "";
}

function createImageCard(image) {
  const card = document.createElement("a"); 
  card.href = image.largeImageURL; 
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
  lightbox.refresh();
}

function scrollToNextImages() {
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}




