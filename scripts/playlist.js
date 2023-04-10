const bucketURL = "https://bandlabaudio.s3.ap-southeast-1.amazonaws.com";
const audioFilesData = [
  { name: "new wave sample", endpoint: `${bucketURL}/new-wave-kit.ogg` },
  { name: "synth organ sample", endpoint: `${bucketURL}/synth-organ.ogg` },
];
const audioContainer = document.getElementById("audio-cards-container");
const playIcon = `<span class="material-symbols-outlined">play_arrow</span>`;
const pauseIcon = `<span class="material-symbols-outlined">pause</span>`;
const errorMessageEl = document.querySelector("#error-message");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Loads audio files from the specified endpoints and returns a Promise containing an array of objects. Each object contains name, buffer, and source properties.
 * @returns {Promise<Array>} A Promise containing an array of objects with name, buffer, and source properties.
 */
const loadAudioFiles = async () => {
  try {
    const audioFiles = await Promise.all(
      audioFilesData.map(async (file) => {
        const response = await fetch(file.endpoint);
        const buffer = await response.arrayBuffer();
        const decodedBuffer = await audioContext.decodeAudioData(buffer);
        const source = audioContext.createBufferSource();
        source.buffer = decodedBuffer;
        source.connect(audioContext.destination);
        return {
          name: file.name,
          buffer: decodedBuffer,
          source,
        };
      })
    );
    return audioFiles;
  } catch (error) {
    console.error("Error loading audio files:", error);
    errorMessageEl.textContent =
      "Could not load audio samples. Please try again later!";
    return [];
  }
};

/**
 * Toggles playback of audio.
 * @param {Object} data - An object containing audio data (name, buffer, source).
 * @param {HTMLButtonElement} playPauseButton - The button used to toggle playback.
 */
const togglePlayPause = (data, playPauseButton) => {
  if (data.source.isPlaying) {
    data.source.stop();
    playPauseButton.innerHTML = playIcon;
  } else {
    data.source = audioContext.createBufferSource();
    data.source.buffer = data.buffer;
    data.source.connect(audioContext.destination);
    data.source.addEventListener("ended", () => {
      data.source.isPlaying = false;
      playPauseButton.innerHTML = playIcon;
    });
    data.source.start(0);
    playPauseButton.innerHTML = pauseIcon;
  }
  data.source.isPlaying = !data.source.isPlaying;
};

/**
 * Creates an HTML element with the given tag name and adds the given class name.
 * @param {string} tagName - The tag name of the HTML element to be created.
 * @param {string} className - The class name to be added to the HTML element.
 * @returns {HTMLElement} - The created HTML element.
 */
const createHTMLEl = (el, className) => {
  const item = document.createElement(el);
  item.classList.add(className);
  return item;
};

/**
 * Creates a new audio card element in the HTML with the specified data and index.
 * @param {Object} data - An object containing audio data (name, buffer, source).
 * @param {number} index - The index of the audio card in the list.
 */
const createAudioCard = (data, index) => {
  const audioCard = createHTMLEl("section", "audio-card");
  const audioTitle = createHTMLEl("h2", "audio-title");
  audioTitle.textContent = data.name;
  audioCard.appendChild(audioTitle);

  const audioControls = createHTMLEl("div", "audio-controls");
  audioCard.appendChild(audioControls);

  const playPauseButton = createHTMLEl("button", "play-pause-btn");
  playPauseButton.innerHTML = playIcon;
  audioControls.appendChild(playPauseButton);

  playPauseButton.addEventListener("click", () => {
    togglePlayPause(data, playPauseButton);
  });
  audioContainer.appendChild(audioCard);
};

/**
 *  Initializes the audio player by loading audio files and creating the necessary HTML elements.
 */
const init = async () => {
  const audioData = await loadAudioFiles();
  audioData.forEach((data, index) => {
    createAudioCard(data, index);
  });
};

init();
