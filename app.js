const dailyData = {
  Fruit: { goal: 2, count: 0 },
  Vegetables: { goal: 3, count: 0 },
  Grains: { goal: 4, count: 0 },
  Protein: { goal: 2, count: 0 },
  Dairy: { goal: 2, count: 0 },
};

const groupOrder = ["Fruit", "Vegetables", "Grains", "Protein", "Dairy"];
const trackerRows = document.querySelectorAll(".tracker__row");
const exportDateInput = document.querySelector("#export-date");
const exportButton = document.querySelector(".export__button");
const exportStatus = document.querySelector(".export__status");

const updateRowDisplay = (row, group) => {
  const data = dailyData[group];
  const countEl = row.querySelector(".tracker__count");
  const barEl = row.querySelector(".tracker__bar");

  const safeGoal = Math.max(0, data.goal);
  const safeCount = Math.max(0, data.count);

  countEl.textContent = `${safeCount}/${safeGoal}`;
  barEl.max = safeGoal || 1;
  barEl.value = Math.min(safeCount, safeGoal || 1);
};

trackerRows.forEach((row) => {
  const group = row.dataset.group;
  const input = row.querySelector(".tracker__input");
  const button = row.querySelector(".tracker__button");

  input.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    dailyData[group].goal = Number.isNaN(value) ? 0 : Math.max(0, value);
    updateRowDisplay(row, group);
  });

  button.addEventListener("click", () => {
    dailyData[group].count += 1;
    updateRowDisplay(row, group);
  });

  updateRowDisplay(row, group);
});

const formatCsvValue = (value) => {
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const buildCsv = (dateValue) => {
  const headers = [
    "date",
    "fruit",
    "vegetables",
    "grains",
    "protein",
    "dairy",
    "fruit_target",
    "vegetables_target",
    "grains_target",
    "protein_target",
    "dairy_target",
  ];

  const counts = groupOrder.map((group) => dailyData[group].count);
  const targets = groupOrder.map((group) => dailyData[group].goal);
  const row = [dateValue, ...counts, ...targets].map(formatCsvValue).join(",");

  return `${headers.join(",")}\n${row}\n`;
};

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const exportCsv = async () => {
  const dateValue =
    exportDateInput?.value || new Date().toISOString().split("T")[0];
  const csv = buildCsv(dateValue);
  const filename = `meal-tracker-${dateValue}.csv`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const file = new File([blob], filename, { type: blob.type });

  exportStatus.textContent = "";

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: "Meal tracker export",
        text: "Daily meal tracker CSV export.",
      });
      exportStatus.textContent = "Shared your CSV export.";
      return;
    } catch (error) {
      exportStatus.textContent = "Share canceled. Downloading instead.";
    }
  }

  triggerDownload(blob, filename);
  exportStatus.textContent = "CSV downloaded to your device.";
};

if (exportDateInput) {
  const today = new Date();
  exportDateInput.value = today.toISOString().split("T")[0];
}

exportButton?.addEventListener("click", exportCsv);
