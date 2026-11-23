console.log('Started');

const Header = document.getElementsByClassName("trans cont")[0];

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
(async function () {
    const response = await fetch("./programe.json");
    programe = await response.json();
    const days = programe.Days;
    const lastupd = document.createElement('p')
    Header.appendChild(lastupd)
    lastupd.textContent = "Last Updated: " + programe.last_updated
    for (const day in days) {
        const classes = days[day];
        for (let i = 0; i < 6; i++) {
            const sbj = classes[i] ?? "N/A";
            const subj = typeof sbj === "object"
                ? sbj.sbj
                : sbj;
            const note = typeof sbj === "object"
                ? sbj.note
                : "";
            const color = programe.Color_code[subj]
                ?? programe.Color_code["N/A"];
            const colors = [
                color.color,
                ...color.Text_colors
            ];
            const parent = getCells(day, i + 1);
            if (!parent) continue;
            makecell(subj, colors, !!note, parent, note);
        }
    }
    // Mobile
    const weekdays = Object.keys(programe.Days);
    let currentDay = 0;
    function showDay() {
        const day = weekdays[currentDay];
        const classes = programe.Days[day];
        document.getElementById("mobileDay").textContent = day;
        const container = document.getElementById("mobileClasses");
        container.innerHTML = "";
        classes.forEach((entry, index) => {
            const subj = typeof entry === "object" ? entry.sbj : entry;
            const note = typeof entry === "object" ? entry.note : "";
            const color = programe.Color_code[subj] ?? programe.Color_code["N/A"];
            const colors = [color.color, ...color.Text_colors];
            const period = document.createElement("div");
            period.className = "mobile-period";
            const number = document.createElement("span");
            number.textContent = index + 1;
            period.append(number);
            makecell(subj, colors, !!note, period, note);
            container.appendChild(period);
        });
    }
    document.getElementById("prevDay").addEventListener("click", () => {
        currentDay = (currentDay - 1 + weekdays.length) % weekdays.length;
        showDay();
    });
    document.getElementById("nextDay").addEventListener("click", () => {
        currentDay = (currentDay + 1) % weekdays.length;
        showDay();
    });
    showDay();
    const dropdown = document.getElementById("subjectSelect");

    for (const subj in programe.Color_code) {
        dropdown.add(new Option(subj, subj));
    }
})();

const plusicon = document.getElementById("plusicon");
const popup = document.querySelector(".popup");
const closePopup = document.getElementById("closePopup");

plusicon.addEventListener("click", () => {
    popup.style.display = 'flex';
});

closePopup.addEventListener("click", () => {
    popup.style.display = 'none';
});

const sbjcard = document.querySelector(".subject-card");
const confirmBtn = document.querySelector(".confirm");
const todolist = document.getElementsByClassName("todolist")[0];
confirmBtn.addEventListener("click", () => {
    const todoText = document.getElementById("maketodo").value;
    const selectedSubject = document.getElementById("subjectSelect").value;

    const clonecard = sbjcard.cloneNode(true);
    clonecard.style.display = "block";
    clonecard.querySelector(".subjectName").textContent = selectedSubject;
    clonecard.querySelector(".contenttext").value = todoText;
    clonecard.id = `todo-${selectedSubject}`;
    const cirle = clonecard.querySelector(".circle");
    cirle.style.background = programe.Color_code[selectedSubject].color;
    cirle.style.boxShadow = `0 0 10px ${programe.Color_code[selectedSubject].color}`;
    todolist.appendChild(clonecard);
    document.getElementById("maketodo").value = "";
    document.getElementById("subjectSelect").value = "";
    popup.style.display = 'none';
})
document.addEventListener("click", event => {
    if (event.target.closest(".delete")) {
        const card = event.target.closest(".subject-card");
        if (card) {
            card.remove();
        }
    }
});
var editingCard = null;
document.addEventListener("click", event => {
    if (event.target.closest(".editicon")) {
        const card = event.target.closest(".subject-card");

        editingCard = card;

        popup.style.display = "flex";
        confirmBtn.style.display = "none";
        document.querySelector(".edit").style.display = "block";

        document.getElementById("maketodo").value =
            card.querySelector(".contenttext").value;

        document.getElementById("subjectSelect").value =
            card.querySelector(".subjectName").textContent;
    }
});

document.querySelector(".edit").addEventListener("click", () => {
    if (!editingCard) return;

    const todoText = document.getElementById("maketodo").value;
    const selectedSubject = document.getElementById("subjectSelect").value;

    editingCard.querySelector(".contenttext").value = todoText;
    editingCard.querySelector(".subjectName").textContent = selectedSubject;

    const color = programe.Color_code[selectedSubject].color;
    const circle = editingCard.querySelector(".circle");

    circle.style.background = color;
    circle.style.boxShadow = `0 0 10px ${color}`;

    popup.style.display = "none";
    editingCard = null;
});