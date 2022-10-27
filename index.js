const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// window.onload = function () {
//   console.log("loaded...");
//   resizeCanvas();
// };

// window.onresize = function () {
//   console.log("resizing...");
//   resizeCanvas();
// };

// function resizeCanvas() {
//   if (window.innerWidth < 1024) {
//     canvas.width = 1024;
//   } else {
//     canvas.width = window.innerWidth;
//   }

//   if (window.innerHeight < 576) {
//     canvas.height = 576;
//   } else {
//     canvas.height = window.innerHeight;
//   }
// }

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

// Create Background
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background2.png",
});

// const shop = new Sprite({
//   position: {
//     x: 610,
//     y: 130,
//   },
//   imageSrc: "./assets/shop.png",
//   scale: 2.75,
//   framesMax: 6,
// });

// Create Player 1
const player = new Fighter({
  position: {
    x: canvas.width * 0.1,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  color: "red",
  offset: {
    x: 100,
    y: 55,
  },
  scale: 2.75,
  sprites: {
    idle: {
      imageSrc: "./assets/Paladin/Idle.png",
      framesMax: 6,
    },
    run: {
      imageSrc: "./assets/Paladin/Run.png",
      framesMax: 5,
    },
    jump: {
      imageSrc: "./assets/Paladin/Jump.png",
      framesMax: 1,
    },
    fall: {
      imageSrc: "./assets/Paladin/Fall.png",
      framesMax: 5,
    },
    attack1: {
      imageSrc: "./assets/Paladin/Attack.png",
      framesMax: 11,
    },
    takeHit: {
      imageSrc: "./assets/Paladin/Hit.png",
      framesMax: 2,
    },
    death: {
      imageSrc: "./assets/Paladin/Death.png",
      framesMax: 2,
    },
  },
  attackFrame: 5,
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 75,
    height: 50,
  },
});

// Create Player 2
const enemy = new Fighter({
  position: {
    x: canvas.width * 0.8,
    y: 75,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  scale: 3,
  offset: {
    x: 150,
    y: 60,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/General/Idle.png",
      framesMax: 6,
    },
    run: {
      imageSrc: "./assets/General/Run.png",
      framesMax: 4,
    },
    jump: {
      imageSrc: "./assets/General/Jump.png",
      framesMax: 1,
    },
    fall: {
      imageSrc: "./assets/General/Fall.png",
      framesMax: 1,
    },
    attack1: {
      imageSrc: "./assets/General/Attack.png",
      framesMax: 12,
    },
    takeHit: {
      imageSrc: "./assets/General/Hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/General/Death.png",
      framesMax: 3,
    },
  },
  attackFrame: 6,
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 190,
    height: 50,
  },
});

const keys = {
  // player controls
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },

  // enemy controls
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

// Character Intro Battle Quote
const p1 = document.querySelector(".quote-p1");
const p2 = document.querySelector(".quote-p2");

p1.getElementsByTagName("p")[0].textContent =
  "“My only wish is to serve and protect the two of you...”";
p2.getElementsByTagName("p")[0].textContent =
  "“Hmm... my men were unable to finish the job, were they? It falls on me to show you my own special brand of power.”";

p1.style.display = "flex";
p2.style.display = "flex";

setTimeout(() => {
  p1.style.display = "none";
  p2.style.display = "none";
}, 3000);

decreaseTimer();

// Animation Frames for Canvas
function animate() {
  window.requestAnimationFrame(animate);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  // shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a") {
    if (player.position.x > 0) {
      player.velocity.x = -5;
      player.switchSprite("run");
    }
  } else if (keys.d.pressed && player.lastKey === "d") {
    if (player.position.x < canvas.width * 0.9) {
      player.velocity.x = 5;
      player.switchSprite("run");
    }
  } else {
    player.switchSprite("idle");
  }

  // player jumping - can only jump once before landing
  if (player.velocity.y < 0) {
    player.isJumping = true;
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  } else {
    player.isJumping = false;
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    if (enemy.position.x > 0) {
      enemy.velocity.x = -5;
      enemy.switchSprite("run");
    }
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    if (enemy.position.x < canvas.width * 0.9) {
      enemy.velocity.x = 5;
      enemy.switchSprite("run");
    }
  } else {
    enemy.switchSprite("idle");
  }

  // enemy jumping - can only jump once before landing
  if (enemy.velocity.y < 0) {
    enemy.isJumping = true;
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  } else {
    enemy.isJumping = false;
  }

  // player: detect for valid hit & enemy hit
  if (
    rectCollision({
      rect1: player,
      rect2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === player.attackFrame &&
    enemy.dead === false
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }

  // if  player misses
  if (player.isAttacking && player.framesCurrent === player.framesMax - 1) {
    player.isAttacking = false;
  }

  // enemy: detect for valid hit  & player hit
  if (
    rectCollision({
      rect1: enemy,
      rect2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === enemy.attackFrame &&
    player.dead === false
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }

  // if  enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === enemy.framesMax - 1) {
    enemy.isAttacking = false;
  }

  // end game based on health
  if (enemy.health <= 0 || player.health === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

// Event Listeners for Player Control/Movement
window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "w":
        if (player.isJumping === false) {
          player.velocity.y = -18;
        }
        break;
      case " ":
        player.attack();
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
    }
  }

  if (!enemy.dead) {
    // enemy keys
    switch (event.key) {
      case "ArrowUp":
        if (enemy.isJumping === false) {
          enemy.velocity.y = -18;
        }
        break;
      case "ArrowDown":
        enemy.attack();
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }

  // enemy keys
  switch (event.key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
  }
});

// Disable arrow key default behavior moving browser screen scroll
window.addEventListener(
  "keydown",
  function (e) {
    if (
      ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
        e.code
      ) > -1
    ) {
      e.preventDefault();
    }
  },
  false
);
