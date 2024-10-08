import { createElement } from '../render.js';
import { formatDate, getTimeDifference } from '../utils.js';
import { dateFormats } from '../const.js';

const createItemPoint = (point, offers, destinations) => {
  const {type, basePrice, dateFrom, dateTo, isFavorite} = point;

  const pointDestination = destinations.find((dest) => dest.id === point.destination);
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  const listOffers = offers.find((offer) => type === offer.type).offers;
  const selectedOffers = listOffers.filter((offer) => point.offers.includes(offer.id));

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${formatDate(dateFrom, dateFormats.fullDate)}">${formatDate(dateFrom, dateFormats.shortDate)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${pointDestination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDate(dateFrom, dateFormats.fullDateTime)}">${formatDate(dateFrom, dateFormats.time)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatDate(dateTo, dateFormats.fullDateTime)}">${formatDate(dateTo, dateFormats.time)}</time>
          </p>
          <p class="event__duration">${getTimeDifference(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">

        ${selectedOffers.map((off) => `<li class="event__offer">
            <span class="event__offer-title">${off.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${off.price}</span>
          </li>`).join('')}

        </ul>
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`);
};

export default class ItemPointView {
  constructor({point, offers, destinations}) {
    this.point = point;
    this.offers = offers;
    this.destinations = destinations;
  }

  getTemplate() {
    return createItemPoint(this.point, this.offers, this.destinations);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
