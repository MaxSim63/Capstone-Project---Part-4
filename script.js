document.addEventListener('DOMContentLoaded', function() {
    const dateForm = document.getElementById('dateForm');
    const dateInput = document.getElementById('dateInput');
    const apodContent = document.getElementById('apodContent');
    const favoritesTab = document.getElementById('favoritesTab');
    const favoritesList = document.getElementById('favoritesList');
    const favoritesButton = document.getElementById('favoritesButton');

    dateForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const date = dateInput.value;
        fetchAPOD(date);
    });

    favoritesButton.addEventListener('click', function() {
        showFavorites();
    });

    function fetchAPOD(date) {
        const apiKey = 'oZp9y8uflMkz6gmsaSPRfau3HjWzkWoiwqNHEl3D';
        const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displayAPOD(data))
            .catch(error => console.error('Error fetching APOD:', error));
    }

    function displayAPOD(data) {
        const { title, date, explanation, url, hdurl } = data;

        const apodHTML = `
            <div>
                <h2>${title}</h2>
                <p>Date:${date}</p>
                <p>${explanation}</p>
                <img src="${url}" alt="${title}" class="apod-image">
                <button class="favorite-button">Add to Favorites</button>
            </div>
        `;

        apodContent.innerHTML = apodHTML;
        apodContent.classList.remove('hidden');

        const apodImage = document.querySelector('.apod-image');
        apodImage.addEventListener('click', function() {
            window.open(hdurl, '_blank');
        });

        const favoriteButton = document.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', function() {
            saveFavorite(title, url);
        });
    }

    function saveFavorite(title, url) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.push({ title, url });
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function showFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p>No favorites saved.</p>';
        } else {
            let favoritesHTML = '';
            favorites.forEach(favorite => {
                favoritesHTML += `
                    <div class="favorite-item">
                        <h3>${favorite.title}</h3>
                        <img src="${favorite.url}" alt="${favorite.title}">
                        <button class="remove-favorite">Remove</button>
                    </div>
                `;
            });
            favoritesList.innerHTML = favoritesHTML;

            const removeButtons = document.querySelectorAll('.remove-favorite');
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const title = button.previousElementSibling.textContent;
                    removeFavorite(title);
                    showFavorites();
                });
            });
        }

        favoritesTab.classList.remove('hidden');
        apodContent.classList.add('hidden');
        favoritesButton.classList.add('hidden');
    }

    function removeFavorite(index) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
});