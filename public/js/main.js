// Main JavaScript for FinTrack Landing Page

document.addEventListener('DOMContentLoaded', function() {
  console.log('FinTrack Landing Page loaded');

  // Fetch and display API health status
  fetchAPIHealth();

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all feature cards and API examples
  document.querySelectorAll('.feature-card, .api-example').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Fetch API health status
async function fetchAPIHealth() {
  try {
    const response = await fetch('/health');
    const data = await response.json();
    
    if (data.success) {
      document.getElementById('api-status').textContent = '🟢 Online';
      
      // Update uptime
      const uptime = data.uptime;
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      document.getElementById('uptime').textContent = `${hours}h ${minutes}m`;
    } else {
      document.getElementById('api-status').textContent = '🔴 Offline';
    }
  } catch (error) {
    console.log('API health check failed - might be in static mode');
    document.getElementById('api-status').textContent = '⚪ Static Mode';
    document.getElementById('uptime').textContent = 'N/A';
  }
}

// Update health status every 30 seconds
setInterval(fetchAPIHealth, 30000);
