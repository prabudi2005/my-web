
"use strict";

/* =========================================
   Lanka Fresh Mart Dashboard
   Dataset and calculations
========================================= */

const monthlyData = [
    { month: "Jan", revenue: 1250, units: 3400 },
    { month: "Feb", revenue: 1180, units: 3150 },
    { month: "Mar", revenue: 1420, units: 3900 },
    { month: "Apr", revenue: 1610, units: 4300 },
    { month: "May", revenue: 1550, units: 4050 },
    { month: "Jun", revenue: 1780, units: 4700 }
];

const branchData = [
    { branch: "Colombo", revenue: 2450, color: "#02561f" },
    { branch: "Kandy", revenue: 1320, color: "#057c44" },
    { branch: "Galle", revenue: 1170, color: "#337a03" }
];

/* =========================================
   Formatting helpers
========================================= */

const formatNumber = (value) =>
    new Intl.NumberFormat("en-US").format(value);

const formatLkrThousands = (value) =>
    `LKR ${formatNumber(value)}k`;

/* =========================================
   Calculate dashboard KPI values
========================================= */

function calculateMetrics() {
    const totalRevenue = monthlyData.reduce(
        (total, item) => total + item.revenue,
        0
    );

    const totalUnits = monthlyData.reduce(
        (total, item) => total + item.units,
        0
    );

    const bestMonth = monthlyData.reduce(
        (best, item) =>
            item.revenue > best.revenue ? item : best
    );

    const bestBranch = branchData.reduce(
        (best, item) =>
            item.revenue > best.revenue ? item : best
    );

    const q2Total = branchData.reduce(
        (total, item) => total + item.revenue,
        0
    );

    // Revenue growth from January to June
    const firstMonth = monthlyData[0];
    const lastMonth = monthlyData[monthlyData.length - 1];

    const growth =
        ((lastMonth.revenue - firstMonth.revenue) /
            firstMonth.revenue) * 100;

    // Display calculated values
    setText("totalRevenue", formatLkrThousands(totalRevenue));
    setText("totalUnits", formatNumber(totalUnits));
    setText("bestMonth", bestMonth.month);
    setText("bestMonthValue", formatLkrThousands(bestMonth.revenue));
    setText("bestBranch", bestBranch.branch);
    setText("bestBranchValue", formatLkrThousands(bestBranch.revenue));
    setText("monthlyPeak", formatLkrThousands(bestMonth.revenue));
    setText("q2Total", formatLkrThousands(q2Total));
    setText("growthRate", `${growth.toFixed(1)}%`);

    // Generate a summary from the dataset
    const insight =
        `${bestMonth.month} recorded the highest monthly revenue at ` +
        `${formatLkrThousands(bestMonth.revenue)}. ` +
        `June revenue was ${growth.toFixed(1)}% higher than January, ` +
        `while ${bestBranch.branch} led branch revenue.`;

    setText("insightText", insight);
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

/* =========================================
   Monthly revenue line chart
========================================= */

function createMonthlyChart() {
    const canvas = document.getElementById("monthlyChart");

    if (!canvas || typeof Chart === "undefined") {
        console.error("Chart.js or monthlyChart element is missing.");
        return;
    }

    const context = canvas.getContext("2d");

    const gradient = context.createLinearGradient(0, 0, 0, 280);

    gradient.addColorStop(0, "rgba(0, 91, 3, 0.24)");
    gradient.addColorStop(1, "rgba(21, 123, 5, 0.01)");

    new Chart(context, {
        type: "line",

        data: {
            labels: monthlyData.map(item => item.month),

            datasets: [{
                label: "Monthly revenue",
                data: monthlyData.map(item => item.revenue),

                borderColor: "#085a01",
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.38,

                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: "#9b9898",
                pointBorderColor: "#014435",
                pointBorderWidth: 2.5
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            interaction: {
                intersect: false,
                mode: "index"
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    backgroundColor:"#012a22",
                    padding: 12,
                    displayColors: false,

                    callbacks: {
                        label: (item) =>
                            ` Revenue: LKR ${formatNumber(item.parsed.y)}k`
                    }
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Month",
                        color: "#039355",

                        font: {
                            family: "DM Sans",
                            size: 10,
                            weight: "600"
                        },

                        padding: { top: 8 }
                    },

                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: "#039355",
                        font: {
                            family: "DM Sans",
                            size: 10
                        },
                        padding: 9
                    }
                },

                y: {
                    beginAtZero: false,
                    min: 1000,
                    max: 2000,

                    title: {
                        display: true,
                        text: "Revenue (LKR '000)",
                        color: "#039355",

                        font: {
                            family: "DM Sans",
                            size: 10,
                            weight: "600"
                        }
                    },

                    grid: {
                        color: "#039355",
                        drawTicks: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        stepSize: 250,
                        color: "#039355",

                        font: {
                            family: "DM Sans",
                            size: 10
                        },

                        padding: 9,

                        callback: value =>
                            value.toLocaleString("en-US")
                    }
                }
            }
        }
    });
}

