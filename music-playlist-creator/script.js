const modal = document.getElementById("festivalModal");
const span = document.getElementsByClassName("close")[0];
const playlistModal = document.getElementById('playlistModal');
const closeBtn = document.querySelector('.modal .close'); // Select the close button inside the modal
const modalImage = document.getElementById('playlistModalImage');
const modalTitle = document.getElementById('playlistModalTitle');
const modalAuthor = document.getElementById('playlistModalAuthor');
const songListContainer = document.getElementById('songListContainer'); 
const shuffleButton = document.getElementById('shuffleButton')
let playlistsData;
let currentPlaylistInModal =null;

function openModal(festival) {
   document.getElementById('festivalName').innerText = festival.name;
   document.getElementById('festivalImage').src = festival.imageUrl;
   document.getElementById('festivalDates').innerText = `Dates: ${festival.dates}`;
   document.getElementById('festivalLocation').innerText = `Location: ${festival.location}`;
   document.getElementById('artistLineup').innerHTML = `<strong>Lineup:</strong> ${festival.lineup.join(', ')}`;
   modal.style.display = "block";
}

span.onclick = function() {
   modal.style.display = "none";
}
window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}
// script.js

// --- Global Variable for the playlist container ---
const playlistContainer = document.getElementById('playlist-container');
// --- Function to dynamically create and display playlist cards ---
/**
 * Displays a list of playlist cards in the designated HTML container.
 * If the provided array is empty or invalid, a "No playlists added" message is shown.
 *
 * @param {Array<Object>} playlistsArray - An array of playlist objects,
 * each containing properties like
 * playlist_art, playlist_name,
 * playlist_author, and likes.
 */
function displayPlaylists(playlistsArray) {
  // 1. Clear previous content to avoid duplicates on re-render
  playlistContainer.innerHTML = '';

  // 2. Check if the playlistsArray is empty or invalid
  if (!playlistsArray || !Array.isArray(playlistsArray) || playlistsArray.length === 0) {
    // Create a paragraph element for the "No playlists" message
    const noPlaylistsMessage = document.createElement('p');
    noPlaylistsMessage.classList.add('no-playlists-message'); // Add a class for styling
    noPlaylistsMessage.textContent = 'No playlists added yet. Check back soon!';

    // Append the message to the container
    playlistContainer.appendChild(noPlaylistsMessage);

    // Apply some inline styles for better visual feedback
    playlistContainer.style.textAlign = 'center';
    playlistContainer.style.padding = '50px';
    playlistContainer.style.color = '#888';
    playlistContainer.style.fontSize = '1.2em';

    return; // Exit the function as there's nothing more to render
  }
/**
 * Handles the click event on a like button.
 * Increments the like count for the corresponding playlist and updates the DOM.
 * @param {Event} event - The click event object.
 */
function handleLikeClick(event) {
    // Prevent the card's open modal click from also firing
    event.stopPropagation();

    // 1. Get the playlist ID from the clicked button
    // 'this' refers to the button that was clicked
    const clickedButton = event.currentTarget;
    const playlistId = clickedButton.dataset.playlistId;

    // 2. Find the corresponding playlist object in your data array
    // (Assuming 'playlistsData' is the array that holds your original data)
    const playlistToUpdate = playlistsData.find(p => p.playlistID === playlistId);

    if (playlistToUpdate) {
        // 3. Increment the like count in the data
        playlistToUpdate.likes = (playlistToUpdate.likes || 0) + 1;

        // 4. Update the displayed like count on the card itself
        // The like count is the next sibling element (the <span> with class 'like-count')
        const likeCountSpan = clickedButton.nextElementSibling;
        if (likeCountSpan) {
            likeCountSpan.textContent = playlistToUpdate.likes;
        }
    }
}
  // 3. Iterate over each playlist object in the array and create its card
  // Inside your displayPlaylists function:

playlistsArray.forEach(playlist => {
    // 1. Create the main card div
    const card = document.createElement('div');
    card.classList.add('playlist-card');

    // Add click listener to the entire card for opening the modal
    card.addEventListener('click', () => {
        openPlaylistModal(playlist);
    });

    // 2. Create the image placeholder/container
    const imgPlaceholder = document.createElement('div');
    imgPlaceholder.classList.add('playlist-image-placeholder');
    const img = document.createElement('img');
    img.src = playlist.playlist_art;
    img.alt = `Cover for ${playlist.playlist_name}`;
    img.onerror = function() {
        this.src = 'https://placehold.co/150x150/CCCCCC/000000?text=No+Image';
        this.style.objectFit = 'contain';
    };
    imgPlaceholder.appendChild(img);

    // 3. Create the details div
    const details = document.createElement('div');
    details.classList.add('playlist-details');

    // Create and append playlist title
    const title = document.createElement('h3');
    title.classList.add('playlist-title');
    title.textContent = playlist.playlist_name;

    // Create and append playlist author
    const author = document.createElement('p');
    author.classList.add('creator-name');
    author.textContent = playlist.playlist_author;

    // --- START OF NEW/MODIFIED LIKES SECTION ---
    const likesContainer = document.createElement('div'); // Container for the button and count
    likesContainer.classList.add('likes');

    // Create the Like Button
    const likeButton = document.createElement('button');
    likeButton.classList.add('like-button');
    likeButton.innerHTML = `<span class="heart-icon">♡</span>`;
    // Attach the playlistID to the button using a data attribute
    likeButton.dataset.playlistId = playlist.playlistID;

    // Add the click listener to the like button
    likeButton.addEventListener('click', handleLikeClick);

    // Create the span for the Like Count
    const likeCountSpan = document.createElement('span');
    likeCountSpan.classList.add('like-count');
    likeCountSpan.textContent = playlist.likes || 0; // Display initial count

    // Append button and count to the likes container
    likesContainer.appendChild(likeButton);
    likesContainer.appendChild(likeCountSpan);
    // --- END OF NEW/MODIFIED LIKES SECTION ---

    // Append all detail elements to the details div
    details.appendChild(title);
    details.appendChild(author);
    details.appendChild(likesContainer); // Append the new likes container

    // Append the image placeholder and details div to the main card div
    card.appendChild(imgPlaceholder);
    card.appendChild(details);

    // Append the complete card to the main playlist container in the HTML
    playlistContainer.appendChild(card);
});
}
/**
 * Opens the playlist modal and populates it with detailed information
 * from a given playlist object.
 *
 * @param {Object} playlist - The playlist object containing details like
 * playlist_art, playlist_name, playlist_author,
 * and an array of songs.
 */
