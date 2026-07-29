const sceneCards = document.querySelectorAll(".scene-card");

sceneCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    const selectedScene = e.currentTarget.dataset.scene;

    if (selectedScene) {
      window.location.href = `visualizer.html?scene=${selectedScene}`;
    }

    // console.log("selectedScene:", selectedScene);
  });
});
