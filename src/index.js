console.log('%c HI', 'color: firebrick');

document.addEventListener('DOMContentLoaded', async function () {
    images();
    fetchBreeds('a');
    const filter = document.querySelector('#breed-dropdown');
    filter.onchange = function () {
        fetchBreeds(filter.value);
    };
});

async function images() {
    const imgUrl = "https://dog.ceo/api/breeds/image/random/4";

    const requestOptions = {
        method: 'GET'
    };
    await fetch(imgUrl, requestOptions)
        .then(async res => {
            const json = await res.json();
            if (json && json.message) {
                const imgContainer = document.querySelector('#dog-image-container');
                json.message.forEach(url => {
                    const e = document.createElement('img');
                    e.setAttribute('src', url);
                    imgContainer.appendChild(e)
                });
            }
        })
        .catch(error => console.log('error', error));
}

async function fetchBreeds(breedFilter) {
    const breedContainer = document.querySelector('#dog-breeds');
    breedContainer.replaceChildren();

    const breedUrl = "https://dog.ceo/api/breeds/list/all";
    await fetch(breedUrl, {method: 'GET'})
        .then(async res => {
            const data = await res.json();

            if (data.status === "success" && data.message) {

                for (const breedCategory in data.message) {
                    if (data.message.hasOwnProperty(breedCategory)) {
                        if (!breedCategory.startsWith(breedFilter)) {
                            continue;
                        }
                        const breeds = data.message[breedCategory];

                        if (breeds.length === 0) {
                            // If no sub-breeds, just display the breed category
                            createBreedElement(breedCategory, breedContainer);
                        } else {
                            // Display each sub-breed under the category
                            breeds.forEach(subBreed => {
                                if (!subBreed.startsWith(breedFilter)) {
                                    return;
                                }
                                const fullBreedName = `${subBreed} ${breedCategory}`;
                                createBreedElement(fullBreedName, breedContainer);
                            });
                        }
                    }
                }
            }
        })
        .catch(error => console.log('error', error));
}

function createBreedElement(breedName, container) {
    const listItem = document.createElement('li');
    listItem.addEventListener('click', function () {
        if (listItem.classList.contains('hl')) {
            listItem.style.color = '#000000';
        } else {
            listItem.style.color = '#CC0000';
        }
        listItem.classList.toggle('hl');
    });
    listItem.textContent = breedName;
    container.appendChild(listItem);
}