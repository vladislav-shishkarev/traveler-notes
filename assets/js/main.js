// Без JavaScript ссылки меню остаются видны. Скрипт включает компактный режим.
document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');

function closeMenu() {
  navigation.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  navigation.classList.toggle('is-open');
});

navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});

// Удержание пальца внутри ролика не должно открывать меню картинки.
const animationClip = document.querySelector('.animation-demo .clip');
if (animationClip) {
  animationClip.addEventListener('contextmenu', event => {
    event.preventDefault();
  });
}
