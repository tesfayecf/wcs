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
  
    .loadingScreen {
      background: rgba(208, 216, 228, 0.9) url(http://192.168.1.101/loadingGif.gif) no-repeat center center; /* http://192.168.1.101/loadingGif.gif */
      background-size: 40%;
      height: 100vh;
      width: 100%;
      left: 0px;
      top: 0px;
      position: fixed;
      z-index: 100;
    }
      
    </style>
    </head>
  <body> 
    <div id="loadingScreen" class="loadingScreen"></div>
  
    <h1>SISTEMA DE CONTROL</h1>
  
    <div class="section" style="height: 400px;">
      <h2 class="h2_control">CONTROL</h2>
      <h3 id="bomba" class="text_bomba">LOADING...</h3>
      <div class="control_buttons">
          <button class='button_right' type="button" onclick="encendre()">START</button>
      </div>
      <div class="control_buttons">
        <button class='button_left' type="button" onclick="apagar()">STOP</button>  
      </div>
    </div>
    
    <div class="section" style="height: 700px;">
      <h2 class="h2_sensors">SENSOR</h2>
        <div class="tank">
          <h2 id="level_indicator" class="level_indicator">LOADING...</h2>
            <div id="water_tank" class="tank_water" ></div>
        </div>
    </div>
  </body>
</html>
)=====";