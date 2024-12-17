const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
let scrollPosition = 0;
class VideoPlayer {
  constructor(container) {
    this.container = container;
    this.videoId = container.getAttribute("data-video-id");
    this.playerOptions = {
      id: this.videoId,
      loop: false,
      autoplay: false,
      controls: false,
      transparent: false,
      playsinline: true,
      allowfullscreen: true,
    };
    this.initPlayer();
  }
  async initPlayer() {
    this.player = new Vimeo.Player(this.container, this.playerOptions);
    await this.player.ready();
    const iframe = this.container.querySelector("iframe");
    if (iframe) {
      iframe.setAttribute("allowfullscreen", "allowfullscreen");
      iframe.setAttribute("webkitallowfullscreen", "true");
      iframe.setAttribute("mozallowfullscreen", "true");
    }
    this.insertCustomHUD();
    this.cacheDOMElements();
    this.initializeEvents();
  }
  insertCustomHUD() {
    const customHud = `
          <button class="center-play play-pause">
            <img class="play-icon" src="images/play.png" alt="Play icon">
          </button>
          <button class="center-play pause hidden">
            <img class="play-icon" src="images/pause.png" alt="Pause icon">
          </button>
          <div class="custom-hud hidden">
            <input type="range" class="progress-bar" value="0" min="0" max="100" />
            <button class="fullscreen-btn">
              <i class="fa-solid fa-expand  fullscreen-icon"></i>
            </button>
          </div>
        `;
    this.container.insertAdjacentHTML("beforeend", customHud);
  }
  cacheDOMElements() {
    this.playPauseButton = this.container.querySelector(".play-pause");
    this.pauseButton = this.container.querySelector(".pause");
    this.progressBar = this.container.querySelector(".progress-bar");
    this.progressBarContainer = this.container.querySelector(".custom-hud");
    this.fullscreenBtn = this.container.querySelector(".fullscreen-btn");
  }
  initializeEvents() {
    if (!isMobile) {
      this.playPauseButton.addEventListener("click", () => this.handlePlay());
      this.pauseButton.addEventListener("click", () => this.handlePause());
      this.container.addEventListener("mouseenter", () => {
        this.showControls();
      });
      this.container.addEventListener("mouseleave", () => {
        this.hideControls();
      });
      this.fullscreenBtn.addEventListener("click", () =>
        this.toggleFullscreen()
      );
      document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement === this.container) {
          this.container.addEventListener("mousemove", () =>
            this.handleMouseMove()
          );
        } else {
          this.container.removeEventListener("mousemove", () =>
            this.handleMouseMove()
          );
        }
      });
    } else {
      this.playPauseButton.addEventListener("touchstart", () =>
        this.handlePlay()
      );
      this.pauseButton.addEventListener("touchstart", () => this.handlePause());
      this.container.addEventListener("touchstart", (event) =>
        this.handleVideoTouch(event)
      );
      this.progressBar.addEventListener("touchstart", () => this.clearTimer());
      this.progressBar.addEventListener("touchend", () =>
        this.startHideControlsTimer()
      );
      this.fullscreenBtn.addEventListener("touchstart", () =>
        this.toggleFullscreen()
      );
    }
    this.progressBar.addEventListener("input", (event) =>
      this.handleProgressChange(event)
    );
    this.player.on("timeupdate", (data) => {
      this.progressBar.value = (data.percent * 100).toFixed(2);
    });
    this.player.on("ended", () => this.handleVideoEnd());
  }
  handleMouseMove() {
    this.showControls();
    this.startHideControlsTimer();
  }
  toggleFullscreen() {
    // Detectar iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (!document.fullscreenElement) {
      scrollPosition = window.scrollY || window.pageYOffset;
      if (isIOS) {
        // En iOS, usamos la API de Vimeo para el fullscreen
        this.player
          .requestFullscreen()
          .then(() => {
            this.showControls();
            this.startHideControlsTimer();
          })
          .catch((error) => {
            console.log("Error entrando a fullscreen:", error);
          });
      } else {
        // Para otros dispositivos, usamos el método anterior
        if (this.container.requestFullscreen) {
          this.container.requestFullscreen();
        } else if (this.container.webkitRequestFullscreen) {
          this.container.webkitRequestFullscreen();
        } else if (this.container.msRequestFullscreen) {
          this.container.msRequestFullscreen();
        }
        this.showControls();
        this.startHideControlsTimer();
      }
    } else {
      if (isIOS) {
        this.player
          .exitFullscreen()
          .then(() => {
            window.scrollTo(0, scrollPosition);
          })
          .catch((error) => {
            console.log("Error saliendo de fullscreen:", error);
          });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().then(() => {
            window.scrollTo(0, scrollPosition);
          });
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
          window.scrollTo(0, scrollPosition);
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
          window.scrollTo(0, scrollPosition);
        }
      }
    }
  }
  showControls() {
    this.player.getPaused().then((paused) => {
      if (paused) {
        this.pauseButton.classList.add("hidden");
        this.playPauseButton.classList.remove("hidden");
      } else {
        this.pauseButton.classList.remove("hidden");
        this.playPauseButton.classList.add("hidden");
      }
      this.progressBarContainer.classList.remove("hidden");
    });
  }
  hideControls() {
    this.player.getPaused().then((paused) => {
      if (paused) {
        this.pauseButton.classList.add("hidden");
        this.progressBarContainer.classList.add("hidden");
      } else {
        this.pauseButton.classList.add("hidden");
        this.playPauseButton.classList.add("hidden");
        this.progressBarContainer.classList.add("hidden");
      }
    });
  }
  startHideControlsTimer() {
    this.clearTimer();
    this.hideControlsTimeout = setTimeout(() => this.hideControls(), 3000);
  }
  clearTimer() {
    if (this.hideControlsTimeout) {
      clearTimeout(this.hideControlsTimeout);
    }
  }
  handlePlay() {
    this.player.getPaused().then((paused) => {
      if (paused) {
        this.player.play().then(() => {
          this.showControls();
          this.startHideControlsTimer();
        });
      }
    });
  }
  handlePause() {
    this.player.getPaused().then((paused) => {
      if (!paused) {
        this.player.pause().then(() => {
          this.showControls();
          if (isMobile) {
            this.clearTimer();
          }
        });
      }
    });
  }
  async handleVideoTouch(event) {
    const target = event.target;
    const isControl =
      target === this.pauseButton ||
      target === this.progressBar ||
      target === this.playPauseButton ||
      this.progressBarContainer.contains(target);
    if (isControl) return;
    this.player.getPaused().then((paused) => {
      this.showControls();
      if (!paused) {
        this.startHideControlsTimer();
      }
    });
  }
  handleProgressChange(event) {
    const percent = event.target.value / 100;
    this.player.getDuration().then((duration) => {
      this.player.setCurrentTime(duration * percent);
    });
  }
  handleVideoEnd() {
    this.player.setCurrentTime(0).then(() => {
      this.player.pause();
      this.showControls();
    });
  }
}
document.querySelectorAll(".video-container").forEach(async (container) => {
  const player = new VideoPlayer(container);
});
