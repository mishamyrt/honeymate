import { runHoneymate } from "./honeymate";

runHoneymate();

const replayButtons = document.querySelectorAll(".honeymate-replay");
replayButtons.forEach((button) => {
  button.addEventListener("click", () => {
    runHoneymate();
  });
});
