### Setup

This application does not require setup or boilerplate codes. This is a simple webpage written using Vanilla Javascript with some basic styles and plain HTML for templating.

### Running the application

The user may opt to either run `home.html` or `music-library.html` on a modern web browser, Eg: Chrome. The pages provide menu on the header section to navigate between them.

`home.html` contains a list of posts that are arranged in accordions, fetched from the endpoint [/posts](https://jsonplaceholder.typicode.com/posts) from JSONplaceholder API.

`music-library.html` retrieves audio files hosted on AWS S3(sourced from Bandlab Technologies endpoints) and loads them via the Web Audio API.

### Technical and design considerations

1. Since the posts are limited in number and are of only about 8Kb in size, the API doesnt support pagination and all the posts are fetched in a single request. In reality, these APIs are paginated and lazily loaded on the frontend.

2. To minimise redundancy in styles and also due to the minimal file size, we have only one main.css. With growing features, its advisable to split into multiple files and preferably into `/styles` directory.

3. At the time of writing, the application has been tested only on Chrome browser and is fully functional.

4. To allow for an indeterminate state for the sort that provides an option for reset, every 3rd click on sort icon would reset the sorting.

### Screenshots

Below are some screenshots of the app -

[Home page](https://imgur.com/BEXvw2F)

[Music Library](https://imgur.com/0l8xikP)

## Todos

Add better audio controls and playback capabilities to the music library.

### Note

The images, favicon are all copyright of [Bandlab Technologies](https://www.bandlab.com/?lang=en).
