App url - https://swiftmove-logistics-client.vercel.app
Api doc - https://documenter.getpostman.com/view/8901262/2sB3BDKr9q#d637128f-3c29-43c8-b7b0-6a332f86b2c5

# Server
- To install a package use npm install --workspace=server <package>


# Shipment Flow
- manager creates or orders a delivery
- delivery status is set to pending
- manager receives a notification on their dashboard about new delivery request (via websocket messaging protocol)
- manager assigns delivery to an available driver for pickup
- delivery status is set to assigned
- driver status changes to busy
- driver picksup delivery
- driver marks delivery as in_transit
- driver completes delivery
- driver marks delivery as delivered
- driver status changes to active
- delivery status changes to delivered


# Pages
- Manager/driver registration/login page
- Admin login page
- Admin dashboard page
- Shipping page
    - create shipping modal
    - table of shipping
        - action to assign a driver by a manager/admin
- Driver dashboard page
    - update delivery status