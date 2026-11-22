console.log('Started');

function getCells(day, period) {
    if (period && day) {
        return document.querySelector(
            `.cell[data-day="${day}"][data-period="${period}"]`
        );
    }else if (!!period) {
        return document.querySelectorAll(
            `.cell[data-day="${day}"]`
        );
    }else if (!!day) {
        return document.querySelector(
            `.cell[data-period="${period}"]`
        );
    }
}

function makecell(subj, colors, hasnote, parent, notetxt) {
    const div = document.createElement("div");
    div.className = "sbj";
    const title = document.createElement("p");
    title.className = "title";
    div.appendChild(title);
    parent.appendChild(div);
    if (hasnote) {
        const hr = document.createElement("hr");
        const note = document.createElement("p");
        note.className = "note";
        note.textContent = notetxt;
        note.style.color = colors[2];
        div.appendChild(hr);
        div.appendChild(note);
    };
    title.textContent = subj;
    title.style.color = colors[1];
    div.style.backgroundColor  = colors[0];
}
var programe = null;
(async function(){
    const response = await fetch("./programe.json");
    programe = await response.json();

    const days = programe.Days;
    const timetable = document.getElementsByClassName("timetable")[0];

    for (const day in days) {
        const classes = days[day];;
        for (let i = 0; i < 6; i++) {
            const subj = classes[i] ?? "N/A";
            const color = programe.Color_code[subj] ?? programe.Color_code["N/A"];

            const colors = [
                color.color,
                ...color.Text_colors
            ];

            const parent = getCells(day, i+1)

            if (!parent) continue;

            makecell(subj, colors, false, parent, "");
        }
    }
})();

