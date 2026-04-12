const API_KEY = "08f88280befec8e9c44f73bbcf9713b3";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/";

let allMovies, AllPopular, rated, newShows, theWeekly, info;
const links = document.querySelectorAll(".nav-link");

// =======================
// Responsive Helpers
// =======================
function log() {
  location.href = "singIn.html";
}

function getItemsPerSlide() {
  const w = window.innerWidth;

  if (w < 414) return 2;
  if (w < 576) return 2;
  if (w < 768) return 3;
  if (w < 992) return 4;
  if (w < 1400) return 6;
  if (w < 1530) return 7; // بدل 8

  return 9;
}

function getImageSize() {
  return window.innerWidth < 768 ? "w342" : "w780";
}

// =======================
// Search
// =======================
async function searchMovies(query) {
  const searchValue =
    typeof query === "string"
      ? query.trim()
      : document.getElementById("searchInput")?.value.trim() || "";

  if (!searchValue) {
    showAllSections();
    loadAll();
    return;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
        searchValue
      )}`
    );

    const data = await res.json();
    showSearchResults(data.results || []);
  } catch (err) {
    console.error("Search error:", err);
  }
}

function showSearchResults(data) {
  document.querySelectorAll(".carousel-section").forEach((section) => {
    section.style.display = "none";
  });

  const filteredData = data.filter((item) => {
    return (
      (item.media_type === "movie" || item.media_type === "tv") &&
      (item.backdrop_path || item.poster_path)
    );
  });

  const trendingTitle = document.querySelector("#sectionTrending h4");
  if (trendingTitle) {
    trendingTitle.textContent = "Search Results";
  }

  if (!filteredData.length) {
    document.getElementById("trendingData").innerHTML = `
      <div class="carousel-item active">
        <div class="text-white text-center py-5">
          No results found
        </div>
      </div>
    `;
    document.getElementById("sectionTrending").style.display = "block";
    return;
  }

  const normalizedResults = filteredData.map((item) => ({
    ...item,
    backdrop_path: item.backdrop_path || item.poster_path,
  }));

  displayCarousel(normalizedResults, "trendingData");
  document.getElementById("sectionTrending").style.display = "block";
}

// =======================
// Display single movie / TV
// =======================
function displaySingleMovie() {
  const modalLabel = document.getElementById("exampleModalLabel");
  const modalBody = document.getElementById("modalBody");

  if (!modalLabel || !modalBody || !info) return;

  modalLabel.innerHTML = info.title || info.name || "No Title";

  const imgPath = info.backdrop_path
    ? `${IMAGE_BASE}${getImageSize()}/${info.backdrop_path}`
    : "img/no-image.png";

  modalBody.innerHTML = `
    <img src="${imgPath}" class="w-100 rounded mb-3">
    <p>${info.overview || "No description available"}</p>
  `;
}

// =======================
// Fetch single info
// =======================
async function singleInfo(id, type = "movie") {
  try {
    const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
    info = await res.json();
    displaySingleMovie();
  } catch (err) {
    console.error("Error fetching single info:", err);
  }
}

// =======================
// Display carousel
// =======================
function displayCarousel(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !data || !data.length) return;

  const itemsPerSlide = getItemsPerSlide();
  const slides = [];

  for (let i = 0; i < data.length; i += itemsPerSlide) {
    slides.push(data.slice(i, i + itemsPerSlide));
  }

  container.innerHTML = slides
    .map((group, i) => {
      return `
        <div class="carousel-item ${i === 0 ? "active" : ""}">
          <div class="row g-2 flex-nowrap m-0">
            ${group
              .map((item) => {
                const imagePath = item.backdrop_path || item.poster_path;
                const imgPath = imagePath
                  ? `${IMAGE_BASE}${getImageSize()}/${imagePath}`
                  : "img/no-image.png";

                const type =
                  item.media_type || (item.first_air_date ? "tv" : "movie");

                return `
                  <div style="flex: 0 0 calc(100% / ${itemsPerSlide}); max-width: calc(100% / ${itemsPerSlide}); padding: 0 4px;">
                    <div class="movie-box">
                      <img
                        src="${imgPath}"
                        class="w-100 rounded"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onclick="singleInfo(${item.id}, '${type}')"
                      >
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

// =======================
// Fetch API Data
// =======================
async function fetchData(path, callback) {
  try {
    const res = await fetch(`${BASE_URL}${path}?api_key=${API_KEY}`);
    const data = await res.json();
    callback(data.results || []);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

// =======================
// Show all sections
// =======================
function showAllSections() {
  [
    "sectionTrending",
    "sectionPopular",
    "sectionTopRated",
    "sectionNew",
    "sectionWeekly",
  ].forEach((id) => {
    const section = document.getElementById(id);
    if (section) {
      section.style.display = "block";
    }
  });
}

// =======================
// Load all carousels
// =======================
function loadAll() {
  const trendingTitle = document.querySelector("#sectionTrending h4");
  if (trendingTitle) {
    trendingTitle.textContent = "Trending";
  }

  fetchData("/movie/popular", (data) => {
    allMovies = data;
    displayCarousel(allMovies, "trendingData");
  });

  fetchData("/movie/top_rated", (data) => {
    AllPopular = data;
    displayCarousel(AllPopular, "popularData");
  });

  fetchData("/tv/top_rated", (data) => {
    rated = data;
    displayCarousel(rated, "topRatedData");
  });

  fetchData("/tv/on_the_air", (data) => {
    newShows = data;
    displayCarousel(newShows, "newData");
  });

  fetchData("/trending/movie/week", (data) => {
    theWeekly = data;
    displayCarousel(theWeekly, "weeklyData");
  });
}

// =======================
// Nav links click
// =======================
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const api = link.dataset.api;

    document.querySelectorAll(".carousel-section").forEach((section) => {
      section.style.display = "none";
    });

    if (api === "home") {
      showAllSections();
      loadAll();
    } else if (api === "/trending/movie/day") {
      fetchData(api, (data) => {
        allMovies = data;
        displayCarousel(allMovies, "trendingData");
        document.getElementById("sectionTrending").style.display = "block";
      });
    } else if (api === "/movie/popular") {
      fetchData(api, (data) => {
        AllPopular = data;
        displayCarousel(AllPopular, "popularData");
        document.getElementById("sectionPopular").style.display = "block";
      });
    } else if (api === "/movie/top_rated") {
      fetchData(api, (data) => {
        rated = data;
        displayCarousel(rated, "topRatedData");
        document.getElementById("sectionTopRated").style.display = "block";
      });
    } else if (api === "/tv/on_the_air") {
      fetchData(api, (data) => {
        newShows = data;
        displayCarousel(newShows, "newData");
        document.getElementById("sectionNew").style.display = "block";
      });
    } else if (api === "/trending/movie/week") {
      fetchData(api, (data) => {
        theWeekly = data;
        displayCarousel(theWeekly, "weeklyData");
        document.getElementById("sectionWeekly").style.display = "block";
      });
    }
  });
});

// =======================
// Initial load
// =======================
loadAll();

// =======================
// Search input events
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const value = this.value.trim();

      if (value.length > 2) {
        searchMovies(value);
      } else if (value.length === 0) {
        showAllSections();
        loadAll();
      }
    });

    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        searchMovies(this.value);
      }
    });
  }
});

// =======================
// Re-render on resize only
// =======================
window.addEventListener("resize", () => {
  if (allMovies) displayCarousel(allMovies, "trendingData");
  if (AllPopular) displayCarousel(AllPopular, "popularData");
  if (rated) displayCarousel(rated, "topRatedData");
  if (newShows) displayCarousel(newShows, "newData");
  if (theWeekly) displayCarousel(theWeekly, "weeklyData");
});

// =======================
// Carousel controls state
// =======================
document.querySelectorAll(".carousel").forEach((carousel) => {
  const nextBtn = carousel.querySelector(".carousel-control-next");
  const prevBtn = carousel.querySelector(".carousel-control-prev");

  carousel.addEventListener("slid.bs.carousel", () => {
    const isFirst = carousel
      .querySelector(".carousel-item:first-child")
      ?.classList.contains("active");

    const isLast = carousel
      .querySelector(".carousel-item:last-child")
      ?.classList.contains("active");

    prevBtn?.classList.toggle("disabled", isFirst);
    nextBtn?.classList.toggle("disabled", isLast);
  });
});
document.querySelectorAll(".nav-center .nav-link").forEach((link) => {
  link.addEventListener("click", function () {
    document.querySelectorAll(".nav-center .nav-link").forEach((item) => {
      item.classList.remove("active");
    });
    this.classList.add("active");
  });
});