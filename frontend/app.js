document.addEventListener("DOMContentLoaded", () => {
    const API_ENDPOINT = "http://localhost:8000/api/v1/inventory/status";
    let lastUpdateTime = null;
    
    async function updateDashboardTelemetry() {
        try {
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            const data = await response.json();
            
            // Update telemetry indicators
            document.getElementById("lblLatency").innerText = `${data.telemetry.apiLatencyMs}ms`;
            
            const dbNode = document.getElementById("lblDb");
            dbNode.innerText = data.telemetry.databaseConnection;
            dbNode.className = data.telemetry.databaseConnection === "CONNECTED" ? "txt-green" : "txt-red";
            
            const statusNode = document.getElementById("lblStatus");
            statusNode.innerText = data.status;
            statusNode.className = data.status === "HEALTHY" ? "txt-green" : "txt-orange";
            
            const resilienceNode = document.getElementById("lblResilience");
            resilienceNode.innerText = data.telemetry.systemResilience;
            resilienceNode.className = data.telemetry.systemResilience === "HIGH" ? "txt-green" : "txt-orange";
            
            // Update metrics
            document.getElementById("lblTotalSkus").innerText = data.metrics.totalSKUsTracked;
            document.getElementById("lblAlerts").innerText = data.metrics.activeAlertsTriggered;
            document.getElementById("lblTotalUnits").innerText = data.metrics.totalUnitsInInventory;
            document.getElementById("lblAvgStock").innerText = data.metrics.averageStockLevel;
            
            // Update timestamp
            const now = new Date();
            document.getElementById("lblLastUpdate").innerText = now.toLocaleTimeString();
            
            // Render inventory table
            const tbody = document.getElementById("inventoryBody");
            tbody.innerHTML = "";
            
            if (data.inventory && data.inventory.length > 0) {
                data.inventory.forEach(item => {
                    const tr = document.createElement("tr");
                    if (item.status === "CRITICAL_LOW") {
                        tr.className = "row-alert";
                    }
                    tr.innerHTML = `
                        <td><code>${item.sku}</code></td>
                        <td><strong>${item.itemName}</strong></td>
                        <td>${item.department}</td>
                        <td>${item.stockQuantity} <small class="muted">/ threshold: ${item.alertThreshold}</small></td>
                        <td>${item.storeLocation}</td>
                        <td><span class="status-pill ${item.status.toLowerCase()}">${item.status}</span></td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td colspan="6" style="text-align: center; font-style: italic;">No inventory data available</td>`;
                tbody.appendChild(tr);
            }
            
            // Hide alert banner on successful connection
            document.getElementById("alertBanner").hidden = true;
            
        } catch (err) {
            console.error("API fetch error:", err);
            document.getElementById("alertBanner").hidden = false;
            
            const dbNode = document.getElementById("lblDb");
            dbNode.innerText = "OFFLINE";
            dbNode.className = "txt-red";
            
            const statusNode = document.getElementById("lblStatus");
            statusNode.innerText = "UNAVAILABLE";
            statusNode.className = "txt-red";
            
            const tbody = document.getElementById("inventoryBody");
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #ef4444;">⚠️ Unable to connect to API. Retrying in 5 seconds...</td></tr>`;
        }
    }
    
    // Initial load and setup polling
    updateDashboardTelemetry();
    setInterval(updateDashboardTelemetry, 5000);
});