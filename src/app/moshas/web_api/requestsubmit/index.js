const form = document.querySelector('form');
form.querySelector('#requestSubmitButton').onclick = actionRequestSubmit;
// form.querySelector("#submitButton").onclick = actionSubmit;

const actionSubmit = (event) => {
    console.debug(event.type, event);
    console.debug("submit");

    const form = event.target.closest("form");
    if (form.reportValidity()) {
        // 制約検証API呼出必要
        form.submit();
    }
}

const actionRequestSubmit = (event) => {
    console.debug(event.type, event);

    const form = event.target.closest("form");
    if (form.requestSubmit) {
        console.debug("requestSubmit");

        // 制約検証API呼出不要
        const rqSbBtn = event.target;
        if (rqSbBtn && rqSbBtn.type === "submit") {
            form.requestSubmit(rqSbBtn);
        } else {
            form.requestSubmit();
        }
    } else {
        actionSubmit();
    }
}
