if ('showOpenFilePicker' in self) {

  const openButton = document.getElementById('open-file');
  openButton.addEventListener('click', async () => {
    // ローカル ファイル システムからファイルを読み取る
    [fileHandle] = await window.showOpenFilePicker();
    console.log('File handle:', fileHandle);

    const file = await fileHandle.getFile();
    // slice, stream, text, arrayBuffer
    const contents = await file.text();
    console.log('File contents:', contents);
  });

  // 保存されているファイルまたはディレクトリのハンドルと権限
  async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }

    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }

    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    return false;
  }

  // ディスクに変更を保存する
  async function writeFile(fileHandle, contents) {
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
  }

  // fetchからblobをファイルに保存する
  async function writeURLToFile(fileHandle, url) {
    const writable = await fileHandle.createWritable();
    const response = await fetch(url);
    await response.body.pipeTo(writable);
  }

  // 新しいファイルを作成する
  async function getNewFileHandle() {
    const options = {
      id: 'openText', // id
      suggestedName: 'Untitled Text.txt', // 提案するファイル名
      startIn: 'documents' , // 開始するディレクトリ
      types: [
        {
          description: 'Text Files',
          accept: {
            'text/plain': ['.txt'],
            },
          },
        ],
      };
      const handle = await window.showSaveFilePicker(options);
      return handle;
  }

  // ディレクトリを開いて、内容を列挙
  async function showOpenDirectoryPicker() {
    const dirHandle = await window.showDirectoryPicker();
    const promises = [];
    for await (const entry of dirHandle.values()) {
      if (entry.kind !== 'file') {
        continue;
      }
      promises.push(entry.getFile().then((file) => `${file.name} (${file.size})`));
    }
    console.log(await Promise.all(promises));

    // ディレクトリ内のファイルやフォルダの作成またはアクセス
    // const newDirectoryHandle = await dirHandle.getDirectoryHandle('Test Documents', {
    //   create: true,
    // });
    // const newFileHandle = await dirHandle.getFileHandle('My Notes.txt', { create: true });
    // ディレクトリ内のアイテムのパスの解決
    // const path = await dirHandle.resolve(newFileHandle);

    // ディレクトリ内のファイルとフォルダ
    // await dirHandle.removeEntry('My Notes.txt');
    // await dirHandle.removeEntry('Test Documents', { recursive: true });

    // ファイルやフォルダを直接削除する
    // await fileHandle.remove();
    // await dirHandle.remove();

    // ファイルやフォルダの名前の変更と移動
    // await file.move('new_name');
    // await file.move(directory);
    // await file.move(directory, 'newer_name');

  }

  // プライベートファイルシステムにアクセス
  // `Worker`:
  // const root = await navigator.storage.getDirectory();
  // const fileHandle = await root.getFileHandle('test', { create: true });
  // const accessHandle = await fileHandle.createSyncAccessHandle();
  // accessHandle.read(/* ... */);
  // accessHandle.write(/* ... */);

  // console.log(accessHandle.getSize());
  // accessHandle.truncate(123);
  // accessHandle.flush();
  // accessHandle.close();
}
