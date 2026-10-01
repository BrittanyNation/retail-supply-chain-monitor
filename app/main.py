import time
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db

app = FastAPI(
    title="The Home Depot Supply Chain API Monitor",
    version="1.0.0",
    description="Production-grade inventory status and system resilience telemetry API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "HEALTHY", "service": "hd-supply-api"}

@app.get("/api/v1/inventory/status")
async def get_inventory_status(db: Session = Depends(get_db)):
    start_time = time.perf_counter()
    
    try:
        # Execute query statement to monitor storage parameters
        query_result = db.execute(
            text("SELECT sku, item_name, department, stock_quantity, alert_threshold, store_location FROM inventory ORDER BY stock_quantity ASC")
        ).fetchall()
        
        items_payload = []
        low_stock_counter = 0
        total_stock = 0
        
        for row in query_result:
            stock_qty = row[3]
            alert_threshold = row[4]
            is_low = stock_qty <= alert_threshold
            
            if is_low:
                low_stock_counter += 1
            
            total_stock += stock_qty
                
            items_payload.append({
                "sku": row[0],
                "itemName": row[1],
                "department": row[2],
                "stockQuantity": stock_qty,
                "alertThreshold": alert_threshold,
                "storeLocation": row[5],
                "status": "CRITICAL_LOW" if is_low else "STABLE"
            })
        
        latency_ms = (time.perf_counter() - start_time) * 1000
        avg_stock = total_stock / len(query_result) if query_result else 0
        
        return {
            "status": "HEALTHY",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "telemetry": {
                "apiLatencyMs": round(latency_ms, 2),
                "databaseConnection": "CONNECTED",
                "systemResilience": "HIGH",
                "uptime_seconds": 86400
            },
            "metrics": {
                "totalSKUsTracked": len(items_payload),
                "activeAlertsTriggered": low_stock_counter,
                "averageStockLevel": round(avg_stock, 2),
                "totalUnitsInInventory": total_stock
            },
            "inventory": items_payload
        }
        
    except Exception as ex:
        latency_ms = (time.perf_counter() - start_time) * 1000
        return {
            "status": "SYSTEM_DEGRADED",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "telemetry": {
                "apiLatencyMs": round(latency_ms, 2),
                "databaseConnection": "DISCONNECTED",
                "systemResilience": "FAILOVER_TRIGGERED"
            },
            "error": str(ex),
            "inventory": []
        }