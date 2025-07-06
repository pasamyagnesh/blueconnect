const IntroScreen = ({
  screenData,
  currentScreen,
  totalScreens,
  onNext,
  onPrevious,
  onSkip,
}) => {
  return (
    <div className="intro-screen">
      <button className="skip-button" onClick={onSkip}>
        Skip
      </button>

      <div className="content">
        <div className="image-container">
          <span className="intro-image" style={{ fontSize: "4rem" }}>
            {screenData.image}
          </span>
        </div>
        <h1>{screenData.title}</h1>
        <p>{screenData.description}</p>

        <div className="progress-indicator">
          {Array.from({ length: totalScreens }).map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${
                index === currentScreen ? "active" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          className="nav-button"
          onClick={onPrevious}
          disabled={currentScreen === 0}>
          Previous
        </button>
        <button className="nav-button" onClick={onNext}>
          {currentScreen === totalScreens - 1 ? "Get Started" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
