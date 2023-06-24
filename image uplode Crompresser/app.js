const dropZone = document.getElementById('dropZone');
const dropZoneInner = document.getElementById('dropZone-inner');
const fileInput = document.getElementById('fileInput');
const compressSlider = document.getElementById('compressSlider');
const compressValue = document.getElementById('compressValue');
const compressButton = document.getElementById('compressButton');
const downloadLink = document.getElementById('downloadLink');
const removeImageLink = document.getElementById('remove-image');
const add2nImageLink = document.getElementById('Select-Image22');
const compressedSize = document.getElementById('compressedSize');
const addImageButton = document.getElementById('addImageButton');
const downloadSection = document.querySelector('.download-section');


dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZoneInner.classList.add('highlight');
});

dropZone.addEventListener('dragleave', () => {
  dropZoneInner.classList.remove('highlight');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZoneInner.classList.remove('highlight');
  const files = e.dataTransfer.files;
  handleFiles(files);
});

fileInput.addEventListener('change', () => {
  const files = fileInput.files;
  handleFiles(files);
});

function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imageType = /^image\//;

    if (!imageType.test(file.type)) {
      continue;
    }

    createImageContainer(file);
  }

  // Hide drop zone inner section
  dropZoneInner.classList.add('hide');

  // Show compress section
  document.querySelector('.compress-section').style.display = 'block';

  // Show remove image link
  removeImageLink.classList.add('show');

  // Show add more image link
  add2nImageLink.classList.add('show');

  // Show add more image button
  addImageButton.classList.add('show');
}

function createImageContainer(file) {

  function showFirstTwentyCharacters(text) {
    return text.substring(0, 15);
  }
  const FileName = showFirstTwentyCharacters(file.name);
  
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');

  const originalSize = document.createElement('div');
  originalSize.textContent = FileName+"... " + Math.round(file.size / 1024) + ' KB';
  originalSize.classList.add('image-file-name'); // Add class to original size label
  imageContainer.appendChild(originalSize);

  const img = document.createElement('img');
  img.classList.add('upload-preview');
  img.src = URL.createObjectURL(file);
  imageContainer.appendChild(img);

  const downloadButton = document.createElement('a');
  downloadButton.classList.add('download-button');
   downloadButton.textContent = 'Download';

  downloadButton.addEventListener('click', () => {
    const quality = compressSlider.value / 100;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match the image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Get the compressed image data
    const compressedImageData = canvas.toDataURL('image/jpeg', quality);

    // Create a temporary anchor element and trigger the download
    const anchor = document.createElement('a');
    anchor.href = compressedImageData;
    anchor.download = 'compressed_image.jpg';
    anchor.click();
    URL.revokeObjectURL(compressedImageData);
  });

  imageContainer.appendChild(downloadButton);

  const compressedSizeLabel = document.createElement('div');
  compressedSizeLabel.textContent = 'Compressed Size: - KB'; // Placeholder for compressed size
  compressedSizeLabel.classList.add('compressed-size-label'); // Add class to compressed size label
  imageContainer.appendChild(compressedSizeLabel);

  const removeButton = document.createElement('a');
  removeButton.classList.add('remove-button');
  const IconTagXmark = document.createElement('i');
  removeButton.appendChild(IconTagXmark);
  const removeIcon = removeButton.querySelector('i');
  removeIcon.classList.add('fa');
  removeIcon.classList.add('fa-xmark');
  removeButton.addEventListener('click', () => {
    imageContainer.remove();
    const imageContainers = document.getElementsByClassName('image-container');
    if (imageContainers.length === 0) {
      location.reload(); // Reload the page if only one image remains and it's removed
    }
  });
  imageContainer.appendChild(removeButton);

  const addButton = document.createElement('a');
  addButton.classList.add('add-image-button');
  const IconTag = document.createElement('i');
  addButton.appendChild(IconTag);
  const addIconn = addButton.querySelector('i');
  addIconn.classList.add('fa');
  addIconn.classList.add('fa-plus');
  const imageContainerWrapper = document.querySelector('.image-container-wrapper');
  imageContainerWrapper.appendChild(imageContainer);
  if(dropZoneInner.querySelector('.add-image-button') == null){
    dropZoneInner.appendChild(addButton);
  }
  
  addButton.addEventListener('click', () => {
    fileInput.click();
    
  });

  // Load the image to calculate compressed size
  const tempImg = new Image();
  tempImg.onload = function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match the image
    canvas.width = tempImg.width;
    canvas.height = tempImg.height;

    // Draw the image on the canvas
    ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);

    // Get the compressed image data
    const quality = compressSlider.value / 100;
    const compressedImageData = canvas.toDataURL('image/jpeg', quality);

    // Calculate and display the compressed size
    const compressedSizeKB = Math.round(compressedImageData.length / 1024);
    compressedSizeLabel.textContent = 'Compressed Size: ' + compressedSizeKB + ' KB';
  };
  tempImg.src = URL.createObjectURL(file);
}

add2nImageLink.addEventListener('click', () => {
  fileInput.click();
});

compressButton.addEventListener('click', () => {
  const uploadPreviews = document.getElementsByClassName('upload-preview');
  if (uploadPreviews.length > 0) {
    const zip = new JSZip();
    const canvasList = [];

    // Rest of the code...

    // Generate the zip file asynchronously
    zip.generateAsync({ type: 'blob' }).then(function (content) {
      // Update download link with the zip file
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = 'compressed_images.zip';

      // Show download section
      downloadSection.style.display = 'block';
      

      // Get the total compressed size
      const totalSizeKB = Math.round(content.size / 1024);
      compressedSize.textContent = 'Total Compressed Size: ' + totalSizeKB + ' KB';
    });
  }
});

compressSlider.addEventListener('input', () => {
  const value = compressSlider.value;
  compressValue.textContent = value;
});
// Hide download section initially
const SelectImage22 = document.querySelector('#Select-Image22');
window.addEventListener('resize',()=>{
  if(window.innerWidth <= 600 ){
    downloadSection.style.display = 'block';
  }else{
    downloadSection.style.display = 'none';
  }
})
if(window.innerWidth <= 600 ){
  downloadSection.style.display = 'block';
}else{
  downloadSection.style.display = 'none';
}