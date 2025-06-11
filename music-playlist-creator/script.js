const modal = document.getElementById("festivalModal");
const span = document.getElementsByClassName("close")[0];
const playlistModal = document.getElementById('playlistModal');
const closeBtn = document.querySelector('.modal .close'); // Select the close button inside the modal
const modalImage = document.getElementById('playlistModalImage');
const modalTitle = document.getElementById('playlistModalTitle');
const modalAuthor = document.getElementById('playlistModalAuthor');
const songListContainer = document.getElementById('songListContainer'); 
const shuffleButton = document.getElementById('shuffleButton')
const playlistContainer = document.getElementById('playlist-container');
let playlistsData;
let currentPlaylistInModal =null;

function openPlaylistModal(playlist) { // Renamed function and parameter
   document.getElementById('playlistModalTitle').textContent = playlist.playlist_name; // New ID, playlist data
   document.getElementById('playlistModalImage').src = playlist.playlist_art; // New ID, playlist data
   document.getElementById('playlistModalAuthor').textContent = `Author: ${playlist.playlist_author}`; // New ID, playlist data
   // Assuming you'll display songs directly in a new container, not 'lineup'
   // document.getElementById('songListContainer').innerHTML = `<strong>Songs:</strong> ${playlist.songs.map(s => s.title).join(', ')}`; // Example
   // You already have renderSongsInModal, so we'd use that instead
   renderSongsInModal(playlist.songs); // Use the dedicated function for songs
   
   // This 'modal' variable likely needs to be renamed too, or it's a global one
   // If it's the main modal div itself:
   playlistModal.style.display = "flex"; // Assuming playlistModal is the main modal element
}

window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}
// script.js

// --- Global Variable for the playlist container ---

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
    event.stopPropagation(); // Prevents modal from opening

    const clickedButton = event.currentTarget;
    const playlistId = clickedButton.dataset.playlistId;

    const playlistToUpdate = playlistsData.find(p => p.playlistID === playlistId);

    if (!playlistToUpdate) {
        console.error('Error: Could not find playlist with ID:', playlistId);
        return;
    }

    const likeCountSpan = clickedButton.nextElementSibling; // The span displaying the count
    const heartIcon = clickedButton.querySelector('.heart-icon'); // The heart span inside the button

    if (playlistToUpdate.isLiked) {
        // If already liked, unlike it
        playlistToUpdate.likes = (parseInt(playlistToUpdate.likes) || 0) - 1;
        playlistToUpdate.isLiked = false;
        if (heartIcon) heartIcon.classList.remove('liked'); // Remove red color
    } else {
        // If not liked, like it
        playlistToUpdate.likes = (parseInt(playlistToUpdate.likes) || 0) + 1;
        playlistToUpdate.isLiked = true;
        if (heartIcon) heartIcon.classList.add('liked'); // Add red color
    }

    // Ensure likes don't go below 0
    if (playlistToUpdate.likes < 0) {
        playlistToUpdate.likes = 0;
    }

    // Update the displayed count
    if (likeCountSpan) {
        likeCountSpan.textContent = playlistToUpdate.likes;
    }

    console.log(`Playlist ${playlistToUpdate.playlist_name} - Likes: ${playlistToUpdate.likes}, Liked: ${playlistToUpdate.isLiked}`);
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
    likeButton.innerHTML = `<span class="heart-icon ${playlist.isLiked ? 'liked' : ''}">♥</span>`;
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
function handleLikeClick(event) {
    event.stopPropagation();
    const clickedButton = event.currentTarget;
    const playlistId = clickedButton.dataset.playlistId;
    const playlistToUpdate = playlistsData.find(p => p.playlistID === playlistId);

    if (playlistToUpdate) {
        playlistToUpdate.likes = (parseInt(playlistToUpdate.likes) || 0) + 1;
        const likeCountSpan = clickedButton.nextElementSibling;
        if (likeCountSpan) {
            likeCountSpan.textContent = playlistToUpdate.likes;
        }
        // Add this line to toggle the 'liked' class on the heart icon
        const heartIcon = clickedButton.querySelector('.heart-icon');
        if (heartIcon) {
            heartIcon.classList.add('liked'); // Make it red immediately
            // Optional: remove after a short delay if you want it to revert, or keep it red
            // setTimeout(() => heartIcon.classList.remove('liked'), 500);
        }
    }
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}
function getRandomPlaylist(playlists) {
    if (!playlists || playlists.length ===0) {
        return null
    }
    const randomIndex = Math.floor(Math.random()* playlists.length)
    return playlists[randomIndex]
}
/**
 * Renders and displays a single featured playlist on the designated container.
 *
 * @param {Object|null} playlist - The playlist object to display, or null if none.
 */
