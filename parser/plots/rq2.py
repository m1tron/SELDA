import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import linregress

# Define years and domains
years = np.array([2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024])
domains = [
    "Cloud", "CI/CD", "Networking", "Database", "Security",
    "Scripting", "Containerization", "Monitoring", "Automation"
]

devops_data = {
    "Cloud":             [25.23, 30.74, 44.3, 51.31, 52.34, 32.35, 30.28, 29.04, 38.79],
    "CI/CD":             [56.76, 55.64, 46.95, 55.9, 57.43, 42.87, 39.7, 36.89, 32.12],
    "Networking":        [23.42, 27.63, 15.12, 22.05, 23.42, 14.58, 22.18, 19.79, 27.12],
    "Database":          [36.94, 38.91, 15.38, 16.59, 23.22, 13.16, 7.22, 5.62, 6.36],
    "Security":          [0.00, 3.5, 0.8, 4.15, 4.48, 4.5, 4.58, 4.57, 8.64],
    "Scripting":            [27.03, 35.41, 23.34, 24.89, 14.66, 9.76, 11.8, 9.02, 10.61],
    "Containerization":  [27.93, 38.91, 44.3, 49.34, 43.99, 30.37, 36.09, 29.86, 35.76],
    "Monitoring":           [12.61, 12.06, 18.83, 10.48, 10.18, 7.02, 9.33, 8.55, 14.85],
    "Automation":        [69.37, 49.81, 48.54, 58.52, 49.49, 34.54, 34.07, 31.62, 42.12]
}

it_data = {
    "Cloud":             [4.55, 5.63, 7.62, 11.51, 15.51, 17.43, 17.84, 13.92, 15.94],
    "CI/CD":             [4.83, 7.06, 8.61, 11.85, 12.61, 11.98, 12.03, 9.77, 13.65],
    "Networking":        [10.7, 13.0, 12.1, 16.17, 15.19, 13.77, 17.08, 15.91, 16.04],
    "Database":          [29.7, 26.6, 27.53, 24.79, 27.05, 22.26, 18.81, 15.67, 17.42],
    "Security":          [1.34, 2.22, 2.12, 4.95, 4.57, 3.99, 3.51, 3.6, 4.24],
    "Scripting":            [4.69, 5.54, 5.2, 5.43, 4.75, 3.5, 2.9, 3.07, 2.83],
    "Containerization":  [6.29, 7.64, 10.76, 14.46, 14.01, 12.35, 11.78, 11.43, 13.35],
    "Monitoring":           [2.48, 3.43, 3.13, 2.61, 1.77, 1.65, 1.8, 2.0, 2.37],
    "Automation":        [4.55, 6.73, 6.31, 10.46, 11.14, 11.85, 11.99, 12.67, 12.77]
}



# Plot small multiples with regression lines and fixed Y-axis
fig, axes = plt.subplots(3, 3, figsize=(13, 10), sharex=True, sharey=True)

for ax, domain in zip(axes.ravel(), domains):
    y_it = it_data[domain]
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
    ax.set_title(
        f"$\\bf{{{domain}}}$\nIT: {slope_it:+.2f}{arrow_it}, DevOps: {slope_dev:+.2f}{arrow_dev}",
        fontsize=11
    )


    ax.set_xlabel("Year")
    ax.set_ylabel("Percentage %")
    ax.set_ylim(0, 70)  # <-- fixed Y axis range
    ax.tick_params(labelrotation=45)

# Legend and layout
fig.legend(['Developer', 'DevOps'], loc='upper center', ncol=2)
fig.tight_layout(rect=[0, 0, 1, 0.95])
fig.savefig("devops_trends.pdf", format='pdf', bbox_inches='tight')
plt.show()