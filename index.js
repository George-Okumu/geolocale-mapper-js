document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('camera');
    const captureButton = document.getElementById('capture');
    const resultDiv = document.getElementById('result');
    let stream;

    // Function to start the camera
    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(mediaStream) {
                video.srcObject = mediaStream;
                stream = mediaStream;
            })
            .catch(function(error) {
                console.error("Error accessing the camera: ", error);
            });
    }

    // Function to capture image and get location
    function captureImage() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL('image/png');

        // Get location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Reverse geocoding to get the location name
                fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        const locationName = data.display_name;

                        // Display the result
                        resultDiv.innerHTML = `
                            <h2>Captured Image:</h2>
                            <img src="${imageDataURL}" alt="Captured Image">
                            <h2>Location:</h2>
                            <p>Latitude: ${latitude}</p>
                            <p>Longitude: ${longitude}</p>
                            <p>Location: ${locationName}</p>
                        `;
                    })
                    .catch(error => {
                        console.error("Error with reverse geocoding: ", error);
                        resultDiv.innerHTML = `<p>Error getting location name: ${error.message}</p>`;
                    });
            }, function(error) {
                console.error("Error getting location: ", error);
                resultDiv.innerHTML = `<p>Error getting location: ${error.message}</p>`;
            });
        } else {
            resultDiv.innerHTML = `<p>Geolocation is not supported by this browser.</p>`;
        }
    }

    // Event listeners
    captureButton.addEventListener('click', captureImage);

    // Start the camera when the page loads
    startCamera();
});
