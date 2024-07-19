const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log(form.querySelector('input[name="field1"]').value);
    console.log(form.querySelector('input[name="field2"]').value);

    const formData = new FormData(form);
    // formdata は formdata イベントで変更される。
    console.log(formData.get('field1'));
    console.log(formData.get('field2'));
})

// フォームのデータを表す項目リストが構築された後に発行される
// フォームが送信されたときに発行されるが、
// FormData() コンストラクターが呼び出されたときにも発行される。
form.addEventListener('formdata', (event) => {
    // console.debug(event.type, event);
    const formData = event.formData;
    formData.set('field1', formData.get('field1').toLowerCase());
    formData.set('field2', formData.get('field2').toLowerCase());
})