import data from './data.json' with { type: 'json' };

document.addEventListener('DOMContentLoaded', async () => {
  async function loadHTML(url) {
    return fetch(url)
      .then(response => response.text())
      .catch(err => console.error(`Erro ao carregar ${url}:`, err))
    ;
  }

  async function loadComponents() {
    const body = document.body;
    const main = document.querySelector('main');

    await Promise.all([
      loadHTML('/components/header.html'),
      loadHTML('/components/footer.html')
    ])
    .then(async ([header, footer]) => {
      body.insertAdjacentHTML('afterbegin', header);
      body.insertAdjacentHTML('beforeend', footer);

      main.innerHTML = body.querySelector('main').innerHTML;

      loadCarouselItems('clothes', data.clothes);
      loadCarouselItems('beauty', data.beauty);
      loadCarouselItems('house', data.house);
      loadCarouselItems('tech', data.tech);

      disableAutoplayOnInteraction();
    });
  }

  async function loadCarouselItems(id, products) {
    const carouselInner = document.querySelector(`#${id} .carousel-inner`);

    if (!carouselInner) return;

    let isFirstItem = true;
    const productTemplate = await loadHTML('./components/product.html');

    const screenWidth = window.innerWidth;
    const productsPerSlide = screenWidth < 768 ? 2 : 4;  // 2 produtos no mobile, 4 no desktop

    function fillProductTemplate(productHTML, product) {
      const templateElement = document.createElement('div');
      templateElement.innerHTML = productHTML.trim();
      
      const productElement = templateElement.firstElementChild;
      productElement.querySelector('.card-img-top').src = product.imgPath;
      productElement.querySelector('.card-img-top').alt = product.name;
      productElement.querySelector('.card-title').textContent = product.name;
      productElement.querySelector('.card-text').textContent = product.description;
      productElement.querySelector('.price').textContent = product.price;

      return productElement;
    }

    let itemDiv = null;
    let rowDiv = null;

    products.forEach((product, index) => {
      const productElement = fillProductTemplate(productTemplate, product);

      if (index % productsPerSlide === 0) {
        itemDiv = document.createElement('div');
        itemDiv.classList.add('carousel-item');

        if (isFirstItem) {
          itemDiv.classList.add('active');
          isFirstItem = false;
        }

        carouselInner.appendChild(itemDiv);

        rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        itemDiv.appendChild(rowDiv);
      }

      rowDiv.appendChild(productElement);
    });
  }

  function disableAutoplayOnInteraction() {
    const carouselElement = document.querySelector('#clothes');

    if (!carouselElement) return;

    const carouselInstance = new bootstrap.Carousel(carouselElement, {
      interval: false,
      ride: false
    });

    carouselElement.addEventListener('slid.bs.carousel', () => carouselInstance.pause());
  }

  function toggleMenuIcon() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuIcon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
      if (menuIcon.classList.contains('fa-bars')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
      } else {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
      }
    });
  }

  await loadComponents();
  toggleMenuIcon();
});