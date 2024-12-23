document.getElementById('booking-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const therapist = document.getElementById('therapist').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  const summary = `
    <h3>Booking Summary</h3>
    <p>Therapist: ${therapist}</p>
    <p>Date: ${date}</p>
    <p>Time: ${time}</p>
  `;

  document.getElementById('booking-summary').innerHTML = summary;
});
