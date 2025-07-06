import { useEffect } from "react";
import { useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";

import "./imageSlider.scss";

const ImageSlider = ({ images, autoSlide = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (autoSlide) {
      const intervalId = setInterval(() => {
        setCurrentSlide((prevState) =>
          prevState === images.length - 1 ? 0 : prevState + 1
        );
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [images.length]);

  function rightImageHandler() {
    setCurrentSlide((prevState) => {
      if (prevState === images.length - 1) {
        return 0;
      }
      return prevState + 1;
    });
  }

  function leftImageHandler() {
    setCurrentSlide((prevState) => {
      if (prevState === 0) {
        return images.length - 1;
      }
      return prevState - 1;
    });
  }

  function setCurrentIndicator(currIndex) {
    setCurrentSlide(currIndex);
  }

  return (
    <div className={"image-slider-container"}>
      {images.length > 1 && (
        <BsArrowLeftCircleFill
          className="arrow arrow-left"
          onClick={leftImageHandler}
        />
      )}
      {images.length > 0 &&
        images.map((image, index) => (
          <img
            src={image}
            alt={index}
            key={index}
            loading="lazy"
            className={currentSlide === index ? "current-image" : "hide-image"}
          />
        ))}
      {images.length > 1 && (
        <BsArrowRightCircleFill
          className="arrow arrow-right"
          onClick={rightImageHandler}
        />
      )}
      {images.length > 1 && (
        <span className="circle-indicator">
          {images.length > 0 &&
            images.map((image, index) => (
              <button
                className={
                  currentSlide === index
                    ? "current-indicator"
                    : "suppress-indicator"
                }
                key={index}
                onClick={() => setCurrentIndicator(index)}
              ></button>
            ))}
        </span>
      )}
    </div>
  );
};

export default ImageSlider;
