import { resetHoneymate, runHoneymate } from "./honeymate";

runHoneymate();

const replayButtons = document.querySelectorAll(".honey-replay");
for (const button of replayButtons) {
  button.addEventListener("click", () => {
    resetHoneymate();
    runHoneymate();
  });
}
