(() => {
  const form = document.querySelector("[data-sobriety-calculator]");
  if (!form) return;

  const language = document.documentElement.lang.toLowerCase().startsWith("es") ? "es" : "en";
  const locale = language === "es" ? "es-MX" : "en-US";
  const dayMs = 24 * 60 * 60 * 1000;
  const dateInput = form.querySelector("[name='start-date']");
  const pickerButton = form.querySelector("[data-date-picker]");
  const error = form.querySelector("[data-error]");
  const empty = document.querySelector("[data-result-empty]");
  const content = document.querySelector("[data-result-content]");
  const daysValue = document.querySelector("[data-total-days]");
  const daysLabel = document.querySelector("[data-day-label]");
  const breakdownValue = document.querySelector("[data-breakdown]");
  const sinceValue = document.querySelector("[data-since]");
  const nextLabel = document.querySelector("[data-next-label]");
  const nextDate = document.querySelector("[data-next-date]");

  const words = {
    en: {
      required: "Choose a start date first.",
      invalid: "That date could not be read. Try entering it again.",
      future: "The start date needs to be in the past.",
      day: "day",
      days: "days",
      since: "Since {date}",
      next: "Next: {name}",
      arrives: "{date}, in {distance}",
      zeroDays: "0 days",
      oneDay: "1 day",
      oneWeek: "1 week",
      thirtyDays: "30 days",
      sixtyDays: "60 days",
      ninetyDays: "90 days",
      sixMonths: "6 months",
      oneYear: "1 year",
      eighteenMonths: "18 months",
      twoYears: "2 years",
      fiveHundredDays: "500 days",
      thousandDays: "1,000 days",
      anniversary: "{count}-year anniversary",
      units: {
        year: ["year", "years"],
        month: ["month", "months"],
        day: ["day", "days"]
      }
    },
    es: {
      required: "Elige primero una fecha de inicio.",
      invalid: "No se pudo leer esa fecha. Intenta ingresarla de nuevo.",
      future: "La fecha de inicio debe estar en el pasado.",
      day: "día",
      days: "días",
      since: "Desde el {date}",
      next: "Próximo: {name}",
      arrives: "{date}, dentro de {distance}",
      zeroDays: "0 días",
      oneDay: "1 día",
      oneWeek: "1 semana",
      thirtyDays: "30 días",
      sixtyDays: "60 días",
      ninetyDays: "90 días",
      sixMonths: "6 meses",
      oneYear: "1 año",
      eighteenMonths: "18 meses",
      twoYears: "2 años",
      fiveHundredDays: "500 días",
      thousandDays: "1,000 días",
      anniversary: "{count} años",
      units: {
        year: ["año", "años"],
        month: ["mes", "meses"],
        day: ["día", "días"]
      }
    }
  }[language];

  const pad = (number) => String(number).padStart(2, "0");
  const today = new Date();
  dateInput.max = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  if (pickerButton && typeof dateInput.showPicker === "function") {
    pickerButton.hidden = false;
    pickerButton.addEventListener("click", () => {
      try {
        dateInput.showPicker();
      } catch {
        dateInput.focus();
      }
    });
  }

  // Compare calendar dates, so daylight-saving changes do not lose or add a day.
  function calendarDays(start, end) {
    const serial = (date) => {
      const utc = new Date(0);
      utc.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      return utc.getTime() / dayMs;
    };
    return serial(end) - serial(start);
  }

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function addMonthsClamped(date, months) {
    const result = new Date(date);
    const originalDay = result.getDate();
    result.setDate(1);
    result.setMonth(result.getMonth() + months);
    result.setDate(Math.min(originalDay, daysInMonth(result.getFullYear(), result.getMonth())));
    return result;
  }

  function addYearsClamped(date, years) {
    return addMonthsClamped(date, years * 12);
  }

  function calendarBreakdown(start, end) {
    let cursor = new Date(start);
    let years = end.getFullYear() - start.getFullYear();
    let yearAnchor = addYearsClamped(start, years);
    if (yearAnchor > end) {
      years -= 1;
      yearAnchor = addYearsClamped(start, years);
    }
    cursor = yearAnchor;

    let months = (end.getFullYear() - cursor.getFullYear()) * 12 + end.getMonth() - cursor.getMonth();
    let monthAnchor = addMonthsClamped(cursor, months);
    if (monthAnchor > end) {
      months -= 1;
      monthAnchor = addMonthsClamped(cursor, months);
    }
    cursor = monthAnchor;

    let days = 0;
    while (true) {
      const next = new Date(cursor);
      next.setDate(next.getDate() + 1);
      if (next > end) break;
      cursor = next;
      days += 1;
    }

    return { years, months, days };
  }

  function formatParts(parts, limit = 3) {
    const ordered = ["year", "month", "day"];
    const items = ordered
      .filter((unit) => parts[`${unit}s`] > 0)
      .slice(0, limit)
      .map((unit) => {
        const value = parts[`${unit}s`];
        const forms = words.units[unit];
        return `${new Intl.NumberFormat(locale).format(value)} ${value === 1 ? forms[0] : forms[1]}`;
      });

    if (!items.length) return words.zeroDays;
    return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(items);
  }

  function nextMilestone(start, now) {
    const elapsed = now - start;
    const dayCandidate = (days, name) => {
      const date = new Date(start);
      date.setDate(date.getDate() + days);
      return { name, date };
    };
    const candidates = [
      dayCandidate(1, words.oneDay),
      dayCandidate(7, words.oneWeek),
      dayCandidate(30, words.thirtyDays),
      dayCandidate(60, words.sixtyDays),
      dayCandidate(90, words.ninetyDays),
      { name: words.sixMonths, date: addMonthsClamped(start, 6) },
      { name: words.oneYear, date: addYearsClamped(start, 1) },
      { name: words.eighteenMonths, date: addMonthsClamped(start, 18) },
      { name: words.twoYears, date: addYearsClamped(start, 2) },
      dayCandidate(500, words.fiveHundredDays),
      dayCandidate(1000, words.thousandDays)
    ].filter((milestone) => milestone.date > now && milestone.date - start > elapsed);

    let anniversaryCount = Math.max(1, now.getFullYear() - start.getFullYear());
    let anniversaryDate = addYearsClamped(start, anniversaryCount);
    while (anniversaryDate <= now) {
      anniversaryCount += 1;
      anniversaryDate = addYearsClamped(start, anniversaryCount);
    }
    candidates.push({
      name: words.anniversary.replace("{count}", new Intl.NumberFormat(locale).format(anniversaryCount)),
      date: anniversaryDate
    });

    return candidates.sort((a, b) => a.date - b.date)[0];
  }

  function render(start) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const totalDays = calendarDays(start, now);
    const breakdown = calendarBreakdown(start, now);
    const milestone = nextMilestone(start, now);
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const milestoneFormatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    daysValue.textContent = new Intl.NumberFormat(locale).format(totalDays);
    daysLabel.textContent = totalDays === 1 ? words.day : words.days;
    breakdownValue.textContent = formatParts(breakdown, 4);
    sinceValue.textContent = words.since.replace("{date}", dateFormatter.format(start));
    nextLabel.textContent = words.next.replace("{name}", milestone.name);
    nextDate.textContent = words.arrives
      .replace("{date}", milestoneFormatter.format(milestone.date))
      .replace("{distance}", formatParts({ days: calendarDays(now, milestone.date) }));

    empty.hidden = true;
    content.hidden = false;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";

    if (!dateInput.value) {
      error.textContent = words.required;
      dateInput.focus();
      return;
    }

    const start = new Date(`${dateInput.value}T00:00`);
    const [year, month, day] = dateInput.value.split("-").map(Number);
    if (Number.isNaN(start.getTime()) || start.getFullYear() !== year || start.getMonth() + 1 !== month || start.getDate() !== day) {
      error.textContent = words.invalid;
      return;
    }

    if (start > new Date()) {
      error.textContent = words.future;
      dateInput.focus();
      return;
    }

    render(start);
  });
})();
