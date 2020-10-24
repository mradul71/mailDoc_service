const browse = document.querySelector(".browse");
const fileInput = document.querySelector(".file");
const status = document.querySelector(".status");
const upload = document.querySelector(".btn");

browse.addEventListener("click", () => {
    fileInput.click();
})

fileInput.addEventListener("change", () => {
    status.style.display = "block";
    upload.classList.remove("btn-primary");
    upload.classList.add("btn-success");
    console.log("file added");
})