import { replace, render, remove } from '../framework/render';
import ItemPointView from '../view/item-point-view';
import OpenPointView from '../view/open-point-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #listPointsComponent = null;
  #allOffers = null;
  #allDestinations = null;
  #handleModeChange = null;

  #point = null;
  #mode = Mode.DEFAULT;

  #pointComponent = null;
  #openPointComponent = null;

  constructor({listPointsContainer, allOffers, allDestinations, onModeChange}) {
    this.#listPointsComponent = listPointsContainer;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevOpenPointComponent = this.#openPointComponent;

    this.#pointComponent = new ItemPointView({
      point: this.#point,
      allOffers : this.#allOffers,
      allDestinations : this.#allDestinations,
      onRollupClick: () => {
        this.#replacePointToOpenPoint();
      }
    });

    this.#openPointComponent = new OpenPointView({
      point: this.#point,
      allOffers : this.#allOffers,
      allDestinations : this.#allDestinations,
      onFormClick: () => {
        this.#replaceOpenPointToPoint();
      }
    });

    if (prevPointComponent === null || prevOpenPointComponent === null) {
      render(this.#pointComponent, this.#listPointsComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#openPointComponent, prevOpenPointComponent);
    }

    remove(prevPointComponent);
    remove(prevOpenPointComponent);

  }

  /**
   * Обработчик события нажатия клавиши 'Escape'.
   * @param evt - Событие клавиатуры.
   */
  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceOpenPointToPoint();
    }
  };

  /**
   * Сбрасывает представление точки.
   */
  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceOpenPointToPoint();
    }
  }

  /**
 * Заменяет компонент закрытой точки на компонент открытой точки.
 */
  #replacePointToOpenPoint() {
    replace(this.#openPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeydown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  /**
   * Заменяет компонент открытой точки на компонент закрытой точки.
   */
  #replaceOpenPointToPoint() {
    replace(this.#pointComponent, this.#openPointComponent);
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#mode = Mode.DEFAULT;
  }

}
