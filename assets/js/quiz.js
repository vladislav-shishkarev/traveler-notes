const questions = [
  {
    text: 'А когда с человеком может произойти дрожемент?',
    answers: ['Когда он влюбляется', 'Когда он идет шопиться', 'Когда он слышит смешную шутку', 'Когда он боится, пугается'],
    correct: 3,
    explanation: 'Лексема «дрожемент» означает состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят».'
  },
  {
    text: 'Говорят, Антон заовнил всех. Это еще как понимать?',
    answers: ['Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?', 'Антон очень надоедливый и въедливый человек, всех задолбал', 'Молодец, Антон, всех победил!', 'Нет ничего плохого в том, что Антон тщательно выбирает себе друзей'],
    correct: 2,
    explanation: 'Термин «заовнить» заимствован из английского языка: он происходит от слова own и переводится как «победить», «завладеть», «получить».'
  },
  {
    text: 'А фразу «заскамить мамонта» как понимать?',
    answers: ['Разозлить кого-то из родителей', 'Увлекаться археологией', 'Развести недотепу на деньги', 'Оскорбить пожилого человека'],
    correct: 2,
    explanation: 'Заскамить мамонта — значит обмануть или развести на деньги. Мошенники часто выбирают в жертвы пожилых людей — отсюда сравнение с мамонтами.'
  },
  {
    text: 'Кто такие бефефе?',
    answers: ['Вши?', 'Милые котики, такие милые, что бефефе', 'Лучшие друзья', 'Люди, которые не держат слово'],
    correct: 2,
    explanation: 'Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever.'
  },
  {
    text: 'Что из перечисленного можно назвать крашем, если ты чиллишь в компании и вдруг залипаешь на кого-то?',
    answers: ['Человек, который тебе очень нравится и вызывает симпатию', 'Просто знакомый, к которому ты не испытываешь симпатии', 'Твоя сильно накрашенная подруга, которая переоценила свой макияж', 'Трэш в более мягкой интерпретации'],
    correct: 0,
    explanation: '«Краш» — это объект симпатии; «чиллить» — расслабляться, отдыхать; «залипать» — засматриваться или задумываться.'
  }
];

const quiz = document.querySelector('#quiz');
const status = document.querySelector('#status');
const summary = document.querySelector('#summary');
const progress = document.querySelector('#progress');
let items = [];
let questionOrder = [];
let active = null;
let answered = 0;
let score = 0;
let finished = false;

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function updateProgress() {
  progress.value = answered;
  progress.max = questions.length;
  document.querySelector('#progress-text').textContent = `Отвечено: ${answered} из ${questions.length}`;
}

function start() {
  quiz.replaceChildren();
  summary.hidden = true;
  active = null;
  answered = 0;
  score = 0;
  finished = false;
  items = [];
  questionOrder = shuffle(questions);
  status.textContent = 'Нажми на вопрос, чтобы увидеть варианты ответа.';
  addQuestion();
  updateProgress();
}

function addQuestion() {
  const index = items.length;
  const data = questionOrder[index];
  const wrapper = element('article', 'question-block');
  const button = element('button', 'question');
  button.type = 'button';
  const marker = element('span', 'marker');
  button.append(element('span', 'number', String(index + 1).padStart(2, '0')), element('span', 'question-text', data.text), marker);
  const panel = element('div', 'panel');
  panel.id = `panel-${index}`;
  wrapper.append(button, panel);
  quiz.append(wrapper);
  const item = { data, button, panel, marker, done: false };
  button.addEventListener('click', () => {
    if (finished) {
      review(item);
    } else {
      openQuestion(item);
    }
  });
  items.push(item);
  return item;
}

function openQuestion(item) {
  if (active || item.done) return;
  active = item;
  items.forEach(other => { other.button.disabled = true; });
  item.button.classList.add('current');
  status.textContent = 'Выбери один ответ. Следующий вопрос станет доступен после анимации.';
  const answers = element('div', 'answers');
  const options = shuffle(item.data.answers.map((text, index) => ({ text, correct: index === item.data.correct })));
  options.forEach(option => {
    const button = element('button', 'answer', option.text);
    button.type = 'button';
    button.addEventListener('click', () => chooseAnswer(item, answers, button, option.correct));
    answers.append(button);
  });
  item.panel.append(answers);
  answers.firstElementChild.focus({ preventScroll: true });
}

function chooseAnswer(item, answers, chosen, correct) {
  if (item.done) return;
  item.done = true;
  const buttons = [...answers.children];
  buttons.forEach(button => { button.disabled = true; });
  if (correct) {
    chosen.classList.add('correct');
    score++;
    chosen.append(element('span', 'explanation', item.data.explanation));
    status.textContent = 'Верно! Прочитай объяснение.';
  } else {
    chosen.classList.add('wrong');
    status.textContent = 'Неверно. Правильный ответ можно будет посмотреть после завершения теста.';
  }
  setTimeout(() => {
    if (correct) {
      item.marker.textContent = '✓';
      item.marker.classList.add('correct-marker');
    } else {
      item.marker.textContent = '✕';
      item.marker.classList.add('wrong-marker');
    }
    let ordered = buttons;
    if (correct) {
      ordered = buttons.filter(button => button !== chosen);
      ordered.push(chosen);
    }
    ordered.forEach((button, index) => {
      button.style.animationDelay = `${index * 220}ms`;
      button.classList.add('leaving');
    });
    setTimeout(() => completeQuestion(item), 550 + (ordered.length - 1) * 220 + 100);
  }, 2000);
}

function completeQuestion(item) {
  item.panel.replaceChildren();
  item.button.classList.remove('current');
  item.button.classList.add('answered');
  active = null;
  answered++;
  updateProgress();
  finished = answered === questions.length;
  items.forEach(other => { other.button.disabled = !finished; });
  if (finished) {
    summary.hidden = false;
    document.querySelector('#score').textContent = `Правильных ответов: ${score} из ${questions.length}.`;
    status.textContent = 'Тест завершён. Нажми на вопрос, чтобы увидеть правильный ответ и объяснение.';
    document.querySelector('#restart').focus({ preventScroll: true });
  } else {
    status.textContent = 'Появился следующий вопрос. Нажми на него, чтобы увидеть ответы.';
    const next = addQuestion();
    next.button.focus();
  }
}

function review(item) {
  const wasOpen = item.panel.children.length > 0;
  items.forEach(other => {
    other.panel.replaceChildren();
  });
  if (wasOpen) return;
  const block = element('div', 'review');
  block.append(element('p', '', `Правильный ответ: ${item.data.answers[item.data.correct]}`), element('p', '', item.data.explanation));
  item.panel.append(block);
}

document.querySelector('#restart').addEventListener('click', () => {
  start();
  items[0].button.focus({ preventScroll: true });
});
start();
