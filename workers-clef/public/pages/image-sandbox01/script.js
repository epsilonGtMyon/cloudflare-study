const gen1ButtonElem = document.getElementById("gen1Button");

const imageInputElem = document.getElementById("imageInput");
const imagePreviewElem = document.getElementById("imagePreview");

const resultMessageElem = document.getElementById("resultMessage");

const API_PREFIX = "/api/image-sandbox01";

let base64Image = "";

imageInputElem.addEventListener("change", (event) => {
  imagePreviewElem.innerHTML = "";
  base64Image = "";
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      base64Image = e.target.result;

      const imgElem = document.createElement("img");
      imgElem.src = base64Image;
      imgElem.alt = "Preview";
      imgElem.style.maxWidth = "100%";
      imgElem.style.maxHeight = "400px";

      imagePreviewElem.appendChild(imgElem);
    };
    reader.readAsDataURL(file);
  }
});

gen1ButtonElem.addEventListener("click", async () => {
  resultMessageElem.textContent = "";

  const response = await fetch(`${API_PREFIX}/gen1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageDataURL: base64Image }),
  });
  const data = await response.json();

  resultMessageElem.textContent = `これは: ${data.choice} です。確信度: ${Math.floor(data.confidence * 1000) / 10 }%
  
  確率: ${JSON.stringify(data.probabilities, null, 2)}
  `;
});
