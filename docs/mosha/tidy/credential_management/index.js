// https://developer.mozilla.org/en-US/docs/Web/API/Credential_Management_API
// https://web.dev/security-credential-management/
// https://developer.chrome.com/blog/credential-management-updates/

if (navigator.credentials) {
    // サインアウト後に、再自動ログインを制御
    navigator.credentials.preventSilentAccess();
}

if (window.PasswordCredential || window.FederatedCredential) {

    const form = document.querySelector('form');
    form.onsubmit = async (event) => {
        event.preventDefault();

        const signInFormData = event.target;

        if (event.target.checkValidity()) {

            const formData = new FormData(signInFormData);
            const password = {
                id: formData.get('email'),
                password: formData.get('password')
            }

            try {
                // sync
                // const cred = new PasswordCredential({id: password.id,password: password.password,});

                // async
                const cred = await navigator.credentials.create({password});
                await navigator.credentials.store(cred);

                console.debug("saved password");
            } catch (error) {
                console.debug(error);
            }
        }
    }

    window.addEventListener('load', async () => {
        const c = await navigator.credentials.get({
            password: true,
            mediation: "optional"
        });

        if (c?.type === "password") {
            console.debug(c);
        }
    })
}