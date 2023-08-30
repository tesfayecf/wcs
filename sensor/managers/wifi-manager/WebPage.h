const char wifi_page[] PROGMEM = R"=====(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>WiFi Credentials</title>
    <style>
        /* Common styles for all devices */
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
            text-align: center;
        }

        header {
            background-color: #0074cc;
            color: white;
            padding: 20px;
        }

        h1 {
            margin: 0;
        }

        /* Styles for laptops/desktops */
        @media (min-width: 768px) {
            .container {
                max-width: 400px;
                margin: 0 auto;
                padding: 20px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        }

        /* Styles for phones */
        @media (max-width: 767px) {
            .container {
                max-width: 90%;
                margin: 0 auto;
                padding: 20px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        }

        /* Common styles for input fields and buttons */
        label {
            display: block;
            margin-top: 10px;
            font-weight: bold;
        }

        input[type="text"],
        input[type="password"] {
            width: 95%;
            padding: 10px;
            margin-top: 5px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
        }

        input[type="submit"] {
            background-color: #0074cc;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        input[type="submit"]:hover {
            background-color: #0056a3;
        }
    </style>
</head>
<body>
    <header>
        <h1>WiFi Credentials</h1>
    </header>
    <div class="container">
        <form id="wifiForm">
            <label for="ssid">SSID:</label>
            <input type="text" id="ssid" name="ssid" required><br><br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required><br><br>
            <input type="submit" value="Submit">
        </form>
    </div>
    <div class="functionalities">
        <h2>Functionalities</h2>
        <button id="reloadBoardInfo">Reload Board Info</button>
        <button id="clearFields">Clear Form Fields</button>
    </div>
</body>
</html>
 <script>
        const form = document.getElementById('wifiForm');
        const wifiStatus = document.getElementById('wifiStatus');
        const toggleWifiBtn = document.getElementById('toggleWifi');
        const clearFieldsBtn = document.getElementById('clearFields');
        const statusInterval = 3000; // Status check interval in milliseconds

        // Function to clear form fields
        function clearFormFields() {
            document.getElementById('ssid').value = '';
            document.getElementById('password').value = '';
        }

        // Function to toggle Wi-Fi connection
        async function toggleWifi() {
            try {
                const response = await fetch('/toggleWifi');
                if (response.ok) {
                    loadWifiStatus();
                } else {
                    throw new Error('Failed to toggle Wi-Fi');
                }
            } catch (error) {
                console.error('An error occurred while toggling Wi-Fi:', error);
            }
        }

        // Function to load Wi-Fi connection status
        async function loadWifiStatus() {
            try {
                const response = await fetch('/wifiStatus');
                if (response.ok) {
                    const data = await response.json();
                    wifiStatus.textContent = `Wi-Fi Status: ${data.status}`;
                } else {
                    throw new Error('Failed to fetch Wi-Fi status');
                }
            } catch (error) {
                console.error('An error occurred while fetching Wi-Fi status:', error);
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the default form submission

            const ssid = document.getElementById('ssid').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`/setCredentials?ssid=${ssid}&password=${password}`, {
                    method: 'POST'
                });

                if (response.ok) {
                    alert('Wi-Fi credentials saved: OK');
                    clearFormFields();
                } else {
                    alert('Wi-Fi credentials not saved: FAIL');
                }
            } catch (error) {
                alert('An error occurred while saving Wi-Fi credentials: ' + error.message);
            }
        });

        toggleWifiBtn.addEventListener('click', toggleWifi);
        clearFieldsBtn.addEventListener('click', clearFormFields);

        // Load initial data when the page loads
        loadWifiStatus();

        // Periodically update Wi-Fi status
        setInterval(loadWifiStatus, statusInterval);
    </script>
)=====";