/* =========================================
   Q2 branch revenue bar chart
========================================= */

function createBranchChart() {
    const canvas = document.getElementById("branchChart");

    if (!canvas || typeof Chart === "undefined") {
        console.error("Chart.js or branchChart element is missing.");
        return;
    }

    new Chart(canvas.getContext("2d"), {
        type: "bar",

        data: {
            labels: branchData.map(item => item.branch),

            datasets: [{
                label: "Q2 revenue",
                data: branchData.map(item => item.revenue),

                backgroundColor: branchData.map(item => item.color),

                borderRadius: 7,
                borderSkipped: false,
                maxBarThickness: 48
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    backgroundColor: "#022d22",
                    padding: 12,
                    displayColors: false,

                    callbacks: {
                        label: item =>
                            ` Revenue: LKR ${formatNumber(item.parsed.y)}k`
                    }
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Branch",
                        color: "#039355",

                        font: {
                            family: "DM Sans",
                            size: 10,
                            weight: "600"
                        },

                        padding: { top: 8 }
                    },

                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: "#039355",

                        font: {
                            family: "DM Sans",
                            size: 10,
                            weight: "600"
                        },

                        padding: 8
                    }
                },

                y: {
                    beginAtZero: true,
                    max: 3000,

                    title: {
                        display: true,
                        text: "Revenue (LKR '000)",
                        color: "#039355",

                        font: {
                            family: "DM Sans",
                            size: 10,
                            weight: "600"
                        }
                    },

                    grid: {
                        color: "#039355",
                        drawTicks: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        stepSize: 1000,
                        color: "#039355",

                        font: {
                            family: "DM Sans",
                            size: 10
                        },

                        padding: 9,

                        callback: value =>
                            value.toLocaleString("en-US")
                    }
                }
            }
        }
    });
}

/* =========================================
   Mobile navigation
========================================= */

function setupMobileNavigation() {
    const menuToggle = document.getElementById("menuToggle");
    const primaryNav = document.getElementById("primaryNav");

    if (!menuToggle || !primaryNav) {
        return;
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = primaryNav.classList.toggle("is-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });

    primaryNav.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            primaryNav.querySelectorAll(".nav-link").forEach(item => {
                item.classList.remove("active");
                item.removeAttribute("aria-current");
            });

            link.classList.add("active");
            link.setAttribute("aria-current", "page");

            primaryNav.classList.remove("is-open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            primaryNav.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        }
    });
}

/* =========================================
   Dark / light mode
========================================= */

function setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) {
        return;
    }

    themeToggle.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-mode");

        themeToggle.innerHTML = isDark
            ? '<i class="fa-regular fa-sun" aria-hidden="true"></i>'
            : '<i class="fa-regular fa-moon" aria-hidden="true"></i>';

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    });
}

/* =========================================
   Dashboard search
========================================= */

function setupDashboardSearch() {
    const search = document.getElementById("dashboardSearch");

    if (!search) {
        return;
    }

    const destinations = {
        dashboard: "dashboard",
        overview: "dashboard",
        sales: "sales",
        revenue: "sales",
        monthly: "sales",
        reports: "reports",
        branch: "reports",
        q2: "reports",
        settings: "settings",
        insight: "settings"
    };

    function performSearch() {
        const term = search.value.trim().toLowerCase();

        if (!term) {
            return;
        }

        const key = Object.keys(destinations).find(word =>
            term.includes(word)
        );

        if (key) {
            const section = document.getElementById(destinations[key]);

            if (section) {
                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        } else {
            search.setCustomValidity(
                "Try Dashboard, Sales, Reports or Settings."
            );
            search.reportValidity();
        }
    }

    search.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            search.setCustomValidity("");
            performSearch();
        }
    });

    search.addEventListener("input", () => {
        search.setCustomValidity("");
    });
}

/* =========================================
   Sidebar navigation
========================================= */

function setupSidebarNavigation() {
    const links = document.querySelectorAll(".side-link");

    links.forEach(link => {
        link.addEventListener("click", () => {
            links.forEach(item => item.classList.remove("active"));
            link.classList.add("active");
        });
    });
}

/* =========================================
   Initialize dashboard
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    calculateMetrics();
    createMonthlyChart();
    createBranchChart();
    setupMobileNavigation();
    setupThemeToggle();
    setupDashboardSearch();
    setupSidebarNavigation();
});
