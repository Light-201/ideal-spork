console.log('Started');
document.getElementById('Savebtn').addEventListener("click", function(){
    const text = document.getElementById('ntpinput').value;
    const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "Note.txt"
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href)
    text = ""
});

const button = document.getElementById("Search");
const search = document.getElementById("dfinput");
const output = document.getElementById("miniweb");

async function startSearch() {
    const query = search.value.trim().toLowerCase();
    if (query === "") {
        return;
    }
    output.textContent = "Searching...";
    search.value = ""
    try {
        const response = await fetch(
            `https://freedictionaryapi.com/api/v1/entries/en/${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("Word not found!");
        }

        const data = await response.json();
        output.replaceChildren();

        // Word title
        const title = document.createElement("h2");
        const a = document.createElement("a");
        a.href = `https://www.wordreference.com/engr/${query}`;
        title.textContent = data.word.charAt(0).toUpperCase() + data.word.slice(1);
        output.appendChild(a);
        a.target = "_blank"
        a.appendChild(title);

        const hr = document.createElement("hr");
        output.appendChild(hr);

        // Entries
        data.entries.forEach(entry => {
            const type = document.createElement("h3");
            type.textContent = entry.partOfSpeech.charAt(0).toUpperCase() + entry.partOfSpeech.slice(1);
            output.appendChild(type);

            entry.senses.forEach((item, index) => {
                const definition = document.createElement("p");
                const bold = document.createElement("b");

                bold.textContent = `${index + 1}. ${item.definition}`;

                output.appendChild(definition);
                definition.appendChild(bold);

                // Examples
                if (item.examples) {
                    item.examples.forEach(exampleText => {
                        const example = document.createElement("p");
                        example.textContent = `Example: ${exampleText}`;
                        example.style.marginLeft = "30px";
                        output.appendChild(example);
                    });
                }
            });
        });
    } catch (error) {
        output.textContent = error.message;
    }
}

button.addEventListener("click", startSearch);
search.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        startSearch();
    }
});

const time = document.getElementById("Time");
const topbar = document.getElementById("Topbar");

function updateClock() {
    const now = new Date();
    time.textContent = now.toLocaleTimeString("en-GB");
}

updateClock();
setInterval(updateClock, 1000);

function updatetext() {
    const [hours, minutes, seconds] = time.textContent.split(":").map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const b = document.createElement('b');
    topbar.appendChild(b)

    if (totalSeconds >= 0 && totalSeconds <= 7*3600) {
        b.textContent = "Its getting late, Light!";
    }else if (totalSeconds > 7*3600 && totalSeconds <= 12*3600) {
        b.textContent = "Good Morning, Light!";
    }else if (totalSeconds > 12*3600 && totalSeconds <= 19*3600) {
        b.textContent = "Good Afternoon, Light!";
    }else if (totalSeconds > 19*3600 && totalSeconds < 24*3600) {
        b.textContent = "Good Evening, Light!";
    }
}

updatetext();
setInterval(updatetext, 60*60*1000);

async function doquote() { 
    const quote = document.getElementById("Quote");
    const author = document.getElementById("author");
    const date = document.getElementById("date");
    const i = document.createElement("i");
    author.appendChild(i);

    try{
        const response = await fetch('/api/quote');
        const data = await response.json();


        quote.textContent = `“${data.quote}”`;
        i.textContent = `—${data.author}`;
        date.textContent = `-${data.date}`;
    }catch (error) {
        quote.textContent = "BONNIE BLUE COULDNT FIND TODAYS QUOTE EVERYONE PANIC!!!";
        console.error("GASP:", error);
    }
}
doquote();


(async function() {
    const ul = document.getElementById('busnav');
    const li = ul.querySelectorAll("li");
    const msg = await fetch('./santorini_ktel_selected_routes.json');
    const routedata = await msg.json();
    const weekdays = document.getElementById("weekdays");
    const sundays = document.getElementById("sundays");
    const saturdays = document.getElementById("Saturdays");
    const footer = document.getElementById('lastupd');
    const tables = {
        weekday: weekdays,
        sunday: sundays,
        saturday: saturdays
    };
    function createTimes(container, times) {
        container.querySelectorAll('p:not(:first-child)').forEach(p => p.remove());

        for (const departure of times) {
            const p = document.createElement('p');

            p.textContent = typeof departure === "object"
                ? `${departure.time} (${departure.note})`
                : departure;

            container.appendChild(p);
        }
    }

    for (const item of li) {
        item.addEventListener("click", function() {
            const route = item.textContent.trim().toLowerCase();
            const routes = routedata.routes[route];
            if (!routes) return;
            // Update destination names
            document.querySelectorAll('.from').forEach(from => {
                from.textContent = `From ${route}`;
            });
            footer.textContent = "Last Updated: " + routedata.last_updated;
            // Update all three schedules
            for (const [day, table] of Object.entries(tables)) {
                const fira = table.querySelector('.fira');
                const location = table.querySelector('.location');
                const schedule = routes[day];
                createTimes(fira, schedule.from_fira);
                createTimes(location, schedule[`from_${route}`]);
            }
        });
    }
})();

