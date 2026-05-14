const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const pageShell = document.querySelector('.page-shell');

if (pageShell) {
  const blobLayer = document.createElement('div');
  blobLayer.className = 'background-blobs';
  pageShell.prepend(blobLayer);

  const blobClasses = ['blob-a', 'blob-b', 'blob-c', 'blob-d', 'blob-e', 'blob-f'];
  let blobs = [];
  const storageKey = window.innerWidth < 720 ? 'portfolio-blobs-mobile' : 'portfolio-blobs-desktop';

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const createBlobSet = () => {
    blobLayer.innerHTML = '';
    const blobCount = window.innerWidth < 720 ? 8 : 12;

    let savedConfigs = [];

    try {
      savedConfigs = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    } catch {
      savedConfigs = [];
    }

    if (!Array.isArray(savedConfigs) || savedConfigs.length !== blobCount) {
      savedConfigs = Array.from({ length: blobCount }, (_, index) => {
        const size = randomInRange(160, 360);
        return {
          className: blobClasses[index % blobClasses.length],
          xRatio: Math.random(),
          yRatio: Math.random(),
          size,
          vx: (Math.random() > 0.5 ? 1 : -1) * randomInRange(0.08, 0.24),
          vy: (Math.random() > 0.5 ? 1 : -1) * randomInRange(0.08, 0.24),
        };
      });

      window.localStorage.setItem(storageKey, JSON.stringify(savedConfigs));
    }

    blobs = savedConfigs.map((config, index) => {
      const size = config.size;
      const x = config.xRatio * Math.max(20, window.innerWidth - size);
      const y = config.yRatio * Math.max(20, window.innerHeight - size);
      const className = config.className || blobClasses[index % blobClasses.length];

      const element = document.createElement('span');
      element.className = `floating-blob ${className}`;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      blobLayer.appendChild(element);

      return {
        className,
        x,
        y,
        vx: config.vx,
        vy: config.vy,
        size,
        element,
      };
    });
  };

  const clampBlobPosition = (blob) => {
    const maxX = Math.max(0, window.innerWidth - blob.size);
    const maxY = Math.max(0, window.innerHeight - blob.size);

    blob.x = Math.min(Math.max(blob.x, 0), maxX);
    blob.y = Math.min(Math.max(blob.y, 0), maxY);
  };

  const animateBlobs = () => {
    blobs.forEach((blob) => {
      blob.x += blob.vx;
      blob.y += blob.vy;

      const maxX = window.innerWidth - blob.size;
      const maxY = window.innerHeight - blob.size;

      if (blob.x <= 0 || blob.x >= maxX) {
        blob.vx *= -1;
        blob.x = Math.min(Math.max(blob.x, 0), maxX);
      }

      if (blob.y <= 0 || blob.y >= maxY) {
        blob.vy *= -1;
        blob.y = Math.min(Math.max(blob.y, 0), maxY);
      }

      blob.element.style.transform = `translate3d(${blob.x}px, ${blob.y}px, 0)`;
    });

    window.requestAnimationFrame(animateBlobs);
  };

  window.addEventListener('resize', () => {
    createBlobSet();
  });

  createBlobSet();
  animateBlobs();
}
