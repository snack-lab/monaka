// URLSearchParams

{
  const searchParams = new URLSearchParams();
  // append
  // 指定されたキー/値のペアを新しい検索パラメーターとして追加
  // 同じキーが複数回追加された場合、各値がパラメーター文字列に複数回現れる
  searchParams.append('foo', 'bar');
  searchParams.append('hello', 'world');
  searchParams.append('hello', 'world2');

  for(var pair of searchParams.entries()) {
    console.log('entries', pair[0]+ ', '+ pair[1]);
  }

  searchParams.forEach((value, key) => {
    console.log('forEach', `${key}=${value}`);
  });

  for(var key of searchParams.keys()) {
    console.log('keys', key);
  }

  for(var value of searchParams.values()) {
    console.log('values', value);
  }

  console.log('get', searchParams.get('foo'));
  console.log('getAll', searchParams.getAll('hello'));

  // delete
  // 指定された検索パラメーターとそれに関連するすべての値を削除
  if (searchParams.has('foo')) {
    searchParams.delete('foo');
    console.log('delete', searchParams.toString())
  }

  // 指定された検索パラメーターに関連付けられた値を指定された値に設定する
  // 一致する値が複数ある場合、このメソッドは他の値を削除します
  searchParams.set('hello', 1234);
  console.log('set', searchParams.toString());
}

{
  const searchParams = new URLSearchParams('z=bar&y=world&x=baz');
  searchParams.sort();
  console.log('sort', searchParams.toString());
}

{
  const searchParams = new URLSearchParams([
    ['foo', 'bar'],
    ['hello', 'world'],
  ]);
  console.log('constructor(array)', Object.fromEntries(searchParams));
}

{
  const searchParams = new URLSearchParams({
    foo: 'bar',
    hello: 'world',
  });
  console.log('constructor(object)',[...searchParams]);
}

{
  const searchParams = new URLSearchParams([
    ['foo', 'bar'],
    ['foo', 'hello'],
  ]);
  console.log(searchParams.toString());
  console.log(Object.fromEntries(searchParams));
}

{
  const value = 'hello&world';
  const badEncoding = `text=${value}`;
  console.log([...new URLSearchParams(badEncoding)]);

  const correctEncoding = new URLSearchParams({ text: value });
  console.log(correctEncoding.toString());
}