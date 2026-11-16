import { useEffect, useState } from "react";
import avatar from "../assets/listing_avatar.jpeg";
import kitchen from "../assets/listing_kitchen.jpeg";
import living from "../assets/listing_living.jpeg";
import room1 from "../assets/listing_room_1.jpeg";
import room2 from "../assets/listing_room_2.jpeg";

type ListingModalProps = {
  onClose: () => void;
};

/** In-world listing page (fictional data). Purely visual: it never touches game state. */
export function ListingModal({ onClose }: ListingModalProps) {
  const [phoneShown, setPhoneShown] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="listing-overlay" onClick={onClose}>
      <article
        className="listing"
        role="dialog"
        aria-modal="true"
        aria-label="Оголошення про оренду"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="listing__bar">
          <span className="listing__brand">КИЇВ · оголошення</span>
          <span className="listing__bar-actions">
            <button
              type="button"
              className={`listing__like${liked ? " is-on" : ""}`}
              aria-pressed={liked}
              aria-label="В обране"
              onClick={() => setLiked(!liked)}
            >
              {liked ? "♥" : "♡"}
            </button>
            <button type="button" className="listing__close" onClick={onClose}>
              Закрити
            </button>
          </span>
        </header>

        <div className="listing__body">
          <section className="listing__gallery" aria-label="Фото квартири">
            <img className="listing__photo listing__photo--main" src={living} alt="Вітальня" />
            <img className="listing__photo" src={kitchen} alt="Кухня" />
            <img className="listing__photo" src={room1} alt="Спальня" />
            <img className="listing__photo" src={room2} alt="Друга кімната" />
            <span className="listing__photo listing__photo--green">
              <img src={kitchen} alt="Кухня, ще одне фото" />
            </span>
          </section>

          <section className="listing__info">
            <p className="listing__price">10 000 грн/міс.</p>
            <h2 className="listing__title">Світла трикімнатна квартира біля центру</h2>

            <div className="listing__agent">
              <img src={avatar} alt="" />
              <div>
                <p className="listing__agent-name">Рієлторка Лариса</p>
                <p className="listing__agent-badge">✔ Верифікований профіль</p>
              </div>
            </div>

            <p className="listing__quote">
              «Терміново! Власник за кордоном. Зробили ремонт для доньки, але плани змінилися.
              Квартира вільна.»
            </p>

            <button
              type="button"
              className="listing__phone"
              onClick={() => setPhoneShown(true)}
            >
              {phoneShown ? "+38 067 123 45 67" : "Показати телефон +38 067 ••• •• ••"}
            </button>
          </section>

          <section className="listing__details">
            <h3>Деталі</h3>
            <ul className="listing__facts">
              <li>3 кімнати</li>
              <li>67 м²</li>
              <li>поверх 5 з 9</li>
              <li>опубліковано 10 хвилин тому</li>
            </ul>
            <p className="listing__address">Центр, вул. Хрещатик</p>
            <div className="listing__map" role="img" aria-label="Мапа району" />
          </section>

          <section className="listing__details">
            <h3>Опис</h3>
            <p>
              Світла квартира після свіжого ремонту: три окремі кімнати, кухня, балкон.
              Поруч метро й парк. Заселення найближчими днями.
            </p>
            <p>Умови за домовленістю. Дзвоніть — відповідаю одразу.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
