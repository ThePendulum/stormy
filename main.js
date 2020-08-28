console.log('hello world!');

async function init() {
    const res = await fetch('./data.json');

    if (res.ok) {
        const data = await res.json();

        document.body.innerText = data.current.insideTemp;

        console.log(data);
    }
}

init();
