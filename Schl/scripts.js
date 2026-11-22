console.log('Started');

function getCell(day, period) {
    return document.querySelector(
        `.cell[data-day="${day}"][data-period="${period}"]`
    );
}