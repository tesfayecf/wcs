const char main_page[] PROGMEM = R"=====(
<html lang="en">
    <head>
    <meta charset="utf-8" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <title>PUMP CONTROL</title>
    <style>
    body {
      background: linear-gradient(0deg, rgb(0, 0, 0) 0%, rgb(115, 49, 169) 70%, rgb(49, 79, 184) 100%);
    }
    
    h1 {
       position: relative;
       text-align: center;
       color: white;/*#0e8f93;*/
       text-decoration: underline;
       font-size: 60px;
    }
    
    h2 {
       position: relative;
       text-align: center;
       color: black;
       text-decoration: blink;
       font-size: 40px;
    }
  
    a {
      color: black;
      text-decoration: blink;
      font-size: 40px;
    }
    
    g {
       position: relative;
       text-align: center;
       color: white;
       text-decoration: blink;
       font-size: 20px;
    }
    
    .estat_bomba {
       position: relative;
       text-align: center;
       margin-top: 45px;
    }
    
    .text_bomba {
       position: relative;
       text-align: center;
       margin-top: 10px;
       font-size: 35px;
       margin-right: 0%;
    }
    
    .section {
         width: 98%;
         border-style: solid;
         border-width: 3px;
         border-color: black;
         border-radius: 30px;
         margin-top: 10px;
         margin-bottom: 10px;
         margin-left: 10px;
         margin-right: 10px;
         position: relative;
         background-color: rgb(231, 235, 235);
    }
    
    .tank {
       width: 216px;
       height: 400px;
       border: 2px solid black;
       background: #ffffff;
       position: relative;
       left: 38%;
       display: inline-block;
       margin: 10px;
    }
    
    .tank_water {
       position: absolute;
       background: blue;
       width: 100%;
       bottom: 0;
    }
    
    .level_indicator {
       position: relative;
       top: 100%;
       text-align: center;
       color: black;
    }
    
    .control_buttons {
       position: relative;
       width: 50%;
       height: 150px;
       top: 1%;
       float: left;
    }
    
    .button_right {
       position: absolute;
       height: 125px;
       width: 275px;
       border-width: 3px;
       border-color: black;
       border-radius:30px;
       text-align: center;
       vertical-align:middle;
       font-size: 35px;
       color: white;
       font-weight:bold; 
       right: 15%;
       background-color: #4CAF50;
    }
    
    .button_right:hover{
       background-color:#b1e3b3; 
       color:black;
    }  
    
    .button_left {
       position: absolute;
       height: 125px;
       width: 275px;
       border-width: 3px;
       border-color: black;
       border-radius:30px;
       text-align: center;
       vertical-align:middle;
       font-size: 35px;
       color: white;
       font-weight:bold; 
       left: 15%;
       background-color: rgb(179, 23, 22);
    }
    
    .button_left:hover{
       background-color:rgb(209 125 124); 
       color:black;
    }
    
    .servertime {
        color: white;
        position: absolute;
        right: 5%;
        top: -11px;
        font-size: 15px;
    }
    </style>
    </head>
  <body> 
    <h1>SISTEMA DE CONTROL</h1>
  
    <div class="section" style="height: 400px;">
      <h2 class="h2_control">CONTROL</h2>
      <h3 id="bomba" class="text_bomba">LOADING...</h3>
      <div class="control_buttons">
          <button class='button_right' type="button" onclick={startPump()}>START</button>
      </div>
      <div class="control_buttons">
        <button class='button_left' type="button" onclick={stopPump()}>STOP</button>  
      </div>
    </div>
    
    <div class="section" style="height: 700px;">
      <h2 class="h2_sensors">SENSOR</h2>
        <div class="tank">
          <h2 id="level_indicator" class="level_indicator">LOADING...</h2>
            <div id="water_tank" class="tank_water" ></div>
        </div>
    </div>

    <div class="section" style="height: 35px;background:rgb(0, 0, 0)">
        <h3 style="position: absolute;top: -12px;text-align: center;color:white;width: 500px;left:222.5px;">Copyright 2023 by Tesfaye. All Rights Reserved.</h3>
        <h4 id="serverTime" class="servertime">Server Time: LOADING...</h4>
      </div>
  </body>
</html>
<script>
    const mainpath = "192.168.1.101";
    const minLevelSensor = 0;
    const maxLevelSensor = 50;
    let data = {}

    function sendRequest(path, method) {
      const webpath = `http://${mainpath}/${path}`;
      return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.addEventListener('load', () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(xhr.responseText);
              } else {
                  reject(`Request failed with status ${xhr.status}`);
              }
          });
          xhr.addEventListener('error', () => {
              reject('Request error');
          });
          xhr.open(method, webpath);
          xhr.send();
      });
    }

    async function post(path) {
        try {
            const responseText = await sendRequest(path, 'POST');
            return responseText;
        } catch (error) {
            console.error('Request error:', error);
            throw error;
        }
    }

    async function get(path) {
        try {
            const responseText = await sendRequest(path, 'GET');
            return responseText;
        } catch (error) {
            console.error('Request error:', error);
            throw error;
        }
    }
    
    getData();
    const timer = setInterval(getData, 15 * 1000)

    async function getData() {
      const newData = await get("DATA");
      const json = JSON.parse(newData);
      data = json;
      console.log(data);
      updateServerTime(data.serverTime);
      updateLevel(data.sensorValue);
      updateStatus(data.pumpStatus);
    }

    function updateServerTime(serverTime) {
      if (serverTime >= 0) {
        document.getElementById("serverTime").innerHTML = "Server Time: " + SecondToDay(data.serverTime);
      }
    }

    function updateLevel(level) {
        level = (Number(level) - minLevelSensor)/(maxLevelSensor - minLevelSensor)*100;
        if (level <= 0) level = 0;
        if (level >= 100) level = 100;
        level = parseInt(level);
        document.getElementById('water_tank').style.height = level+"%";
        document.getElementById('level_indicator').innerHTML = level+"%";
    }

    function updateStatus(status) {
      if (status == '1') {
        document.getElementById('bomba').innerHTML = "ENCESA";
      } else if (status == '0') {
          document.getElementById('bomba').innerHTML = "APAGADA";
      }
    } 

    function startPump() {
        if (data.pumpStatus == '1') {
            alert("Pump already ON"); 
        } else {
            var password = prompt("Password: ");
            if (password === "1234") post("ON");
        }
        getData();
    }
    
    function stopPump() {
        if (data.pumpStatus == '0') {
            alert("Pump already OFF"); 
        } else {
            var confirmation = confirm("Are you sure you want to turn off the pump?");
            if (confirmation) {
                post("OFF");
            }
        }
        getData();
    }

    function SecondToDay(seconds) {
      seconds = parseInt(seconds)
      var days = Math.floor(seconds / 86400);
      var hours = Math.floor((seconds - (days * 86400)) / 3600);
      var minutes = Math.floor((seconds - (days * 86400) - (hours * 3600)) / 60);
      var seconds = seconds - (days * 86400) - (hours * 3600) - (minutes * 60);
      if (days < 10) { days = "0" + days} 
      if (hours < 10) { hours = "0" + hours; }
      if (minutes < 10) { minutes = "0" + minutes; }
      if (seconds < 10) { seconds = "0" + seconds; }
      return days + ':' + hours + ':' + minutes + ':' + seconds;
  }
</script>
)=====";