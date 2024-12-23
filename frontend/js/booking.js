document.addEventListener('DOMContentLoaded', () => {
  // Grab the form and confirmation elements
  const bookingForm = document.getElementById('bookingForm');
  const confirmationMessage = document.getElementById('confirmation');
  const submitButton = bookingForm.querySelector('button'); // Get the submit button

  // Handle form submission
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from submitting traditionally

    // Get user input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;

    // Ensure all fields are filled
    if (!name || !email || !date) {
      confirmationMessage.innerHTML = 'Please fill in all fields.';
      return;
    }

    // Show loading message and disable the submit button
    confirmationMessage.innerHTML = 'Processing...';
    submitButton.disabled = true;

    // Send data to backend API
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, date }),
      });

      const data = await response.json();

      // Handle the response
      if (response.ok) {
        confirmationMessage.innerHTML = `
          Booking successful! Your Zoom link is: 
          <a href="${data.zoomLink}" target="_blank">${data.zoomLink}</a>
        `;
      } else {
        // Specific error message based on response data
        if (data.error) {
          confirmationMessage.innerHTML = `Error: ${data.error}`;
        } else {
          confirmationMessage.innerHTML = 'Error: Booking failed. Please try again later.';
        }
      }
    } catch (err) {
      // Handle network errors or any other unexpected issues
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        confirmationMessage.innerHTML = 'Network error: Unable to connect to the server. Please check your internet connection.';
      } else {
        confirmationMessage.innerHTML = `Unexpected error: ${err.message}. Please try again later.`;
      }
    } finally {
      // Re-enable the submit button after the API response
      submitButton.disabled = false;
    }
  });
});
