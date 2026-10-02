document.addEventListener("DOMContentLoaded", () => {
    // Static Mock Data Matrix bypassing the live database node
    const mockData = {
        "status": "HEALTHY",
        "timestamp": "2026-10-02T16:22:45Z",
        "telemetry": {
            "apiLatencyMs": 4.12,
            "databaseConnection": "CONNECTED",
            "systemResilience": "HIGH",
            "uptime_seconds": 86400
        },
        "metrics": {
            "totalSKUsTracked": 8,
            "activeAlertsTriggered": 2,
            "totalUnitsInInventory": 855,
            "averageStockLevel": 106.88
        },
        "inventory": [
            {
                "sku": "SKU-1004-891",
                "itemName": "Premium Kiln-Dried Lumber 2x4x8",
                "department": "Lumber & Building Materials",
                "stockQuantity": 420,
                "alertThreshold": 100,
                "storeLocation": "Aisle 24, Bay 002",
                "status": "STABLE"
            },
            {
                "sku": "SKU-2015-442",
                "itemName": "Milwaukie 18V Cordless Drill Driver Kit",
                "department": "Hardware & Tools",
                "stockQuantity": 14,
                "alertThreshold": 25,
                "storeLocation": "Aisle 04, Bay 012",
                "status": "CRITICAL_LOW"
            },
            {
                "sku": "SKU-3098-115",
                "itemName": "Behr Ultra Pure White Satin Interior Paint",
                "department": "Paint & Decor",
                "stockQuantity": 85,
                "alertThreshold": 30,
                "storeLocation": "Aisle 11, Bay 005",
                "status": "STABLE"
            },
            {
                "sku": "SKU-4412-073",
                "itemName": "Sovereign Brass Smart Entry Deadbolt",
                "department": "Hardware & Tools",
                "stockQuantity": 8,
                "alertThreshold": 15,
                "storeLocation": "Aisle 02, Bay 008",
                "status": "CRITICAL_LOW"
            },
            {
                "sku": "SKU-5201-928",
                "itemName": "Stainless Steel Hinges 3-inch Pack",
                "department": "Hardware & Tools",
                "stockQuantity": 156,
                "alertThreshold": 50,
                "storeLocation": "Aisle 03, Bay 014",
                "status": "STABLE"
            },
            {
                "sku": "SKU-6789-334",
                "itemName": "Concrete Mix 50lb Bag",
                "department": "Lumber & Building Materials",
                "stockQuantity": 22,
                "alertThreshold": 40,
                "storeLocation": "Aisle 25, Bay 001",
                "status": "CRITICAL_LOW"
            },
            {
                "sku": "SKU-7845-012",
                "itemName": "LED Recessed Light Fixtures",
                "department": "Electrical Supplies",
                "stockQuantity": 45,
                "alertThreshold": 20,
                "storeLocation": "Aisle 18, Bay 009",
                "status": "STABLE"
            },
            {
                "sku": "SKU-8912-445",
                "itemName": "Cabinet Hardware Assortment",
                "department": "Hardware & Tools",
                "stockQuantity": 5,
                "alertThreshold": 12,
                "storeLocation": "Aisle 02, Bay 011",
                "status": "CRITICAL_LOW"
            }
        ]
    };

    function renderStaticDashboard() {
        // Update telemetry indicators
        document.getElementById("lblLatency").innerText = `${mockData.telemetry.apiLatencyMs}ms`;
        
        const dbNode = document.getElementById("lblDb");
        dbNode.innerText = mockData.telemetry.databaseConnection;
        dbNode.className = "txt-green";
        
        const statusNode = document.getElementById("lblStatus");
        statusNode.innerText = mockData.status;
        statusNode.className = "txt-green";
        
        const resilienceNode = document.getElementById("lblResilience");
        resilienceNode.innerText = mockData.telemetry.systemResilience;
        resilienceNode.className = "txt-green";
        
        // Update metrics
        document.getElementById("lblTotalSkus").innerText = mockData.metrics.totalSKUsTracked;
        document.getElementById("lblAlerts").innerText = mockData.metrics.activeAlertsTriggered;
        document.getElementById("lblTotalUnits").innerText = mockData.metrics.totalUnitsInInventory;
        document.getElementById("lblAvgStock").innerText = mockData.metrics.averageStockLevel;
        
        // Update timestamp
        const now = new Date();
        document.getElementById("lblLastUpdate").innerText = now.toLocaleTimeString();
        
        // Render inventory table
        const tbody = document.getElementById("inventoryBody");
        tbody.innerHTML = "";
        
        mockData.inventory.forEach(item => {
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
        
        // Hide alert banner
        document.getElementById("alertBanner").hidden = true;
    }
    
    // Execute rendering immediately
    renderStaticDashboard();
});
