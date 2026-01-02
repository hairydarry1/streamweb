/* ================================
   MAIN.JS - ALL-IN-ONE (Updated for JSON)
================================ */
document.addEventListener("DOMContentLoaded", () => {

  /* ================================
     STAR BACKGROUND
  ================================= */
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let stars = [], STAR_COUNT = 120;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function createStars() {
    stars = [];
    for(let i=0; i<STAR_COUNT; i++){
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1
      });
    }
  }
  createStars();

  function drawStars(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
      star.y += star.speed;
      if(star.y > canvas.height){
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();

  /* ================================
     FADE-IN ON SCROLL
  ================================= */
  const faders = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add("show");
    });
  }, {threshold: 0.15});
  faders.forEach(el => observer.observe(el));

  /* ================================
     STATS COUNTER
  ================================= */
  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const counter = entry.target;
      const target = +counter.dataset.target;
      let count = 0;
      const speed = target / 80;
      const update = () => {
        count += speed;
        if(count < target){
          counter.innerText = Math.floor(count);
          requestAnimationFrame(update);
        } else {
          counter.innerText = target;
        }
      };
      update();
      counterObserver.unobserve(counter);
    });
  }, {threshold: 0.6});
  counters.forEach(counter => counterObserver.observe(counter));

  /* ================================
     SKELETON INTERACTION + EYE ANIMATION
  ================================= */
  const skeleton = document.getElementById("skeleton");
  const speech = document.getElementById("speech");
  const leftEye = skeleton.querySelector(".eye.left");
  const rightEye = skeleton.querySelector(".eye.right");

  function blinkEyes() {
    [leftEye, rightEye].forEach(eye => {
      eye.style.transform += " scaleY(0.1)";
    });
    setTimeout(() => {
      [leftEye, rightEye].forEach(eye => {
        eye.style.transform = eye.style.transform.replace(" scaleY(0.1)", "");
      });
    }, 150);
    setTimeout(blinkEyes, 2000 + Math.random() * 4000);
  }
  blinkEyes();

  if(skeleton && speech){
    skeleton.addEventListener("mouseenter", ()=>{
      skeleton.classList.add("wave");
      speech.style.opacity = "1";
      [leftEye, rightEye].forEach(eye => eye.style.boxShadow = "0 0 8px 3px rgba(255,255,255,0.8)");
    });
    skeleton.addEventListener("mouseleave", ()=>{
      skeleton.classList.remove("wave");
      speech.style.opacity = "0";
      [leftEye, rightEye].forEach(eye => eye.style.boxShadow = "none");
    });
  }

  document.addEventListener("mousemove", e => {
    if(leftEye && rightEye){
      const skeletonRect = skeleton.getBoundingClientRect();
      const centerX = skeletonRect.left + skeletonRect.width / 2;
      const centerY = skeletonRect.top + skeletonRect.height / 4;
      const maxOffset = 5;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const offsetX = Math.cos(angle) * maxOffset;
      const offsetY = Math.sin(angle) * maxOffset;
      leftEye.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      rightEye.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  });

  /* ================================
     SERVICE SPARKLES
  ================================= */
  document.querySelectorAll(".service-card").forEach(card => {
    const sparkles = card.querySelectorAll(".sparkles div");
    sparkles.forEach(s => {
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.setProperty("--x", Math.random() * 20 + "px");
      s.style.setProperty("--y", Math.random() * 20 + "px");
      s.style.animationDelay = Math.random() * 2 + "s";
    });
  });

  /* ================================
     MOUSE GLOW
  ================================= */
  const glow = document.getElementById("mouse-glow");
  document.addEventListener("mousemove", e => {
    glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
  });

  /* ================================
     LOADER HIDE
  ================================= */
  const loader = document.getElementById("loader");
  window.addEventListener("load", ()=>{
    if(loader){
      loader.style.opacity = "0";
      setTimeout(()=>loader.style.display="none", 500);
    }
  });

  /* ================================
     PORTFOLIO CAROUSEL - STATIC JSON FETCH
  ================================ */
  const track = document.querySelector(".carousel-track");
  if (track) {
    track.innerHTML = "";

    // Fetch the JSON file from a fixed path
    fetch("/img/portfolio/images.json")
      .then(res => {
        if (!res.ok) throw new Error("Portfolio JSON not found");
        return res.json();
      })
      .then(data => {
        const images = data.images; // ["overlay1.jpg","overlay2.jpg","overlay3.jpg"]

        // Duplicate the array for infinite scroll
        images.concat(images).forEach(file => {
          const img = document.createElement("img");
          img.src = "/img/portfolio/" + file;  // Fixed path
          img.alt = file;
          img.style.width = "300px";           // Optional: set size
          img.style.marginRight = "20px";      // Optional spacing
          track.appendChild(img);
        });

        // Infinite horizontal scroll
        let x = 0;
        const scrollSpeed = 0.5;
        function animateCarousel() {
          x -= scrollSpeed;
          if (Math.abs(x) >= track.scrollWidth / 2) x = 0;
          track.style.transform = `translateX(${x}px)`;
          requestAnimationFrame(animateCarousel);
        }
        animateCarousel();
      })
      .catch(err => console.error("Error loading portfolio JSON:", err));
  }

  /* ================================
     CONTACT FORM → SERVERLESS FUNCTION
  ================================= */
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");
  const formError = document.getElementById("form-error");

  if(contactForm){
    contactForm.addEventListener("submit", async e => {
      e.preventDefault();

      const name = contactForm.name.value;
      const email = contactForm.email.value;
      const message = contactForm.message.value;

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message })
        });

        const data = await res.json();

        if(data.success){
          formSuccess.style.display = "block";
          formError.style.display = "none";
          contactForm.reset();
          setTimeout(()=>formSuccess.style.display="none", 4000);
        } else {
          formError.style.display = "block";
          formSuccess.style.display = "none";
        }
      } catch(err){
        console.error(err);
        formError.style.display = "block";
        formSuccess.style.display = "none";
      }
    });
  }
  /* ================================
     TOUCH INTERACTIONS FOR MOBILE
  ================================ */
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', e => {
    isDragging = true;
    startX = e.touches[0].clientX;
  });

  track.addEventListener('touchmove', e => {
    if(!isDragging) return;
    currentX = e.touches[0].clientX;
    let diff = currentX - startX;
    track.style.transform = `translateX(${x + diff}px)`;
  });

  track.addEventListener('touchend', e => {
    x += currentX - startX;
    isDragging = false;
  });

  /* ================================
     SKELETON MOBILE TOUCH
  ================================ */
  document.addEventListener("touchmove", e => {
    const touch = e.touches[0];
    const skeletonRect = skeleton.getBoundingClientRect();
    const centerX = skeletonRect.left + skeletonRect.width / 2;
    const centerY = skeletonRect.top + skeletonRect.height / 4;
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const maxOffset = 5;
    const angle = Math.atan2(dy, dx);
    const offsetX = Math.cos(angle) * maxOffset;
    const offsetY = Math.sin(angle) * maxOffset;
    leftEye.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    rightEye.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });

  skeleton.addEventListener("touchstart", ()=>{
    skeleton.classList.add("wave");
    speech.style.opacity = "1";
    setTimeout(()=>{
      skeleton.classList.remove("wave");
      speech.style.opacity = "0";
    }, 2000);
  });

});
