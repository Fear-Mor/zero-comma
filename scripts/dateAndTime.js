$(document).ready(function () {
    let formatIndex = 0; // 0 = Republican, 1 = regular, 2 = uptime.

    const $clock  = $("#clock");
    const launchDate = new Date(Date.UTC(2025, 7, 23, 21, 0));

    const republicanMonths = [
        "Vendémiaire", "Brumaire", "Frimaire",
        "Nivôse", "Pluviôse", "Ventôse",
        "Germinal", "Floréal", "Prairial",
        "Messidor", "Thermidor", "Fructidor"
    ];

    const sansculottideNames = [
        "La Fête de la Vertu",
        "La Fête du Génie",
        "La Fête du Travail",
        "La Fête de l'Opinion",
        "La Fête des Récompenses",
        "La Fête de la Révolution" // Only used in leap years
    ];

    const equinoxTable = {
        2024: new Date(2024, 8, 22),
        2025: new Date(2025, 8, 22),
        2026: new Date(2026, 8, 23),
        2027: new Date(2027, 8, 23),
        2028: new Date(2028, 8, 22),
        2029: new Date(2029, 8, 22),
        2030: new Date(2030, 8, 22),
        2031: new Date(2031, 8, 23),
        2032: new Date(2032, 8, 22),
        2033: new Date(2033, 8, 22),
        2034: new Date(2034, 8, 22),
        2035: new Date(2035, 8, 23),
        2036: new Date(2036, 8, 22),
        2037: new Date(2037, 8, 22),
        2038: new Date(2038, 8, 22),
        2039: new Date(2039, 8, 23),
        2040: new Date(2040, 8, 22),
        2041: new Date(2041, 8, 22),
        2042: new Date(2042, 8, 22),
        2043: new Date(2043, 8, 23),
        2044: new Date(2044, 8, 22)
    };

    function updateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const decimalDay = (totalSeconds / 86400).toFixed(3).substring(2);

        const republicanFormat = `${regularToRepublican(now)}, ${decimalDay.substring(0, 1)}:${decimalDay.substring(1)}`;
        const regularFormat = `${year}-${month}-${day}, ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        const uptimeFormat = liveTime(now);

        const formats = [republicanFormat, regularFormat, uptimeFormat];
        $clock.text(formats[formatIndex]);
    }

    function regularToRepublican(date) {
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const republicStart = new Date(1792, 8, 22);
        const dayDiff = Math.floor((localDate - republicStart) / (1000 * 60 * 60 * 24));
        const republicanYear = Math.floor(dayDiff / 365.2425) + 1;

        let equinox = equinoxTable[localDate.getFullYear()];
        if (localDate < equinox) {
            equinox = equinoxTable[localDate.getFullYear() - 1];
        }

        const daysSinceEquinox = Math.floor((localDate - equinox) / (1000 * 60 * 60 * 24));
        let monthIndex, dayInMonth;
        if (daysSinceEquinox >= 360) {
            const sansculottideIndex = daysSinceEquinox - 360;
            const dayName = sansculottideNames[sansculottideIndex];
            return `Year ${republicanYear}, ${dayName}`;
        } else {
            monthIndex = Math.floor(daysSinceEquinox / 30);
            dayInMonth = (daysSinceEquinox % 30) + 1;
            const monthName = republicanMonths[monthIndex];
            return `Year ${republicanYear}, ${monthName} ${dayInMonth}`;
        }
    }

    function liveTime(date) {
        // I was arsing around for so long trying to get this shit to work myself when I could've just been using Luxon.
        const launchDateLuxon = luxon.DateTime.fromJSDate(launchDate, { zone: 'utc' });
        const now = luxon.DateTime.fromJSDate(date);

        const diff = now.diff(launchDateLuxon, ["years", "months", "days", "hours", "minutes"]).toObject();

        let parts = [];

        if (diff.years > 0) parts.push(`${Math.floor(diff.years)}y`);
        if (diff.months > 0) parts.push(`${Math.floor(diff.months)}mo`);
        if (diff.days > 0) parts.push(`${Math.floor(diff.days)}d`);
        if (diff.hours > 0) parts.push(`${Math.floor(diff.hours)}h`);
        if (diff.minutes > 0) parts.push(`${Math.floor(diff.minutes)}m`);

        let display = "Live for ";
        if (parts.length === 1) {
            display += parts[0];
        } else {
            display += parts.slice(0, -1).join(", ");
            display += (parts.length > 2 ? "," : "") + " and " + parts[parts.length - 1];
        }

        return display;
    }

    $clock.on("click", function () {
        formatIndex = (formatIndex + 1) % 3;
        updateTime();
    });
    setInterval(updateTime, 2400); // 2.4 seconds is the greatest common divisor of decimal and regular minutes.
    updateTime();
});
