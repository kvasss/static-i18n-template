import { gsap } from "gsap";

export const Cookies = () => {

  const accept = document.querySelector('.cookies-accept');
  const decline = document.querySelector('.cookies-decline');
  const cookies = document.querySelector('.cookies');

  if (localStorage.getItem('cookies') !== 'true') {
    cookies.classList.remove('hidden');
  }
  accept && accept.addEventListener('click', () => {
    localStorage.setItem('cookies', 'true');
    // cookies.classList.add('hidden');
    gsap.to(cookies, {
      height: 0,
      opacity: 0,
      duration: 0.35
    })
  });
  decline && decline.addEventListener('click', () => {
    localStorage.setItem('cookies', 'false');
  });
}