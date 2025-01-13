const styleSheet = new CSSStyleSheet();
// 0番目の位置にスタイル追加
styleSheet.insertRule("body { background-color: blue; }", 0);
styleSheet.insertRule("h1 { color: red; }", 1);
// 1番目のスタイルを削除
styleSheet.deleteRule(1);
// スタイルを非同期に変更
styleSheet.replace("body { background-color: #1a6ccc; } h1 { color: #fff; }");
// スタイルを同期的に変更
// styleSheet.replaceSync("body { background-color: #1a6ccc; } h1 { color: #fff; }");

//
const styleSheetDark = new CSSStyleSheet({
  media: "(prefers-color-scheme: dark)",
});
styleSheetDark.insertRule("body { background-color: #434343; }", 0);


document.adoptedStyleSheets.push(styleSheet);
document.adoptedStyleSheets.push(styleSheetDark);

const ruleList = styleSheet.cssRules;
for (const rule of ruleList) {
  // console.debug(rule);
  console.debug(rule.cssText);
}

const darkRuleList = styleSheetDark.cssRules;
for (const rule of darkRuleList) {
  // console.debug(rule);
  console.debug(rule.cssText);
}
