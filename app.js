const dailyData = {
  Fruit: { goal: 2, count: 0 },
  Vegetables: { goal: 3, count: 0 },
  Grains: { goal: 4, count: 0 },
  Protein: { goal: 2, count: 0 },
  Dairy: { goal: 2, count: 0 },
};

const trackerRows = document.querySelectorAll(".tracker__row");

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
