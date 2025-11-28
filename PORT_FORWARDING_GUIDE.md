# Port Forwarding Setup Guide

## Your Information
- **Public IP Address**: 92.63.86.234
- **Local IP Address**: 192.168.21.93
- **Port**: 5173
- **Protocol**: TCP

## Step-by-Step Port Forwarding Instructions

### Step 1: Access Your Router
1. Open a web browser
2. Enter your router's gateway IP: **192.168.21.1**
   - This is your Default Gateway
3. Log in with your router admin credentials
   - Common defaults: admin/admin, admin/password, or check your router's label

### Step 2: Find Port Forwarding Section
Common locations in router settings:
- **Advanced** → **Port Forwarding**
- **Firewall** → **Port Forwarding**
- **NAT** → **Port Forwarding**
- **Virtual Server** (some routers)
- **Applications & Gaming** → **Port Forwarding** (Linksys)

### Step 3: Add Port Forwarding Rule
Create a new rule with these settings:

- **Service Name**: Vite Dev Server (or any name you prefer)
- **External Port**: 5173
- **Internal Port**: 5173
- **Protocol**: TCP (or Both/TCP+UDP)
- **Internal IP Address**: 192.168.21.93
- **Enabled**: Yes/Checked

### Step 4: Save and Apply
- Click **Save** or **Apply**
- Your router may restart (this is normal)

### Step 5: Test the Connection
Once port forwarding is set up, share this URL:
```
http://92.63.86.234:5173
```

## Important Notes

⚠️ **Security Warning**: 
- Exposing your development server to the internet can be a security risk
- Only use this for testing/demonstration purposes
- Consider using ngrok or a VPN for production use

⚠️ **ISP Restrictions**:
- Some ISPs block incoming connections on residential connections
- If it doesn't work, your ISP may be blocking port 5173
- You may need to contact your ISP or use a different port

⚠️ **Dynamic IP**:
- Your public IP (92.63.86.234) may change when your router restarts
- Check your IP again if the connection stops working: `curl https://api.ipify.org`

## Alternative: Check if Port is Already Open
You can test if the port is accessible from outside using online tools:
- https://www.yougetsignal.com/tools/open-ports/
- Enter: 92.63.86.234 and port 5173

## Troubleshooting

1. **Can't access router**: Try common IPs like 192.168.1.1, 192.168.0.1, or 10.0.0.1
2. **Port forwarding not working**: 
   - Make sure your local IP (192.168.21.93) hasn't changed
   - Check Windows Firewall allows port 5173 (already done)
   - Verify the server is running: `netstat -an | findstr ":5173"`
3. **Connection timeout**: Your ISP may be blocking the port

