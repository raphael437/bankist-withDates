'use strict';

const account1 = {
  owner: 'Raphael Nady',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Lio Messi',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
//functions
const formatMovmentdate = function (date, locale) {
  const calcdaypassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daypassed = calcdaypassed(new Date(), date);
  console.log(daypassed);
  if (daypassed === 0) return 'today';
  if (daypassed === 1) return 'yesteday';
  if (daypassed <= 7) return `${daypassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
const displayMovments = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const combinedmovsdates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));
  if (sort) combinedmovsdates.sort((a, b) => a.movement - b.movement);
  //  const movs = sort ? movments.slice().sort((a, b) => a - b) : movment;
  combinedmovsdates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(movementDate);
    const dispalydate = formatMovmentdate(date, acc.locale);
    const formatedmov = formatCur(movement, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(incomes, acc.locale, acc.currency);
};
const displaySummury = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}$`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

const updateUi = function (acc) {
  //display movments
  displayMovments(acc.movements);
  //dispaly balance
  displayBalance(acc);
  //display summury
  displaySummury(acc);
};
const startlogouttimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  // Set time to 5 minutes
  let time = 120;
  //call it every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
//////////////////////////////////////////////////////////////
//event handelers
let currentacount;
//login
btnLogin.addEventListener('click', function (e) {
  //to prevent from submtting
  e.preventDefault();
  currentacount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentacount);
  //displau ui and message
  if (currentacount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `WELCOME BACK, ${
      currentacount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    //timer
    if (timer) clearInterval(timer);
    timer = startlogouttimer();
    //clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //update ui
    updateUi(currentacount);
  }
});
//transfare
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputLoanAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    reciveAcc &&
    currentacount.balance >= amount &&
    reciveAcc?.username !== currentacount.username
  ) {
    //doing the transfare
    currentacount.movements.push(-amount);
    reciveAcc.movements.push(amount);
    currentacount.movementsDates.push(new Date().toISOString());
    reciveAcc.movementsDates.push(new Date().toISOString());
    updateUi(currentacount);
    clearInterval(timer);
    timer = startlogouttimer();
  }
});
//loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentacount.movements.some(mov > mov >= amount * 0.1)) {
    setTimeout(function () {
      currentacount.movements.push(amount);
      currentacount.movementsDates.push(new Date().toISOString());
      updateUi(currentacount);
      clearInterval(timer);
      timer = startlogouttimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});
//close
btnClose.addEventListener('click', function () {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentacount.username &&
    Number(inputClosePin.value) === currentacount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentacount.username
    );
    console.log(index);
    //delete account
    accounts.splice(index, 1);
    //hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovments(currentacount, !sorted);
  sorted = !sorted;
});
