document.addEventListener('DOMContentLoaded', () => {
  // Selectors
  const slider = document.querySelector('.experience-slider');
  const pagination = document.querySelector('.pagination-lines');
  const experiencePages = document.querySelectorAll('.experience-page');
  let currentIndex = 0;
  let isScrolling = false;

  // Function to Create Pagination Lines Dynamically
  const createPaginationLines = () => {
    experiencePages.forEach((page, index) => {
      const line = document.createElement('div');
      line.classList.add('line');
      if (index === 0) line.classList.add('active');
      line.dataset.index = index;
      line.ariaLabel = `Go to experience section ${index + 1}`;
      pagination.appendChild(line);
    });
  };

  // Initialize Pagination Lines
  createPaginationLines();
  const lines = document.querySelectorAll('.pagination-lines .line');

  // Function to Update Active Line
  const updateActiveLine = (index) => {
    lines.forEach(line => line.classList.remove('active'));
    if (lines[index]) lines[index].classList.add('active');
  };

  // Function to Scroll to Specific Experience Page
  const scrollToPage = (index) => {
    const page = experiencePages[index];
    if (page) {
      slider.scrollTo({
        left: page.offsetLeft,
        behavior: 'smooth',
      });
      currentIndex = index;
      updateActiveLine(index);
    }
  };

  // Add Click Event Listeners to Lines
  lines.forEach(line => {
    line.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      scrollToPage(index);
    });
  });

  // Scroll Event with Debounce to Update Active Line
  const debounceScroll = () => {
    if (isScrolling) return;
    isScrolling = true;

    setTimeout(() => {
      const sliderCenter = slider.scrollLeft + (slider.offsetWidth / 2);
      let closestIndex = 0;
      let minDistance = Infinity;

      experiencePages.forEach((page, index) => {
        const pageCenter = page.offsetLeft + (page.offsetWidth / 2);
        const distance = Math.abs(pageCenter - sliderCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      currentIndex = closestIndex;
      updateActiveLine(closestIndex);
      isScrolling = false;
    }, 150);
  };

  slider.addEventListener('scroll', debounceScroll);

  // Drag-to-Scroll Functionality
  let isDown = false;
  let startX;
  let scrollLeftPos;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeftPos = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed as needed
    slider.scrollLeft = scrollLeftPos - walk;
  });

  // Optional: Keyboard Navigation (Left and Right Arrow Keys)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      scrollToPage(currentIndex - 1);
    } else if (e.key === 'ArrowRight' && currentIndex < experiencePages.length - 1) {
      scrollToPage(currentIndex + 1);
    }
  });

  // Modal Functionality for Experience Details
  const modal = document.getElementById('experience-modal');
  const closeBtn = modal.querySelector('.close-btn');
  const companyName = document.getElementById('company-name');
  const jobRole = document.getElementById('job-role');
  const jobDuration = document.getElementById('job-duration');
  const jobDescription = document.getElementById('job-description');

  const experienceItems = document.querySelectorAll('.experience-item');

  experienceItems.forEach(item => {
    item.addEventListener('click', () => {
      companyName.textContent = item.querySelector('h4').textContent;
      jobRole.textContent = item.dataset.role;
      jobDuration.textContent = item.dataset.duration;
      jobDescription.textContent = item.dataset.description;
      modal.style.display = 'block';
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