function openPlaylistModal(playlist) {
    // 1. Populate the main modal content with playlist details
    modalImage.src = playlist.playlist_art;
    modalImage.alt = `Cover for ${playlist.playlist_name}`;
    modalTitle.textContent = playlist.playlist_name;
    modalAuthor.textContent = playlist.playlist_author; // Using playlist_author for the modal

    // 2. Clear any previously displayed songs
    songListContainer.innerHTML = '';

    // 3. Populate the song list
    if (playlist.songs && playlist.songs.length > 0) {
        const songListHeader = document.createElement('h3');
        songListHeader.textContent = 'Songs:';
        songListContainer.appendChild(songListHeader);

        const ul = document.createElement('ul'); // Create an unordered list for songs
        playlist.songs.forEach(song => {
            const li = document.createElement('li'); // Create a list item for each song
            li.innerHTML = `
                <span>${song.title} - ${song.artist}</span>
                <span class="song-duration">${song.duration}</span>
            `;
            ul.appendChild(li); // Add the list item to the unordered list
        });
        songListContainer.appendChild(ul); // Add the complete song list to the container
    } else {
        // Display a message if there are no songs in the playlist
        const noSongsMessage = document.createElement('p');
        noSongsMessage.textContent = 'No songs in this playlist yet.';
        noSongsMessage.style.fontStyle = 'italic';
        noSongsMessage.style.color = '#888';
        songListContainer.appendChild(noSongsMessage);
    }
        currentPlaylistInModal = playlist;
        renderSongsInModal(playlist.songs); // Call new function to render songs
    // 4. Display the modal by changing its CSS display property to 'flex'
    // (assuming your CSS uses `display: flex;` for centering)
    playlistModal.style.display = 'flex';
}
function closePlaylistModal() {
    playlistModal.style.display = 'none';
}
/**
 * Renders and displays the list of songs within the playlist modal.
 *
 * @param {Array<Object>} songsArray - An array of song objects, each with
 * properties like title, artist, and duration.
 */
function renderSongsInModal(songsArray) {
    // 1. Clear any previously displayed songs
    songListContainer.innerHTML = '';

    // 2. Check if there are songs to display
    if (!songsArray || songsArray.length === 0) {
        const noSongsMessage = document.createElement('p');
        noSongsMessage.textContent = 'No songs in this playlist yet.';
        noSongsMessage.style.fontStyle = 'italic';
        noSongsMessage.style.color = '#888';
        songListContainer.appendChild(noSongsMessage);
        return; // Exit if no songs
    }

    // 3. Add a header for the song list
    const songListHeader = document.createElement('h3');
    songListHeader.textContent = 'Songs:';
    songListContainer.appendChild(songListHeader);

    // 4. Create an unordered list to hold the songs
    const ul = document.createElement('ul');

    // 5. Iterate through each song and create a list item for it
    songsArray.forEach(song => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${song.title} - ${song.artist}</span>
            <span class="song-duration">${song.duration}</span>
        `;
        ul.appendChild(li); // Add the list item to the unordered list
    });

    // 6. Append the complete song list to the modal's song list container
    songListContainer.appendChild(ul);
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// --- Event Listener: Execute code when the DOM is fully loaded ---
document.addEventListener('DOMContentLoaded', () => {
  // 1. Fetch data from 'data.json'
  fetch('data/data.json')
    .then(response => {
      // Check if the network request was successful (status code 200-299)
      if (!response.ok) {
        // If not successful, throw an error to be caught by the .catch() block
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Parse the JSON data from the response body
      return response.json();
    })
    .then(data => {
      playlistsData = data.playlists;
      // Once data is successfully parsed, call displayPlaylists.
      // We expect the JSON to have a top-level key named 'playlists'.
      displayPlaylists(data.playlists);
    })
    .catch(error => {
      // Catch any errors during fetch or JSON parsing
      console.error('Error fetching or parsing playlist data:', error);
      // Display the "No playlists" message if there's an error
      displayPlaylists([]);
    });
    // Close button click
    closeBtn.addEventListener('click', closePlaylistModal);

    // Click outside modal content (overlay)
    window.addEventListener('click', (event) => {
        if (event.target === playlistModal) { // If the click target is the modal backdrop itself
            closePlaylistModal();
        }
    });

// Optional: Close with Escape key
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && playlistModal.style.display === 'flex') {
        closePlaylistModal();
    }
});
});

