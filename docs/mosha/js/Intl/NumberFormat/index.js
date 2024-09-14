//
const locale = "ja-JP";
const opts1 = {
  style: 'currency',
  currency: 'JPY'
}

const num1 = 123456.789;
const jpYen = new Intl.NumberFormat(locale, opts1);
const yen = jpYen.format(num1);
document.querySelector('#yen').textContent = yen;

//
const opts2 = {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 1,
}
const num2 = 123456.789;
const jpYen2 = new Intl.NumberFormat(locale, opts2);
const yen2 = jpYen2.format(num2);
document.querySelector('#yen2').textContent = yen2;

//
const opts3 = {
  style: 'percent',
  minimumFractionDigits: 2,
  roundingIncrement: 5,
}
const num3 = 0.428267;
const jpPercent1 = new Intl.NumberFormat(locale, opts3);
const percent1 = jpPercent1.format(num3);
document.querySelector('#percent1').textContent = percent1;

//
const opts4 = {
  style: 'percent',
  minimumFractionDigits: 2,
  trailingZeroDisplay: 'stripIfInteger',
}
const num4 = 0.42;
const jpPercent2 = new Intl.NumberFormat(locale, opts4);
const percent2 = jpPercent2.format(num4);
document.querySelector('#percent2').textContent = percent2;

//
const opts5 = {
  style: 'percent',
  minimumFractionDigits: 2,
  trailingZeroDisplay: 'auto',
}
const num5 = 0.42;
const jpPercent3 = new Intl.NumberFormat(locale, opts5);
const percent3 = jpPercent3.format(num5);
document.querySelector('#percent3').textContent = percent3;
