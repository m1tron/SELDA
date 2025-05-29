import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import linregress

# Data
years = np.array([2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024])
percentages = np.array([1.06, 2.44, 3.19, 5.81, 10.19, 12.24, 13.04, 13.36, 15.13])
# Percentages data here is inaccurate (was mistakenly overwritten, fetch new before graphing)

# Regression
slope, intercept, *_ = linregress(years, percentages)
fit_line = slope * years + intercept
arrow = '↑' if slope > 0 else '↓'

# Plot
fig, ax = plt.subplots(figsize=(8, 5))

ax.plot(years, percentages, marker='o', label='DevOps % of Postings')
ax.plot(years, fit_line, linestyle='--', color='orange', alpha=0.7, label='Trend')

# Title + subtitle
# Add title with slope
ax.set_title(f"trend {slope:+.2f}{arrow}", fontsize=9)

# Labels & styling
ax.set_xlabel("Year")
ax.set_ylabel("Percentage %")
ax.set_ylim(0, 20)
ax.set_xticks(years)
ax.grid(True, linestyle='--', linewidth=0.5, alpha=0.5)
ax.legend()
plt.tight_layout()

# Save as pdf
fig.savefig("single_trend_plot.pdf", format='pdf', bbox_inches='tight')

plt.show()
