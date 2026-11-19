// AOS init
document.addEventListener('DOMContentLoaded', function(){
  if (window.AOS) {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 80 });
  }
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function(){
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobileNav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); });
    });
  }

  // Style select quick-book
  document.querySelectorAll('.style-book').forEach(function(btn){
    btn.addEventListener('click', function(e){
      var style = btn.getAttribute('data-style');
      var sel = document.getElementById('style');
      if (sel && style) { sel.value = style; }
    });
  });

  // 3D studio card tilt
  var card = document.getElementById('studioCard');
  if (card) {
    var rect, cx, cy;
    function updateRect(){ rect = card.getBoundingClientRect(); cx = rect.left + rect.width/2; cy = rect.top + rect.height/2; }
    updateRect();
    window.addEventListener('resize', updateRect);

    var tiltX = 0, tiltY = 0, targetX = 0, targetY = 0;
    function animate(){
      tiltX += (targetX - tiltX) * 0.12;
      tiltY += (targetY - tiltY) * 0.12;
      card.style.transform = 'rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
      requestAnimationFrame(animate);
    }
    animate();

    // desktop mousemove
    document.addEventListener('mousemove', function(e){
      if (!rect) updateRect();
      var dx = (e.clientX - cx) / (rect.width/2);
      var dy = (e.clientY - cy) / (rect.height/2);
      targetY = dx * 12;
      targetX = -dy * 12;
    });
    card.addEventListener('mouseleave', function(){ targetX = 0; targetY = 0; });

    // mobile touch drag
    var dragging = false, lastX = 0, lastY = 0;
    card.style.touchAction = 'pan-y';
    card.addEventListener('touchstart', function(e){
      if (e.touches.length === 1){ dragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; }
    }, {passive:true});
    card.addEventListener('touchmove', function(e){
      if (!dragging || e.touches.length !== 1) return;
      var dx = e.touches[0].clientX - lastX;
      var dy = e.touches[0].clientY - lastY;
      targetY = Math.max(-18, Math.min(18, targetY + dx * 0.25));
      targetX = Math.max(-18, Math.min(18, targetX - dy * 0.25));
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
    }, {passive:true});
    card.addEventListener('touchend', function(){ dragging = false; setTimeout(function(){ targetX=0; targetY=0; }, 600); });
  }
});

function handleBooking(e){
  e.preventDefault();
  var name = document.getElementById('name').value.trim();
  var phone = document.getElementById('phone').value.trim();
  var style = document.getElementById('style').value;
  var date = document.getElementById('date').value;
  var time = document.getElementById('time').value;
  var notes = document.getElementById('notes').value.trim();
  var msg = 'Hi Shavette, I would like to book an appointment.\n\nName: ' + name +
            '\nPhone: ' + phone +
            '\nStyle: ' + style +
            '\nPreferred date: ' + date +
            '\nTime window: ' + time +
            (notes ? '\nNotes: ' + notes : '');
  var sms = 'sms:+14692160596?body=' + encodeURIComponent(msg);
  var wa = 'https://wa.me/14692160596?text=' + encodeURIComponent(msg);
  // Open WhatsApp as primary instant booking; also offer SMS via alert fallback
  window.open(wa, '_blank');
  return false;
}

// Fallback for style card images that fail to load: swap to a warm champagne-silk + espresso monogrammed illustration card
function handleImgError(img){
  if (!img || img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = '1';
  img.onerror = null;
  var label = img.getAttribute('data-style-name') || img.alt || 'Style';
  var initials = label.split(/\s+/).filter(Boolean).map(function(w){ return w.charAt(0); }).slice(0,3).join('').toUpperCase();
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="750" viewBox="0 0 1000 750">' +
    '<rect width="1000" height="750" fill="#EFE6DA"/>' +
    '<rect x="60" y="60" width="880" height="630" rx="26" fill="none" stroke="#181210" stroke-opacity=".12" stroke-width="2"/>' +
    '<text x="500" y="360" font-family="Georgia, serif" font-size="150" fill="#181210" text-anchor="middle" font-weight="600">' + esc(initials) + '</text>' +
    '<text x="500" y="430" font-family="system-ui, sans-serif" font-size="26" fill="#181210" text-anchor="middle" opacity=".72">' + esc(label) + '</text>' +
    '<text x="500" y="620" font-family="system-ui, sans-serif" font-size="16" fill="#181210" text-anchor="middle" opacity=".45" letter-spacing="4">PRICELESS BRAIDS / EXPERIENCE</text>' +
  '</svg>';
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  img.style.objectFit = 'cover';
  img.style.objectPosition = 'center top';
}
