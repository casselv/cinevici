const navlinks = document.querySelectorAll(".navlist a");
const submt = document.querySelector("#submit");

navlinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const textElement = document.getElementById("typing");

const text = "cinevici";

let charIndex = 0;

function type() {
  textElement.textContent = text.slice(0, charIndex);
  charIndex++;

  if (charIndex <= text.length) {
    setTimeout(type, 50);
  }
}

type();

const budgetSlider = document.getElementById("budget");
const budgetValue = document.getElementById("budget-value");

budgetSlider.addEventListener("input", () => {
  budgetValue.textContent = budgetSlider.value;
});
