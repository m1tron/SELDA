import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import linregress

# 1) Define years and domains
years = np.array([2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024])

categories = [
    "com", "csy", "flx", "ips", "itg",
    "pat", "per", "pro", "res", "twk", "wke"
]

data = {
    "com": [7.21, 1.17, 1.86, 5.02, 2.24, 1.54, 1.5, 1.52, 0.91],
    "csy": [2.7, 0.39, 0.53, 0.66, 0.41, 0.55, 0.26, 0.7, 0.91],
    "flx": [9.01, 12.45, 7.16, 5.24, 8.96, 11.4, 15.32, 10.42, 15.76],
    "ips": [18.92, 33.85, 21.22, 18.56, 16.5, 13.16, 19.72, 17.33, 15.15],
    "itg": [1.8, 0.0, 1.33, 1.53, 0.61, 0.88, 0.79, 1.99, 1.06],
    "pat": [11.71, 8.17, 3.18, 2.4, 4.89, 3.73, 3.08, 5.27, 5.15],
    "per": [9.91, 8.17, 8.75, 7.42, 10.59, 9.21, 9.33, 6.67, 8.33],
    "pro": [0.9, 1.17, 3.18, 1.09, 0.41, 0.66, 2.02, 0.82, 0.0],
    "res": [27.93, 17.51, 14.85, 15.07, 18.94, 14.04, 24.74, 22.01, 23.48],
    "twk": [18.92, 9.73, 8.49, 11.35, 13.65, 10.64, 11.88, 11.71, 14.24],
    "wke": [29.73, 43.97, 25.99, 18.12, 23.63, 20.5, 20.51, 20.96, 23.03]
}




# 3) Plot small multiples with regression lines and fixed Y-axis
fig, axes = plt.subplots(4, 3, figsize=(13, 15), sharex=True, sharey=True)

plot_count = 0
total_plots = len(categories)

for row in range(4):
    for col in range(3):
        if plot_count < total_plots:
            domain = categories[plot_count]
            y_it = data[domain]
            ax = axes[row][col]

            # Plot original data
            ax.plot(years, y_it, marker='o', label='Developer')

            # Linear regressions
            slope_it, intercept_it, *_ = linregress(years, y_it)
            y_it_fit = slope_it * years + intercept_it

            # Regression lines
            ax.plot(years, y_it_fit, linestyle='--', color='orange', alpha=0.6)

            # Add title with slope
            arrow_it = '↑' if slope_it > 0 else '↓'
            ax.set_title(f"trend {slope_it:+.2f}{arrow_it}", fontsize=9)
            ax.text(0.5, 1.12,
                    domain.upper(),
                    transform=ax.transAxes,
                    fontsize=11, fontweight='bold',
                    ha='center')

            ax.set_xlabel("Year")
            ax.set_ylabel("Percentage %")
            ax.set_ylim(0, 30)
            ax.tick_params(labelrotation=45)

            plot_count += 1
        else:
            fig.delaxes(axes[row][col])  # Remove the empty subplot

# 4) Legend and layout
fig.tight_layout(rect=[0, 0, 1, 0.95])
fig.savefig("softskills_categories.pdf", format='pdf', bbox_inches='tight')
plt.show()
