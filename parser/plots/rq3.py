import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import linregress

# 1) Define years and domains
years = np.array([2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024])
domains = [
    "driven", "curiosity", "flexible", "social", "communicative",
    "structured", "responsibility", "autonomous", "team player",
    "cooperation skills", "engaged", "proactive", "analytical",
    "creative", "solution oriented"
]

devops_data = {
    "driven":             [16.22, 29.96, 13.79, 8.52, 9.37, 8.44, 10.39, 7.26, 7.42],
    "curiosity":         [9.91, 6.61, 7.69, 6.99, 9.98, 8.66, 8.71, 6.09, 7.27],
    "flexible":           [4.5, 5.84, 2.39, 1.75, 5.09, 7.13, 11.53, 5.5, 8.33],
    "social":             [10.81, 9.34, 5.31, 3.93, 4.07, 4.06, 12.32, 6.44, 3.79],
    "communicative":       [4.5, 7.0, 6.1, 2.84, 6.11, 4.61, 4.58, 7.14, 8.18],
    "structured":       [2.7, 3.89, 4.24, 3.93, 3.05, 3.4, 10.04, 6.09, 2.58],
    "responsibility":     [14.41, 6.23, 3.71, 4.59, 5.09, 3.95, 8.19, 3.98, 2.42],
    "autonomous":        [12.61, 5.45, 2.92, 3.28, 5.09, 4.61, 4.4, 5.74, 4.39],
    "team player":         [2.7, 2.33, 0.53, 3.28, 6.92, 4.06, 4.23, 6.67, 5.45],
    "cooperation skills":   [1.8, 4.67, 2.92, 1.75, 3.26, 3.62, 4.49, 5.74, 7.12],
    "engaged":          [2.7, 5.45, 3.18, 3.06, 2.24, 1.43, 2.02, 5.62, 10.0],
    "proactive":       [0, 2.33, 2.65, 2.4, 2.65, 3.62, 5.46, 5.04, 2.58],
    "analytical":          [1.8, 1.17, 3.71, 2.62, 4.07, 2.74, 3.08, 5.15, 5.45],
    "creative":            [4.5, 5.06, 3.18, 2.62, 2.24, 2.96, 3.61, 3.63, 4.09],
    "solution oriented": [5.41, 2.33, 2.12, 3.28, 3.05, 4.28, 2.29, 3.75, 4.39]
}


developer_data = {
    "driven":             [26.41, 20.51, 18.64, 18.92, 18.88, 18.14, 17.04, 12.4, 10.82],
    "curiosity":         [10.41, 11.07, 10.84, 12.83, 12.72, 12.87, 15.19, 16.58, 12.51],
    "flexible":           [10.21, 8.82, 8.92, 8.19, 8.94, 8.18, 8.79, 6.34, 7.21],
    "social":             [13.07, 11.03, 7.84, 8.35, 6.09, 4.17, 5.2, 4.33, 3.67],
    "communicative":       [12.87, 11.14, 9.86, 12.86, 10.87, 10.62, 11.29, 9.98, 11.1],
    "structured":       [9.76, 8.44, 7.2, 6.94, 7.36, 5.76, 5.55, 5.51, 6.56],
    "responsibility":     [11.0, 9.1, 8.46, 7.72, 7.24, 7.05, 8.08, 6.01, 7.43],
    "autonomous":        [11.73, 9.35, 7.36, 7.9, 7.79, 9.1, 7.16, 10.05, 5.26],
    "team player":         [7.86, 8.37, 7.47, 6.79, 8.67, 7.68, 7.95, 7.18, 6.22],
    "cooperation skills":   [6.68, 8.62, 9.88, 6.86, 6.32, 6.83, 6.41, 6.71, 8.69],
    "engaged":          [8.36, 8.08, 7.35, 7.07, 5.37, 4.82, 3.95, 4.78, 5.46],
    "proactive":       [6.54, 6.76, 5.78, 5.76, 5.46, 5.86, 4.68, 4.35, 3.51],
    "analytical":          [9.62, 8.4, 7.5, 7.02, 6.11, 5.44, 5.82, 6.19, 7.25],
    "creative":            [11.0, 10.72, 8.4, 6.83, 7.09, 8.87, 7.81, 5.98, 6.26],
    "solution oriented": [6.54, 6.42, 5.93, 5.84, 5.28, 5.1, 6.33, 5.45, 4.64]
}




# 3) Plot small multiples with regression lines and fixed Y-axis
fig, axes = plt.subplots(5, 3, figsize=(13, 15), sharex=True, sharey=True)

for ax, domain in zip(axes.ravel(), domains):
    y_it = developer_data[domain]
    y_devops = devops_data[domain]

    # Plot original data
    ax.plot(years, y_it, marker='o', label='Developer')
    ax.plot(years, y_devops, marker='s', label='DevOps')

    # Linear regressions
    slope_it, intercept_it, *_ = linregress(years, y_it)
    slope_dev, intercept_dev, *_ = linregress(years, y_devops)
    y_it_fit = slope_it * years + intercept_it
    y_dev_fit = slope_dev * years + intercept_dev

    # Regression lines
    ax.plot(years, y_it_fit, linestyle='--', color='blue', alpha=0.6)
    ax.plot(years, y_dev_fit, linestyle='--', color='orange', alpha=0.6)

    # Add title with slope
    arrow_it = '↑' if slope_it > 0 else '↓'
    arrow_dev = '↑' if slope_dev > 0 else '↓'
    # Main title (bold)
    ax.set_title(f"IT: {slope_it:+.2f}{arrow_it}, DevOps: {slope_dev:+.2f}{arrow_dev}", fontsize=9)

    # Subtitle below title (regular text, slightly offset)
    ax.text(0.5, 1.12,
            domain,
            transform=ax.transAxes,
            fontsize=11, fontweight='bold',
            ha='center')


    ax.set_xlabel("Year")
    ax.set_ylabel("Percentage %")
    ax.set_ylim(0, 30)  # <-- fixed Y axis range
    ax.tick_params(labelrotation=45)

# 4) Legend and layout
fig.legend(['Developer', 'DevOps'], loc='upper center', ncol=2)
fig.tight_layout(rect=[0, 0, 1, 0.95])
fig.savefig("devops_trends.pdf", format='pdf', bbox_inches='tight')
plt.show()