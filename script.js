const body = document.querySelector("body");
const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const quoteIcon = document.getElementById("quote-left");
const auhtorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const shareBtn = document.getElementById("share");
const shootBtn = document.getElementById("shoot");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
let quotes = [];

function loading() {
  loader.hidden = false;
  // quoteText.hidden = true;
  // quoteContainer.style.display = "none";
}

function complete() {
  loader.hidden = true;
  // quoteIcon.hidden = false;

  // quoteContainer.style.display = "flex";
  // quoteContainer.hidden = false;
}

function newQuote() {
  body.style.background = "url('https://source.unsplash.com/random?nature')";
  body.style.backgroundSize = "cover";
  body.style.backgroundRepeat = "no-repeat";
  loading();
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  auhtorText.textContent = quote.author ? quote.author : "Inconnu";
  if (quote.text.length > 100) {
    quoteText.classList.add("long-quote");
  } else {
    quoteText.classList.remove("long-quote");
  }
  quoteText.textContent = quote.text;
  complete();
}

function setBackGround() {
  fetch("https://random.imagecdn.app/500/150").then((res) => {
    console.log(res.url);
    quoteContainer.style.backgroundImage = res.url;
  });
}

function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${auhtorText.textContent}`;
  window.open(twitterUrl, "_blank");
}

function shareQutote() {
  if (navigator.share) {
    navigator
      .share({
        title: document.title,
        text: `" ${quoteText.textContent} " \n ${auhtorText.textContent}\n`,
        url: document.location.href,
      })
      .then(function () {})
      .catch(function (e) {
        // error message
        console.log(e.message);
      });
  }
}

function takeshot() {
  const div = document.getElementById("to-shoot");
  div.classList.add("to-shoot");
  html2canvas(div).then(function (canvas) {
    // document.getElementById("output").appendChild(canvas);
    canvas.getContext("2d");
    const link = document.createElement("a");

    link.download = "quote.png";
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  });
  div.classList.remove("to-shoot");
}

async function getQuotes() {
  loading();
  const apiUrl = "https://type.fit/api/quotes";
  try {
    const response = await fetch(apiUrl);
    quotes = await response.json();
    newQuote();
  } catch (error) {}
}

newQuoteBtn.addEventListener("click", newQuote);
twitterBtn.addEventListener("click", tweetQuote);
shareBtn.addEventListener("click", shareQutote);
shootBtn.addEventListener("click", takeshot);

// OnLoad
getQuotes();
// loading();

async function shareCanvas() {
  const shoot = document.getElementById("to-shoot");
  shoot.classList.add("to-shoot");
  const canvasElement = await html2canvas(shoot);
  const dataUrl = canvasElement.toDataURL();
  const blob = await (await fetch(dataUrl)).blob();
  const filesArray = [
    new File([blob], "quote.png", {
      type: blob.type,
      lastModified: new Date().getTime(),
    }),
  ];
  const shareData = {
    files: filesArray,
  };
  navigator.share(shareData);
  shoot.classList.remove("to-shoot");
}
