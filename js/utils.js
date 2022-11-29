function rectCollision({ rect1, rect2 }) {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";

  const p1 = document.querySelector(".quote-p1");
  const p2 = document.querySelector(".quote-p2");

  p1.getElementsByTagName("p")[0].textContent =
    "“Urgh… My apologies. I must withdraw.”";
  p2.getElementsByTagName("p")[0].textContent =
    "“Very... Impressive... However... I expect you'll wish you'd died here on my steel. Lord Valter is...not nearly as merciful as I...”";

  if (player.health === enemy.health) {
    document.querySelector("#displayText").textContent = "Tie";
    p1.style.display = "flex";
    p2.style.display = "flex";

    player.switchSprite("death");
    enemy.switchSprite("death");
  }
  if (player.health > enemy.health) {
    document.querySelector("#displayText").textContent = "Seth Wins";
    p2.style.display = "flex";

    enemy.switchSprite("death");
  }
  if (player.health < enemy.health) {
    document.querySelector("#displayText").textContent = "Tirado Wins";
    p1.style.display = "flex";

    player.switchSprite("death");
  }
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

const closeBtn = document.querySelector(".btn-close");
const helpBtn = document.querySelector(".btn-help");
const visible = document.querySelector(".help");

closeBtn.addEventListener("click", () => {
  visible.ariaExpanded = false;
});

helpBtn.addEventListener("click", () => {
  if (visible.ariaExpanded === "false") {
    visible.ariaExpanded = true;
  } else {
    visible.ariaExpanded = false;
  }
});