function displayFeaturedPlaylist(playlist) {
    const featuredContainer = document.getElementById('featured-playlist-container');
    if (!featuredContainer) return; // Exit if the container isn't found (i.e., not on featured.html)

    featuredContainer.innerHTML = ''; // Clear previous content

    if (!playlist) {
        // Display a message if no playlist is available (e.g., error or empty data)
        featuredContainer.innerHTML = '<p style="text-align:center; padding:50px; color:#888;">No featured playlist available.</p>';
        return;
    }

    // Create and append the playlist image
    const img = document.createElement('img');
    img.src = playlist.playlist_art;
    img.alt = `Cover for ${playlist.playlist_name}`;
    img.classList.add('featured-playlist-image');
    img.onerror = function() {
        this.src = 'https://placehold.co/300x300/CCCCCC/000000?text=No+Image'; // Fallback
        this.style.objectFit = 'contain';
    };
    featuredContainer.appendChild(img);

    // Create a div for playlist details and song list
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('featured-song-list');

    // Create and append playlist title
    const title = document.createElement('h2');
    title.textContent = playlist.playlist_name;
    detailsDiv.appendChild(title);

    // Create and append playlist author
    const author = document.createElement('p');
    author.classList.add('author');
    author.textContent = playlist.playlist_author;
    detailsDiv.appendChild(author);

    // Create and populate the song list (unordered list)
    const ul = document.createElement('ul');
    if (playlist.songs && playlist.songs.length > 0) {
        playlist.songs.forEach(song => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${song.title} - ${song.artist}</span>
                <span class="song-duration">${song.duration}</span>
            `;
            ul.appendChild(li);
        });
    } else {
        const noSongs = document.createElement('li');
        noSongs.textContent = 'No songs in this playlist.';
        noSongs.style.fontStyle = 'italic';
        noSongs.style.color = '#888';
        ul.appendChild(noSongs);
    }
    detailsDiv.appendChild(ul); // Append song list to details div

    // Append the entire details section (title, author, songs)
    featuredContainer.appendChild(detailsDiv);
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
            playlistsData = data.playlists; // Ensure this assigns to your global playlistsData variable
            playlistsData.forEach(playlist => {
                playlist.isLiked = false; // Default to unliked
            });
            console.log('Fetched playlistsData (global):', playlistsData);

            // <--- PUT THE CONDITIONAL EXECUTION BLOCK HERE --->
            // This determines which function to call based on the current page
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                displayPlaylists(playlistsData);
            } else if (window.location.pathname.endsWith('featured.html')) {
                const randomPlaylist = getRandomPlaylist(playlistsData);
                displayFeaturedPlaylist(randomPlaylist);
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing playlist data:', error);
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                displayPlaylists([]); // Show "no playlists" on 'All' page
            } else if (window.location.pathname.endsWith('featured.html')) {
                displayFeaturedPlaylist(null); // Show "no featured" on 'Featured' page
            }
        });

    // All these event listeners must be placed AFTER their respective elements
    // have been selected/assigned inside the DOMContentLoaded block.

    // Close button click listener
    if (closeBtn) { // Check if closeBtn was found
        closeBtn.addEventListener('click', closePlaylistModal);
    } else {
        console.warn("Close button element not found. Modal close by button may not work.");
    }


    // Click outside modal content (overlay) listener
    if (playlistModal) { // Check if playlistModal was found
        window.addEventListener('click', (event) => {
            if (event.target === playlistModal) { // If the click target is the modal backdrop itself
                closePlaylistModal();
            }
        });
    } else {
        console.warn("Playlist modal element not found. Modal close by overlay may not work.");
    }


    // Shuffle button listener
    if (shuffleButton) { // Check if shuffleButton was found
        shuffleButton.addEventListener('click', () => {
            if (currentPlaylistInModal && currentPlaylistInModal.songs) {
                shuffleArray(currentPlaylistInModal.songs);
                renderSongsInModal(currentPlaylistInModal.songs);
            }
        });
    } else {
        console.warn("Shuffle button element not found. Shuffle functionality may not work.");
    }

    // No code should be placed directly after the DOMContentLoaded closing brace
    // unless it's a global function definition.
}); // This is the closing brace for DOMContentLoaded