const supported = Intl.Segmenter.supportedLocalesOf(["ja-JP"]);
if (0 < supported.length) {
  console.debug("Support: ", supported);

  const word = document.querySelector("#word");
  const jaSegmenter = new Intl.Segmenter("ja-JP", { granularity: "word" });

  const options = jaSegmenter.resolvedOptions();
  console.debug("locale: ", options.locale);
  console.debug("granularity: ",options.granularity);


  const segments = jaSegmenter.segment(word.textContent);

  const words = Array.from(segments)
    .filter((item) => item.isWordLike)
    .map((item) => item.segment);

  console.log(words);
}
