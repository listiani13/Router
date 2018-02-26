// Select your input type file and store it in a variable
const input = document.getElementById('uploadFile');

// This will upload the file after having read it
const upload = (e) => {
  fetch('http://localhost:8080/submit', {
    // Your POST endpoint
    method: 'POST',
    body: e.currentTarget.result, // This is the content of your file
  })
    .then(
      (response) => response.json(), // if the response is a JSON object
    )
    .then(
      (success) => console.log(success), // Handle the success response object
    )
    .catch(
      (error) => console.log(error), // Handle the error response object
    );
};

// Event handler executed when a file is selected
const onSelectFile = (files) => {
  // Files is a list because you can select several files
  // We just upload the first selected file
  const file = input.files[0];
  const reader = new FileReader();

  // We read the file and call the upload function with the result
  reader.onload = upload;
  reader.readAsText(file);
};

// Add a listener on your input
// It will be triggered when a file will be selected
input.addEventListener('change', onSelectFile, false);
