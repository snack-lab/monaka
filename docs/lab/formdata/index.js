{
  const form = document.getElementById('frm');
  const formData = new FormData(form);

  for(var pair of formData.entries()) {
    console.log('entries', pair[0]+ ', '+ pair[1]);
  }

  for (var key of formData.keys()) {
    console.log('key' ,key);
  }
}

{
  // append
  // 既存の値のセットの最後に新しい値を追加します
  const formData = new FormData();
  formData.append('username', 'Chris');
  formData.append('username', 'Bob');
  console.log(formData.getAll('username'));

  const formData2 = new FormData();
  formData2.append('userpic[]', new Blob, 'chris1.jpg');
  formData2.append('userpic[]', new Blob, 'chris2.jpg');
  console.log(formData2.getAll('userpic'));
}

{
  const formData = new FormData();
  // set
  // すべての既存の値を新しい値で上書きする
  formData.set('username', 'Chris');
  formData.set('username2', 'Chris2');

  console.log([...formData]);

  if (formData.has('username2')) {
    formData.delete('username2');
  }

  console.log(Object.fromEntries(formData));
}

{
  const formData = new FormData();
  formData.append('foo', 'bar');
  formData.append('baz', 'a');
  formData.append('baz', 'b');

  const data = Object.fromEntries(
    [...new Set(formData.keys())]
      .map((key) => [key, formData.getAll(key)]),
  );

  console.log(data);

  // select multiple name="test[]"
  const data = Object.fromEntries(
    [...new Set(formData.keys())].map((key) =>
      key.endsWith('[]')
        ?
          [key.slice(0, -2), formData.getAll(key)]
        :
          [key, formData.get(key)],
    ),
  );
}