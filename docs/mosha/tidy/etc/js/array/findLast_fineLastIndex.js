// findLast
// 指定されたテスト関数を満たす配列の最後の要素を返す,
// 満たす要素がない場合 undefined
// findLast((element, index, array) => {})
// findLast(callbackFn, thisArg)
const arr1 = [5 ,12, 50, 130, 44];
const found = arr1.findLast((element) => element > 45);
console.debug(found);

const inventory = [
    { name: "apples", quantity: 2},
    { name: "bananas", quantity: 0},
    { name: "fish", quantity: 1},
    { name: "cherries", quantity: 5},
];

const result = inventory.findLast(({quantity}) => quantity < 2);
console.debug(result);

// findLastIndex
// 指定されたテスト関数を満たす配列の最後の要素の添字を返す
// 満たす要素がなかった場合、-1
// findLastIndex((element, index, array) => {})
// findLastIndex(callbackFn, thisArg)
const arr2 = [5, 12, 50, 130, 44];
const isLargeNumber = (element) => element > 45;
const foundIndex = arr2.findLastIndex(isLargeNumber);
console.debug(foundIndex);

const fruits = ["apple", "banana", "cantaloupe", "blueberries", "grapefruit"];
const index = fruits.findLastIndex((fruit) => fruit === "blueberries");
console.debug(index);
